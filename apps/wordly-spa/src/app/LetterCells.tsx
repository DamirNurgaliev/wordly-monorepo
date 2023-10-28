import React, {useState} from 'react';
import { useSpring, animated } from '@react-spring/web';
import styled from 'styled-components';

interface StyledLetterCellProps {
  $green: boolean;
  $yellow: boolean;
  $grey: boolean;
  $isFlipping: boolean;
}

const StyledCells = styled.div`
  display: flex;
`;

const StyledCell = styled.div<StyledLetterCellProps>`
  position: relative;
  width: 70px;
  height: 70px;
  margin: 5px;
  text-align: center;
  line-height: 60px;
  color: white;
  font-size: 60px;
  text-shadow: 0 0 2px #000;
  background-color: ${(props) =>
    props.$green
      ? '#00d800'
      : props.$yellow
      ? '#f7a308bd'
      : props.$grey
      ? '#bdb8b8'
      : 'bisque'};
`;

const WORD_LENGTH = 5;

function LetterCells(props: {
  word: string;
  guessedLetters: number[];
  guessedPositions: number[];
  notGuessedPositions: number[];
  isFlipping: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <StyledCells>
      {Array.from({ length: WORD_LENGTH }, (_, index) => (
        <StyledCell
          key={index}
          $green={props.guessedLetters.includes(index)}
          $yellow={props.guessedPositions.includes(index)}
          $grey={props.notGuessedPositions.includes(index)}
          $isFlipping={props.isFlipping}
        >
          {props.word[index]}
        </StyledCell>
      ))}
    </StyledCells>
  );
}

export default LetterCells;
