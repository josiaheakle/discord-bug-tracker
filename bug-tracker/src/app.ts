import { BugTrackerClient } from "./client"
import { CFG } from "./config"

const client = new BugTrackerClient(CFG.DISCORD_GUILD, "reported-bugs", "fixed-bugs")
console.log("Client activated")
