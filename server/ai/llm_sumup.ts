import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const modelParams = {
    modelName: "gpt-4o",
    temperature: 0.7,
};

const promptString = `{role}
    {instruction}
    Article: 
        {title} \n 
        {article} \n
    Questions: 
        {questions} \n
    Answers:
        {answers} \n
    Feedbacks:  
        {feedbacks} \n
`;

const role = "You are a English teacher.";
const instruction = `You provided me with an article and a set of questions to help them practice their English language skills. I answered each question, and you have already given feedback on their responses. Now, identify one most important areas and common mistakes need to improve based on the my answers.Ignore Spelling issues. Be concise.`;
const model = new ChatOpenAI(modelParams);
export async function sumUpAnswers(
    title: string,
    article: string,
    questions: string[],
    answers: string[],
    feedbacks: string[]
) {
    const prompt = PromptTemplate.fromTemplate(promptString);
    const systemPrompt = await prompt.format({
        role: role,
        instruction: instruction,
        title: title,
        article: article,
        questions: questions,
        answers: answers,
        feedbacks: feedbacks,
    });
    const response = await model.invoke(systemPrompt);
    return response.content;
}
