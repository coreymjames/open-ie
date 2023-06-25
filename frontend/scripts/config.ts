import * as dotenv from "dotenv";
dotenv.config();

export const requireEnv = (identifier: string) => {
  const value = process.env[identifier];

  if (!value) {
    throw new Error(`Required env var ${identifier} does not exist`);
  }
  return value;
};

export const GITHUB_TOKEN = requireEnv("GITHUB_TOKEN");
export const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";