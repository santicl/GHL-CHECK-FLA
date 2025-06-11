const axios = require("axios");

// Función reutilizable para obtener submissions
const getSubmissions = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY_FLAMANTE}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.submissions; // Me aseguro de devolver solo el array de datos
    } catch (error) {
        console.error('Error en getSubmissions:', error.message);
        throw error;
    }
};

const getFormAllByIdSubmissions = async (req, res, next) => {
    const formId = process.env.FORM_ID;
    const limit = 100;

    if (!formId) {
        return res.status(400).json({ error: 'El FORM_ID es requerido en las variables de entorno' });
    }

    let page = 1;
    let allSubmissions = [];
    let hasMore = true;

    try {
        while (hasMore) {
            const url = `https://rest.gohighlevel.com/v1/forms/submissions?page=${page}&limit=${limit}&formId=${formId}`;
            const submissions = await getSubmissions(url);

            if (!Array.isArray(submissions)) {
                throw new Error('La respuesta del formulario no es un arreglo');
            }

            allSubmissions = allSubmissions.concat(submissions);

            // Si recibimos menos del límite, significa que ya no hay más páginas
            if (submissions.length < limit) {
                hasMore = false;
            } else {
                page++;
            }
        }

        req.body.submissions = allSubmissions;
        next();
    } catch (error) {
        console.error('Error al obtener datos:', error.message);
        res.status(error.response?.status || 500).json({
            error: 'Error al obtener los datos',
            details: error.response?.data || error.message
        });
    }
};


module.exports = getFormAllByIdSubmissions;
