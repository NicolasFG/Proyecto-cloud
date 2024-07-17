import React from 'react';

function CategorySelector({ categories, setSelectedCategory }) {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Selecciona una Categoría</h2>
      <select
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full max-w-xs mx-auto p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Seleccione una categoría</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategorySelector;
