import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import LetterCells from './LetterCells';
import DifficultySelect from './DifficultySelect';
import Keyboard from './Keyboard';
import { fetchGuessingAnswer } from './api/gameApi';
import { useImmer } from 'use-immer';
import { WORD_LENGTH, NUMBER_OF_ATTEMPTS, ALLOWED_RUSSIAN_LETTERS, ENG_TO_RU_KEYMAP } from './constants';

interface GuessedWords {
  guessedPositions: number[];
  guessedLetters: number[];
  word: string;
}

interface GuessedLetters {
  guessedPositions: string[];
  guessedLetters: string[];
  notGuessedLetters: string[];
}

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
`;

const initialState = Array.from({ length: NUMBER_OF_ATTEMPTS }, () => ({
  word: '',
  guessedPositions: [],
  guessedLetters: [],
}));

function WordlyGame() {
  const [guessedWords, setGuessedWords] = useImmer<GuessedWords[]>(initialState);
  const [guessedLetters, setGuessedLetters] = useImmer<GuessedLetters>({
    guessedPositions: [],
    guessedLetters: [],
    notGuessedLetters: [],
  });
  const [isLocked, setIsLocked] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(0);

  useEffect(() => sessionStorage.removeItem('gameId'), []);

  useEffect(() => {
    setGuessedLetters((draft) => {
      guessedWords[currentAttempt - 1]?.word.split('').forEach((char, index) => {
        if (guessedWords[currentAttempt - 1].guessedPositions.includes(index)) {
          draft.guessedPositions.push(char);
        } else {
          if (guessedWords[currentAttempt - 1].guessedLetters.includes(index)) {
            draft.guessedLetters.push(char);
          } else {
            draft.notGuessedLetters.push(char);
          }
        }
      });
    });
  }, [currentAttempt]);

  useEffect(() => {
    let resetTimeout: NodeJS.Timeout;

    if (guessedWords[currentAttempt - 1]?.guessedPositions.length === WORD_LENGTH) {
      resetTimeout = setTimeout(resetGame, 2000);
    }

    if (
      currentAttempt === NUMBER_OF_ATTEMPTS &&
      guessedWords[currentAttempt - 1]?.guessedPositions.length !== WORD_LENGTH
    ) {
      sessionStorage.removeItem('gameId');
      resetTimeout = setTimeout(resetGame, 2000);
    }

    return () => clearTimeout(resetTimeout);
  }, [currentAttempt]);

  const handleBackspacePress = () => {
    setGuessedWords((draft) => {
      draft[currentAttempt].word = draft[currentAttempt].word.slice(0, -1);
    });
  };

  const handleEnterPress = () => {
    if (guessedWords[currentAttempt].word.length === WORD_LENGTH) {
      verifyAnswer(guessedWords[currentAttempt].word);
    }
  };

  const handleAnyLetterPress = (key: string) => {
    setGuessedWords((draft) => {
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
    [currentAttempt, isLocked, guessedWords],
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
          // fill later
        } else {
          if (!gameId) {
            sessionStorage.setItem('gameId', responseData.gameId);
          }

          setGuessedWords((draft: GuessedWords[]) => {
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
    setGuessedWords(initialState);
    sessionStorage.removeItem('gameId');
    setGuessedLetters({ guessedPositions: [], guessedLetters: [], notGuessedLetters: [] });
  };

  return (
    <StyledContainer>
      <DifficultySelect onDifficultyChange={resetGame} />
      <GuessingBlock>
        {Array.from({ length: NUMBER_OF_ATTEMPTS }, (_, index) => (
          <LetterCells
            key={index}
            word={guessedWords[index].word}
            guessedLetters={guessedWords[index].guessedLetters}
            guessedPositions={guessedWords[index].guessedPositions}
            isFlipping={currentAttempt - 1 < index}
          />
        ))}
      </GuessingBlock>
      <Keyboard
        onEnterPress={handleEnterPress}
        onBackspacePress={handleBackspacePress}
        onLetterPress={(letter: string) => handleAnyLetterPress(letter)}
        guessedLetters={guessedLetters}
      />
    </StyledContainer>
  );
}

export default WordlyGame;
