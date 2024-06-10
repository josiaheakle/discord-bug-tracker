import dotenv from "dotenv"

dotenv.config()

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD } = process.env

console.log({ DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD })

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_GUILD) {
	throw new Error("Missing environment variables")
}

export const CFG = {
	DISCORD_TOKEN: DISCORD_TOKEN as string,
	DISCORD_CLIENT_ID: DISCORD_CLIENT_ID as string,
	DISCORD_GUILD: DISCORD_GUILD as string,
}
