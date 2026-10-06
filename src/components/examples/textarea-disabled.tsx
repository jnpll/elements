"use client"

import { Field, FieldLabel } from "@jnpll/elements-ui/field"
import { Textarea } from "@jnpll/elements-ui/textarea"

export function TextareaDisabled() {
  return (
    <Field data-disabled>
      <FieldLabel htmlFor="textarea-disabled">Message</FieldLabel>
      <Textarea
        id="textarea-disabled"
        placeholder="Type your message here."
        disabled
      />
    </Field>
  )
}

export default TextareaDisabled;
