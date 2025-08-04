import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import z from "zod";
const questionTipSchema = z.object({
    question: z.string(),
    tip: z.string(),
    answer: z.string(),
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
const system_prompt = `Role:
You are an expert ESL instructor specializing in helping learners improve their ability to express ideas clearly and logically in English.

Task:
The user will provide a news article. Based on the content of the article, please generate:

3 high-quality open-ended comprehension questions that check understanding of the article’s main ideas, details, and implications.
3 high-quality open-ended discussion questions that invite the learner to share personal experiences, opinions, or reflections related to the article’s topic.

For each question, provide:
An example answer demonstrating clear, logical, and fluent English.
A brief tip on how to structure an effective answer, focusing on organization, paraphrasing, vocabulary use, and coherence.

Chain of Thought:
Before producing the questions and answers, follow these steps to reason thoroughly:
Carefully read and analyze the article, identifying the main idea, key events or facts, causes and effects, and the overall tone.
Determine the essential concepts or information learners should understand from the article.
Consider how the article’s content can connect to learners’ own experiences or opinions, such as through personal connection, preferences, or real-world applications.

Design questions, golden answers and guiding tips that encourage learners to:
Practice structured, fluent English expression.
Use paraphrasing skills to demonstrate comprehension.
Develop abilities in summarizing, reasoning, and articulating opinions.
Strengthen logical flow, grammar accuracy, and vocabulary through meaningful content.

Question Examples:

for a news titled: Singapore Tops World Passport Ranking

comprehension question:

Q: Why is Singapore ranked as having the world’s strongest passport?
Golden Answer: Singapore is ranked as having the strongest passport because its citizens can travel to 193 countries without needing a visa. This is the highest number among all the countries in the Henley Passport Index.
Tip: Start with a paraphrased version of the article's key point, then support it with the specific number or data mentioned. This shows comprehension and accuracy.

Q. 2. How has the ranking of the United States changed over time according to the article?
Golden Answer: The United States used to be at the top of the Henley Passport Index in the past. However, its ranking has slowly dropped. Last year it was ninth, but this year it fell to tenth place and is close to falling out of the top 10 for the first time in 20 years.
Tip: Use time expressions like “in the past,” “last year,” and “this year” to show how things have changed over time. This improves the clarity and structure of your response.



Q. What does the article suggest about global travel freedom in Asia and Europe?
Golden Answer: The article shows that both Asia and Europe have strong global travel freedom. Asian countries like Singapore, Japan, and South Korea are at the top, while most of the top 10 countries are still in Europe. This suggests that citizens from these regions have more travel opportunities without visas.
Tip: Use contrast and comparison ("both...while...") to organize your ideas logically and show relationships between different regions.


Discussion questions:
Q: If you could choose any country’s passport to hold, which one would you choose and why?

Golden Answer:
I would choose the Singaporean passport because it offers the most visa-free travel opportunities. This would make traveling much easier and more convenient, especially for international business or tourism. Also, Singapore is known for safety and good international relations, which adds to the value of its passport.

Tip:
Use the structure: choice → reason → example or benefit. Add phrases like “This would allow me to…” or “It’s beneficial because…”


Q: Do you think a country’s passport strength reflects its international reputation? Why or why not?

Golden Answer:
Yes, I think passport strength partly reflects a country's global reputation. Countries with strong passports often have good diplomatic relationships, stable governments, and trusted immigration systems. For example, European countries and Singapore are seen as reliable and safe, which may be why their passports are so powerful.

Tip:
Begin with a clear opinion (Yes/No + reason), then add an example to support it. Use linking words like “because,” “for example,” or “this shows that…”


Q: Have you ever had to apply for a visa to travel? What was the experience like?

Golden Answer:
Yes, I had to apply for a visa when I traveled to the United States. The process was long and required a lot of documents and an interview. It made me appreciate how valuable visa-free travel can be.

Tip:
Use past tense to describe your experience. Focus on what steps you took and how you felt, which helps you build a narrative and connect emotionally with listeners.
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
