export default function Filters({ currentFilter, onFilterChange }) {
    return (
        <div className="filters">
            <button 
                disabled={currentFilter === 'all'} 
                onClick={() => onFilterChange('all')}
            >
                all
            </button>
            <button 
                disabled={currentFilter === 'active'} 
                onClick={() => onFilterChange('active')}
            >
                active
            </button>
            <button 
                disabled={currentFilter === 'completed'} 
                onClick={() => onFilterChange('completed')}
            >
                completed
            </button>
        </div>
    );
}