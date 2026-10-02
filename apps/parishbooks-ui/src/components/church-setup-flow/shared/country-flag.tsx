export function IndiaFlag({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden focusable="false">
            <rect width="30" height="6.67" fill="#FF9933" />
            <rect y="6.67" width="30" height="6.66" fill="#FFFFFF" />
            <rect y="13.33" width="30" height="6.67" fill="#138808" />
            <g fill="none" stroke="#000080" strokeWidth="0.4">
                <circle cx="15" cy="10" r="2.15" />
                {Array.from({ length: 24 }, (_, index) => (
                    <line key={index} x1="15" y1="10" x2="15" y2="7.95" transform={`rotate(${index * 15} 15 10)`} />
                ))}
            </g>
            <circle cx="15" cy="10" r="0.35" fill="#000080" />
        </svg>
    );
}

export function UsaFlag({ className }: { className?: string }) {
    const stripe = 10 / 13;
    return (
        <svg viewBox="0 0 19 10" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden focusable="false">
            {Array.from({ length: 13 }, (_, index) => (
                <rect key={index} y={index * stripe} width="19" height={stripe} fill={index % 2 === 0 ? '#B22234' : '#FFFFFF'} />
            ))}
            <rect width="7.6" height={stripe * 7} fill="#3C3B6E" />
            {Array.from({ length: 9 }, (_, row) => {
                const count = row % 2 === 0 ? 6 : 5;
                const offsetX = row % 2 === 0 ? 0.7 : 1.35;
                return Array.from({ length: count }, (_, col) => (
                    <circle key={`${row}-${col}`} cx={offsetX + col * 1.25} cy={0.55 + row * 0.58} r="0.22" fill="#FFFFFF" />
                ));
            })}
        </svg>
    );
}
