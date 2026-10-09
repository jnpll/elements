export const layoutIds = ["overview", "board", "settings"] as const;
export type LayoutId = typeof layoutIds[number];
export function isLayoutId(value: unknown): value is LayoutId { return layoutIds.some(id => id === value); }
