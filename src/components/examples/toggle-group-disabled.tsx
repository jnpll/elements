"use client"

import { IconTooltip } from "@/components/icon-tooltip";

import { Bold, Italic, Underline } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@jnpll/elements-ui/toggle-group"

export function ToggleGroupDisabled() {
  return (
    <ToggleGroup disabled>
      <IconTooltip label="Toggle bold" disabled><ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem></IconTooltip>
      <IconTooltip label="Toggle italic" disabled><ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem></IconTooltip>
      <IconTooltip label="Toggle strikethrough" disabled><ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <Underline />
      </ToggleGroupItem></IconTooltip>
    </ToggleGroup>
  )
}

export default ToggleGroupDisabled;
