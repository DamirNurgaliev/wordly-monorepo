import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  $green?: boolean;
  $orange?: boolean;
  $grey?: boolean;
}

interface LettersColor {
  green: string[];
  orange: string[];
  grey: string[];
}

interface KeyboardProps {
  onEnterPress: () => void;
  onBackspacePress: () => void;
  onLetterPress: (letter: string) => void;
  lettersColor: LettersColor;
}

const StyledKeyboard = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
  width: 400px;
  flex-direction: column;
`;

const StyledButton = styled.button<ButtonProps>`
  flex: 1;
  font-size: 20px;
  background-color: ${(props) =>
    props.$green ? '#6cab64' : props.$orange ? '#fbba59' : props.$grey ? 'grey' : '#e7e7e7'};
  border: 1px solid #d1d1d1;
  border-radius: 5px;
  cursor: pointer;
`;

const StyledRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  height: 50px;
  padding: 3px;
`;

const keyboardButtons = [
  ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'Х', 'Ъ'],
  ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
  ['←', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', 'ВВОД'],
];

interface LettersColor {
  green: string[];
  orange: string[];
  grey: string[];
}

const Keyboard: React.FC<KeyboardProps> = ({ onEnterPress, onBackspacePress, onLetterPress, lettersColor }) => {
  return (
    <StyledKeyboard>
      {keyboardButtons.map((row, index) => (
        <StyledRow key={index}>
          {row.map((char, index) => (
            <StyledButton
              key={index}
              $green={lettersColor.green.includes(char)}
              $orange={lettersColor.orange.includes(char)}
              $grey={lettersColor.grey.includes(char)}
              onClick={
                char === '←'
                  ? onBackspacePress
                  : char === 'ВВОД'
                  ? onEnterPress
                  : () => onLetterPress(char)
              }
            >
              {char}
            </StyledButton>
          ))}
        </StyledRow>
      ))}
    </StyledKeyboard>
  );
};

export default Keyboard;
