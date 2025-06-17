import { cn } from "@/client/lib/utils";
import Fuse, { type RangeTuple } from "fuse.js";
import { Fragment, type PropsWithChildren, useMemo, useState } from "react";
import { highlightMatches } from "./highlightMatches";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useHotkeys, useHotkeysContext } from "react-hotkeys-hook";
import { X } from "lucide-react";

export function ShortcutsDialog() {
  const [search, setSearch] = useState("");
  const [isOpenDialog, setOpenDialog] = useState(false);

  useHotkeys("mod+h", () => setOpenDialog((prev) => !prev), {
    preventDefault: true,
    description: "Open Keyboard Shortcuts Dialog",
  });
  const { hotkeys } = useHotkeysContext();

  const searchResults = useMemo<
    ((typeof hotkeys)[number] & { matches?: RangeTuple[] })[]
  >(() => {
    if (!search?.trim() || hotkeys.length === 0) return [...hotkeys];

    const fuse = new Fuse(hotkeys, {
      keys: ["description"],
      includeMatches: true,
    });

    return fuse.search(search).map(({ item, matches }) => ({
      ...item,
      matches: matches?.flatMap((match) => match.indices),
    }));
  }, [hotkeys, search]);

  return (
    <Dialog open={isOpenDialog} onOpenChange={setOpenDialog}>
      <DialogContent
        isClosable={false}
        className="flex min-h-[500px] sm:max-w-xl flex-col gap-6"
      >
        <DialogHeader className="flex-row items-center justify-between space-y-0">
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <div className="flex flex-row-reverse justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost">
                <X />
              </Button>
            </DialogClose>
            <Input
              type="search"
              className="w-[200px]"
              placeholder="Search shortcuts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
        </DialogHeader>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 items-center gap-1.5">
            {searchResults.map(
              (
                {
                  description,
                  mod: isMod,
                  shift: isShift,
                  alt: isAlt,
                  keys,
                  matches,
                },
                index,
              ) => (
                <Fragment key={`${index}-${keys}`}>
                  <p className="text-sm font-medium">
                    {matches
                      ? highlightMatches(description ?? "", matches)
                      : description}
                  </p>
                  <div className="select-none space-x-1">
                    {isMod && <KeyComponent>Ctrl</KeyComponent>}
                    {isAlt && <KeyComponent>Alt</KeyComponent>}
                    {isShift && <KeyComponent>⇧</KeyComponent>}
                    <KeyComponent className="capitalize">
                      {keys?.join("")}
                    </KeyComponent>
                  </div>
                </Fragment>
              ),
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center flex-col justify-center text-center">
            <h3 className="font-medium">No shortcuts found</h3>
            <p className="text-muted-foreground text-sm">
              Try searching for a specific shortcut or check your configuration.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

type KeyComponent = PropsWithChildren<{
  className?: string;
}>;

function KeyComponent({ children, className }: KeyComponent) {
  return (
    <kbd
      className={cn(
        "text-foreground rounded bg-secondary border w-max px-1 py-0.5 text-xs leading-none shadow-none",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
