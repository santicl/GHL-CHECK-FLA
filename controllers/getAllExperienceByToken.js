const axios = require('axios');

const getAllExperiences = async (req, res, next) => {
const clientToken = req.accessToken;
console.log(clientToken)
const params = req.body;
  try {
    const baseUrlOfficial = 'https://api.utriper.com/api/v1.1.1/experience';
    const baseUrl = 'https://api.utriper.com/api/v1.1.0/experience?expId=582&draft=true&archive=true';

    const queryParams = {};
    if (params.page) queryParams.page = params.page;
    if (params.pageSize) queryParams.pageSize = params.pageSize;
    if (params.lat) queryParams.lat = params.lat;
    if (params.lng) queryParams.lng = params.lng;
    if (params.radius) queryParams.radius = params.radius;
    if (params.moduses) queryParams.moduses = params.moduses;
    if (params.code) queryParams.code = params.code;
    if (params.sectionId) queryParams.sectionId = params.sectionId;
    if (params.priceOrder) queryParams['price-order'] = params.priceOrder;
    if (params.getExpsDetails) queryParams.getExpsDetails = params.getExpsDetails;


    const response = await axios.get(baseUrl, {
      headers: {
        'Authorization': `Bearer ${clientToken}`,
        'Content-Type': 'application/json',
      }
    });

    console.log(response.data.data);
    req.experiences = response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener experiencias:', error.message);
    if (error.response) {
      console.error('📡 Status:', error.response.status);
      console.error('📦 Body:', error.response.data);
    }
    throw new Error('Error al consultar la API de experiencias');
  }
};

module.exports = getAllExperiences;
