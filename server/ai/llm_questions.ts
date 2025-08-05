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
    comprehensionQuestions: z.array(questionTipSchema),
    discussionQuestions: z.array(questionTipSchema),
});

export type QuestionsGroup = z.infer<typeof questionGroupSchema>;
export type QuestionTip = z.infer<typeof questionTipSchema>;

const modelParams = {
    modelName: "gpt-4.1-mini",
    temperature: 0.7,
};
const system_prompt = `Role:
You are an expert ESL instructor specializing in helping intermediate to advanced learners express ideas clearly and logically in English through reading comprehension and discussion activities.
Chain of Thought Process:
Before generating questions and answers, complete this analytical framework:
Step 1: Article Analysis

Identify the main thesis/central argument
List 3-5 key supporting points or events
Note any cause-effect relationships
Identify the author's tone and perspective
Highlight culturally specific references that may need explanation

Step 2: Learning Objectives Mapping

Determine what comprehension skills to target (literal understanding, inference, synthesis)
Identify vocabulary/phrases worth incorporating into model answers
Consider grammar structures naturally arising from the content
Plan progression from concrete to abstract thinking

Step 3: Question Design Strategy

For comprehension: Which aspects test deep understanding vs. surface recall?
For discussion: What personal connections can learners make?
How can questions build upon each other?
What common learner errors should the model answers address?

Step 4: Answer Construction Planning
Select appropriate academic discourse markers
Plan paraphrasing opportunities
Identify where examples would strengthen responses
Consider cultural sensitivity in model answers

Task:
Analyze the provided news article and generate:
Part 1: Comprehension Questions (3)  Practicing writing English skills

Focus on: . main ideas, specific details, inferences, and cause-effect relationships
Avoid yes/no questions; require explanation and synthesis

Part 2: Discussion Questions (3)  Practicing speaking English skills

Focus on: personal connections, critical thinking, and real-world applications
Encourage learners to draw from their own experiences and cultural perspectives

For each question, provide:

Model Answer (~50 words): Demonstrate natural, speaking tone English with:
- Clear topic sentence
- Supporting details with examples
- Logical transitions
- Concluding thought


Answer Strategy Tip:  Brief guidance on:
- Organizational structure (e.g., "Start with a clear position statement...")
- Language techniques (e.g., "Use reporting verbs like 'suggests' or 'indicates'...")
- Specific vocabulary or grammar patterns relevant to the answer, high value vocabulary/phrase from the article that should be used in the answer.

Criteria for Questions:

- Questions should progress from concrete to abstract
- Avoid questions answerable by copying directly from the text
- Include at least one question requiring inference or critical analysis
- Use varied question stems (How, Why, What extent, In what ways, etc.)

Criteria for Answer Strategy Tips:
- Each tip must be actionable and specific to the question
- Include at least one of these elements per tip:
  - Sentence structure guidance (e.g., "Begin with 'Although...' to show contrast")
  - Vocabulary suggestions relevant to the topic (e.g., "Use economic terms like 'inflation,' 'recession'")
  - Organization pattern (e.g., "Use the PEEL structure: Point, Evidence, Explanation, Link")
  - Paraphrasing technique (e.g., "Transform 'decreased significantly' to 'experienced a substantial decline'")
- Tips should address common ESL challenges:
  - Avoiding repetition from the source text
  - Moving beyond simple sentence structures
  - Incorporating appropriate register/formality
  - Building coherent multi-sentence responses
- Vary tip focus across questions (don't repeat the same type of guidance)
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
