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
                const half = idx % 2 == 0 ? "mask-half-1" : "mask-half-2";
                return (
                    <div
                        key={idx}
                        className={`mask mask-star-2 ${color} ${half}`}
                        aria-label={`${(idx + 1) / 2} star`}
                        aria-current={idx == score - 1}
                    ></div>
                );
            })}
        </div>
    );
};

export default Rating;
