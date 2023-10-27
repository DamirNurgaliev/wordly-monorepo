import React from 'react';
import styled from 'styled-components';
import { useSpring, animated } from "@react-spring/web";

interface StyledLetterCellProps {
  isGreen: boolean;
  isYellow: boolean;
  isGrey: boolean;
}

const StyledLetter = styled(animated.div)<StyledLetterCellProps>`
  position: relative;
  width: 70px;
  height: 70px;
  margin: 5px;
  text-align: center;
  line-height: 60px;
  color: white;
  font-size: 60px;
  text-shadow: 0 0 2px #000;
`;

function Letter(props: {
  isGreen: boolean;
  isYellow: boolean;
  isGrey: boolean;
  letter: string;
  isFlipping: boolean;
}) {
  console.log(props.isGrey)
  const { transform, backgroundColor }
    = useSpring({
    transform: `rotateY(${props.isFlipping ? 360 : 0}deg)`,
    backgroundColor: `${props.isGreen ? '#00d800' : props.isYellow ? '#f7a308bd' : props.isGrey ? '#bdb8b8' : 'bisque'}`
  });

  return (
    <StyledLetter
      isGreen={props.isGreen}
      isYellow={props.isYellow}
      isGrey={props.isGrey}
      style={{ transform, backgroundColor }}
    >
      {props.letter}
    </StyledLetter>
  );
}

export default Letter;
