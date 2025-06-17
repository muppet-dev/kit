import { SendHorizonal } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { Spinner } from "../../../../components/ui/spinner";
import { useHotkeys } from "react-hotkeys-hook";

export function SendButton() {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  useHotkeys(
    "mod+enter",
    () => {
      const form = document.getElementById(
        "request-form",
      ) as HTMLFormElement | null;

      if (form) form.requestSubmit();
    },
    {
      preventDefault: true,
      description: "Send Request",
    },
  );

  return (
    <>
      <Button
        form="request-form"
        type="submit"
        disabled={isSubmitting}
        className="px-3 py-1.5 xl:flex hidden"
      >
        Send
        {isSubmitting ? (
          <Spinner className="size-4 min-w-4 min-h-4" />
        ) : (
          <SendHorizonal />
        )}
      </Button>
      <Button
        form="request-form"
        type="submit"
        disabled={isSubmitting}
        className="xl:hidden size-max has-[>svg]:px-2.5 py-2.5"
      >
        {isSubmitting ? (
          <Spinner className="size-4 min-w-4 min-h-4" />
        ) : (
          <SendHorizonal />
        )}
      </Button>
    </>
  );
}
