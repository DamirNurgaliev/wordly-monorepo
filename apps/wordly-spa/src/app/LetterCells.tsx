import { memo } from 'react';
import { styled } from 'styled-components';
import { useTrail, animated, SpringValue } from '@react-spring/web';
import { WORD_LENGTH } from './constants';

interface LetterCellsProps {
  word: string;
  guessedLetters: number[];
  guessedPositions: number[];
  isFlipping: boolean;
}

const StyledWordContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const Letter = styled.div`
  position: relative;
  height: 65px;
  width: 65px;
`;

const SharedStyles = `
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Helvetica;
  font-weight: 800;
  backface-visibility: hidden;
  font-size: xx-large;
  transform-style: preserve-3d;
`;

const Frontside = styled(animated.div)`
  background-color: #fafafa;
  border: 2px solid #1a1a1a;
  ${SharedStyles}
`;

const Backside = styled(animated.div)`
  color: #fafafa;
  ${SharedStyles}
`;

const LetterCells: React.FC<LetterCellsProps> = memo(({ word, guessedLetters, guessedPositions, isFlipping }) => {
  const [trail, api] = useTrail(WORD_LENGTH, () => ({
    rotateX: 0,
  }));

  if (isFlipping) {
    api.start({
      rotateX: 0,
    });
  } else {
    api.start({
      rotateX: 180,
    });
  }

  const renderLetter = (rotateX: SpringValue<number>, index: number) => {
    const frontFlip = rotateX.to((val) => `perspective(300px) rotateX(${val}deg)`);
    const backFlip = rotateX.to((val) => `perspective(300px) rotateX(${180 - val}deg)`);
    const backgroundColor = guessedPositions.includes(index)
      ? '#6cab64'
      : guessedLetters.includes(index)
      ? '#fbba59'
      : isFlipping
      ? 'white'
      : 'grey';
    const border = `solid 2px ${backgroundColor}`;

    return (
      <Letter key={index}>
        <Frontside
          style={{
            transform: frontFlip,
          }}
        >
          {word[index]}
        </Frontside>
        <Backside
          style={{
            transform: backFlip,
            backgroundColor,
            border,
          }}
        >
          {word[index]}
        </Backside>
      </Letter>
    );
  };

  return <StyledWordContainer>{trail.map(({ rotateX }, i) => renderLetter(rotateX, i))}</StyledWordContainer>;
});

export default LetterCells;
