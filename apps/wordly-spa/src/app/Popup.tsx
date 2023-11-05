import React from 'react';
import styled from 'styled-components';

interface StyledPopupProps {
  $visible: boolean;
}

const StyledPopup = styled.div<StyledPopupProps>`
  position: absolute;
  height: 150px;
  width: 380px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: x-large;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.5s;
`;

const Popup: React.FC<{ message: string }> = ({ message }) => {
  return <StyledPopup $visible={message !== ''}>{message}</StyledPopup>;
};

export default Popup;
