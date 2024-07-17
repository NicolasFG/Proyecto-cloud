const API_URL = 'https://api-cloud-proyecto.azure-api.net/recomendaciones/recomendar';

export const getRecommendations = async (cod_cliente) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '8e86d0751b924ee9b97a6622057b83df'
      },
      body: JSON.stringify({ cod_cliente })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    throw error;
  }
};
