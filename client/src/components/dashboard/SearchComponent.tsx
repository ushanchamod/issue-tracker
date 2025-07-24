import { Search } from "lucide-react";
import type { filterType } from "../../pages/Dashboard";
import { useEffect } from "react";
import useSearchDebounce from "../../hooks/useSearchDebounce";

type Props = {
  filter: filterType;
  setFilter: (prv: any) => void;
};

const SearchComponent = ({ filter, setFilter }: Props) => {
  const debouncedSearchTerm = useSearchDebounce(filter.field);

  useEffect(() => {
    setFilter((prv: filterType) => ({
      ...prv,
      fieldDebounceValue: debouncedSearchTerm,
    }));
  }, [debouncedSearchTerm]);

  return (
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
        onChange={(e) =>
          setFilter((pev: filterType) => ({
            ...pev,
            field: e.target.value,
          }))
        }
        value={filter.field}
      />
    </div>
  );
};

export default SearchComponent;
