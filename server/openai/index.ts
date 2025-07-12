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

const questionGroupSchema = z.object({
    summaryQuestions: z.array(z.string()),
    discussionQuestions: z.array(z.string()),
});

type QuestionsGroup = z.infer<typeof questionGroupSchema>;

async function AIRequest<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodSchema,
    options: {
        model?: string;
        temperature?: number;
        max_output_tokens?: number;
    } = {}
) {
    const response = await openai.responses.parse({
        model: options.model ?? "gpt-4o",
        temperature: options.temperature ?? 1,
        max_output_tokens: options.max_output_tokens ?? 4096,
        input: [
            {
                role: "system",
                content: [
                    {
                        type: "input_text",
                        text: systemPrompt,
                    },
                ],
            },
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: userPrompt,
                    },
                ],
            },
        ],
        text: {
            format: zodTextFormat(schema, "json_object"),
        },
    });
    return response.output_parsed as T;
}

export const aiEvaluateAnswer = async (
    title: string,
    article: string,
    questions: string[],
    question: string,
    type: number,
    answer: string
) => {
    let systemPrompt = "";
    if (type === 1) {
        systemPrompt = `You are a English tutor. You privode the user a article and some questions to help the user grasp the main infomation of the article. Evaluate the user's answer to one of the questions about the article. response in JSON format. {"score": the score of the answer (0-10),  "feedback": a brief feedback to user's answer}, "improved": the improved answer.
        Article: 
            ${title} \n 
            ${article} \n
        Questions:
            ${questions} \n
    `;
    } else if (type === 2) {
        systemPrompt = `You are a English tutor. You privode the user an article and some discussion questions related to this article. The questions is related to the article's topic to everyday life or personal experience, so it's easy for ESL students like me to talk about them in class. Evaluate the user's answer to one of the questions about the article. response in JSON format. {"score": the score of the answer (0-10),  "feedback": a brief feedback to user's answer}, "improved": the improved answer.
        Article: 
            ${title} \n 
            ${article} \n
        Questions:
            ${questions} \n
    `;
    }
    const userPrompt = `
        Question:
            ${question} \n
        Answer:
            ${answer} \n`;

    const schema = z.object({
        score: z.number(),
        feedback: z.string(),
        improved: z.string(),
    });

    const response = await AIRequest(systemPrompt, userPrompt, schema);

    return response as z.infer<typeof schema>;
};

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
1: create 3 questions to help me grasp the main infomation of the news.
2: create 3 discussion questions related to this news. The questions should connect the topic to everyday life or personal experience, so it's easy for ESL students like me to talk about them in class. Keep the questions simple and friendly for conversation practice.`,
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
            format: zodTextFormat(questionGroupSchema, "json_object"),
        },
        temperature: 1,
        max_output_tokens: 4096,
    });
    return response.output_parsed as QuestionsGroup;
};

export type { Feedback, QuestionsGroup };
