import { useEffect, useState } from 'react';
import Popup from '../Popup';

const usePopup = () => {
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPopupMessage('');
    }, 2000);

    return () => clearTimeout(timer);
  }, [popupMessage]);

  const showPopup = (message: string) => {
    setPopupMessage(message);
  };

  return {
    showPopup,
    Popup: <Popup message={popupMessage} />,
  };
};

export default usePopup;
