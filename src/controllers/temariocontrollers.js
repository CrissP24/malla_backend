const pool = require('../db'); // Asegúrate de que la ruta sea correcta

const addTemario = async (req, res) => {
    const { id_unidad, nombre_temario, cod_carrera, cod_facultad, estado } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO temario (id_unidad, nombre_temario, cod_carrera, cod_facultad, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_unidad, nombre_temario, cod_carrera, cod_facultad, estado]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al añadir el temario:', err);
        res.status(500).json({ error: 'Error al añadir el temario', details: err.message });
    }
};

module.exports = {
    addTemario
};