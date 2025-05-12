import { ArrayField } from "./Array";
import { CheckboxField } from "./Checkbox";
import { CompletionField } from "./Completion";
import { NumberField } from "./Number";
import { ObjectField } from "./Object";
import { TextareaField } from "./Textarea";
import { FieldType } from "./constants";

export const quackFields: Record<FieldType, () => React.JSX.Element> = {
  [FieldType.ARRAY]: ArrayField,
  [FieldType.BOOLEAN]: CheckboxField,
  [FieldType.NUMBER]: NumberField,
  [FieldType.OBJECT]: ObjectField,
  [FieldType.STRING]: TextareaField,
  [FieldType.DEFAULT]: CompletionField,
};
