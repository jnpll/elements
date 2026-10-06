"use client"

import { BookmarkIcon } from "lucide-react"

import { Toggle } from "@jnpll/elements-ui/toggle"

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
      <BookmarkIcon className="group-aria-pressed/toggle:fill-foreground" />
      Bookmark
    </Toggle>
  )
}

export default ToggleDemo;
