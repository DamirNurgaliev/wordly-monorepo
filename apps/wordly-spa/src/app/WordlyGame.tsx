import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import LetterCells from './LetterCells';
import DifficultySelect from './DifficultySelect';
import { fetchGuessingAnswer } from './api/gameApi';
import { useImmer } from 'use-immer';
import { WORD_LENGTH, NUMBER_OF_ATTEMPTS, ALLOWED_RUSSIAN_LETTERS, ENG_TO_RU_KEYMAP } from './constants';

interface GuessedWords {
  guessedPositions: number[];
  guessedLetters: number[];
  notGuessedLetters: number[];
  word: string;
}

const GuessingBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
  background-color: beige;
`;

const initialState = Array.from({ length: NUMBER_OF_ATTEMPTS }, (_, index) => ({
  word: '',
  guessedPositions: [],
  guessedLetters: [],
  notGuessedLetters: [],
}));

function WordlyGame() {
  const [guessedWords, setGuessedWords] = useImmer<GuessedWords[]>(initialState);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => sessionStorage.removeItem('gameId'), []);

  useEffect(() => {
    if (guessedWords[currentAttempt].guessedPositions.length === WORD_LENGTH) {
      sessionStorage.removeItem('gameId');
      setMessage('Победа');

      setTimeout(() => {
        setGuessedWords([]);
        setMessage('');
      }, 2000);
    }

    if (currentAttempt === WORD_LENGTH && guessedWords[currentAttempt].guessedPositions.length !== WORD_LENGTH) {
      sessionStorage.removeItem('gameId');
      setMessage('Не удалось разгадать слово!');

      setTimeout(() => {
        setGuessedWords([]);
      }, 2000);
    }
  }, [currentAttempt]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      setGuessedWords((draft) => {
        switch (key) {
          case 'backspace':
            draft[currentAttempt].word = draft[currentAttempt].word.slice(0, -1);
            break;
          case 'enter':
            draft[currentAttempt].word.length < WORD_LENGTH
              ? setMessage(`В слове должно быть ${WORD_LENGTH} букв.`)
              : verifyAnswer(draft[currentAttempt].word);
            break;
          default:
            if (ALLOWED_RUSSIAN_LETTERS.includes(key) && draft[currentAttempt].word.length < WORD_LENGTH) {
              draft[currentAttempt].word = draft[currentAttempt].word + key;
            }

            if (ENG_TO_RU_KEYMAP[key] && draft[currentAttempt].word.length < WORD_LENGTH) {
              draft[currentAttempt].word = draft[currentAttempt].word + ENG_TO_RU_KEYMAP[key];
            }
        }
      });
    },
    [currentAttempt],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  function verifyAnswer(word: string) {
    const gameId = sessionStorage.getItem('gameId') || '';

    fetchGuessingAnswer(word, localStorage.getItem('difficulty') || '0', gameId).then((response) => {
      const responseData = response.data;

      if (responseData.error) {
        setMessage('Введенное слово не найдено.');
      } else {
        if (!gameId) {
          sessionStorage.setItem('gameId', responseData.gameId);
        }

        setGuessedWords((draft) => {
          draft[currentAttempt].guessedPositions = responseData.guessedPositions;
          draft[currentAttempt].guessedLetters = responseData.guessedLetters;
          draft[currentAttempt].notGuessedLetters = Array.from({ length: WORD_LENGTH }, (_, index) => index).filter(
            (i) => !responseData.guessedPositions.concat(responseData.guessedLetters).includes(i),
          );
        });

        setCurrentAttempt((prev) => prev + 1);
      }
    });
  }

  function printWord(index: number) {
    return guessedWords[index].word;

    const guessedWord = guessedWords[index];

    if (guessedWord) return guessedWord.word;

    if (guessedWords.length === index) {
      return guessedWords[currentAttempt].word;
    } else {
      return '';
    }
  }

  return (
    <>
      <DifficultySelect />
      <GuessingBlock>
        <div>{message}</div>
        {Array.from({ length: NUMBER_OF_ATTEMPTS }, (_, index) => (
          <LetterCells
            key={index}
            word={printWord(index) || ''}
            guessedLetters={guessedWords[index].guessedPositions || []}
            guessedPositions={guessedWords[index].guessedLetters || []}
            notGuessedPositions={guessedWords[index].notGuessedLetters || []}
          />
        ))}
      </GuessingBlock>
    </>
  );
}

export default WordlyGame;
