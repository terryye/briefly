import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import z from "zod";

const questionGroupSchema = z.object({
    summaryQuestions: z.array(z.string()),
    discussionQuestions: z.array(z.string()),
});

export type QuestionsGroup = z.infer<typeof questionGroupSchema>;

const modelParams = {
    modelName: "gpt-4o",
    temperature: 0.7,
};
const system_prompt = `You are an Expert ESL instructor specializing in comprehension strategies. User will provide a news or article.  Please generate exactly: 
1. Three comprehension questions testing factual understanding
   Example: "What are the three main reasons mentioned for..."
    1) [Question focusing on main idea]
    2) [Question about supporting details]
    3) [Question about cause/effect or sequence]
2. Three discussion questions connecting to personal experience
   Example: "How does this situation compare to your experience with..."
    1. [Personal connection question]
    2. [Opinion/preference question]
    3. [Real-world application question]
`;

const v2_system_prompt_template =
    SystemMessagePromptTemplate.fromTemplate(system_prompt);

const model = new ChatOpenAI(modelParams);

export async function generateQuestions(title: string, content: string) {
    const structuredChatModel = model.withStructuredOutput(questionGroupSchema);

    const messages = [
        new SystemMessage(system_prompt),
        new HumanMessage(`${title}\n\n${content}`),
    ];
    const response = await structuredChatModel.invoke(messages);
    return response as QuestionsGroup;
}
