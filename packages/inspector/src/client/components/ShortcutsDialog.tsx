import { cn } from "@/client/lib/utils";
import Fuse, { type RangeTuple } from "fuse.js";
import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
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

const capitalize = (s?: string) => (s && s[0].toUpperCase() + s.slice(1)) || "";

type Hotkey = {
  description: string;
  mod?: boolean;
  shift?: boolean;
  alt?: boolean;
  keys: string[];
};

const keyboardShortcuts: Hotkey[] = [
  {
    description: "Quick Connect Configurations",
    mod: true,
    keys: ["Enter"],
  },
  {
    description: "Save and Connect Configurations",
    mod: true,
    shift: true,
    keys: ["Enter"],
  },
  {
    description: "Theme Dialog Open",
    mod: true,
    shift: true,
    keys: ["?"],
  },
  {
    description: "Submit Explorer Form",
    mod: true,
    keys: ["Enter"],
  },
];

export function ShortcutsDialog() {
  const [isMac, toggleOs] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpenDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (navigator) toggleOs(navigator.userAgent.toLowerCase().includes("mac"));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = isMac ? e.metaKey : e.ctrlKey;
      if (isMod && e.key === "/") {
        e.preventDefault();
        setOpenDialog((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMac]);

  const fuse = useMemo(() => {
    return new Fuse(keyboardShortcuts, {
      keys: ["description"],
      includeMatches: true,
    });
  }, []);

  let searchResults: (Hotkey & { matches?: RangeTuple[] })[] = [
    ...keyboardShortcuts,
  ];
  let isEmpty = false;

  if (search) {
    const results = fuse.search(search);

    if (results.length === 0) isEmpty = true;

    searchResults = results.reduce<typeof searchResults>(
      (prev, { item, matches }) => {
        prev.push({
          ...item,
          matches: matches?.flatMap((match) => match.indices),
        });

        return prev;
      },
      []
    );
  }

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
              <Button size="sm">Close Esc</Button>
            </DialogClose>
            <Input
              type="search"
              className="w-[200px]"
              placeholder="Enter Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
        </DialogHeader>
        {isEmpty ? (
          <div className="flex-1 flex items-center flex-col justify-center text-center">
            <h3 className="font-medium">Shortcut Not Found</h3>
            <p className="text-muted-foreground text-sm">
              Please check your spelling and try again.
            </p>
          </div>
        ) : (
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
                index
              ) => (
                <Fragment key={`${index}-${keys}`}>
                  <p className="text-sm font-medium">
                    {matches
                      ? highlightMatches(description ?? "", matches)
                      : description}
                  </p>
                  <div className="select-none space-x-1">
                    {isMod && (
                      <KeyComponent>{isMac ? "⌘" : "Ctrl"}</KeyComponent>
                    )}
                    {isAlt && (
                      <KeyComponent>{isMac ? "⌥" : "Alt"}</KeyComponent>
                    )}
                    {isShift && <KeyComponent>⇧</KeyComponent>}
                    <KeyComponent className="capitalize">
                      {capitalize(keys?.join(""))}
                    </KeyComponent>
                  </div>
                </Fragment>
              )
            )}
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
        className
      )}
    >
      {children}
    </kbd>
  );
}
