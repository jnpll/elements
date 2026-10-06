"use client"

import { Checkbox } from "@jnpll/elements-ui/checkbox"
import { Label } from "@jnpll/elements-ui/label"

export default function LabelDemo() {
  return (
    <div className="flex gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
