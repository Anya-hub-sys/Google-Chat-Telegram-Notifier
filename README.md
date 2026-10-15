# Google Chat → Telegram Notifier

A Google Apps Script that sends a Telegram message whenever you get a Google Chat DM, an @mention, or an @all. Useful when your work account is blocked on your phone.

## Setup

### Part 1: Create the Telegram bot
1. Open Telegram and search for **@BotFather**.
2. Send `/newbot`, then choose a name and a username ending in `bot`.
3. Copy the **bot token** BotFather gives you.
4. Open your new bot and send it any message, such as "hi".
5. In your browser, open:
   `https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates`
6. Find `"chat":{"id":123456789` and copy that number. This is your **chat ID**.

### Part 2: Set up the script
1. Go to https://script.google.com and click **New project**.
2. Paste the contents of `code.gs` into the editor.
3. Replace `YOUR_BOT_TOKEN` and `YOUR_CHAT_ID` with your own values.
4. Click **Services (+)** and add **Google Chat API**.
5. Open **Project Settings**, tick **Show appsscript.json**, and copy the `oauthScopes` from this repo's `appsscript.json` into yours.
6. Run `checkChatAndNotify` once and approve the permissions.

### Part 3: Run it automatically
1. Click the **Triggers** (clock) icon.
2. Click **Add Trigger**.
3. Function: `checkChatAndNotify`. Event source: **Time-driven**. Type: **Minutes timer**, **Every minute**.
4. Click **Save**.

## What it does
- Alerts on direct messages
- Alerts when your name is mentioned
- Alerts on @all
- Ignores your own messages

## Security
Never share your bot token publicly. If it leaks, regenerate it with `/revoke` in BotFather.
