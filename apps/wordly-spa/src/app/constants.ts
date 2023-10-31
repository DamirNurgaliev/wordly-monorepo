export const NUMBER_OF_ATTEMPTS = 6;
export const WORD_LENGTH = 5;
export const ALLOWED_RUSSIAN_LETTERS = [
  'А',
  'Б',
  'В',
  'Г',
  'Д',
  'Е',
  'Ж',
  'З',
  'И',
  'Й',
  'К',
  'Л',
  'М',
  'Н',
  'О',
  'П',
  'Р',
  'С',
  'Т',
  'У',
  'Ф',
  'Х',
  'Ц',
  'Ч',
  'Ш',
  'Щ',
  'Ъ',
  'Ы',
  'Ь',
  'Э',
  'Ю',
  'Я',
];

type EnglishToRussianKeyMap = {
  [key: string]: string;
};

export const ENG_TO_RU_KEYMAP: EnglishToRussianKeyMap = {
  A: 'Ф',
  B: 'И',
  C: 'С',
  D: 'В',
  E: 'У',
  F: 'А',
  G: 'П',
  H: 'Р',
  I: 'Ш',
  J: 'О',
  K: 'Л',
  L: 'Д',
  M: 'Ь',
  N: 'Т',
  O: 'Щ',
  P: 'З',
  Q: 'Й',
  R: 'К',
  S: 'Ы',
  T: 'Е',
  U: 'Г',
  V: 'М',
  W: 'Ц',
  X: 'Ч',
  Y: 'Н',
  Z: 'Я',
  ';': 'Ж',
  ':': 'Ж',
  "'": 'Э',
  '"': 'Э',
  '>': 'Ю',
  '.': 'Ю',
  ',': 'Б',
  '<': 'Б',
  '{': 'Х',
  '[': 'Х',
  ']': 'Ъ',
  '}': 'Ъ',
};
