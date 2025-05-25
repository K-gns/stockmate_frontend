export const materialsMap: Record<number, string> = {
  45405: "Скобы для степлера",
  45406: "Пакет п/э 200×300",
  45299: "Бумага А4",
  46305: "Картриджи",
  47402: "Офисные стулья",
} as const;

export type MaterialId = keyof typeof materialsMap;
export type MaterialName = typeof materialsMap[MaterialId];
