import re
import os

import pathlib
current_dir = str(pathlib.Path(__file__).parent)

# load csv file
import pandas as pd
def load_csv(file_path):
    """Load a CSV file into a DataFrame."""
    try:
        df = pd.read_csv(file_path)
        print(f"Loaded {len(df)} rows from {file_path}")
        return df
    except Exception as e:
        print(f"Error loading CSV file: {e}")
        return None

df = load_csv(current_dir +"/engoo.csv")

#show the first 5 rows
if df is not None:
    print(df.head())


title_pattern = r'((?:[0-9]|[12][0-9]|3[01]) days ago|[0-9] months ago).*$'


df["title"] = df["news"].astype(str).str.replace(title_pattern, '', regex=True).str.strip()
df['content'] = df.apply(lambda row: row['content'].replace(row['title'], '', 1), axis=1)
df['question_1_type'] = df['exe3'].apply(lambda x: 'Discussion' if str(x).startswith('Exercise 3Discussion') else 'Summary')
df["question_1"] = df["exe3"].astype(str).str.replace(r'^Exercise 3DiscussionHave a discussion based on the following questions\.|Exercise 3QuestionsAnswer the following questions about the article\.', '', regex=True).str.strip()

df['question_2_type'] = df['exe4'].apply(lambda x: 'Further' if str(x).startswith('Exercise 4Further Discussion') else 'Discussion')
df["question_2"] = df["exe4"].astype(str).str.replace(r'^Exercise 4Further Discussion Have a discussion based on the following questions\.|Exercise 4DiscussionHave a discussion based on the following questions\.', '', regex=True).str.strip()

df_processed = df[['title', 'content', 'question_1_type', 'question_1', 'question_2_type', 'question_2']]

df_processed.to_csv("./engoo_processed.csv", index=False)


import pandas as pd
import json
import re

counter_disscuss = {"max":0, "min":100}
counter_summary = {"max":0, "min":100}
def parse_questions(question_text, question_type):
    """Parse question text and extract individual questions"""
    if pd.isna(question_text) or not question_text:
        return []
    
    # Split by numbered questions (1., 2., etc.)
    questions = re.split(r'\d+\.', str(question_text))

    # Remove empty strings and strip whitespace
    questions = [re.sub(r'\?(.*)','?', q.strip()) for q in questions if q.strip()]

    
    # Count questions for summary and discussion
    global counter_disscuss, counter_summary
    if question_type == "Discussion":
        counter_disscuss["max"] = max(counter_disscuss["max"], len(questions))
        counter_disscuss["min"] = min(counter_disscuss["min"], len(questions))
    elif question_type == "Summary":
        counter_summary["max"] = max(counter_summary["max"], len(questions))
        counter_summary["min"] = min(counter_summary["min"], len(questions))
    return questions

def categorize_questions(question_1_type, question_1, question_2_type, question_2):
    """Categorize questions into summary_questions and discuss_questions"""
    summary_questions = []
    discuss_questions = []
    
    # Process question 1
    if question_1_type in ['Summary']:
        summary_questions.extend(parse_questions(question_1,"Summary"))
    elif question_1_type in ['Discussion', 'Further']:
        discuss_questions.extend(parse_questions(question_1,"Discussion"))
    
    # Process question 2
    if question_2_type in ['Summary']:
        summary_questions.extend(parse_questions(question_2,"Summary"))
    elif question_2_type in ['Discussion', 'Further']:
        discuss_questions.extend(parse_questions(question_2,"Discussion"))
    
    return summary_questions, discuss_questions

def create_system_prompt():
    """Create the system prompt for the ESL tutor"""
    return """You are an ESL tutor. User will provide a news article. Please:
1: create 3 - 5 questions to help me grasp the main idea of the news.
2: create 5 - 6 discussion questions related to this news. The questions should connect the topic to everyday life or personal experience, so it's easy for ESL students like me to talk about them in class. Keep the questions simple and friendly for conversation practice."""

def convert_csv_to_jsonl(input_file=current_dir+'/engoo_processed.csv', output_file=current_dir+'/training_data.jsonl'):
    """Convert CSV file to JSONL format for OpenAI fine-tuning"""
    
    # Read the CSV file
    df = pd.read_csv(input_file)
    
    system_prompt = create_system_prompt()
    training_examples = []
    counter = 0
    for _, row in df.iterrows():
        # Extract article information
        title = str(row['title']) if pd.notna(row['title']) else ""
        content = str(row['content']) if pd.notna(row['content']) else ""
        
        # Skip if no content
        if not title or not content:
            continue
        
        # Parse and categorize questions
        summary_questions, discuss_questions = categorize_questions(
            row['question_1_type'], row['question_1'],
            row['question_2_type'], row['question_2']
        )
        
         # Skip this example if no summary questions
        if len(summary_questions) <= 0:
            continue
            
         # Skip this example if no discussion questions
        if len(discuss_questions) <= 0:
            continue
        
        # Create the training example
        user_content = f"{title}\n\n{content}"
        
        assistant_response = {
            "summary_questions": summary_questions,
            "discuss_questions": discuss_questions
        }
        
        training_example = {
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user", 
                    "content": user_content
                },
                {
                    "role": "assistant",
                    "content": json.dumps(assistant_response, ensure_ascii=False)
                }
            ]
        }

        counter += 1

        if counter > 50:
            break
        
        training_examples.append(training_example)
    
    # Write to JSONL file
    with open(output_file, 'w', encoding='utf-8') as f:
        for example in training_examples:
            f.write(json.dumps(example, ensure_ascii=False) + '\n')
    
    print(f"Converted {len(training_examples)} examples to {output_file}")
    return len(training_examples)

def preview_conversion(input_file='engoo_processed.csv', num_examples=3):
    """Preview the conversion without writing to file"""
    df = pd.read_csv(input_file)
    system_prompt = create_system_prompt()
    
    print("Preview of conversion:")
    print("=" * 50)
    
    count = 0
    for _, row in df.iterrows():
        if count >= num_examples:
            break
            
        title = str(row['title']) if pd.notna(row['title']) else ""
        content = str(row['content']) if pd.notna(row['content']) else ""
        
        if not title or not content:
            continue
            
        summary_questions, discuss_questions = categorize_questions(
            row['question_1_type'], row['question_1'],
            row['question_2_type'], row['question_2']
        )
        
        if not summary_questions or not discuss_questions:
            continue
            
        print(f"\nExample {count + 1}:")
        print(f"Title: {title}")
        print(f"Summary Questions ({len(summary_questions)}): {summary_questions[:3]}")
        print(f"Discussion Questions ({len(discuss_questions)}): {discuss_questions[:5]}")
        print("-" * 30)
        
        count += 1

# Example usage:
if __name__ == "__main__":
    # Preview the conversion first
    preview_conversion()
    
    # Convert the file
    num_examples = convert_csv_to_jsonl()
    print(f"Successfully created training file with {num_examples} examples, max {counter_disscuss} {counter_summary} questions per example.")
    
    # You can also specify custom file names:
    # convert_csv_to_jsonl('your_csv_file.csv', 'your_output_file.jsonl')