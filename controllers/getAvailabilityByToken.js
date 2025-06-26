const axios = require('axios');

const getAvailabilityByToken = async (req) => {
  const { fecha, numberPerson, experienceId } = req.body;
  const accessToken = req.accessToken;
  console.log(fecha, numberPerson, experienceId)

  if (!accessToken) {
    throw new Error('Access token no disponible en la solicitud');
  }

  const baseUrl = `https://api.utriper.com/api/v1.1.1/experience/${experienceId}/availabilty`;

  const params = {
    fromDateTime: `${fecha}T00:00:00`,
    toDateTime: `${fecha}T23:59:59`,
    group_size: `${numberPerson}`
  };

  console.log(params)

  try {
    const response = await axios.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params
    });

    console.log('Respuesta Data: ', response.data?.data)

    const data = response.data?.data || [];

    console.log('data: { data: []}: ', data)

    // Si no hay disponibilidad
    if (data.length === 0) {
      return {
        msg: 'No hay disponibilidad para esta fecha.',
        ava: false,
        avaNumber: 0
      };
    }

    // Suponiendo que solo te interesa el primer slot disponible
    const firstAvailable = data[0];
    const availablePlaces = firstAvailable.vacancies || 0;

    console.log(firstAvailable, availablePlaces)

    // No hay suficientes cupos
    if (groupSize > availablePlaces) {
      return {
        msg: 'No hay cupos suficientes.',
        ava: false,
        avaNumber: availablePlaces
      };
    }

    // Hay cupos suficientes
    return {
      msg: 'Hay cupos suficientes.',
      ava: true,
      avaNumber: availablePlaces
    };

  } catch (error) {
    console.error('❌ Error en getAvailabilityByToken:', error.message);
    if (error.response) {
      console.error('📡 Status:', error.response.status);
      console.error('📦 Body:', error.response.data);
    }
    return {
      msg: 'No se pudo validar la disponibilidad.',
      ava: false,
      avaNumber: 0
    };
  }
};

module.exports = getAvailabilityByToken;
