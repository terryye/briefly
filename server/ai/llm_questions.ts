import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import z from "zod";
const questionTipSchema = z.object({
    question: z.string(),
    tip: z.string(),
});
const questionGroupSchema = z.object({
    summaryQuestions: z.array(questionTipSchema),
    discussionQuestions: z.array(questionTipSchema),
});

export type QuestionsGroup = z.infer<typeof questionGroupSchema>;
export type QuestionTip = z.infer<typeof questionTipSchema>;

const modelParams = {
    modelName: "gpt-4o",
    temperature: 0.7,
};
const system_prompt = `You are an expert ESL instructor specializing in reading comprehension strategies. The user will provide a news article or passage. Based on the content, please generate exactly six questions, along with a tip for how to structure the answer to each question.

1. Comprehension Questions – Factual Understanding

Write three questions that assess the reader’s factual understanding of the text. For each question, include a tip that helps the learner structure a clear and complete answer (not just how to find the answer).
	•	Q1: Main Idea
Example: “What is the main idea of the article?”
Answer Tip: Start with a clear topic sentence summarizing the article in one sentence. Then give 1–2 key points that support your summary.
	•	Q2: Supporting Details
Example: “What are the three main reasons mentioned for the policy change?”
Answer Tip: Begin with a short introduction sentence (e.g., “The article gives three reasons…”), then list each reason in a numbered or bulleted format, each with a brief explanation.
	•	Q3: Cause/Effect or Sequence
Example: “What caused the event described in paragraph 3?”
Answer Tip: Use a cause-and-effect structure: start by describing the effect, then explain the cause(s) clearly, using linking words like “because,” “as a result,” or “due to.”

⸻

2. Discussion Questions – Personal Connection

Write three open-ended discussion questions to encourage the learner to reflect and respond using personal experience or opinion. For each, include a tip that shows how to organize a thoughtful response.
	•	Q1: Personal Connection
Example: “Have you ever had a similar experience?”
Answer Tip: Begin with a brief “yes” or “no” statement, then describe a specific personal experience using past tense, and finish with a short reflection (e.g., how you felt or what you learned).
	•	Q2: Opinion or Preference
Example: “Do you agree with the author’s viewpoint?”
Answer Tip: Start by clearly stating your opinion (e.g., “I agree because…”), then give at least two reasons or examples to support your view. Use logical connectors like “first,” “also,” or “for example.”
	•	Q3: Real-World Application
Example: “How could the ideas in this article apply to your life or community?”
Answer Tip: Begin with a general statement about relevance, then give one or two specific examples of how the topic could affect real situations, and finish with a possible result or benefit.
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
