import { usePreferences } from "@/client/providers";
import { Label } from "../ui/label";
import toast, { type ToastPosition } from "react-hot-toast";
import { ItemCard } from "./ItemCard";
import { eventHandler } from "@/client/lib/eventHandler";

const TOAST_POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export function ToastSetting() {
  const { toastPosition, setToast } = usePreferences();

  const handleChangeToastPosition = (name: ToastPosition) =>
    eventHandler(() => {
      setToast(name as ToastPosition);

      toast.success(`Toast position changed to ${name}`, {
        id: "toast-position-changed",
      });
    });

  return (
    <div className="flex flex-col gap-2">
      <Label>Toast Position</Label>
      <div className="grid grid-cols-3 gap-3">
        {TOAST_POSITIONS.map((name) => {
          const isSelected = toastPosition === name;

          return (
            <ItemCard
              key={name}
              name={name}
              isSelected={isSelected}
              onClick={handleChangeToastPosition(name as ToastPosition)}
              onKeyDown={handleChangeToastPosition(name as ToastPosition)}
              className="capitalize"
            />
          );
        })}
      </div>
    </div>
  );
}
