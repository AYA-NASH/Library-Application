interface DueDateProps {
    daysLeft: number;
}

export const DueDateMessage: React.FC<DueDateProps> = ({ daysLeft }) => {
    if (daysLeft > 0) return <p className="text-secondary">Due in {daysLeft} days.</p>;
    if (daysLeft === 0) return <p className="text-success">Due Today.</p>;
    return <p className="text-danger">Past due by {Math.abs(daysLeft)} days.</p>;
};
