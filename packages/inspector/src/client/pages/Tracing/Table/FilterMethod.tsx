import { useLogs } from "../providers";
import { FilterComponent } from "./FilterComponent";

export function FilterMethod() {
  const { methodFilters, filterData } = useLogs();

  if (!filterData.methods) return <></>;

  return (
    <FilterComponent
      filterKey="methods"
      filterOptions={filterData.methods}
      selectedFilters={methodFilters}
    />
  );
}
