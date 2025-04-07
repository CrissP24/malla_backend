const pool = require('../db'); // Asegúrate de que la ruta sea correcta

const getFacultades = async (req, res) => {
    try {
        const result = await pool.query('SELECT nom_facultad FROM facultad');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las facultades' });
    }
};

const getFacultadesActivas = async (req, res) => {
    try {
        const result = await pool.query('SELECT cod_facultad, nom_facultad FROM facultad WHERE estado = 1');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las facultades activas' });
    }
};

module.exports = {
    getFacultades,
    getFacultadesActivas
};