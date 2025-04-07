const pool = require('../db'); // Asegúrate de que la ruta sea correcta

const addProyectoIntegrador = async (req, res) => {
    const { id_nivel, nombre_proyecto } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO proyecto_integrador (id_nivel, nombre_proyecto) VALUES ($1, $2) RETURNING *',
            [id_nivel, nombre_proyecto]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al añadir el proyecto integrador:', err);
        res.status(500).json({ error: 'Error al añadir el proyecto integrador', details: err.message });
    }
};

module.exports = {
    addProyectoIntegrador
};
