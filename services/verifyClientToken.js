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
        if (!refreshToken) {
            console.error('❌ El refresh token no está definido: ', refreshToken);
            throw new Error('Refresh token no definido');
        }

        const response = await axios.get('https://auth.utriper.com/1/accessToken', {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });
        //console.log(response)
        accessToken = response.data.data.accessToken;
        tokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hora

        console.log('✅ Access token renovado correctamente');
        return accessToken;
    } catch (err) {
        console.error('❌ Error al renovar access token:', err.response?.data || err.message);
        throw new Error('No se pudo obtener access token');
    }
}

// 4. Obtener un access token válido (usa token del cliente si es válido, si no, renueva)
async function getValidAccessToken(req, res, next) {
    const clientToken = req.clientToken;
    if (isClientAccessTokenValid(clientToken)) {
        console.log('🔐 Usando access token proporcionado por el cliente');
        console.log(clientToken);
        req.accessToken = clientToken
        //return clientToken;
    }

    console.log('🔄 Access token inválido o expirado. Renovando...');
    req.accessToken = await refreshAccessToken();
    console.log(req.accessToken)
    next()
}

module.exports = getValidAccessToken;
