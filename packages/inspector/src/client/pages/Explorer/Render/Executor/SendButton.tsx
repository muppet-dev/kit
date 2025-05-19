import { Button } from "../../../../components/ui/button";
import { Spinner } from "../../../../components/ui/spinner";
import { SendHorizonal } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function SendButton() {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <>
      <Button
        form="request-form"
        type="submit"
        disabled={isSubmitting}
        className="px-3 py-1.5 xl:flex hidden"
      >
        {isSubmitting && <Spinner className="size-4 min-w-4 min-h-4" />}
        {isSubmitting ? "Sending" : "Send"}
        <SendHorizonal />
      </Button>
      <Button
        form="request-form"
        type="submit"
        disabled={isSubmitting}
        className="xl:hidden size-max has-[>svg]:px-2.5 py-2.5"
      >
        {isSubmitting && <Spinner className="size-4 min-w-4 min-h-4" />}
        <SendHorizonal />
      </Button>
    </>
  );
}
