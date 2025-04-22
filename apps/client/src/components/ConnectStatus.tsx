import { cn } from "@/lib/utils";
import { useConnection } from "@/providers";
import { useSidebar } from "./ui/sidebar";

export function ConnectStatus() {
  const { connectionStatus } = useConnection();
  const { open } = useSidebar();

  const PinDot: React.FC<{ className?: string }> = ({ className }) => (
    <div
      className={cn(
        "size-2 rounded-full",
        connectionStatus === "connected"
          ? "bg-green-500"
          : connectionStatus === "error"
          ? "bg-red-500"
          : "bg-gray-500",
        className
      )}
    />
  );

  if (open)
    return (
      <div className="flex items-center justify-center gap-2">
        <PinDot />
        <span className="text-xs">
          {connectionStatus === "connected"
            ? "Connected"
            : connectionStatus === "error"
            ? "Connection Error"
            : "Disconnected"}
        </span>
      </div>
    );

  return <PinDot className="absolute top-2 right-0" />;
}
