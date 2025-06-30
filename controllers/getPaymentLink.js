const axios = require('axios');

const getPaymentLink = async (req, res) => {

  const { items, callbackURL, code } = req.body;
  //const experienceId = payload.items[0].experienceId;
  const accessToken = req.accessToken;
  //console.log(fecha, numberPerson, experienceId)

  const payload = {
    items,
    callbackURL,
    code,
    overrideAvailability: true
  }

  console.log(payload)

  if (!accessToken) {
    throw new Error('Access token no disponible en la solicitud');
  }

  const baseUrl = `https://api.utriper.com/api/v1.1.1/experience/reservation`;

  try {
    const response = await fetch(`${baseUrl}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("Respuesta de la API:", result);

    //console.log(result)

    if (result?.data?.paymentLink) {
      return res.json({
        msg: 'Solicitud exitosa',
        paymentLink: `https://buy.utriper.com/?code=${result.data.paymentLink}`
      })
    } else {
      return res.json({
        msg: 'Error en la solicitud o servidor interno uTriper',
        paymentLink: "https://skyhub.agenciasky.com/v2/preview/qD9hSzymcTbC0264JPOG?notrack=true"
      })
    }

  } catch (error) {
    console.error('❌ Error en getPaymentLink:', error.message);
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

module.exports = getPaymentLink;
