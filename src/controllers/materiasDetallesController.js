// controllers/materiasDetallesController.js
const pool = require('../db'); // Asegúrate de tener configurada la conexión a la base de datos

// Añadir una nueva materia
const addMateriaDetalle = async (req, res) => {
    const {
        cod_carrera,
        nombre_materia,
        id_nivel,
        id_unidad,
        resultados,
        contenidos,
        aprendizaje_docente,
        aprendizaje_practico,
        aprendizaje_autonomo,
        practicas_profesionales,
        practicas_servicio_comunitario
    } = req.body;

    // Calcular el total de horas
    const total_horas = aprendizaje_docente + aprendizaje_practico + aprendizaje_autonomo;

    try {
        const result = await pool.query(
            'INSERT INTO MateriasDetalles (cod_carrera, nombre_materia, id_nivel, id_unidad, resultados, contenidos, aprendizaje_docente, aprendizaje_practico, aprendizaje_autonomo, practicas_profesionales, practicas_servicio_comunitario, total_horas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
            [cod_carrera, nombre_materia, id_nivel, id_unidad, resultados, contenidos, aprendizaje_docente, aprendizaje_practico, aprendizaje_autonomo, practicas_profesionales, practicas_servicio_comunitario, total_horas]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
const getMateriasDetalles = async (req, res) => {
    const { cod_carrera } = req.params;
    try {
        const result = await pool.query('SELECT * FROM MateriasDetalles WHERE cod_carrera = $1', [cod_carrera]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    addMateriaDetalle,
    getMateriasDetalles
};