"use client";

import { Button } from "@jnpll/elements-ui/button";
import { Toaster, toast } from "@jnpll/elements-ui/sonner";

export default function ToastDemo() {
  return <><Toaster /><Button onClick={() => toast.success("Changes saved", { description: "Your workspace is up to date." })}>Show notification</Button></>;
}
