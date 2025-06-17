import { cn } from "../../lib/utils";

function Spinner({
  title = "loading",
  className,
  ...props
}: React.ComponentProps<"svg"> & { title?: string }) {
  return (
    <svg
      className={cn(
        "animate-spin size-[24px] min-w-[24px] min-h-[24px]",
        className,
      )}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.917 7A6.002 6.002 0 0 0 2.083 7H1.071a7.002 7.002 0 0 1 13.858 0h-1.012z"
      />
    </svg>
  );
}

export { Spinner };
