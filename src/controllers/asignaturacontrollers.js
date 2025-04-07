const pool = require('../db'); 

const addAsignatura = async (req, res) => {
    const { codigo_unico, id_nivel, nombre_asignatura, estado, horas, cod_carrera, cod_facultad } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO asignatura (codigo_unico, id_nivel, nombre_asignatura, estado, horas, cod_carrera, cod_facultad) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [codigo_unico, id_nivel, nombre_asignatura, estado, horas, cod_carrera, cod_facultad]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al añadir la asignatura:', err);
        res.status(500).json({ error: 'Error al añadir la asignatura', details: err.message });
    }
};
const getAllAsignaturas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM asignatura');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al consultar las asignaturas:', err);
        res.status(500).json({ error: 'Error al consultar las asignaturas', details: err.message });
    }
};


const updateAsignatura = async (req, res) => {
    const { nombre_asignatura, nuevo_nombre } = req.body;

    try {
        const result = await pool.query(
            'UPDATE asignatura SET nombre_asignatura = $1 WHERE nombre_asignatura = $2 RETURNING *',
            [nuevo_nombre, nombre_asignatura]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Asignatura no encontrada' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error('Error al modificar la asignatura:', err);
        res.status(500).json({ error: 'Error al modificar la asignatura', details: err.message });
    }
};

const deleteAsignatura = async (req, res) => {
    const { nombre_asignatura } = req.params;

    try {
        await pool.query('BEGIN');
        
        // Delete related records in asignatura_precedente_relacion
        await pool.query(
            'DELETE FROM asignatura_precedente_relacion WHERE id_asignatura_precedente = (SELECT id_asignatura FROM asignatura WHERE nombre_asignatura = $1)',
            [nombre_asignatura]
        );

        // Delete the asignatura
        const result = await pool.query(
            'DELETE FROM asignatura WHERE nombre_asignatura = $1 RETURNING *',
            [nombre_asignatura]
        );

        await pool.query('COMMIT');

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Asignatura no encontrada' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        await pool.query('ROLLBACK');
        if (err.code === '23503') { // Foreign key violation
            res.status(400).json({ error: 'No se puede eliminar la asignatura porque tiene relaciones dependientes en la tabla asignatura_precedente_relacion.' });
        } else {
            console.error('Error al eliminar la asignatura:', err);
            res.status(500).json({ error: 'Error al eliminar la asignatura', details: err.message });
        }
    }
};
const getAsignaturasByNombre = async (req, res) => {
    try {
        const { nombre_asignatura } = req.params;
        const result = await pool.query('SELECT * FROM asignaturas WHERE asignatura = $1', [nombre_asignatura]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getAllAsignaturass = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM asignaturas');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addAsignatura,
    getAllAsignaturas,
    updateAsignatura,
    deleteAsignatura,
    getAsignaturasByNombre,
    getAllAsignaturass
};