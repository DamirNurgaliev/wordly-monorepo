import axios from 'axios';

export async function fetchGuessingAnswer(word: string, difficulty: string, gameId: string) {
  return await axios.get(process.env.NX_LAMBDA_API_URL || '', {
    params: {
      word,
      difficulty,
      gameId,
    },
  });
}
