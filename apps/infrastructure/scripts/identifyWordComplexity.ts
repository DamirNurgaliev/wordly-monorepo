import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const BATCH_SIZE = 100;

const filepath = path.join(__dirname, '../wordly-words/ru5.txt');
const newFilepath = path.join(
  __dirname,
  '../wordly-words/ru5WithComplexity.txt',
);
const splittedWords = fs
  .readFileSync(filepath, { encoding: 'utf8' })
  .split('\n');
const arrayWithBatches = [];

for (let i = 0; i < splittedWords.length; i += BATCH_SIZE) {
  const batch = splittedWords.slice(i, i + BATCH_SIZE);
  arrayWithBatches.push(batch);
}

const url = 'https://api.openai.com/v1/chat/completions';
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer test',
  },
};

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fillComplexity() {
  for (const batch of arrayWithBatches) {
    const content = `Оцени популярность слов в плане использования в обычной речи от 0 до 10: ${batch.join(
      ',',
    )}. В ответе верни слова в формате: слово:популярность и ничего больше.`;

    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
      temperature: 0.4,
    };
    console.log('making new request');
    await axios
      .post(url, requestData, axiosConfig)
      .then(function (response) {
        fs.appendFileSync(
          newFilepath,
          response.data['choices'][0]['message']['content'] + '\n',
        );
      })
      .finally(async () => await wait(30000));
  }
}

fillComplexity();
