import { useForm } from "react-hook-form";
import PopUp from "../ui/PopUp";
import {
  issueSchema,
  type CreateIssueFormInputs,
} from "../../utility/zod-schema/issueSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/Input";
import AdvancedSelect from "../ui/AdvanceSelect";
import Button from "../ui/Button";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type Props = {
  setAddNewPopup: (x: boolean) => void;
};

const CreateIssue = ({ setAddNewPopup }: Props) => {
  const { fetchData } = useAxios();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateIssueFormInputs>({
    resolver: zodResolver(issueSchema),
  });

  const create = async (data: CreateIssueFormInputs) => {
    const { title, description, priority, severity, status } = data;

    try {
      await fetchData({
        url: "/issue",
        method: "post",
        data: {
          title,
          description,
          priority,
          severity,
          status,
        },
        headers: { "Content-Type": "application/json" },
      });

      return true;
    } catch (error: any) {
      console.log("Registration error:", error);
      throw new Error(error);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success("Issue Create successful", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
    },
    onError: () => {
      return toast.error("An error occurred during creating issue", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-issue"] });
      queryClient.invalidateQueries({ queryKey: ["fetch-statistics"] });
      setAddNewPopup(false);
    },
  });

  useEffect(() => {
    const clickEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAddNewPopup(false);
      }
    };

    document.addEventListener("keydown", clickEsc);

    return () => {
      document.removeEventListener("keydown", clickEsc);
    };
  }, []);

  return (
    <PopUp
      title="Create Issue"
      setAddNewPopup={setAddNewPopup}
      loading={isPending}
    >
      <div>
        <form
          onSubmit={handleSubmit((formData) => mutate(formData))}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="title-input-issue-create"
              name="title"
              register={register}
              errors={errors}
              label={{ content: "Title" }}
              required
              autoFocus
            />
            <Input
              id="description-input-issue-creation"
              name="description"
              register={register}
              errors={errors}
              label={{ content: "Description" }}
              required
            />
          </div>

          <AdvancedSelect
            id="severity-issue-creation"
            name="severity"
            register={register}
            errors={errors}
            label={{ content: "Severity" }}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
            required
            placeholder="Select Severity"
          />

          <AdvancedSelect
            id="priority-issue-creation"
            name="priority"
            register={register}
            errors={errors}
            label={{ content: "Priority" }}
            options={[
              { value: "low", label: "Low" },
              { value: "normal", label: "Normal" },
              { value: "high", label: "High" },
            ]}
            required
            placeholder="Select Priority"
          />

          <AdvancedSelect
            id="status-issue-creation"
            name="status"
            register={register}
            errors={errors}
            label={{ content: "Status" }}
            options={[
              { value: "open", label: "Open" },
              { value: "in-progress", label: "In Progress" },
              { value: "testing", label: "Testing" },
              { value: "resolved", label: "Resolved" },
              { value: "closed", label: "closed" },
            ]}
            required
            placeholder="Select Status"
          />

          <Button
            type="submit"
            activeText="Add Issue"
            disableText="Adding Issue..."
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </form>
      </div>
    </PopUp>
  );
};

export default CreateIssue;
