import type { ArrayProps } from "./Array";
import type { CheckboxProps } from "./Checkbox";
import type { FieldWrapperProps } from "./FieldWrapper";
import type { NumberProps } from "./Number";
import type { ObjectProps } from "./Object";
import type { TextareaProps } from "./Textarea";
import type { FieldType } from "./constants";

export type GeneralWrapperProps<T = undefined> = T &
  FieldWrapperProps & { fieldset?: string };

export type FieldProps =
  | GeneralWrapperProps<CheckboxProps>
  | (ObjectProps & { fieldset?: string })
  | GeneralWrapperProps<NumberProps>
  | GeneralWrapperProps<TextareaProps>
  | GeneralWrapperProps<ArrayProps>;

export type FieldPropsMap = {
  [K in FieldType]: Extract<FieldProps, { type: K }>;
};

export type {
  ArrayProps,
  CheckboxProps,
  FieldWrapperProps,
  NumberProps,
  ObjectProps,
  TextareaProps,
};
