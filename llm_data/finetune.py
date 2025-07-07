# Fine Tuning Dataset
import openai
import os
import pathlib

current_dir = str(pathlib.Path(__file__).parent)
openai.api_key = os.getenv("OPENAI_API_KEY")

# Upload the file using the new API format
file_path = current_dir + "/training_data.jsonl"

response = openai.files.create(
    file=open(file_path, "rb"),
    purpose="fine-tune"
)

file_id = response.id
print("Uploaded file ID:", file_id)

# Start fine-tuning using the uploaded file ID
try:
    fine_tune_response = openai.fine_tuning.jobs.create(
        training_file=file_id,
        model="gpt-4.1-2025-04-14",  # Replace with a supported model
        suffix="ESLTutorFineTuning"  # Optional: specify a suffix for the fine-tuned model
    )
    print("Fine-tune started:", fine_tune_response)
except Exception as e:
    print("Fine-tune error:", e)