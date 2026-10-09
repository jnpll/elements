"use client";

import type { ReactElement } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@jnpll/elements-ui/tooltip";

export function IconTooltip({ label, children, disabled = false }: {
  label: string;
  children: ReactElement<{ "aria-label"?: string }>;
  disabled?: boolean;
}) {
  return <Tooltip>
    {disabled
      ? <TooltipTrigger aria-label={label} render={<span tabIndex={0} className="inline-flex" />}>{children}</TooltipTrigger>
      : <TooltipTrigger aria-label={children.props["aria-label"] ?? label} render={children} />}
    <TooltipContent role="tooltip">{label}</TooltipContent>
  </Tooltip>;
}
