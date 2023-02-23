# React Native Config TypeScript declaration generator

Small CLI tool to generate a `env.d.ts` file for your react-native-config variables.

## Installation

Install the package :

```shell
yarn add --dev react-native-config-codegen
```

## Usage

Add a script in your `package.json` file :

```json
{
  "scripts": {
    "codegen-env": "react-native-config-codegen .env"
  }
}
```

### Multiple config files

If you have multiple `.env` files for different environments like `.env.dev`, `.env.staging`, `.env.prod`, you just have to pass each of them to the script :

```json
{
  "scripts": {
    "codegen-env": "react-native-config-codegen .env.dev .env.staging .env.prod"
  }
}
```
