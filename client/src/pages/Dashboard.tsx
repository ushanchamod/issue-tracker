import { useQuery } from "@tanstack/react-query";
import Table from "../components/dashboard/Table";
import TopBar from "../components/dashboard/TopBar";
import useAxios from "../hooks/useAxios";
import Loading from "../components/ui/Loading";
import IssueTable, {
  type TableDataType,
} from "../components/dashboard/IssueTable";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import FilterSection from "../components/dashboard/FilterSection";

export type filterType = {
  field: string;
  severity: string;
  priority: string;
  status: string;
  fieldDebounceValue: string;
};

const Dashboard = () => {
  const { fetchData } = useAxios();
  const [page, setPage] = useState(1);

  const [filter, setFilter] = useState<filterType>({
    field: "",
    fieldDebounceValue: "",
    severity: "",
    priority: "",
    status: "",
  });

  const fetchIssue = async (page: number) => {
    const response = await fetchData({
      url: `/user/my-issues?page=${page}&field=${filter.fieldDebounceValue}&severity=${filter.severity}&priority=${filter.priority}&status=${filter.status}`,
    });

    return response.data;
  };

  const { isFetching, isError, data } = useQuery({
    queryKey: [
      "dashboard-issue",
      page,
      filter.fieldDebounceValue,
      filter.severity,
      filter.priority,
      filter.status,
    ],
    queryFn: () => fetchIssue(page),
  });

  // if (isPending) return <Loading />;
  if (isError) return <p>Error</p>;

  return (
    <div className="relative w-full h-full max-h-[100vh] bg-gray-100 overflow-auto pt-12">
      {/* top bar section */}
      <TopBar />

      <div className="h-full overflow-auto">
        <div className="p-6 max-w-7xl mx-auto ">
          <h1 className="text-2xl font-bold mb-4 bg-white px-5 py-5 rounded-sm border border-gray-200 shadow">
            Issue Tracker
          </h1>

          {/* filter section */}
          <div className="overflow-hidden overflow-x-auto bg-white px-5 py-5 rounded-sm border border-gray-200 shadow mb-4">
            <FilterSection filter={filter} setFilter={setFilter} />
          </div>

          <div className="overflow-hidden overflow-x-auto bg-white px-5 py-5 rounded-sm border border-gray-200 shadow">
            <IssueTable data={data?.issues || []} />
          </div>

          <div className="mt-4 text-sm text-gray-500 w-full flex justify-between align-middle h-fit">
            {page} of {data?.pageCount} pages
            {data?.pageCount > 1 && (
              <div className="w-fit flex gap-1 mb-10">
                <ChevronLeft
                  className="bg-white p-1 w-[40px] h-[35px] cursor-pointer border border-gray-200 shadow"
                  onClick={() => {
                    if (page !== 1) return setPage((prv) => prv - 1);
                  }}
                />
                <ChevronRight
                  className="bg-white p-1 w-[40px] h-[35px] cursor-pointer border border-gray-200 shadow"
                  onClick={() => {
                    if (page !== data?.pageCount)
                      return setPage((prv) => prv + 1);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isFetching && <Loading />}
    </div>
  );
};

export default Dashboard;
