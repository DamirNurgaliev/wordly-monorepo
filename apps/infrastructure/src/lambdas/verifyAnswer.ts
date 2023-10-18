import { DynamoDB } from 'aws-sdk';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

const CORS_HEADERS = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,HEAD',
};

export const handler = async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  const dynamoDb = new DynamoDB.DocumentClient();

  const wordExist = await dynamoDb
    .query({
      TableName: process.env.DYNAMODB_TABLE || '',
      KeyConditionExpression: 'entity = :entity',
      FilterExpression: 'word = :word',
      ExpressionAttributeValues: {
        ':entity': 'RU5',
        ':word': event.queryStringParameters?.word,
      },
    })
    .promise();

  let messageBody = {};

  if (wordExist.Count == 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ error: 'Word is not exist' }),
      headers: CORS_HEADERS,
    };
  }

  const gameDifficulty = event.queryStringParameters?.difficulty;
  const complexity = calculateComplexity(gameDifficulty || '0');

  if (event.queryStringParameters?.gameId == null) {
    const word = await dynamoDb
      .scan({
        TableName: process.env.DYNAMODB_TABLE || '',
        ExclusiveStartKey: { entity: 'RU5', uuid: uuidv4() },
        FilterExpression: 'complexity = :complexity',
        ExpressionAttributeValues: { ':complexity': String(complexity) },
      })
      .promise();

    const gameUuid = uuidv4();

    const randomIndex = Math.floor(Math.random() * word.Items.length);

    await dynamoDb
      .put({
        TableName: process.env.DYNAMODB_TABLE || '',
        Item: {
          entity: 'Game',
          uuid: gameUuid,
          word: word.Items?.at(randomIndex)?.word,
        },
      })
      .promise();

    const result = wordComparison(
      event.queryStringParameters?.word || '',
      word.Items?.at(randomIndex)?.word,
    );
    messageBody = { ...result, gameId: gameUuid };
  } else {
    const startedGame = await dynamoDb
      .query({
        TableName: process.env.DYNAMODB_TABLE || '',
        KeyConditionExpression: 'entity = :entity and #gameUuid = :gameUuid',
        ExpressionAttributeValues: {
          ':entity': 'Game',
          ':gameUuid': event.queryStringParameters?.gameId,
        },
        ExpressionAttributeNames: { '#gameUuid': 'uuid' },
      })
      .promise();

    messageBody = wordComparison(
      event.queryStringParameters?.word || '',
      startedGame.Items?.at(0)?.word,
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ...messageBody }),
    headers: CORS_HEADERS,
  };
};

const wordComparison = (userAnswer: string, hiddenWord: string) => {
  let guessedPositions: number[] = [];
  let guessedLetters: number[] = [];

  if (userAnswer === hiddenWord) {
    return { guessedPositions: [0, 1, 2, 3, 4], guessedLetters: [] };
  }

  const userAnswerLetters = parseByLetters(userAnswer);
  const hiddenWordLetters = parseByLetters(hiddenWord);

  Object.keys(userAnswerLetters).forEach((char) => {
    if (!hiddenWordLetters[char]) return;

    const intersection = userAnswerLetters[char].filter((x: number) =>
      hiddenWordLetters[char].includes(x),
    );
    const difference = userAnswerLetters[char].filter(
      (x: number) => !hiddenWordLetters[char].includes(x),
    );
    const differenceContrary = hiddenWordLetters[char].filter(
      (x: number) => !userAnswerLetters[char].includes(x),
    );
    guessedLetters = [
      ...guessedLetters,
      ...difference.slice(0, differenceContrary.length),
    ];

    guessedPositions = [...guessedPositions, ...intersection];
  });

  return { guessedLetters, guessedPositions };
};

const parseByLetters = (word: string) => {
  const result: { [key: string]: number[] } = {};

  [...word].forEach((letter, index) =>
    letter in result ? result[letter].push(index) : (result[letter] = [index]),
  );

  return result;
};

const GAME_DIFFICULTIES = {
  '0': { min: 6, max: 10 },
  '1': { min: 3, max: 5 },
  '2': { min: 0, max: 2 },
};

const calculateComplexity = (difficulty: string) => {
  return Math.round(
    Math.random() *
      (GAME_DIFFICULTIES[difficulty].max - GAME_DIFFICULTIES[difficulty].min) +
      GAME_DIFFICULTIES[difficulty].min,
  );
};
