import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import ProductList from './ProductList';

function Recommendations({ recommendations }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-2xl">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Recomendaciones de Productos</h1>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
          >
            Cerrar Sesión
          </button>
        </header>
        <main>
          <ProductList products={recommendations["Productos recomendados para el cliente"] || []} />
        </main>
      </div>
    </div>
  );
}

export default Recommendations;
