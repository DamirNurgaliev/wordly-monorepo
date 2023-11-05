import { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { GameField, LettersColor } from '../commonTypes';

const useLettersColor = (gameField: GameField[], currentAttempt: number) => {
  const [lettersColor, setLettersColor] = useImmer<LettersColor>({
    green: [],
    orange: [],
    grey: [],
  });

  useEffect(() => {
    setLettersColor((draft) => {
      gameField[currentAttempt - 1]?.word.split('').forEach((char, index) => {
        if (gameField[currentAttempt - 1].guessedPositions.includes(index)) {
          if (!draft.green.includes(char)) {
            draft.green.push(char);
          }
        } else {
          if (gameField[currentAttempt - 1].guessedLetters.includes(index)) {
            if (!draft.orange.includes(char)) {
              draft.orange.push(char);
            }
          } else {
            if (!draft.grey.includes(char)) {
              draft.grey.push(char);
            }
          }
        }
      });
    });
  }, [currentAttempt]);

  return lettersColor;
};

export default useLettersColor;
