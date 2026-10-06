"use client"

import { Field, FieldLabel } from "@jnpll/elements-ui/field"
import { Switch } from "@jnpll/elements-ui/switch"

export function SwitchDisabled() {
  return (
    <Field orientation="horizontal" data-disabled className="w-fit">
      <Switch id="switch-disabled-unchecked" disabled />
      <FieldLabel htmlFor="switch-disabled-unchecked">Disabled</FieldLabel>
    </Field>
  )
}

export default SwitchDisabled;
