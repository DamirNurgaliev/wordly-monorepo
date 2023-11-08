import { memo } from 'react';
import { styled } from 'styled-components';
import { useTrail, animated, SpringValue, useSpring } from '@react-spring/web';
import { WORD_LENGTH } from './constants';

interface LetterCellsProps {
  word: string;
  guessedLetters: number[];
  guessedPositions: number[];
  isFlipping: boolean;
  isShaking: boolean;
  resetShaking: () => void;
}

const StyledWordContainer = styled(animated.div)`
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
  border: 2px solid #d3d6da;
  ${SharedStyles}
`;

const Backside = styled(animated.div)`
  color: #fafafa;
  ${SharedStyles}
`;

const LetterCells: React.FC<LetterCellsProps> = memo(
  ({ word, guessedLetters, guessedPositions, isFlipping, isShaking, resetShaking }) => {
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

    const { x } = useSpring({
      from: { x: 0 },
      to: { x: isShaking ? 1 : 0 },
      onRest: () => {
        if (isShaking) {
          resetShaking();
        }
      },
    });

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

    return isShaking ? (
      <StyledWordContainer
        style={{
          transform: x
            .to({
              range: [0, 0.25, 0.5, 0.75, 1],
              output: [0, -5, 5, -5, 0],
            })
            .to((x) => `translate3d(${x}px, 0px, 0px)`),
        }}
      >
        {trail.map(({ rotateX }, i) => renderLetter(rotateX, i))}
      </StyledWordContainer>
    ) : (
      <StyledWordContainer>{trail.map(({ rotateX }, i) => renderLetter(rotateX, i))}</StyledWordContainer>
    );
  },
);

export default LetterCells;
