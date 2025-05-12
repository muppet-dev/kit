import { ConfigForm } from "../../../ConfigForm";
import { FormFields } from "./Fields";
import { FormFooter } from "./Footer";

export function Connect() {
  return (
    <ConfigForm>
      <FormFields />
      <div className="flex-1" />
      <FormFooter />
    </ConfigForm>
  );
}
