import * as ReactDOM from 'react-dom/client';
import GlobalStyles from './app/GlobalStyles';
import WordlyGame from './app/WordlyGame';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

async function deferRender() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./app/mocks/browser');

  return worker.start();
}

deferRender().then(() => {
  root.render(
    <>
      <GlobalStyles />
      <WordlyGame />
    </>,
  );
});
