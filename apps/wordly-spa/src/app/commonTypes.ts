export interface GameField {
  guessedPositions: number[];
  guessedLetters: number[];
  word: string;
}

export interface LettersColor {
  green: string[];
  orange: string[];
  grey: string[];
}
