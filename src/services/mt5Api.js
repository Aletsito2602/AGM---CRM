import axios from 'axios';

const API_BASE_URL = 'http://62.171.177.212:5000/api';

// Configuración global de axios
axios.defaults.timeout = 30000; // 30 segundos
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptor para manejar errores
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Si es un error de timeout y no hemos intentado reintentar
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Esperar 1 segundo antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reintentar la petición
      return axios(originalRequest);
    }

    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
      return Promise.reject(new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.'));
    } else {
      // Algo sucedió al configurar la solicitud
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

const mt5Api = {
  // Verificar estado de la API
  checkHealth: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear una cuenta de trading
  createAccount: async (token, {
    name,
    email,
    leverage = 100,
    deposit,
    challenge_type = "one_step",
    group = "challenge\\onestep",
    purchase_id,
    phone
  }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/accounts`, {
        name,
        email,
        leverage,
        deposit,
        challenge_type,
        group,
        purchase_id,
        phone
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Depositar fondos en una cuenta
  depositFunds: async (token, accountId, depositData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/accounts/${accountId}/deposit`, depositData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener información de una cuenta
  getAccountInfo: async (token, accountId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar grupo de una cuenta
  changeAccountGroup: async (token, accountId, groupData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/accounts/${accountId}/group`, groupData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default mt5Api; 