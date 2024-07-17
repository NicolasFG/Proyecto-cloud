import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { getRecommendations } from './api';
import { defaultRecommendations } from './data';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        try {
          const data = await getRecommendations(647917); // Usamos un código de cliente fijo por ahora
          setRecommendations(data);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
          setRecommendations(defaultRecommendations);
        }
      } else {
        setRecommendations(defaultRecommendations);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return React.cloneElement(children, { recommendations });
};

export default ProtectedRoute;
