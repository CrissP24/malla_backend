// controllers/materiasController.js
const pool = require('../db'); // Asegúrate de tener configurada la conexión a la base de datos

const getAllDataByCarrera = async (req, res) => {
    const { cod_carrera } = req.params;
    try {
        const materiasResult = await pool.query(
            'SELECT id_materia, id_nivel, cod_carrera, cod_facultad, nombre_materia, estado, creditos, horas, id_unidad, codigo_materia FROM Materias WHERE cod_carrera = $1',
            [cod_carrera]
        );
        const mallaPrecedenteResult = await pool.query(
            'SELECT id_materia, id_materia_precedente, nombre_materia_prece, horas, cod_carrera, cod_facultad, precedente_index, id_nivel, unidad FROM malla_precedente WHERE cod_carrera = $1',
            [cod_carrera]
        );
        const mallaPrecedentePrecedenteResult = await pool.query(
            'SELECT id, id_materia_precedente, id_materia_precedente_precedente, nombre_materia_prece, horas, cod_carrera, cod_facultad, precedente_index, id_nivel, unidad FROM malla_precedente_precedente WHERE cod_carrera = $1',
            [cod_carrera]
        );

        // Combinar y ordenar los resultados por id_nivel
        const combinedResults = [
            ...materiasResult.rows.map(row => ({ ...row, type: 'materia' })),
            ...mallaPrecedenteResult.rows.map(row => ({ ...row, type: 'precedente' })),
            ...mallaPrecedentePrecedenteResult.rows.map(row => ({ ...row, type: 'precedente_precedente' }))
        ].sort((a, b) => a.id_nivel - b.id_nivel);

        res.json(combinedResults);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};
const getNivelUnidadByNombreMateria = async (req, res) => {
    const { nombre_materia } = req.params;
    try {
        const result = await pool.query(
            `SELECT id_nivel, id_unidad 
             FROM Materias 
             WHERE TRIM(UPPER(nombre_materia)) = TRIM(UPPER($1))`,
            [nombre_materia]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Materia no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
const getNivelUnidadByNombreMateriaPrece = async (req, res) => {
    const { nombre_materia_prece } = req.params;
    try {
        const result = await pool.query(
            'SELECT id_nivel, unidad FROM malla_precedente WHERE nombre_materia_prece = $1',
            [nombre_materia_prece]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Materia precedente no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
const getNivelUnidadByNombreMateriaPrecePrece = async (req, res) => {
    const { nombre_materia_prece } = req.params;
    try {
        const result = await pool.query(
            'SELECT id_nivel, unidad FROM malla_precedente_precedente WHERE nombre_materia_prece = $1',
            [nombre_materia_prece]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Materia precedente no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
module.exports = {
    getAllDataByCarrera,
    getNivelUnidadByNombreMateria ,
    getNivelUnidadByNombreMateriaPrece,
    getNivelUnidadByNombreMateriaPrecePrece
};