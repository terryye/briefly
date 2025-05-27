import { Feedback } from "@/server/openai";
import { Summary } from "@/server/api/summary";

const FeedbackCard = ({ summary }: { summary: Summary | null }) => {
    if (!summary) return null;
    const feedback = summary.feedback as Feedback;

    return (
        <div className="prose prose-invert max-w-none p-6">
            <div className="text-sm">Feedback:</div>
            <div>
                <span className="text-xs opacity-60"></span>
            </div>
            <div className="join join-vertical bg-base-100">
                <div className="collapse collapse-arrow join-item border-base-300 border">
                    <input type="radio" name="my-accordion-1" defaultChecked />
                    <div className="collapse-title font-semibold">
                        Overall: {summary.score}
                    </div>
                    <div className="collapse-content text-sm">
                        {feedback.overall}
                    </div>
                </div>
                <div className="collapse collapse-arrow join-item border-base-300 border">
                    <input type="radio" name="my-accordion-1" />
                    <div className="collapse-title font-semibold">
                        Accuracy: {feedback.accuracy.score}
                    </div>
                    <div className="collapse-content text-sm">
                        {feedback.accuracy.feedback}
                    </div>
                </div>
                <div className="collapse collapse-arrow join-item border-base-300 border">
                    <input type="radio" name="my-accordion-1" />
                    <div className="collapse-title font-semibold">
                        Clarity: {feedback.clarity.score}
                    </div>
                    <div className="collapse-content text-sm">
                        {feedback.clarity.feedback}
                    </div>
                </div>
                <div className="collapse collapse-arrow join-item border-base-300 border">
                    <input type="radio" name="my-accordion-1" />
                    <div className="collapse-title font-semibold">
                        Language: {feedback.language.score}
                    </div>
                    <div className="collapse-content text-sm">
                        {feedback.language.feedback}
                    </div>
                </div>
                <div className="collapse collapse-arrow join-item border-base-300 border">
                    <input type="radio" name="my-accordion-1" />
                    <div className="collapse-title font-semibold">
                        Paraphrasing: {feedback.paraphrasing.score}
                    </div>
                    <div className="collapse-content text-sm">
                        {feedback.paraphrasing.feedback}
                    </div>
                </div>
                <div className="collapse collapse-arrow join-item border-base-300 border">
                    <input type="radio" name="my-accordion-1" />
                    <div className="collapse-title font-semibold">
                        Improved Version:
                    </div>
                    <div className="collapse-content text-sm">
                        {feedback.improved}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackCard;
