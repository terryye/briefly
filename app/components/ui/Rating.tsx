const Rating = ({ score }: { score: number }) => {
    let color = "bg-red-400";
    if (score >= 8) {
        color = "bg-green-400";
    } else if (score >= 6) {
        color = "bg-yellow-400";
    }
    return (
        <div
            className="rating rating-xs rating-half mb-1"
            title={`Score: ${score} / 10`}
        >
            {Array.from({ length: 10 }).map((_, idx) => {
                return (
                    <div
                        key={idx}
                        className={`mask mask-star-2 mask-half-${
                            idx % 2 == 0 ? "1" : "2"
                        }  ${color}`}
                        aria-label={`${(idx + 1) / 2} star`}
                        aria-current={idx == score - 1}
                    ></div>
                );
            })}
        </div>
    );
};

export default Rating;
