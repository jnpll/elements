"use client"

import { Checkbox } from "@jnpll/elements-ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@jnpll/elements-ui/field"

export function CheckboxDisabled() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-disabled>
        <Checkbox
          id="toggle-checkbox-disabled"
          name="toggle-checkbox-disabled"
          disabled
        />
        <FieldLabel htmlFor="toggle-checkbox-disabled">
          Enable notifications
        </FieldLabel>
      </Field>
    </FieldGroup>
  )
}

export default CheckboxDisabled;
