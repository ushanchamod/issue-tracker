import { Funnel, Search } from "lucide-react";
import Select from "../ui/Select";

const FilterSection = () => {
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

      <div className="flex justify-between items-center gap-2">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
            strokeWidth={2}
          />
          <input
            id="filter-section-text-box"
            type="text"
            placeholder="Search by title and description"
            className="w-full pl-10 pr-4 py-2 rounded-md border-2 border-gray-300 bg-white text-black placeholder-gray-400 focus:border-gray-500 focus:ring-0.5 focus:ring-gray-500 focus:outline-none transition-all"
          />
        </div>

        <div className="flex justify-end items-center">
          <Select
            id=""
            name=""
            onChange={() => null}
            options={[
              {
                label: "aaa",
                value: "aa",
              },
            ]}
            value={""}
          />
          <Select id="" name="" onChange={() => null} options={[]} value={""} />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
