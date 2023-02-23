#!/usr/bin/env node
const {readFileSync, writeFileSync} = require('fs');

const ENV_FILES: string[] = process.argv.slice(2);

const KEY_GROUP_INDEX = 1;
const VALUE_GROUP_INDEX = 2;

type AggregatedValues = {
  [key: string]: string[];
};

/**
 * Generates TypeScript types declaration for env files
 *
 * Inspired by https://dev.to/osamaq/react-native-generating-typescript-types-for-environment-variables-141d
 * and https://regex101.com/r/cbm5Tp/1 (from https://github.com/luggit/react-native-config)
 */
const generate = (): void => {
  // READ ALL ENV FILES
  const envs = ENV_FILES.map(envFile =>
    readFileSync(envFile, {
      encoding: 'ascii',
    }),
  );

  const aggregatedValues: AggregatedValues = {};

  // RETRIEVE KEY AND VALUE FOR EACH ENV FILE
  envs.forEach(env => {
    const matches = [...env.matchAll(/^(.*?)= *(.*?)$/gm)];

    for (let match of matches) {
      const key = match[KEY_GROUP_INDEX];
      const value = match[VALUE_GROUP_INDEX];
      const previousValues = aggregatedValues[key] ?? [];

      // APPEND THE CURRENT VALUE TO EXISTING ONES IF EXISTS
      aggregatedValues[key] = previousValues.includes(value)
        ? previousValues
        : [...previousValues, value];
    }
  });

  // FORMAT THE TYPE VALUES
  const joined = Object.entries(aggregatedValues)
    .map(
      ([key, values]) =>
        `${key}: ${values.map(value => `'${value}'`).join(' | ')}`,
    )
    .join('\n    ');

  const typeDeclaration = `declare module 'react-native-config' {
  interface Env {
    ${joined};
  }

  const Config: Env;

  export default Config;
}
`;

  writeFileSync('env.d.ts', typeDeclaration, 'utf8');
};

generate();
