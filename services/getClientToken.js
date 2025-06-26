const getClientToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const clientToken = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;

        req.clientToken = clientToken
        next();
    } catch (error) {
        console.error('Error al obtener datos:', error.message);
        res.status(error.response?.status || 500).json({
            error: 'Error al obtener los datos',
            details: error.response?.data || error.message
        });
    }
};


module.exports = getClientToken;
