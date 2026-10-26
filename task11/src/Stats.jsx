export default function Stats({ stats }) {
    return (
        <div className="stats">
            <span>left: {stats.left}</span>
            <span>done: {stats.done}</span>
        </div>
    );
}