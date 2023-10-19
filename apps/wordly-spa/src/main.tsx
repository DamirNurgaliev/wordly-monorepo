import * as ReactDOM from 'react-dom/client';
import GlobalStyles from './app/GlobalStyles';
import WordlyGame from './app/WordlyGame';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <>
    <GlobalStyles />
    <WordlyGame />
  </>,
);
