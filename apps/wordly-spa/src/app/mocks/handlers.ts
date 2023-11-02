import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get(process.env.NX_LAMBDA_API_URL || '', (req) => {

    if (req.request.url.includes(encodeURIComponent('арбуз'))) {
      return HttpResponse.json({
        guessedLetters: [],
        guessedPositions: [0,1,2,3,4],
        gameId: '447ddf6d-f370-4c39-b1a1-7ec9cdd0d35b',
      });
    }

    return HttpResponse.json({
      guessedLetters: [1,2],
      guessedPositions: [0,4],
      gameId: '447ddf6d-f370-4c39-b1a1-7ec9cdd0d35b',
    });
  }),
];
