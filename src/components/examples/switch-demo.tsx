"use client"

import { Label } from "@jnpll/elements-ui/label"
import { Switch } from "@jnpll/elements-ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}

export default SwitchDemo;
