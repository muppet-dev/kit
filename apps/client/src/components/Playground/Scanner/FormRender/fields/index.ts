import * as React from "react";

import { FieldType } from "./constants";
import { ArrayField } from "./Array";
import { CheckboxField } from "./Checkbox";
import { NumberField } from "./Number";
import { ObjectField } from "./Object";
import { TextareaField } from "./Textarea";

export const quackFields: Record<FieldType, () => React.JSX.Element> = {
  [FieldType.ARRAY]: ArrayField,
  [FieldType.BOOLEAN]: CheckboxField,
  [FieldType.NUMBER]: NumberField,
  [FieldType.OBJECT]: ObjectField,
  [FieldType.TEXTAREA]: TextareaField,
};
