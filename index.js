import "dotenv/config";
import axios from "axios";
import FormData from "form-data";
import { v4 as uuid } from "uuid";

const ACCOUNT_COUNT = parseInt(process.env.ACCOUNT_COUNT || "0");

// 고정된 Discord Interaction 설정
const APP_ID = "1356609826230243469";
const GUILD_ID = "1308368864505106442";
const COMMAND_ID = "1356665931056808211";
const COMMAND_VERSION = "1356665931056808212";

const NETWORK_CHANNEL_IDS = {
  "Sepolia": "1339883019556749395",
  "Arbitrum Sepolia": "1364457925632065620",
  "Plume": "1364457608962117774",
  "BSC": "1372399850339045488",
  "Monad": "1367156681154236467",
  "Base Sepolia": "1374560325059350538"
};

async function fetchUserId(discordToken) {
  const res = await axios.get("https://discord.com/api/v9/users/@me", {
    headers: { Authorization: discordToken }
  });
  return res.data.id;
}

async function claimFaucet(discordToken, walletAddress, networkName) {
  try {
    const channelId = NETWORK_CHANNEL_IDS[networkName];
    if (!channelId) throw new Error(`Invalid network: ${networkName}`);

    const userId = await fetchUserId(discordToken);

    const payload = {
      type: 2,
      application_id: APP_ID,
      guild_id: GUILD_ID,
      channel_id: channelId,
      session_id: uuid(),
      data: {
        version: COMMAND_VERSION,
        id: COMMAND_ID,
        name: "faucet",
        type: 1,
        options: [{ type: 3, name: "address", value: walletAddress }]
      },
      nonce: Date.now().toString()
    };

    const form = new FormData();
    form.append("payload_json", JSON.stringify(payload));

    await axios.post("https://discord.com/api/v9/interactions", form, {
      headers: { Authorization: discordToken, ...form.getHeaders() }
    });

    console.log(`[${networkName}] Faucet command sent for ${walletAddress}`);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const res = await axios.get(
      `https://discord.com/api/v9/channels/${channelId}/messages?limit=10`,
      { headers: { Authorization: discordToken } }
    );

    const messages = res.data;
    const response = messages.find(
      (m) => m.author.id === APP_ID && m.interaction?.user?.id === userId
    );

    if (response?.content.includes("successfully")) {
      console.log(`[${networkName}] ✅ Success: ${response.content}`);
    } else {
      console.log(`[${networkName}] ⚠️ Possibly Failed: ${response?.content || "No response"}`);
    }
  } catch (error) {
    console.error(`[${networkName}] ❌ Error: ${error.message}`);
  }
}

async function main() {
  const networks = Object.keys(NETWORK_CHANNEL_IDS);

  for (let i = 1; i <= ACCOUNT_COUNT; i++) {
    const token = process.env[`DISCORD_TOKEN_${i}`];
    const wallet = process.env[`WALLET_ADDRESS_${i}`];

    if (!token || !wallet) {
      console.warn(`⚠️ Missing DISCORD_TOKEN_${i} or WALLET_ADDRESS_${i}`);
      continue;
    }

    console.log(`\n=== 🚀 Account ${i} (${wallet}) ===`);
    for (const network of networks) {
      await claimFaucet(token, wallet, network);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

main();
