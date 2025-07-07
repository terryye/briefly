import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
// export const getOpenAI = async (prompt: string) => {
//     const response = await client.responses.create({
//         model: "gpt-4.1",
//         messages: [{ role: "user", content: prompt }],
//         max_tokens: 1000,
//         temperature: 0.7,
//     });
//     return response.choices[0].message.content;
// };

const feedbackSchema = z.object({
    accuracy: z.object({
        score: z.number(),
        feedback: z.string(),
    }),
    clarity: z.object({
        score: z.number(),
        feedback: z.string(),
    }),
    language: z.object({
        score: z.number(),
        feedback: z.string(),
    }),
    paraphrasing: z.object({
        score: z.number(),
        feedback: z.string(),
    }),
    overall: z.string(),
    improved: z.string(),
});

type Feedback = z.infer<typeof feedbackSchema>;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const prompt_system = `
You are an English tutor. Evaluate the user's article summary based on the following four criteria:

1. Accuracy – Does it reflect the main points and meaning of the original article?
2. Clarity & Coherence – Is it easy to understand and well-organized?
3. Language Use – Are grammar, vocabulary, and sentence structure correct?
4. Paraphrasing – Are ideas expressed in the user's own words?

For each, give an integer score (0–5) and a brief suggestion for improvement.

Then, provide:
- A short overall comment
- An improved version of the summary
`;

export const askAI = async (
    title: string,
    article: string,
    summary: string
) => {
    const response = await openai.responses.parse({
        model: "gpt-4o-mini",
        input: [
            {
                role: "system",
                content: [
                    {
                        type: "input_text",
                        text: `${prompt_system} \n Article: ${title} \n ${article} \n`,
                    },
                ],
            },
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: summary,
                    },
                ],
            },
        ],
        text: {
            format: zodTextFormat(feedbackSchema, "json_object"),
        },
        temperature: 1,
        max_output_tokens: 4096,
    });
    return response.output_parsed as Feedback;
};

const questionSchema = z.object({
    summaryQuestions: z.array(z.string()),
    discussQuestions: z.array(z.string()),
});

type Questions = z.infer<typeof questionSchema>;
export const aiQuestions = async (title: string, article: string) => {
    const response = await openai.responses.parse({
        model: "gpt-4o",
        input: [
            {
                role: "system",
                content: [
                    {
                        type: "input_text",
                        text: `You are an ESL tutor. User will provide a news article. Please:
1: create 3 - 5 questions to help me grasp the main infomation of the news, then I can easily summarize it.
2: create 5 - 6 discussion questions related to this news. The questions should connect the topic to everyday life or personal experience, so it's easy for ESL students like me to talk about them in class. Keep the questions simple and friendly for conversation practice.`,
                    },
                ],
            },
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: `${title}\n\n${article}`,
                    },
                ],
            },
        ],
        text: {
            format: zodTextFormat(questionSchema, "json_object"),
        },
        temperature: 1,
        max_output_tokens: 4096,
    });
    return response.output_parsed as Questions;
};

export type { Feedback, Questions };
