import Table, { type Header } from "./Table";
import Select from "../ui/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import { Trash2 } from "lucide-react";

export type TableDataType = {
  _id: string;
  issueId: number;
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
      key: "issueId",
      title: "IssueID",
      align: "left",
      bold: 700,
      width: "200px",
      element: (raw: TableDataType) => {
        return <span># {raw.issueId}</span>;
      },
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
      align: "center",
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
              {
                value: "low",
                label: "Low",
                color: "#FEF9C3", // Tailwind: yellow-100
                textColor: "#92400E", // Tailwind: yellow-800
              },
              {
                value: "medium",
                label: "Medium",
                color: "#CFFAFE", // Tailwind: cyan-100
                textColor: "#155E75", // Tailwind: cyan-800
              },
              {
                value: "high",
                label: "High",
                color: "#FECACA", // Tailwind: red-200
                textColor: "#991B1B", // Tailwind: red-800
              },
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
              {
                value: "low",
                label: "Low",
                color: "#DCFCE7", // Tailwind: green-100
                textColor: "#166534", // Tailwind: green-800
              },
              {
                value: "normal",
                label: "Normal",
                color: "#E0F2FE", // Tailwind: blue-100
                textColor: "#1E3A8A", // Tailwind: blue-800
              },
              {
                value: "high",
                label: "High",
                color: "#FECACA", // Tailwind: red-200
                textColor: "#991B1B", // Tailwind: red-800
              },
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
              {
                value: "open",
                label: "Open",
                color: "#FEF9C3", // Tailwind: yellow-100
                textColor: "#92400E", // Tailwind: yellow-800
              },
              {
                value: "in-progress",
                label: "In Progress",
                color: "#CFFAFE", // Tailwind: cyan-100
                textColor: "#155E75", // Tailwind: cyan-800
              },
              {
                value: "testing",
                label: "Testing",
                color: "#E0E7FF", // Tailwind: indigo-100
                textColor: "#3730A3", // Tailwind: indigo-800
              },
              {
                value: "resolved",
                label: "Resolved",
                color: "#D1FAE5", // Tailwind: green-100
                textColor: "#065F46", // Tailwind: green-800
              },
              {
                value: "closed",
                label: "Closed",
                color: "#F3F4F6", // Tailwind: gray-100
                textColor: "#374151", // Tailwind: gray-700
              },
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
    </>
  );
};

export default IssueTable;
