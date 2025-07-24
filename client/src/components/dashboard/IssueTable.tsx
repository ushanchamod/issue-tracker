import Table, { type Header } from "./Table";
import Select from "../ui/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import { Trash2 } from "lucide-react";

export type TableDataType = {
  _id: string;
  title: string;
  description: string;
  severity: string;
  priority: string;
  status: string;
  createdBy: string;
  createdAt: Date;
  __v: number;
};

export type TableHeaderType = {
  key: string;
  title: string;
  hidden?: boolean;
  element?: (row: TableDataType) => void;
  width?: string;
  align?: "left" | "right" | "center";
  bold?: number;
};

type Props = {
  data: TableDataType[];
};

const IssueTable = ({ data }: Props) => {
  const { fetchData } = useAxios();
  const queryClient = useQueryClient();

  const updateOption = async ({
    row,
    value,
    whichOption,
  }: {
    row: TableDataType;
    value: string;
    whichOption: string;
  }) => {
    console.log("row", row);

    try {
      const response = await fetchData({
        url: `/issue/${row._id}`,
        method: "patch",
        data: {
          ...row,
          [whichOption]: value,
        },
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const deleteIssue = async (row_id: string) => {
    try {
      const response = await fetchData({
        url: `/issue/${row_id}`,
        method: "delete",
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const { mutate: _delete, isPending: _pending } = useMutation({
    mutationFn: deleteIssue,
    onSuccess: () => {
      toast.success("Delete successful!", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
    },
    onError: () => {
      toast.error("Delete failed!", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-issue"] });
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateOption,
    onSuccess: () => {
      toast.success("Update successful!", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
    },
    onError: () => {
      toast.error("Update failed!", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-issue"] });
    },
  });

  const headers: Header[] = [
    {
      key: "_id",
      title: "ID",
      hidden: true,
    },
    {
      key: "title",
      title: "Title",
      align: "left",
      bold: 700,
      width: "200px",
    },
    {
      key: "description",
      title: "Description",
      align: "left",
      bold: 700,
      width: "400px",
    },
    {
      key: "severity",
      title: "Severity",
      align: "left",
      bold: 700,
      width: "200px",
      element: (raw: TableDataType) => {
        return (
          <Select
            name="severity"
            id="severity-select"
            value={raw.severity}
            onChange={(e) =>
              mutate({
                row: raw,
                value: e.target.value,
                whichOption: "severity",
              })
            }
            options={[
              { value: "low", label: "Low", color: "#FFFA8D" },
              { value: "medium", label: "Medium", color: "#BBFBFF" },
              { value: "high", label: "High", color: "#FFD8D8" },
            ]}
          />
        );
      },
    },
    {
      key: "priority",
      title: "Priority",
      align: "left",
      bold: 700,
      width: "200px",
      element: (raw: TableDataType) => {
        return (
          <Select
            name="priority"
            id="priority-select"
            value={raw.priority}
            onChange={(e) =>
              mutate({
                row: raw,
                value: e.target.value,
                whichOption: "priority",
              })
            }
            options={[
              { value: "low", label: "Low", color: "#FFFA8D" },
              { value: "normal", label: "Normal", color: "#BBFBFF" },
              { value: "high", label: "High", color: "#FFD8D8" },
            ]}
          />
        );
      },
    },
    {
      key: "status",
      title: "Status",
      align: "left",
      bold: 700,
      width: "200px",
      element: (raw: TableDataType) => {
        return (
          <Select
            name="status"
            id="status-select"
            value={raw.status}
            onChange={(e) =>
              mutate({
                row: raw,
                value: e.target.value,
                whichOption: "status",
              })
            }
            options={[
              { value: "open", label: "Open", color: "#FFFA8D" },
              { value: "in-progress", label: "In Progress", color: "#BBFBFF" },
              { value: "testing", label: "Testing", color: "#FFD8D8" },
              { value: "resolved", label: "Resolved", color: "#FFD8D8" },
              { value: "closed", label: "closed", color: "#FFD8D8" },
            ]}
          />
        );
      },
    },
    {
      key: "createdAt",
      title: "Created Date",
      align: "left",
      bold: 700,
      width: "200px",
      element: (raw: TableDataType) => {
        return new Date(raw.createdAt).toDateString();
      },
    },
    {
      key: "",
      title: "Created Date",
      align: "center",
      bold: 700,
      width: "200px",
      element: (raw: TableDataType) => {
        return (
          <div className="flex justify-center align-middle w-full">
            <Button
              Icon={Trash2}
              activeText="Delete"
              disableText="Deleting..."
              isLoading={false}
              onClick={() => _delete(raw._id)}
              className="bg-red-400 px-4 py-1.5 text-white rounded-md cursor-pointer hover:bg-red-500"
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table
        headers={headers}
        rows={data}
        headerColor="#f8f9fa"
        borderHidden={false}
        fontSize="14px"
        rawHeight="50px"
        firstRowColor="#f8f9fa"
        loading={isPending || _pending}
      />

      {/* {isPending && <Loading />} */}
    </>
  );
};

export default IssueTable;
