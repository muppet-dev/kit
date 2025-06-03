import { useSearchParams } from "react-router";
import { useLogs } from "../providers";
import { FilterComponent } from "./FilterComponent";

export function FilterServer() {
  const { serverFilters, filterData } = useLogs();
  const [searchParams] = useSearchParams();

  const serverID = searchParams.get("server");

  if (!filterData.servers) return <></>;

  const selectedServerFilters = serverID
    ? [serverID, ...(serverFilters ?? [])]
    : serverFilters;

  return (
    <FilterComponent
      filterKey="servers"
      filterOptions={filterData.servers}
      selectedFilters={selectedServerFilters}
    />
  );
}
