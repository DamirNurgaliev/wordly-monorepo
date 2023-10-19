import React from 'react';
import styled from 'styled-components';

interface CellProps {
  $green: boolean;
  $yellow: boolean;
}

const LetterCell = styled.div<CellProps>`
  background-color: ${(props) => (props.$green ? 'green' : props.$yellow ? 'orange' : 'bisque')};
  width: 70px;
  height: 70px;
  margin: 5px;
  text-align: center;
  line-height: 60px;
  color: white;
  font-size: 60px;
  text-shadow: 0 0 2px #000;
`;

function LetterCells(props: {
  word: string;
  greenPositions: number[];
  yellowPositions: number[];
}) {
  return (
    <div className="Cells">
      {Array.from({ length: 5 }, (_, index) => (
        <LetterCell
          key={index}
          $green={props.greenPositions?.includes(index)}
          $yellow={props.yellowPositions?.includes(index)}
        >
          {props.word?.[index]}
        </LetterCell>
      ))}
    </div>
  );
}

export default LetterCells;
