"use client"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@jnpll/elements-ui/field"
import { Input } from "@jnpll/elements-ui/input"

export function InputDisabled() {
  return (
    <Field data-disabled>
      <FieldLabel htmlFor="input-demo-disabled">Email</FieldLabel>
      <Input
        id="input-demo-disabled"
        type="email"
        placeholder="Email"
        disabled
      />
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  )
}

export default InputDisabled;
