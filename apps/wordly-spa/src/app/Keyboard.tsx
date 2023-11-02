import React from 'react';
import styled from 'styled-components';

const StyledKeyboard = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
`;

interface ButtonProps {
  isGreen?: boolean;
  isYellow?: boolean;
  isGrey?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  flex: 1;
  font-size: 20px;
  background-color: ${(props) =>
    props.isGreen ? '#6cab64' : props.isYellow ? '#fbba59' : props.isGrey ? 'grey' : '#e7e7e7'};
  border: 1px solid #d1d1d1;
  border-radius: 5px;
  cursor: pointer;
`;

const StyledFirstRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  height: 50px;
`;

const StyledSecondRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  height: 50px;
  padding-top: 3px;
`;

const StyledThirdRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  height: 50px;
  padding-top: 3px;
`;

const StyledContainer = styled.div`
  width: 500px;
`;

interface GuessedLetters {
  guessedPositions: string[];
  guessedLetters: string[];
  notGuessedLetters: string[];
}

export default function RussianKeyboard(props: {
  onEnterPress: () => void;
  onBackspacePress: () => void;
  onLetterPress: (letter: string) => void;
  guessedLetters: GuessedLetters;
}) {
  const firstRow = 'йцукенгшщзхъ';
  const secondRow = 'фывапролджэ';
  const thirdRow = 'ячсмитьбю';
  console.log(props.guessedLetters)
  return (
    <StyledKeyboard>
      <StyledContainer>
        <StyledFirstRow>
          {firstRow.split('').map((char, index) => (
            <StyledButton
              key={index}
              isGreen={props.guessedLetters.guessedPositions.includes(char.toUpperCase())}
              isYellow={props.guessedLetters.guessedLetters.includes(char.toUpperCase())}
              isGrey={props.guessedLetters.notGuessedLetters.includes(char.toUpperCase())}
              onClick={() => props.onLetterPress(char.toUpperCase())}
            >
              {char}
            </StyledButton>
          ))}
        </StyledFirstRow>
        <StyledSecondRow>
          {secondRow.split('').map((char, index) => (
            <StyledButton
              key={index}
              isGreen={props.guessedLetters.guessedPositions.includes(char.toUpperCase())}
              isYellow={props.guessedLetters.guessedLetters.includes(char.toUpperCase())}
              isGrey={props.guessedLetters.notGuessedLetters.includes(char.toUpperCase())}
              onClick={() => props.onLetterPress(char.toUpperCase())}
            >
              {char}
            </StyledButton>
          ))}
        </StyledSecondRow>
        <StyledThirdRow>
          <StyledButton onClick={() => props.onBackspacePress()}>{String.fromCharCode(8656)}</StyledButton>
          {thirdRow.split('').map((char, index) => (
            <StyledButton
              key={index}
              isGreen={props.guessedLetters.guessedPositions.includes(char.toUpperCase())}
              isYellow={props.guessedLetters.guessedLetters.includes(char.toUpperCase())}
              isGrey={props.guessedLetters.notGuessedLetters.includes(char.toUpperCase())}
              onClick={() => props.onLetterPress(char.toUpperCase())}
            >
              {char}
            </StyledButton>
          ))}
          <StyledButton onClick={() => props.onEnterPress()}>{'Ввод'}</StyledButton>
        </StyledThirdRow>
      </StyledContainer>
    </StyledKeyboard>
  );
}
