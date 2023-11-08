import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import LetterCells from './LetterCells';
import DifficultySelect from './DifficultySelect';
import Keyboard from './Keyboard';
import { fetchGuessingAnswer } from './api/gameApi';
import { useImmer } from 'use-immer';
import useLettersColor from './hooks/useLettersColor';
import usePopup from './hooks/usePopup';
import { GameField } from './commonTypes';
import { WORD_LENGTH, NUMBER_OF_ATTEMPTS, ALLOWED_RUSSIAN_LETTERS, ENG_TO_RU_KEYMAP } from './constants';

const GuessingBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  align-items: center;
`;

const initialState = Array.from({ length: NUMBER_OF_ATTEMPTS }, () => ({
  word: '',
  guessedPositions: [],
  guessedLetters: [],
  isShaking: false,
}));

const WordlyGame = () => {
  const [gameField, setGameField] = useImmer<GameField[]>(initialState);
  const [isLocked, setIsLocked] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(0);

  const lettersColor = useLettersColor(gameField, currentAttempt);
  const { showPopup, Popup } = usePopup();

  useEffect(() => sessionStorage.removeItem('gameId'), []);

  useEffect(() => {
    let resetTimeout: NodeJS.Timeout;

    if (gameField[currentAttempt - 1]?.guessedPositions.length === WORD_LENGTH) {
      resetTimeout = setTimeout(resetGame, 2000);
    }

    if (
      currentAttempt === NUMBER_OF_ATTEMPTS &&
      gameField[currentAttempt - 1]?.guessedPositions.length !== WORD_LENGTH
    ) {
      sessionStorage.removeItem('gameId');
      resetTimeout = setTimeout(resetGame, 2000);
    }

    return () => clearTimeout(resetTimeout);
  }, [currentAttempt]);

  const handleBackspacePress = () => {
    setGameField((draft) => {
      draft[currentAttempt].word = draft[currentAttempt].word.slice(0, -1);
    });
  };

  const resetShaking = () => {
    setGameField((draft) => {
      draft[currentAttempt].isShaking = false;
    });
  };

  const handleEnterPress = () => {
    if (gameField[currentAttempt].word.length === WORD_LENGTH) {
      verifyAnswer(gameField[currentAttempt].word);
    } else {
      showPopup(`В слове должно быть ${WORD_LENGTH} букв!😎`);
      setGameField((draft) => {
        draft[currentAttempt].isShaking = true;
      });
    }
  };

  const handleAnyLetterPress = (key: string) => {
    setGameField((draft) => {
      if (ALLOWED_RUSSIAN_LETTERS.includes(key) && draft[currentAttempt].word.length < WORD_LENGTH) {
        draft[currentAttempt].word = draft[currentAttempt].word + key;
      }

      if (ENG_TO_RU_KEYMAP[key] && draft[currentAttempt].word.length < WORD_LENGTH) {
        draft[currentAttempt].word = draft[currentAttempt].word + ENG_TO_RU_KEYMAP[key];
      }
    });
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (NUMBER_OF_ATTEMPTS === currentAttempt) return;

      const key = e.key.toUpperCase();

      if (!isLocked) {
        switch (key) {
          case 'BACKSPACE':
            handleBackspacePress();
            break;
          case 'ENTER':
            handleEnterPress();
            break;
          default:
            handleAnyLetterPress(key);
        }
      }
    },
    [currentAttempt, isLocked, gameField],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  function verifyAnswer(word: string) {
    setIsLocked(true);

    const gameId = sessionStorage.getItem('gameId') || '';

    fetchGuessingAnswer(word.toLowerCase(), localStorage.getItem('difficulty') || '0', gameId)
      .then((response) => {
        const responseData = response.data;

        if (responseData.error) {
          showPopup('Введенное слово не найдено😔');
          setGameField((draft) => {
            draft[currentAttempt].isShaking = true;
          });
        } else {
          if (!gameId) {
            sessionStorage.setItem('gameId', responseData.gameId);
          }

          setGameField((draft) => {
            draft[currentAttempt].guessedPositions = responseData.guessedPositions;
            draft[currentAttempt].guessedLetters = responseData.guessedLetters;
          });

          setCurrentAttempt((prev: number) => prev + 1);
        }
      })
      .finally(() => setIsLocked(false));
  }

  const resetGame = (): void => {
    setCurrentAttempt(0);
    setGameField(initialState);
    sessionStorage.removeItem('gameId');
  };

  return (
    <StyledContainer>
      {Popup}
      <DifficultySelect onDifficultyChange={resetGame} />
      <GuessingBlock>
        {Array.from({ length: NUMBER_OF_ATTEMPTS }, (_, index) => (
          <LetterCells
            key={index}
            word={gameField[index].word}
            guessedLetters={gameField[index].guessedLetters}
            guessedPositions={gameField[index].guessedPositions}
            isFlipping={currentAttempt - 1 < index}
            isShaking={gameField[index].isShaking}
            resetShaking={resetShaking}
          />
        ))}
      </GuessingBlock>
      <Keyboard
        onEnterPress={handleEnterPress}
        onBackspacePress={handleBackspacePress}
        onLetterPress={(letter: string) => handleAnyLetterPress(letter)}
        lettersColor={lettersColor}
      />
    </StyledContainer>
  );
};

export default WordlyGame;
