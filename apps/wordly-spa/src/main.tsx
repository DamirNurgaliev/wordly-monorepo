import * as ReactDOM from 'react-dom/client';

import WordlyGame from './app/WordlyGame';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<WordlyGame />);
