export const materialsMap: Record<number, string> = {
  45405: "Скобы для степлера",
  45406: "Пакет п/э 200×300",
  45299: "Бумага А4",
  46305: "Картриджи",
  47402: "Офисные стулья",
  10001: "Кольцо бандерольное",
  10002: "Пакет б/вак."

} as const;

export type MaterialId = keyof typeof materialsMap;
export type MaterialName = typeof materialsMap[MaterialId];

export const warehousesMap: Record<string, string> = {
  "1300": "Ярославль",
  "1600": "Екатеринбург",
  "1800": "Калинингра",
  "3800": "Рязань",
  "4000": "Краснодар",
  "4200": "Оренбург",
  "4400": "Петрозавод",
  "5200": "Благовещенск",
  "5400": "Липецк",
  "5500": "Санкт-Петербург",
  "7000": "Москва",
} as const;
