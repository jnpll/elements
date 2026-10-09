"use client"

import { IconTooltip } from "@/components/icon-tooltip";

import { Bold, Italic, Underline } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@jnpll/elements-ui/toggle-group"

export function ToggleGroupDemo() {
  return (
    <ToggleGroup variant="outline" multiple>
      <IconTooltip label="Toggle bold"><ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem></IconTooltip>
      <IconTooltip label="Toggle italic"><ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem></IconTooltip>
      <IconTooltip label="Toggle strikethrough"><ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <Underline />
      </ToggleGroupItem></IconTooltip>
    </ToggleGroup>
  )
}

export default ToggleGroupDemo;
