const pool = require('../db'); // Asegúrate de que la ruta sea correcta

const addMallaCurricular = async (req, res) => {
    const { cod_carrera, cod_facultad, version_malla, estado } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO malla_curricular (cod_carrera, cod_facultad, version_malla, estado) VALUES ($1, $2, $3, $4) RETURNING *',
            [cod_carrera, cod_facultad, version_malla, estado]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al añadir la malla curricular:', err);
        res.status(500).json({ error: 'Error al añadir la malla curricular', details: err.message });
    }
};
const getMallaCurricularByCodCarrera = async (req, res) => {
    const { cod_carrera } = req.params;

    if (!cod_carrera) {
        return res.status(400).json({ error: 'cod_carrera is required' });
    }

    const query = 'SELECT * FROM malla_curricular WHERE cod_carrera = $1';
    const queryParams = [cod_carrera];

    try {
        const result = await pool.query(query, queryParams);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching malla curricular:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const addMateria = async (req, res) => {
    const { id_nivel, cod_carrera, cod_facultad, nombre_materia, estado, creditos, horas, id_unidad, codigo_materia } = req.body;

    // Validar que todos los campos requeridos estén presentes y no sean nulos
    if (
        id_nivel === undefined || 
        cod_carrera === undefined || 
        cod_facultad === undefined || 
        nombre_materia === undefined || 
        estado === undefined || 
        creditos === undefined || 
        horas === undefined || 
        id_unidad === undefined || 
        codigo_materia === undefined
    ) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el nombre de la materia ya existe para la carrera
        const checkNombreResult = await pool.query(
            'SELECT * FROM Materias WHERE nombre_materia = $1 AND cod_carrera = $2',
            [nombre_materia, cod_carrera]
        );

        if (checkNombreResult.rows.length > 0) {
            return res.status(400).json({ error: 'El nombre de la materia ya existe para esta carrera' });
        }

        // Verificar si el código de la materia ya existe
        const checkCodigoResult = await pool.query(
            'SELECT * FROM Materias WHERE codigo_materia = $1',
            [codigo_materia]
        );

        if (checkCodigoResult.rows.length > 0) {
            return res.status(400).json({ error: 'El código de la materia ya existe' });
        }

        const result = await pool.query(
            'INSERT INTO Materias (id_nivel, cod_carrera, cod_facultad, nombre_materia, estado, creditos, horas, id_unidad, codigo_materia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [id_nivel, cod_carrera, cod_facultad, nombre_materia, estado, creditos, horas, id_unidad, codigo_materia]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al añadir la materia:', err);
        res.status(500).json({ error: 'Error al añadir la materia', details: err.message });
    }
};
const deleteMateriaByNombre = async (req, res) => {
        const { codigo_materia } = req.params;
    
        // Validar que el código de la materia esté presente
        if (!codigo_materia) {
            return res.status(400).json({ error: 'El código de la materia es obligatorio' });
        }
    
        try {
            console.log('Código Materia:', codigo_materia);
    
            // Verificar si la materia existe
            const checkResult = await pool.query(
                'SELECT * FROM Materias WHERE codigo_materia = $1',
                [codigo_materia]
            );
    
            console.log('Check Result:', checkResult.rows);
    
            if (checkResult.rows.length === 0) {
                return res.status(404).json({ error: 'Materia no encontrada' });
            }
    
            // Eliminar la materia
            await pool.query(
                'DELETE FROM Materias WHERE codigo_materia = $1',
                [codigo_materia]
            );
    
            res.status(200).json({ message: 'Materia eliminada exitosamente' });
        } catch (err) {
            console.error('Error al eliminar la materia:', err);
            res.status(500).json({ error: 'Error al eliminar la materia', details: err.message });
        }
    };
const getMateriasByCodigo = async (req, res) => {
    const { cod_facultad, cod_carrera } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM Materias WHERE cod_facultad = $1 AND cod_carrera = $2',
            [cod_facultad, cod_carrera]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ error: 'No se encontraron materias para los códigos proporcionados' });
        }
    } catch (err) {
        console.error('Error al consultar las materias:', err);
        res.status(500).json({ error: 'Error al consultar las materias', details: err.message });
    }
};
const updateMateria = async (req, res) => {
    const { id_materia } = req.params;
    const { id_nivel, cod_carrera, cod_facultad, nombre_materia, estado, creditos, horas } = req.body;

    try {
        const result = await pool.query(
            'UPDATE Materias SET id_nivel = $1, cod_carrera = $2, cod_facultad = $3, nombre_materia = $4, estado = $5, creditos = $6, horas = $7 WHERE id_materia = $8 RETURNING *',
            [id_nivel, cod_carrera, cod_facultad, nombre_materia, estado, creditos, horas, id_materia]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'No se encontró la materia para actualizar' });
        }
    } catch (err) {
        console.error('Error al actualizar la materia:', err);
        res.status(500).json({ error: 'Error al actualizar la materia', details: err.message });
    }
};

const getMallaCurricular = async (req, res) => {
    const { cod_carrera, cod_facultad, version_malla } = req.query;

    let query = 'SELECT * FROM malla_curricular';
    const queryParams = [];
    const conditions = [];

    if (cod_carrera) {
        conditions.push(`cod_carrera = $${queryParams.length + 1}`);
        queryParams.push(cod_carrera);
    }
    if (cod_facultad) {
        conditions.push(`cod_facultad = $${queryParams.length + 1}`);
        queryParams.push(cod_facultad);
    }
    if (version_malla) {
        conditions.push(`version_malla = $${queryParams.length + 1}`);
        queryParams.push(version_malla);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        const result = await pool.query(query, queryParams);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ error: 'Malla curricular no encontrada' });
        }
    } catch (err) {
        console.error('Error al consultar la malla curricular:', err);
        res.status(500).json({ error: 'Error al consultar la malla curricular', details: err.message });
    }
};
module.exports = {
    addMallaCurricular,
    getMallaCurricular,
    addMateria,
    getMateriasByCodigo,
    updateMateria,
    getMallaCurricularByCodCarrera,
    deleteMateriaByNombre
};