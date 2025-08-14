const axios = require('axios');

const getAvailabilityCalendar = async (req, res) => {
  const { fecha, experienceId } = req.body;
  const accessToken = req.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token no disponible en la solicitud' });
  }

  // Horarios por defecto
  let start = 'T19:30:00.000-05:00';
  let end = 'T21:30:00.000-05:00';

  // Ajustar horarios según experienceId
  switch (Number(experienceId)) {
    case 1990: // Fiesta
      start = 'T00:30:00.000';
      end = 'T02:30:00.000';
      break;
    case 1989: // Sunset Flamante
      start = 'T17:00:00.000-05:00';
      end = 'T19:00:00.000-05:00';
      break;
    case 1986: // Islas del Rosario
      start = 'T09:00:00.000';
      end = 'T16:00:00.000';
      break;
    case 2520: // Day Tour
      start = 'T08:45:00.000';
      end = 'T15:30:00.000';
      break;
  }

  const getLastDayOfMonthWithTime = (fecha, hora) => {
    const [year, month] = fecha.split('-').map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}${hora}`;
  };

  const removeDuplicatesByStartEnd = arr => {
    const seen = new Set();
    return arr.filter(item => {
      const key = `${item.start}-${item.end}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const transformAvailability = arr => arr.map(item => ({
    date: new Date(item.start).toISOString().split('T')[0], // YYYY-MM-DD
    ava: item.available,
    avaNumber: item.vacancies
  }));

  try {
    const baseUrl = `https://api.utriper.com/api/v1.1.1/experience/${experienceId}/availabilty`;

    const params = {
      fromDateTime: `${fecha}${start}`,
      toDateTime: getLastDayOfMonthWithTime(fecha, end),
    };

    const response = await axios.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params
    });

    const data = response.data?.data || [];
    const arrCleaned = removeDuplicatesByStartEnd(data);
    const availabilityArray = transformAvailability(arrCleaned);

    return res.json(availabilityArray);

  } catch (error) {
    console.error('❌ Error en getAvailabilityCalendar:', error.message);
    if (error.response) {
      console.error('📡 Status:', error.response.status);
      console.error('📦 Body:', error.response.data);
    }
    return res.status(500).json([]);
  }
};

module.exports = getAvailabilityCalendar;
