import { ArrayField } from "./Array";
import { CheckboxField } from "./Checkbox";
import { NumberField } from "./Number";
import { ObjectField } from "./Object";
import { TextareaField } from "./Textarea";
import { FieldType } from "./constants";

export { FieldWrapper, type FieldWrapperProps } from "./FieldWrapper";

export const quackFields: Record<FieldType, () => React.JSX.Element> = {
  [FieldType.ARRAY]: ArrayField,
  [FieldType.BOOLEAN]: CheckboxField,
  [FieldType.NUMBER]: NumberField,
  [FieldType.OBJECT]: ObjectField,
  [FieldType.STRING]: TextareaField,
  [FieldType.DEFAULT]: TextareaField,
};
