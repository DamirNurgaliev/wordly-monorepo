import React from 'react';
import styled from 'styled-components';
import Letter from './Letter';

const StyledCells = styled.div`
  display: flex;
`;

const WORD_LENGTH = 5;

function LetterCells(props: {
  word: string;
  guessedLetters: number[];
  guessedPositions: number[];
  notGuessedPositions: number[];
  isFlipping: boolean;
}) {
  return (
    <StyledCells>
      {Array.from({ length: WORD_LENGTH }, (_, index) => (
        <Letter
          isGreen={props.guessedPositions.includes(index)}
          isYellow={props.guessedLetters.includes(index)}
          isGrey={props.notGuessedPositions.includes(index)}
          letter={props.word[index]}
          isFlipping={props.isFlipping}
        ></Letter>
      ))}
    </StyledCells>
  );
}

export default LetterCells;
