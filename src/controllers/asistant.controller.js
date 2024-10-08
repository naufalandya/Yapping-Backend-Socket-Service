// controllers/yappinController.js

const { default: Groq } = require("groq-sdk");
const { PrismaClient } = require("@prisma/client");
const { subDays, differenceInCalendarDays } = require("date-fns");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const prisma = new PrismaClient();

const getParaphrasedMessage = async (message) => {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a creative and dynamic assistant that paraphrases messages while retaining their original meaning.",
          },
          {
            role: "user",
            content: `Paraphrase the following message to make it more dynamic and varied while keeping the same meaning:\n"${message}"`,
          },
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 150,
        top_p: 0.9,
        stop: ["\n"],
        stream: false,
      });
  
      const paraphrased = chatCompletion.choices[0]?.message?.content?.trim();
      return paraphrased || message;
    } catch (error) {
      console.error("Error in Groq completion:", error);
      throw new Error("Failed to paraphrase message.");
    }
  };
  
const getPostStats = async (id) => {
  const today = new Date();

  const posts = await prisma.yappins.findMany({
    where: {
      user_id : id,
      created_at: {
        gte: subDays(today, 6),
      },
    },
  });

  const dailyPosts = Array(7).fill(0);

  posts.forEach((post) => {
    const dayDiff = differenceInCalendarDays(today, new Date(post.created_at));
    if (dayDiff >= 0 && dayDiff < 7) {
      dailyPosts[dayDiff]++;
    }
  });

  return dailyPosts;
};



const generateResponse = async (id) => {
  const dailyPosts = await getPostStats(id);

  const totalPostsThisWeek = dailyPosts.reduce((acc, day) => acc + day, 0);
  const averagePosts = totalPostsThisWeek / 7;

  dailyPosts.forEach((count, index) => {
    const dayLabel = index === 0 ? "Today" : `Day - ${index}`;
    console.log(`${dayLabel} = ${count}`);
  });

  let responseMessage = "";

  if (dailyPosts[0] > 2) {
    responseMessage = "You haven't been very productive today.";
  }
  else if (averagePosts > 0.4 && averagePosts <= 1.4) {
    responseMessage = "You have been quite active this week.";
  }
  else if (averagePosts > 1.4) {
    responseMessage =
      "You are spending too much time on the platform and wasting your productivity.";
  }
  else {
    responseMessage =
      "Is there nothing you want to post? Explore these interesting contents!";
  }

  const dynamicResponse = await getParaphrasedMessage(responseMessage);
  return dynamicResponse;
};

const handleYappinStats = async (req, res) => {
  try {
    const response = await generateResponse(Number(req.user.id));
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Failed to generate response." });
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { handleYappinStats };
