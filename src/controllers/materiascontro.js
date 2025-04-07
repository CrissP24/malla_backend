const pool = require('../db'); // Adjust the path according to your project structure

const getUnidadByMateria = async (req, res) => {
    const { nombre_materia } = req.params;
    try {
        const result = await pool.query(
            'SELECT id_unidad FROM Materias WHERE TRIM(UPPER(nombre_materia)) = TRIM(UPPER($1))',
            [nombre_materia]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Materia no encontrada' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
const getUnidadByMateriaNombre = async (req, res) => {
    let { nombre_materia } = req.params;
    nombre_materia = nombre_materia.trim().toLowerCase(); // Normalize the parameter
    try {
        const result = await pool.query(
            'SELECT unidad FROM malla_precedente WHERE LOWER(TRIM(nombre_materia_prece)) = $1',
            [nombre_materia]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'No se encontraron unidades para la materia especificada' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
const getUnidadByMateriaPrecedentePrecedenteNombre = async (req, res) => {
    let { nombre_materia } = req.params;
    nombre_materia = nombre_materia.trim().toLowerCase(); // Normalize the parameter
    try {
        const result = await pool.query(
            'SELECT unidad FROM malla_precedente_precedente WHERE LOWER(TRIM(nombre_materia_prece)) = $1',
            [nombre_materia]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'No se encontraron unidades para la materia especificada' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
module.exports = {
    getUnidadByMateria,
    getUnidadByMateriaNombre,
    getUnidadByMateriaPrecedentePrecedenteNombre
};