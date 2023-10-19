import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import LetterCells from './LetterCells';
import DifficultySelect from './DifficultySelect';
import { fetchGuessingAnswer } from './api/gameApi';

interface GuessedWords {
  guessedPositions: number[];
  guessedLetters: number[];
  word: string;
}

function WordlyGame() {
  const [guessedWords, setGuessedWords] = useState<GuessedWords[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [message, setMessage] = useState('');

  const currentWordRef = useRef(currentWord);

  useEffect(() => {
    currentWordRef.current = currentWord;
  }, [currentWord]);

  useEffect(() => {
    setCurrentWord('')
  }, [guessedWords])

  useEffect(() => sessionStorage.removeItem('gameId'), []);

  useEffect(() => {
    if (guessedWords[guessedWords.length - 1]?.guessedPositions.length === 5) {
      sessionStorage.removeItem('gameId');
      setMessage('Победа');

      setTimeout(() => {
        setGuessedWords([]);
        setMessage('');
      }, 3000);
    }

    if (
      guessedWords.length === 6 &&
      guessedWords.at(5)?.guessedPositions.length !== 5
    ) {
      sessionStorage.removeItem('gameId');
      setMessage('Не удалось разгадать слово!');

      setTimeout(() => {
        setGuessedWords([]);
      }, 3000);
    }
  }, [guessedWords]);

  const handleKeyDown = (e: KeyboardEvent) => {
    setMessage('');

    switch (e.key) {
      case 'Backspace':
        setCurrentWord((prev) => prev.slice(0, -1));
        break;
      case 'Enter':
        if (currentWordRef.current.length < 5) {
          setMessage('В слове должно быть 5 букв.');
        } else {
          verifyAnswer();
        }
        break;
      default:
        if (e.key.length === 1 && !Number(e.key) && currentWord.length < 5) {
          setCurrentWord((prev) => (prev.length < 5 ? prev + e.key : prev));
        }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
  }, []);

  function verifyAnswer() {
    const gameId = sessionStorage.getItem('gameId') || '';

    fetchGuessingAnswer(
      currentWordRef.current,
      localStorage.getItem('difficulty') || '0',
      gameId,
    ).then((response) => {
      if (response.data.error) {
        setMessage('Введенное слово не найдено.');
      } else {
        if (!gameId) {
          sessionStorage.setItem('gameId', response.data.gameId);
        }

        setGuessedWords((prev) =>
          prev.concat({
            guessedPositions: response.data.guessedPositions,
            guessedLetters: response.data.guessedLetters,
            word: currentWordRef.current,
          }),
        );
      }
    });
  }

  function printWord(index: number) {
    const guessedWord = guessedWords[index];

    if (guessedWord) return guessedWord.word;

    if (guessedWords.length === index) {
      return currentWord;
    } else {
      return '';
    }
  }

  return (
    <>
      <DifficultySelect />
      <div className="Main">
        <div className="Message">{message}</div>
        {Array.from({ length: 6 }, (_, index) => (
          <LetterCells
            key={index}
            word={printWord(index) || ''}
            greenPositions={guessedWords[index]?.guessedPositions || []}
            yellowPositions={guessedWords[index]?.guessedLetters || []}
          />
        ))}
      </div>
    </>
  );
}

export default WordlyGame;
