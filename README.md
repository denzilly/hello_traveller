# Hello Traveller

A small Discord bot that greets new members and answers `/hello` and `/ping`
slash commands. Built with [discord.js](https://discord.js.org/).

## 1. Create the bot on Discord

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application**.
2. Note the **Application ID** on the *General Information* page — this is your `CLIENT_ID`.
3. Go to the **Bot** tab, click **Reset Token** to reveal/generate a token — this is your `DISCORD_TOKEN`. Keep it secret; anyone with it controls your bot.
4. On the **Bot** tab, enable the **Server Members Intent** (needed for the welcome message).
5. Go to **OAuth2 → URL Generator**, check the `bot` and `applications.commands` scopes, then under Bot Permissions check at least `Send Messages` and `Use Slash Commands`. Open the generated URL to invite the bot to your server.

## 2. Configure

```bash
cp .env.example .env
```

Fill in `.env`:
- `DISCORD_TOKEN` — from step above
- `CLIENT_ID` — from step above
- `GUILD_ID` (optional but recommended while developing) — your server's ID (enable Developer Mode in Discord settings, then right-click your server icon → Copy Server ID). Guild-scoped commands register instantly; without it, global commands can take up to an hour to show up.
- `WELCOME_CHANNEL_ID` (optional) — channel ID to post welcome messages in. If left blank, the bot uses the server's system channel.

## 3. Run locally

```bash
npm install
npm run deploy-commands   # registers /hello and /ping
npm start
```

You should see `Logged in as <bot>#0000. Ready to greet travellers!` in the console. Try `/hello` and `/ping` in your server, and have someone join to test the welcome message.

## 4. Add more commands

Drop a new file in `src/commands/` following the shape of `hello.js` (export `data` as a `SlashCommandBuilder` and an async `execute(interaction)`), then rerun `npm run deploy-commands`.

## 5. Hosting options

The bot needs to run 24/7 somewhere other than your own laptop. A few good options, roughly cheapest/simplest to most control:

### Railway (recommended if you just want it running with minimal setup)
1. Push this repo to GitHub.
2. Create a project on [Railway](https://railway.app), choose **Deploy from GitHub repo**.
3. It will detect the `Dockerfile` automatically. Add `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`, `WELCOME_CHANNEL_ID` as environment variables in the Railway dashboard (don't commit `.env`).
4. Deploy. Railway has a small free trial credit, then it's usage-based (a small bot like this is typically only a few dollars/month).

### Fly.io
1. Install `flyctl`, run `fly launch` in this directory (it'll detect the Dockerfile).
2. `fly secrets set DISCORD_TOKEN=... CLIENT_ID=... GUILD_ID=...`
3. `fly deploy`. Fly's free allowance covers small always-on bots like this.

### A VPS (DigitalOcean, Hetzner, a Raspberry Pi, etc.) — most control
1. Install Node.js 20+, clone the repo, `npm install`, set up `.env`.
2. Run it under a process manager so it restarts on crash/reboot, e.g. [`pm2`](https://pm2.keymetrics.io/):
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name hello-traveller
   pm2 save
   pm2 startup   # follow the printed instructions to enable on-boot start
   ```
   Or with the included Dockerfile: `docker build -t hello-traveller . && docker run -d --restart unless-stopped --env-file .env hello-traveller`.

Whichever host you pick, never commit your real `.env` or bot token — `.gitignore` already excludes `.env`.
