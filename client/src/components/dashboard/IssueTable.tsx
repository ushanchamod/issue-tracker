import Table, { type Header } from "./Table";
import Select from "../ui/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import { Trash2 } from "lucide-react";
import { EditDescription, EditTitle } from "./EditField";

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
  _loading: boolean;
  popup: (x: boolean) => void;
};

const IssueTable = ({ data, popup, _loading }: Props) => {
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
      queryClient.invalidateQueries({ queryKey: ["fetch-statistics"] });
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
      queryClient.invalidateQueries({ queryKey: ["fetch-statistics"] });
    },
  });

  const headers: Header[] = [
    {
      key: "issueId",
      title: "Issue ID",
      align: "left",
      bold: 700,
      width: "200px",
      element: (row: TableDataType) => {
        return <span># {row.issueId}</span>;
      },
    },
    {
      key: "title",
      title: "Title",
      align: "left",
      bold: 700,
      width: "600px",
      element: (row: TableDataType) => {
        return <EditTitle row={row} mutate={mutate} />;
      },
    },
    {
      key: "description",
      title: "Description",
      align: "left",
      bold: 700,
      width: "900px",
      element: (row: TableDataType) => {
        return <EditDescription row={row} mutate={mutate} />;
      },
    },
    {
      key: "createdAt",
      title: "Created Date",
      align: "left",
      bold: 700,
      width: "200px",
      element: (row: TableDataType) => {
        return new Date(row.createdAt).toDateString();
      },
    },
    {
      key: "severity",
      title: "Severity",
      align: "center",
      bold: 700,
      width: "200px",
      element: (row: TableDataType) => {
        return (
          <Select
            name="severity"
            id="severity-select"
            value={row.severity}
            onChange={(e) =>
              mutate({
                row: row,
                value: e.target.value,
                whichOption: "severity",
              })
            }
            options={[
              {
                value: "low",
                label: "Low",
                color: "#fff",
                textColor: "#000",
              },
              {
                value: "medium",
                label: "Medium",
                color: "#fff",
                textColor: "#000",
              },
              {
                value: "high",
                label: "High",
                color: "#fff",
                textColor: "#000",
              },
            ]}
          />
        );
      },
    },
    {
      key: "priority",
      title: "Priority",
      align: "center",
      bold: 700,
      width: "200px",
      element: (row: TableDataType) => {
        return (
          <Select
            name="priority"
            id="priority-select"
            value={row.priority}
            onChange={(e) =>
              mutate({
                row: row,
                value: e.target.value,
                whichOption: "priority",
              })
            }
            options={[
              {
                value: "low",
                label: "Low",
                color: "#fff",
                textColor: "#000",
              },
              {
                value: "normal",
                label: "Normal",
                color: "#fff",
                textColor: "#000",
              },
              {
                value: "high",
                label: "High",
                color: "#fff",
                textColor: "#000",
              },
            ]}
          />
        );
      },
    },
    {
      key: "status",
      title: "Status",
      align: "center",
      bold: 700,
      width: "200px",
      element: (row: TableDataType) => {
        return (
          <Select
            name="status"
            id="status-select"
            value={row.status}
            onChange={(e) =>
              mutate({
                row: row,
                value: e.target.value,
                whichOption: "status",
              })
            }
            options={[
              {
                value: "open",
                label: "Open",
                color: "#F59E0B", // vibrant amber
                textColor: "#FFFFFF", // white for contrast
              },
              {
                value: "in-progress",
                label: "In Progress",
                color: "#2563EB", // rich blue
                textColor: "#FFFFFF",
              },
              {
                value: "testing",
                label: "Testing",
                color: "#7C3AED", // deep purple
                textColor: "#FFFFFF",
              },
              {
                value: "resolved",
                label: "Resolved",
                color: "#16A34A", // lush green
                textColor: "#FFFFFF",
              },
              {
                value: "closed",
                label: "Closed",
                color: "#4B5563", // dark gray
                textColor: "#FFFFFF",
              },
            ]}
          />
        );
      },
    },

    {
      key: "",
      title: "Created Date",
      align: "center",
      bold: 700,
      width: "200px",
      element: (row: TableDataType) => {
        return (
          <div className="flex justify-center align-middle w-full">
            <Button
              Icon={Trash2}
              activeText="Delete"
              disableText="Deleting..."
              isLoading={false}
              onClick={() => _delete(row._id)}
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
        rowHeight="50px"
        firstRowColor="#f8f9fa"
        loading={isPending || _pending || _loading}
        popup={popup}
      />
    </>
  );
};

export default IssueTable;
