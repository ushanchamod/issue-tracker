import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Loading from "../ui/Loading";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";

type StackCardProps = {
  label: string;
  count: number;
  totalIssue: number;
  color: string;
  icon?: React.ReactNode;
};

const StackCard = ({
  label,
  count,
  color,
  icon,
  totalIssue,
}: StackCardProps) => {
  return (
    <div className="w-full bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300 group">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          {icon && (
            <div
              className="p-2 rounded-lg group-hover:bg-opacity-10 transition-colors"
              style={{ backgroundColor: `${color}20` }}
            >
              {icon}
            </div>
          )}
        </div>
        <p className="text-3xl font-bold" style={{ color }}>
          {count.toLocaleString()}
        </p>
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (count / totalIssue) * 100)}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const CombinedStatCard = ({ data }: { data: any }) => {
  const statCards = [
    {
      label: "Total",
      key: "total",
      color: "#6366F1",
      icon: <TrendingUp size={18} color="#6366F1" />,
    },
    {
      label: "Open",
      key: "open",
      color: "#EAB308",
      icon: <AlertCircle size={18} color="#EAB308" />,
    },
    {
      label: "In Progress",
      key: "inProgress",
      color: "#0EA5E9",
      icon: <Loader2 size={18} color="#0EA5E9" />,
    },
    {
      label: "Testing",
      key: "test",
      color: "#F97316",
      icon: <Clock size={18} color="#F97316" />,
    },
    {
      label: "Resolved",
      key: "resolved",
      color: "#10B981",
      icon: <CheckCircle size={18} color="#10B981" />,
    },
    {
      label: "Closed",
      key: "closed",
      color: "#6B7280",
      icon: <XCircle size={18} color="#6B7280" />,
    },
  ];

  return (
    <div className="w-full bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <h2 className="text-lg font-semibold mb-6 text-gray-700 flex items-center gap-2">
        <TrendingUp size={20} className="text-indigo-500" />
        Statistics Overview
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {statCards.map(({ label, key, color, icon }) => (
          <div key={key} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {icon}
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {label}
              </p>
            </div>
            <p className="text-xl font-bold" style={{ color }}>
              {data?.[key]?.toLocaleString() || 0}
            </p>
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${Math.min(
                    100,
                    ((data?.[key] || 0) / data?.total) * 100
                  )}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Statistics = () => {
  const { fetchData } = useAxios();

  const fetchStack = async () => {
    const response = await fetchData({
      url: "/user/statistics",
      method: "get",
    });

    return response.data;
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["fetch-statistics"],
    queryFn: fetchStack,
  });

  const statCards = [
    {
      label: "Total",
      key: "total",
      color: "#6366F1",
      icon: <TrendingUp size={18} color="#6366F1" />,
    },
    {
      label: "Open",
      key: "open",
      color: "#EAB308",
      icon: <AlertCircle size={18} color="#EAB308" />,
    },
    {
      label: "In Progress",
      key: "inProgress",
      color: "#0EA5E9",
      icon: <Loader2 size={18} color="#0EA5E9" />,
    },
    {
      label: "Testing",
      key: "test",
      color: "#F97316",
      icon: <Clock size={18} color="#F97316" />,
    },
    {
      label: "Resolved",
      key: "resolved",
      color: "#10B981",
      icon: <CheckCircle size={18} color="#10B981" />,
    },
    {
      label: "Closed",
      key: "closed",
      color: "#6B7280",
      icon: <XCircle size={18} color="#6B7280" />,
    },
  ];

  if (isError) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        <p className="flex items-center gap-2">
          <AlertCircle size={18} />
          Failed to load statistics. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mb-5 relative">
      {isPending && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
          <Loading size={24} />
        </div>
      )}

      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(({ label, key, color, icon }) => (
          <StackCard
            key={key}
            label={label}
            count={data?.[key] || 0}
            color={color}
            icon={icon}
            totalIssue={data?.total}
          />
        ))}
      </div>

      <div className="block sm:hidden">
        <CombinedStatCard data={data} />
      </div>
    </div>
  );
};

export default Statistics;
