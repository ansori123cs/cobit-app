import OpenAI from "openai";

export const testOpenAi = async (message: string) => {
  const apiKey = process.env.NEXT_PUBLIC_APIKEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY belum diset di environment variable");
  }

  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const response = await client.responses.create({
    model: "gpt-4o",
    input: [
      {
        role: "system",
        content: "You are a coding assistant that talks like a pirate",
      },
      {
        role: "user",
        content: `${message}`,
      },
    ],
  });

  console.log(response.output_text);
};
