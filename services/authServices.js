const axios = require('axios');

let accessToken = null;
let tokenExpiresAt = null;
const refreshToken = process.env.TOKEN_FLAMANTE;

// 1. Verificar si el access token en memoria ha expirado
function isAccessTokenExpired() {
  return !accessToken || !tokenExpiresAt || Date.now() >= tokenExpiresAt;
}

// 2. Verificar si un token externo coincide con el almacenado y sigue siendo válido
function isClientAccessTokenValid(clientToken) {
  return clientToken && clientToken === accessToken && !isAccessTokenExpired();
}

// 3. Obtener un nuevo access token desde el refresh token interno
async function refreshAccessToken() {
  try {
    const response = await axios.get('https://auth-beta.utriper.com/1/accessToken', {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    accessToken = response.data.token;
    tokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hora

    console.log('✅ Access token renovado correctamente');
    return accessToken;
  } catch (err) {
    console.error('❌ Error al renovar access token:', err.response?.data || err.message);
    throw new Error('No se pudo obtener access token');
  }
}

// 4. Obtener un access token válido (usa token del cliente si es válido, si no, renueva)
async function getValidAccessToken(clientToken = null) {
  if (isClientAccessTokenValid(clientToken)) {
    console.log('🔐 Usando access token proporcionado por el cliente');
    return clientToken;
  }

  console.log('🔄 Access token inválido o expirado. Renovando...');
  return await refreshAccessToken();
}

// 5. Exponer tokens actuales (para fines de debug o devolución al cliente)
function getCurrentTokens() {
  return {
    accessToken,
    refreshToken,
    expiresAt: tokenExpiresAt,
  };
}

module.exports = {
  getValidAccessToken,
  getCurrentTokens,
};
