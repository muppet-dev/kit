import { ConfigForm } from "../../../ConfigForm";
import { FormFields } from "./Fields";
import { FormFooter } from "./Footer";

export function Connect() {
  return (
    <ConfigForm>
      <FormFields />
      <FormFooter />
    </ConfigForm>
  );
}
