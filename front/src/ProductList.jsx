import React from 'react';

function ProductList({ products }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Productos recomendados para el cliente</h2>
      <ul className="list-none p-0">
        {products.map((product, index) => (
          <li key={index} className="bg-gray-100 my-2 p-4 rounded-lg shadow-sm">
            {product}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
