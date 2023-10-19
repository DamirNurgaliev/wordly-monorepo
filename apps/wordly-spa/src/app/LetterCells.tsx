import React from 'react';
import styled from 'styled-components';

interface CellProps {
  $green: boolean;
  $yellow: boolean;
  $grey: boolean;
}

const LetterCell = styled.div<CellProps>`
  background-color: ${(props) =>
    props.$green
      ? '#00d800'
      : props.$yellow
        ? '#f7a308bd'
        : props.$grey
          ? '#bdb8b8'
          : 'bisque'};
  width: 70px;
  height: 70px;
  margin: 5px;
  text-align: center;
  line-height: 60px;
  color: white;
  font-size: 60px;
  text-shadow: 0 0 2px #000;
`;

const StyledCells = styled.div`
  display: flex;
`
const WORD_LENGTH = 5;

function LetterCells(props: {
  word: string;
  guessedLetters: number[];
  guessedPositions: number[];
  notGuessedPositions: number[];
}) {

  return (
    <StyledCells>
      {Array.from({ length: WORD_LENGTH }, (_, index) => (
        <LetterCell
          key={index}
          $green={props.guessedLetters?.includes(index)}
          $yellow={props.guessedPositions?.includes(index)}
          $grey={props.notGuessedPositions?.includes(index)}
        >
          {props.word?.[index]}
        </LetterCell>
      ))}
    </StyledCells>
  );
}

export default LetterCells;
