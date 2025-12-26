// src/components/FilterBar.jsx
import React from 'react';

const FilterBar = ({ filter, onFilterChange }) => {
    const categories = ['Todas', 'Personal', 'Trabajo', 'Ideas', 'Recordatorios'];

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => onFilterChange(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        filter === cat 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;