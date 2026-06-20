export const ngWords = [
  "spam",
  "scam",
  "\u7121\u6599\u30d7\u30ec\u30bc\u30f3\u30c8",
  "\u4eca\u3059\u3050\u767b\u9332",
  "\u66b4\u8a00",
  "\u6b7b\u306d",
  "\u6d88\u3048\u308d",
];

export function findNgWord(text: string) {
  const normalized = text.toLowerCase();
  return ngWords.find((word) => normalized.includes(word.toLowerCase()));
}
