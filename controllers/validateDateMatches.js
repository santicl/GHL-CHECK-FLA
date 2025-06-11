const validateDateMatches = async (req, res, next) => {
    const { fecha } = req.body;
    const { submissions } = req.body;
    const { numberPerson } = req.body;
    const numberAvailable = req.body.placesAvailable;

    if (!fecha) {
        return res.status(400).json({ error: 'La fecha es requerida' });
    }

    try {
        const submissionsData = submissions || [];
        //console.log(submissionsData.length, 'Cantidad de Registros')

        let totalAdditionalPeople = 0;

        //console.log(submissionsData)

        submissionsData.filter(submission => {
            const submissionDate = submission.EmpYNzeziZpMDUh6PypQ;
            const numberAdult = parseInt(submission.ZX7OoZj1AB4fuDkULkL4, 10) || 0;
            const numberChilds= parseInt(submission.iuvJPK52pWDuFdsUICir, 10) || 0;
            const numberInfants = parseInt(submission.CEoZMyXaO4gffLggAIZL, 10) || 0;
            const peoples = numberAdult + numberChilds + numberInfants;

            // Se suma la fecha si coincide
            if (submissionDate === fecha) {
                //console.log('Existe coincidencia', submissionDate, personas)
                totalAdditionalPeople += peoples;
            }

            console.log('Fechas: ' + submissionDate + ' / ' + fecha)
            console.log(totalAdditionalPeople)
        
            return submissionDate === fecha;
        }).length;
        

        // Cantidad de personas total
        const availablePlaces = numberAvailable - totalAdditionalPeople;
        const avaNumber = numberAvailable - totalAdditionalPeople;
        console.log(availablePlaces, avaNumber)

        // Cupos a solicitar es mayor a cupos disponibles
        if (numberPerson > availablePlaces) {
            return res.json({
                msg: 'No hay Cupos Suficientes',
                ava: false,
                avaNumber: avaNumber
            });
        }

        // Colocar disponibilidad para una siguiente fecha mas cercana o en el formulario colocar mensaje al usuario de buscar disponibilidad para otras fechas

        // Cupos suficientes
        if (availablePlaces <= numberAvailable) {
            return res.json({
                msg: 'Hay Cupos Suficientes',
                ava: true,
                avaNumber: avaNumber
            });
        }

        return res.json({
            msg: 'No se pudo validar',
            ava: false,
            avaNumber: avaNumber
        });

    } catch (error) {
        console.error('Error al validar las fechas:', error);
        res.status(error.response?.status || 500).json({ error: 'Error al validar las fechas', details: error.response?.data });
    }
};

module.exports = validateDateMatches;
