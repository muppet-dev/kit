import { useLogs } from "../providers";
import { FilterComponent } from "./FilterComponent";

export function FilterSession() {
  const { sessionFilters, filterData } = useLogs();

  if (!filterData.methods) return <></>;

  return (
    <FilterComponent
      filterKey="sessions"
      filterOptions={filterData.sessions}
      selectedFilters={sessionFilters}
    />
  );
}
