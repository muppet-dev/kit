import { useServerData } from "@/client/queries/useServerData";
import { DrawerHeader } from "./Header";
import { DrawerTabs } from "./Tabs";

export type TableDrawer = {
  selected?: string;
  data: Record<string, any>[];
} & Pick<DrawerHeader, "goToPreviousServer" | "goToNextServer" | "closeDrawer">;

export function TableDrawer({
  selected,
  data: serversData,
  ...props
}: TableDrawer) {
  const { data, isLoading } = useServerData({ id: selected });

  const selectedIndex = serversData.findIndex((item) => item.id === selected);

  if (selected)
    return (
      <div className="p-4 w-[550px] h-full border flex flex-col gap-3 overflow-y-auto">
        <DrawerHeader
          {...props}
          data={data}
          disabledPrevButton={selectedIndex === 0}
          disabledNextButton={selectedIndex === serversData.length - 1}
        />
        <DrawerTabs data={data} isLoading={isLoading} />
      </div>
    );
}
