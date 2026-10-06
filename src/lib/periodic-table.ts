export const families = {
  alkali: { label: "Alkali metals", color: "#e9a2a8" },
  alkaline: { label: "Alkaline earth metals", color: "#edcf8d" },
  transition: { label: "Transition metals", color: "#eebaa0" },
  post: { label: "Post-transition metals", color: "#b9c6d5" },
  metalloid: { label: "Metalloids", color: "#b5cba2" },
  nonmetal: { label: "Other nonmetals", color: "#a5d8ba" },
  halogen: { label: "Halogens", color: "#9dd8d8" },
  noble: { label: "Noble gases", color: "#bfb0dc" },
  lanthanide: { label: "Lanthanides", color: "#e7b4cc" },
  actinide: { label: "Actinides", color: "#cca9cf" },
};
export type Family = keyof typeof families;
export interface ElementSlot { number: number; row: number; column: number; family: Family }
const metalloids = new Set([5, 14, 32, 33, 51, 52]);
const nonmetals = new Set([1, 6, 7, 8, 15, 16, 34]);
function family(number: number, column: number): Family {
  if (number >= 57 && number <= 71) return "lanthanide";
  if (number >= 89 && number <= 103) return "actinide";
  if (nonmetals.has(number)) return "nonmetal";
  if (metalloids.has(number)) return "metalloid";
  if (column === 18) return "noble";
  if (column === 17) return "halogen";
  if (column === 1) return "alkali";
  if (column === 2) return "alkaline";
  if (column <= 12) return "transition";
  return "post";
}
// Complete f-block detached; two connector slots remain in the main table.
const periods = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10],
  [11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 15, 16, 17, 18],
  Array.from({ length: 18 }, (_, i) => 19 + i),
  Array.from({ length: 18 }, (_, i) => 37 + i),
  [55, 56, 0, ...Array.from({ length: 15 }, (_, i) => 72 + i)],
  [87, 88, 0, ...Array.from({ length: 15 }, (_, i) => 104 + i)],
];
export const elementSlots: ElementSlot[] = periods.flatMap((period, index) => period.flatMap((number, column) => number ? [{ number, row: index + 1, column: column + 1, family: family(number, column + 1) }] : []));
for (const [row, start] of [[9, 57], [10, 89]]) {
  for (let i = 0; i < 15; i++) elementSlots.push({ number: start + i, row, column: i + 3, family: family(start + i, i + 3) });
}
