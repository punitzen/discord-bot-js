require("dotenv").config();

const {
  Client,
  WebhookClient
} = require("discord.js");
const fetch = require("node-fetch");

const client = new Client({
  partials: ["MESSAGE", "REACTION"],
});

const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN
);

const PREFIX = "$";
// Commands starting from $ from discord server
// eg. $kick {member_id}

const sadWords = [
  "sad",
  "depressed",
  "unhappy",
  "angry",
  "code doesn't work",
  "quiting",
  "not working",
]; // any random quotes 

const encouragments = [
  "Cheer up! Your code is definately worth something",
  "Your git repo is the best! I know you will get through it",
  "Do not worry! Your code will definately work",
  "You will definelty make that code work",
]; // any random quotes 

function getQuote() {
  return fetch(process.env.URL)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data[0]["q"] + " ~" + data[0]["a"];
    });
}

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in`);
});

client.on("message", (message) => {
  if (message.author.bot) return;

  if (message.content == "ping") {
    return message.reply("pong");
  } 
  else if (sadWords.some((word) => message.content.includes(word))) {
    const encouragment =
      encouragments[Math.floor(Math.random() * encouragments.length)];
    message.reply(encouragment);
  }
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    if (CMD_NAME === "kick") {
      if (!message.member.hasPermission("KICK_MEMBERS"))
        return message.reply("You do not have permissions");

      if (args.length === 0) return message.reply("Please Provide an ID!");
      const member = message.guild.members.cache.get(args[0]);
      if (member) {
        member
          .kick("Sorry Little One")
          .then((member) => message.channel.send(`${member} was kicked.`))
          .catch((err) =>
            message.channel.send("I don't have required permissions")
          );
      } else {
        message.channel.send("Member Not Found");
      }
    } 
    else if (CMD_NAME === "ban") {
      if (!message.member.hasPermission("BAN_MEMBERS"))
        return message.reply("You do not have permissions");

      if (args.length === 0) return message.reply("Please Provide an ID!");
      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send("User was banned succesfully");
      } catch (err) {
        console.log(err);
        message.channel.send("An error occured");
      }
    } 
    else if (CMD_NAME === "announce") {
      const msg = args.join(" ");
      webhookClient.send(msg);
    } 
    else if (CMD_NAME === "inspire") {
      getQuote().then((quote) => message.channel.send(quote));
    }
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  const {
    name
  } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id == "863445971430146100") {
    switch (name) {
      case "🔴": // JavaScript
        member.roles.add("863444734859804722");
        break;
      case "🔵": // C++
        member.roles.add("863444850698616862");
        break;
      case "🟡": // Java
        member.roles.add("863444817069342761");
        break;
      case "🟢": // Python
        member.roles.add("863444948845592606");
        break;
    }
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  const {
    name
  } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id == "863445971430146100") {
    switch (name) {
      case "🔴": // JavaScript
        member.roles.remove("863444734859804722");
        break;
      case "🔵": // C++
        member.roles.remove("863444850698616862");
        break;
      case "🟡": // Java
        member.roles.remove("863444817069342761");
        break;
      case "🟢": // Python
        member.roles.remove("863444948845592606");
        break;
    }
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);