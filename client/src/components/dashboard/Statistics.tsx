import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

type StackCardProps = {
  label: string;
  count: number;
  color: string;
};

const StackCard = ({ label, count, color }: StackCardProps) => {
  return (
    <div className="w-full bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col gap-2">
        <p className="text-[17px] font-medium text-gray-600 whitespace-nowrap">
          {label}
        </p>
        <p className="text-3xl font-semibold" style={{ color }}>
          {count}
        </p>
      </div>
    </div>
  );
};

const CombinedStatCard = ({ data }: { data: any }) => {
  const statCards = [
    { label: "Total", key: "total", color: "#000" },
    { label: "Open", key: "open", color: "#EAB308" },
    { label: "In Progress", key: "inProgress", color: "#0EA5E9" },
    { label: "Testing", key: "test", color: "#F97316" },
    { label: "Resolved", key: "resolved", color: "#10B981" },
    { label: "Closed", key: "closed", color: "#6B7280" },
  ];

  return (
    <div className="w-full bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        {statCards.map(({ label, key, color }) => (
          <div key={key}>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold" style={{ color }}>
              {data?.[key] || 0}
            </p>
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
    { label: "Total", key: "total", color: "#000" },
    { label: "Open", key: "open", color: "#EAB308" },
    { label: "In Progress", key: "inProgress", color: "#0EA5E9" },
    { label: "Testing", key: "test", color: "#F97316" },
    { label: "Resolved", key: "resolved", color: "#10B981" },
    { label: "Closed", key: "closed", color: "#6B7280" },
  ];

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  return (
    <div className="w-full">
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(({ label, key, color }) => (
          <StackCard
            key={key}
            label={label}
            count={data?.[key] || 0}
            color={color}
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
