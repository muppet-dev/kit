import { Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { ScanButton } from "./ScanButton";

export function PageHeader() {
  return (
    <div className="flex items-center gap-2">
      <Shield className="size-6" />
      <h2 className="text-2xl font-bold">MCP Scan</h2>
      <PoweredBy />
      <div className="flex-1" />
      <ScanButton />
    </div>
  );
}

function PoweredBy() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <a href="https://invariantlabs.ai/" target="_blank" rel="noreferrer">
          <div className="flex items-center rounded-sm gap-1 p-1.5 border shadow-md dark:bg-muted/50 ml-2 min-w-[106.2px]">
            <img
              src="https://invariantlabs.ai/theme/images/logo.svg"
              alt="Invariant Labs Logo"
              className="size-3.5"
            />
            <img
              src="https://invariantlabs.ai/theme/images/logo-font-dark.svg"
              about="Invariant Labs Logo"
              alt="Invariant Labs"
              className="dark:hidden h-2.5"
            />
            <img
              src="https://invariantlabs.ai/theme/images/logo-font-light.svg"
              about="Invariant Labs Logo"
              alt="Invariant Labs"
              className="hidden dark:block h-2.5"
            />
          </div>
        </a>
      </TooltipTrigger>
      <TooltipContent>Powered by Invariant Labs</TooltipContent>
    </Tooltip>
  );
}
