const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

export const GITHUB_LOGIN = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`;
export const DISCORD_LOGIN = `https://discord.com/oauth2/authorize?response_type=code&client_id=${DISCORD_CLIENT_ID}&scope=identify`;