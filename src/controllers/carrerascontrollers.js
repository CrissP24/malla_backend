const pool = require('../db'); // Asegúrate de que la ruta sea correcta

const getCarrerasActivas = async (req, res) => {
    const { cod_facultad } = req.params;

    if (!cod_facultad) {
        return res.status(400).json({ error: 'El parámetro cod_facultad es requerido' });
    }

    try {
        const result = await pool.query(
            'SELECT cod_carrera, nom_carrera FROM carrera WHERE estado = 1 AND cod_facultad = $1',
            [cod_facultad]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron carreras activas para la facultad proporcionada' });
        }
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las carreras activas' });
    }
};

module.exports = {
    getCarrerasActivas
};