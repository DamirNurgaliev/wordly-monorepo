import React from 'react';
import styled from 'styled-components';
import { css } from 'styled-components';
import { useSpring, animated } from '@react-spring/web';

interface StyledLetterCellProps {
  isGreen: boolean;
  isYellow: boolean;
  isGrey: boolean;
}

const commonStyles = css`
  width: 70px;
  height: 70px;
  margin: 5px;
  text-align: center;
  line-height: 60px;
  color: white;
  font-size: 60px;
  text-shadow: 0 0 2px #000;
  backface-visibility: hidden;
`;

const StyledBack = styled(animated.div)<StyledLetterCellProps>`
  background-color: ${(props) =>
    props.isGreen ? '#00d800' : props.isYellow ? '#f7a308bd' : props.isGrey ? '#bdb8b8' : 'bisque'};
  position: absolute;
  ${commonStyles};
`;

const StyledFront = styled(animated.div)`
  background-color: bisque;
  ${commonStyles};
`;

function Letter(props: { isGreen: boolean; isYellow: boolean; isGrey: boolean; letter: string; isFlipping: boolean }) {
  const { transform } = useSpring({
    transform: `perspective(300px) rotateX(${props.isFlipping ? 180 : 0}deg)`,
    config: { mass: 15, tension: 200, friction: 70 },
  });

  return (
    <div>
      <StyledBack
        isGreen={props.isGreen}
        isYellow={props.isYellow}
        isGrey={props.isGrey}
        style={{ transform }}
      >
        {props.letter}
      </StyledBack>
      <StyledFront
        style={{
          transform,
          rotateX: '180deg',
        }}
      >
        {props.letter}
      </StyledFront>
    </div>
  );
}

export default Letter;
