import {
	Client,
	GatewayIntentBits,
	GuildBasedChannel,
	Message,
	MessageType,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	Interaction,
} from "discord.js"
import { CFG } from "./config"

export class BugTrackerClient extends Client {
	// #region Initialization

	guildName: string

	channelNameReport: string
	channelNameFixed: string

	channelReport: GuildBasedChannel
	channelFixed: GuildBasedChannel

	constructor(guildName: string, channelReport: string, channelFixed: string) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
			],
		})

		this.guildName = guildName
		this.channelNameReport = channelReport
		this.channelNameFixed = channelFixed

		this.login(CFG.DISCORD_TOKEN)
		this.initEvents()
	}

	initEvents() {
		this.once("ready", this.onReady)
		this.on("messageCreate", this.onMessage)
		this.on("interactionCreate", this.onInteract)
	}

	// #endregion Initialization
	// #region Discord Event Listeners

	async onReady() {
		console.log(`Logged in as ${this.user?.tag}!`)

		const guild = this.guilds.cache.find((guild) => guild.name === this.guildName)

		if (guild) {
			const report = guild.channels.cache.find((channel) => channel.name === this.channelNameReport)
			const fixed = guild.channels.cache.find((channel) => channel.name === this.channelNameFixed)

			if (!report) {
				throw new Error(`Could not connect to ${this.channelNameReport}.`)
			}

			if (!fixed) {
				throw new Error(`Could not connect to ${this.channelNameFixed}.`)
			}

			this.channelReport = report
			this.channelFixed = fixed
		}
	}

	async onInteract(interaction: Interaction) {
		if (interaction.isButton()) {
			switch (interaction.customId) {
				case "close-bug":
					this.handleCloseBug(interaction)
					return
				case "create-bug-thread":
					return
			}
		}
	}

	async onMessage(msg: Message) {
		if (msg.channelId === this.channelReport.id) {
			switch (msg.type) {
				case MessageType.Default:
					this.handleNewBug(msg)
					break
			}
		}
	}

	// #endregion Discord Event Listeners
	// #region Custom Commands

	async handleNewBug(msg: Message) {
		const createThread = new ButtonBuilder()
			.setCustomId("create-bug-thread")
			.setLabel("Create Thread")
			.setStyle(ButtonStyle.Secondary)

		const close = new ButtonBuilder()
			.setCustomId("close-bug")
			.setLabel("Close")
			.setStyle(ButtonStyle.Success)

		const row = new ActionRowBuilder().addComponents(createThread, close)

		await msg.reply({
			// @ts-ignore
			components: [row],
		})
	}

	async handleCloseBug(interaction: Interaction) {
		console.warn(interaction)

		if (interaction.isMessageComponent()) {
			const initialMsg = await interaction.message.reference
		}
	}

	// #endregion Custom Commands
}
