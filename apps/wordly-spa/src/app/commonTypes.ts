export interface GameField {
  guessedPositions: number[];
  guessedLetters: number[];
  word: string;
  isShaking: boolean;
}

export interface LettersColor {
  green: string[];
  orange: string[];
  grey: string[];
}
