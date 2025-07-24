import { HumanMessage } from "@langchain/core/messages";
import { SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import z from "zod";

const feedbackSchema = z.object({
    score: z.number(),
    feedback: z.string(),
    improved: z.string(),
});
type Feedback = z.infer<typeof feedbackSchema>;

const modelParams = {
    modelName: "gpt-4o",
    temperature: 0.7,
};

const systemPromptString = `{role}
    {instructions}
    Article: 
        {title} \n 
        {article} \n
    Questions: 
        {question} \n
`;
const systemPromptTemplate =
    SystemMessagePromptTemplate.fromTemplate(systemPromptString);

const role = "You are a English teacher.";

const instruction1 = `You privode the user a article and some questions to help the user grasp the main infomation of the article. Evaluate the user's answer to one of the questions about the article. response in JSON format. {"score": the score of the answer (0-10),  "feedback": a brief feedback to user's answer, "improved": the improved answer}.`;

const instruction2 = `You privode the user an article and some discussion questions related to this article. The questions is related to the article's topic to everyday life or personal experience, so it's easy for ESL students like me to talk about them in class. Evaluate the user's answer to one of the questions about the article. response in JSON format. {"score": the score of the answer (0-10),  "feedback": a brief feedback to user's answer}, "improved": the improved answer.`;

const model = new ChatOpenAI(modelParams);

export async function evaluateAnswer(
    title: string,
    article: string,
    questions: string[],
    question: string,
    type: number,
    answer: string
) {
    const structuredChatModel = model.withStructuredOutput(feedbackSchema);
    const instruction = type === 1 ? instruction1 : instruction2;
    const systemPrompt = await systemPromptTemplate.format({
        role: role,
        instructions: instruction,
        title: title,
        article: article,
        question: question,
    });
    const messages = [systemPrompt, new HumanMessage(answer)];
    const response = await structuredChatModel.invoke(messages);
    return response as Feedback;
}
