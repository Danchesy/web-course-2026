export default function Sorting({ currentSort, onSortChange }) {
    return (
        <div>
            <select value={currentSort} onChange={(e) => onSortChange(e.target.value)}>
                <option value="none">default</option>
                <option value="alpha">a-z</option>
                <option value="newest">newest first</option>
                <option value="oldest">oldest first</option>
            </select>
        </div>
    );
}