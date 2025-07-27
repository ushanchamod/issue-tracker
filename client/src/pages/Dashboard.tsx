import { useQuery } from "@tanstack/react-query";
import TopBar from "../components/dashboard/TopBar";
import useAxios from "../hooks/useAxios";
import Loading from "../components/ui/Loading";
import IssueTable from "../components/dashboard/IssueTable";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import FilterSection from "../components/dashboard/FilterSection";
import Button from "../components/ui/Button";
import CreateIssue from "../components/dashboard/CreateIssue";
import ErrorPage from "../components/ui/ErrorPage";
import Statistics from "../components/dashboard/Statistics";

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
  const [addNewPopup, setAddNewPopup] = useState(false);

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

  const { isFetching, isError, data, refetch } = useQuery({
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

  if (isError)
    return (
      <ErrorPage
        message="Oops! We encountered an error. Sorry for the inconvenience."
        retry={refetch}
      />
    );

  return (
    <div className="relative w-full h-full max-h-[100vh] bg-gray-100 overflow-auto">
      <TopBar />
      {addNewPopup && <CreateIssue setAddNewPopup={setAddNewPopup} />}

      <div className="h-full overflow-auto mt-14">
        <div className="p-6 max-w-[2000px] mx-auto">
          <div className="font-bold mb-4 bg-white px-5 py-5 rounded-sm border border-gray-200 shadow w-full">
            <div className="flex sm:hidden justify-between items-center">
              <h1 className="text-2xl">Dashboard</h1>
              <Button
                Icon={Plus}
                className="text-nowrap bg-blue-500 hover:bg-blue-700 text-white p-2.5 rounded-sm font-semibold cursor-pointer flex justify-center"
                onClick={() => setAddNewPopup(true)}
              />
            </div>

            <div className="hidden sm:flex justify-between items-center">
              <h1 className="text-2xl">Dashboard</h1>
              <Button
                Icon={Plus}
                activeText="Add New Issue"
                className="text-nowrap bg-blue-500 hover:bg-blue-700 text-white p-2.5 rounded-sm font-semibold cursor-pointer flex justify-center"
                onClick={() => setAddNewPopup(true)}
              />
            </div>
          </div>

          {/* stack */}
          <Statistics />

          {/* filter section */}
          <div className="overflow-hidden overflow-x-auto bg-white px-5 py-5 rounded-sm border border-gray-200 shadow mb-4">
            <FilterSection filter={filter} setFilter={setFilter} />
          </div>

          <div className="overflow-hidden overflow-x-auto bg-white px-5 py-5 rounded-sm border border-gray-200 shadow relative ">
            {isFetching && (
              <div className="absolute w-full h-full top-0 left-0 z-2">
                <Loading />
              </div>
            )}
            <IssueTable data={data?.issues || []} popup={setAddNewPopup} />
          </div>

          <div className="mt-4 text-sm text-gray-500 w-full flex justify-between align-middle h-fit">
            {data?.pageCount > 1 && `${page} of ${data?.pageCount} pages`}
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
    </div>
  );
};

export default Dashboard;
