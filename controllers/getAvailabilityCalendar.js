const axios = require('axios');

const getAvailabilityCalendar = async (req, res) => {
  const { fecha, experienceId } = req.body;
  const accessToken = req.accessToken;
  var start = 'T19:30:00.000-05:00'
  var end = 'T21:30:00.000-05:00'
  console.log(fecha, experienceId)

  if (!accessToken) {
    throw new Error('Access token no disponible en la solicitud');
  }

  // Fiesta
  if (experienceId == 1990) {
    console.log('Fiesta ID: ', experienceId)
    start = 'T00:30:00.000'
    end = 'T02:30:00.000'
  }

  // Sunset Flamante
    if (experienceId == 1989) {
    console.log('Sunset Flamante ID: ', experienceId)
    start = 'T17:00:00.000-05:00'
    end = 'T19:00:00.000-05:00'
  }

  // Islas del Rosario
  if (experienceId == 1986) {
    console.log('Islas del Rosario ID: ', experienceId)
    start = 'T09:00:00.000'
    end = 'T16:00:00.000'
  }

    // Day Tour
  if (experienceId == 2520) {
    console.log('Day Tour ID: ', experienceId)
    start = 'T08:45:00.000'
    end = 'T15:30:00.000'
  }

  const baseUrl = `https://api.utriper.com/api/v1.1.1/experience/${experienceId}/availabilty`;

  const params = {
    fromDateTime: `${fecha}${start}`,
    toDateTime: `${fecha}${end}`,
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

    //console.log('data: { data: []}: ', data)

    // Si no hay disponibilidad
    if (data.length === 0) {
      return res.json({
        msg: 'No hay disponibilidad para esta fecha.',
        ava: false,
        avaNumber: 0
      });
    }

    // Suponiendo que solo te interesa el primer slot disponible
    const firstAvailable = data[0];
    const availablePlaces = firstAvailable.vacancies || 0;

    console.log(firstAvailable, availablePlaces)

    // No hay suficientes cupos
    if (availablePlaces == 0) {
      return res.json({
        msg: 'No hay cupos suficientes.',
        ava: false,
        avaNumber: availablePlaces
      });
    }

    // Hay cupos suficientes
    return res.json({
      msg: 'Hay cupos suficientes.',
      ava: true,
      avaNumber: availablePlaces
    });

  } catch (error) {
    console.error('❌ Error en getAvailabilityCalendar:', error.message);
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

module.exports = getAvailabilityCalendar;
