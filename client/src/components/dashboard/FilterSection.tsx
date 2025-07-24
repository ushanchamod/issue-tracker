import { Funnel, Search } from "lucide-react";
import Select from "../ui/Select";
import type { filterType } from "../../pages/Dashboard";
import SearchComponent from "./SearchComponent";

type Props = {
  filter: filterType;
  setFilter: (prv: any) => void;
};

const FilterSection = ({ filter, setFilter }: Props) => {
  return (
    <div>
      <div className="flex flex-row gap-5 justify-start items-center mb-1.5">
        <div>
          <Funnel size={19} strokeWidth={2.5} stroke="#393E46" className="" />
        </div>
        <h1 className="text-[19px] font-bold text-[#393E46]">
          Filter & Search
        </h1>
      </div>

      <div className="flex justify-between items-end gap-5">
        <SearchComponent filter={filter} setFilter={setFilter} />

        <div className="flex justify-end items-center gap-2">
          <Select
            label="Severity"
            id="severity-select-filter-section"
            name="severity"
            onChange={(e) =>
              setFilter((pev: filterType) => ({
                ...pev,
                severity: e.target.value,
              }))
            }
            options={[
              { value: "", label: "All" },
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
            value={filter.severity}
            className="rounded-md border-2 border-gray-300 bg-white text-black placeholder-gray-400 focus:border-gray-500 focus:ring-0.5 focus:ring-gray-500 focus:outline-none transition-all"
          />

          <Select
            label="Priority"
            id="priority-select-filter-section"
            name="priority"
            onChange={(e) =>
              setFilter((pev: filterType) => ({
                ...pev,
                priority: e.target.value,
              }))
            }
            options={[
              { value: "", label: "All" },
              { value: "low", label: "Low" },
              { value: "normal", label: "Normal" },
              { value: "high", label: "High" },
            ]}
            value={filter.priority}
            className="rounded-md border-2 border-gray-300 bg-white text-black placeholder-gray-400 focus:border-gray-500 focus:ring-0.5 focus:ring-gray-500 focus:outline-none transition-all"
          />

          <Select
            label="Status"
            id="status-select-filter-section"
            name="status"
            onChange={(e) =>
              setFilter((pev: filterType) => ({
                ...pev,
                status: e.target.value,
              }))
            }
            options={[
              { value: "", label: "All Status" },
              { value: "open", label: "Open" },
              { value: "in-progress", label: "In Progress" },
              { value: "testing", label: "Testing" },
              { value: "resolved", label: "Resolved" },
              { value: "closed", label: "closed" },
            ]}
            value={filter.status}
            className="rounded-md border-2 border-gray-300 bg-white text-black placeholder-gray-400 focus:border-gray-500 focus:ring-0.5 focus:ring-gray-500 focus:outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
