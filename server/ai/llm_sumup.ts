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

const role =
    "You are an expert ESL instructor analyzing a learner's overall performance.";
const instruction = `Based on the learner's answers and the feedback provided for each question, create a concise performance summary.

    Analyze the patterns across ALL answers to identify:
    
    **OVERALL PERFORMANCE SUMMARY** (2-3 sentences)
    Briefly assess the learner's general English proficiency level and main characteristics of their writing.
    
    **THE #1 PRIORITY AREA TO IMPROVE**
    Identify the SINGLE most important weakness that, if improved, would have the biggest impact on their English. Be specific and provide:
    - What the issue is
    - Why it's the top priority
    - One concrete strategy to improve it
    
    **COMMON PATTERNS** (2-3 bullet points)
    List recurring mistakes or weaknesses that appeared across multiple answers. Focus on:
    - Grammar patterns (not isolated errors)
    - Vocabulary usage trends
    - Structural/organizational habits
    
    **QUICK WIN SUGGESTION**
    One simple technique they can implement immediately to see improvement.
    
    Keep the entire summary under 200 words. Be encouraging but direct.`;
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
