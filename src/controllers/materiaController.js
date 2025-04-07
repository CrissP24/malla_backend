const pool = require('../db'); // Asegúrate de tener la ruta correcta a tu conexión de base de datos

const addMallaPrecedente = async (req, res) => {
    const { id_materia, id_materia_precedente, nombre_materia_prece, horas, cod_carrera, cod_facultad, unidad } = req.body;

    if (!id_materia_precedente) {
        return res.status(400).json({ error: 'El campo id_materia_precedente no puede ser nulo.' });
    }
    try {
        // Verificar que id_materia existe en la tabla materias
        const materiaResult = await pool.query('SELECT * FROM materias WHERE id_materia = $1', [id_materia]);

        if (materiaResult.rowCount === 0) {
            return res.status(400).json({ error: 'El id_materia no existe en la tabla materias.' });
        }

        // Obtener el nivel actual de la materia
        const currentLevel = materiaResult.rows[0].id_nivel;

        // Verificar si id_materia_precedente existe en la tabla materias
        const materiaPrecedenteResult = await pool.query('SELECT * FROM materias WHERE id_materia = $1', [id_materia_precedente]);

        let id_nivel;
        if (materiaPrecedenteResult.rowCount === 0) {
            id_nivel = currentLevel + 1;
            await pool.query(
                'INSERT INTO materias (id_materia, nombre_materia, horas, cod_carrera, cod_facultad, id_nivel) VALUES ($1, $2, $3, $4, $5, $6)',
                [id_materia_precedente, nombre_materia_prece, horas, cod_carrera, cod_facultad, id_nivel]
            );
        } else {
            id_nivel = materiaPrecedenteResult.rows[0].id_nivel;
            if (id_nivel === 2) {
                id_nivel = 3;
            } else if (id_nivel === 3) {
                id_nivel = 4;
            } else if (id_nivel === 4) {
                id_nivel = 5;
            } else if (id_nivel === 5) {
                id_nivel = 6;
            } else if (id_nivel === 6) {
                id_nivel = 7;
            } else if (id_nivel === 7) {
                id_nivel = 8;
            } else if (id_nivel === 8) {
                id_nivel = 9;
            } else if (id_nivel === 9) {
                id_nivel = 10;
            } else if (id_nivel === 10) {
                id_nivel = 10;
            } else {
                id_nivel += 1;
            }
        }

        // Obtener el valor actual máximo de precedente_index para el id_materia_precedente dado
        const maxIndexResult = await pool.query(
            'SELECT COALESCE(MAX(precedente_index), 0) AS max_index FROM malla_precedente WHERE id_materia_precedente = $1',
            [id_materia_precedente]
        );
        const maxIndex = maxIndexResult.rows[0].max_index;

        const precedente_index = maxIndex + 1;

        if (precedente_index > 5) {
            return res.status(400).json({ error: 'No se pueden añadir más de 5 registros con el mismo id_materia_precedente' });
        }

        const result = await pool.query(
            'INSERT INTO malla_precedente (id_materia, id_materia_precedente, nombre_materia_prece, horas, cod_carrera, cod_facultad, precedente_index, id_nivel, unidad) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [id_materia, id_materia_precedente, nombre_materia_prece, horas, cod_carrera, cod_facultad, precedente_index, id_nivel, unidad]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al añadir la materia precedente:', err);
        res.status(500).json({ error: 'Error al añadir la materia precedente', details: err.message });
    }
};
const updateMallaPrecedente = async (req, res) => {
    const { nombre_materia_prece, new_nombre_materia_prece, horas, cod_carrera, cod_facultad } = req.body;

    if (!nombre_materia_prece) {
        return res.status(400).json({ error: 'El campo nombre_materia_prece no puede ser nulo.' });
    }

    try {
        // Verificar que la materia precedente existe en la tabla malla_precedente
        const materiaPrecedenteResult = await pool.query('SELECT * FROM malla_precedente WHERE nombre_materia_prece = $1', [nombre_materia_prece]);

        if (materiaPrecedenteResult.rowCount === 0) {
            return res.status(400).json({ error: 'La materia precedente no existe en la tabla malla_precedente.' });
        }

        // Actualizar la materia precedente
        const result = await pool.query(
            'UPDATE malla_precedente SET nombre_materia_prece = $1, horas = $2, cod_carrera = $3, cod_facultad = $4 WHERE nombre_materia_prece = $5 RETURNING *',
            [new_nombre_materia_prece, horas, cod_carrera, cod_facultad, nombre_materia_prece]
        );

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar la materia precedente:', err);
        res.status(500).json({ error: 'Error al actualizar la materia precedente', details: err.message });
    }
};
const deleteMallaPrecedente = async (req, res) => {
    const { nombre_materia_prece } = req.body;

    if (!nombre_materia_prece) {
        return res.status(400).json({ error: 'El campo nombre_materia_prece no puede ser nulo.' });
    }

    try {
        // Verificar que la materia precedente existe en la tabla malla_precedente
        const materiaPrecedenteResult = await pool.query('SELECT * FROM malla_precedente WHERE nombre_materia_prece = $1', [nombre_materia_prece]);

        if (materiaPrecedenteResult.rowCount === 0) {
            return res.status(400).json({ error: 'La materia precedente no existe en la tabla malla_precedente.' });
        }

        // Eliminar la materia precedente
        await pool.query('DELETE FROM malla_precedente WHERE nombre_materia_prece = $1', [nombre_materia_prece]);

        res.status(200).json({ message: 'Materia precedente eliminada exitosamente' });
    } catch (err) {
        console.error('Error al eliminar la materia precedente:', err);
        res.status(500).json({ error: 'Error al eliminar la materia precedente', details: err.message });
    }
};
const getMallaPrecedenteByCarrera = async (req, res) => {
    const { cod_carrera } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM malla_precedente WHERE cod_carrera = $1',
            [cod_carrera]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener la malla precedente por carrera:', err);
        res.status(500).json({ error: 'Error al obtener la malla precedente por carrera', details: err.message });
    }
};
const getPrecedentesByNivel = async (req, res) => {
    const { id_nivel } = req.params;

    if (!id_nivel) {
        return res.status(400).json({ error: 'El campo id_nivel no puede ser nulo.' });
    }

    try {
        console.log('Nivel:', id_nivel);

        // Consulta para obtener las materias precedentes por nivel
        const result = await pool.query(
            `SELECT mp.id, mp.id_materia_precedente, mp.id_materia_precedente_precedente, mp.nombre_materia_prece, mp.horas, mp.cod_carrera, mp.cod_facultad, mp.precedente_index, mp.id_nivel, mp.unidad, m.nombre_materia AS nombre_materia_precedente
             FROM malla_precedente_precedente mp
             JOIN Materias m ON mp.id_materia_precedente = m.id_materia
             WHERE mp.id_nivel = $1
             UNION ALL
             SELECT NULL AS id, mp.id_materia_precedente, NULL AS id_materia_precedente_precedente, mp.nombre_materia_prece, mp.horas, mp.cod_carrera, mp.cod_facultad, mp.precedente_index, mp.id_nivel, mp.unidad, m.nombre_materia AS nombre_materia_precedente
             FROM malla_precedente mp
             JOIN Materias m ON mp.id_materia_precedente = m.id_materia
             WHERE mp.id_nivel = $1
             UNION ALL
             SELECT m.id_materia AS id, NULL AS id_materia_precedente, NULL AS id_materia_precedente_precedente, m.nombre_materia AS nombre_materia_prece, m.horas, m.cod_carrera, m.cod_facultad, NULL AS precedente_index, m.id_nivel, NULL AS unidad, m.nombre_materia AS nombre_materia_precedente
             FROM Materias m
             WHERE m.id_nivel = $1`,
            [id_nivel]
        );

        console.log('Query Result:', result.rows);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No se encontraron registros para el nivel proporcionado.' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al consultar las materias precedentes por nivel:', err);
        res.status(500).json({ error: 'Error al consultar las materias precedentes por nivel', details: err.message });
    }
};
const addNewPrecedenteBasedOnExisting = async (req, res) => {
    const { id_materia_precedente, id_materia_precedente_precedente, nombre_materia_prece, horas, cod_carrera, cod_facultad, unidad } = req.body;

    if (!id_materia_precedente || !id_materia_precedente_precedente) {
        return res.status(400).json({ error: 'Los campos id_materia_precedente y id_materia_precedente_precedente no pueden ser nulos.' });
    }

    try {
        // Verificar si id_materia_precedente existe en la tabla materias
        const materiaPrecedenteResult = await pool.query('SELECT * FROM materias WHERE id_materia = $1', [id_materia_precedente]);

        if (materiaPrecedenteResult.rowCount === 0) {
            return res.status(400).json({ error: 'El id_materia_precedente no existe en la tabla materias.' });
        }

        // Obtener el nivel actual de la materia precedente en la tabla malla_precedente
        const nivelPrecedenteResult = await pool.query(
            'SELECT id_nivel FROM malla_precedente WHERE id_materia_precedente = $1 ORDER BY id_nivel DESC LIMIT 1',
            [id_materia_precedente]
        );

        let id_nivel;
        if (nivelPrecedenteResult.rowCount === 0) {
            id_nivel = materiaPrecedenteResult.rows[0].id_nivel + 1;
        } else {
            id_nivel = nivelPrecedenteResult.rows[0].id_nivel;
            id_nivel += 1; // Incrementar el nivel para el nuevo precedente
        }

        // Obtener el valor actual máximo de precedente_index para el id_materia_precedente dado
        const maxIndexResult = await pool.query(
            'SELECT COALESCE(MAX(precedente_index), 0) AS max_index FROM malla_precedente_precedente WHERE id_materia_precedente = $1',
            [id_materia_precedente]
        );
        const maxIndex = maxIndexResult.rows[0].max_index;

        const precedente_index = maxIndex + 1;

        if (precedente_index > 5) {
            return res.status(400).json({ error: 'No se pueden añadir más de 5 registros con el mismo id_materia_precedente' });
        }

        const result = await pool.query(
            'INSERT INTO malla_precedente_precedente (id_materia_precedente, id_materia_precedente_precedente, nombre_materia_prece, horas, cod_carrera, cod_facultad, precedente_index, id_nivel, unidad) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [id_materia_precedente, id_materia_precedente_precedente, nombre_materia_prece, horas, cod_carrera, cod_facultad, precedente_index, id_nivel, unidad]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al añadir la nueva materia precedente:', err);
        res.status(500).json({ error: 'Error al añadir la nueva materia precedente', details: err.message });
    }
};
const getMallaPrecedente = async (req, res) => {
    const { cod_carrera } = req.params;

    console.log('Received cod_carrera:', cod_carrera); // Log para verificar el valor recibido
    console.log('Type of cod_carrera:', typeof cod_carrera); // Log para verificar el tipo de dato

    try {
        const result = await pool.query(
            'SELECT * FROM malla_precedente WHERE cod_carrera = $1::text',
            [cod_carrera]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las asignaturas precedentes:', err);
        res.status(500).json({ error: 'Error al obtener las asignaturas precedentes', details: err.message });
    }
};
const getMallaPrecedentePrecedenteByCarrera = async (req, res) => {
    const { cod_carrera } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM malla_precedente_precedente WHERE cod_carrera = $1',
            [cod_carrera]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener la malla precedente precedente por carrera:', err);
        res.status(500).json({ error: 'Error al obtener la malla precedente precedente por carrera', details: err.message });
    }
};
const updateMallaPrecedentePrecedente = async (req, res) => {
    const { nombre_materia_prece, horas } = req.body;

    if (!nombre_materia_prece) {
        return res.status(400).json({ error: 'El campo nombre_materia_prece no puede ser nulo.' });
    }

    try {
        // Verificar que la materia precedente precedente existe en la tabla malla_precedente_precedente
        const materiaPrecedentePrecedenteResult = await pool.query('SELECT * FROM malla_precedente_precedente WHERE nombre_materia_prece = $1', [nombre_materia_prece]);

        if (materiaPrecedentePrecedenteResult.rowCount === 0) {
            return res.status(400).json({ error: 'La materia precedente precedente no existe en la tabla malla_precedente_precedente.' });
        }

        // Actualizar la materia precedente precedente
        const result = await pool.query(
            'UPDATE malla_precedente_precedente SET horas = $1 WHERE nombre_materia_prece = $2 RETURNING *',
            [horas, nombre_materia_prece]
        );

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar la materia precedente precedente:', err);
        res.status(500).json({ error: 'Error al actualizar la materia precedente precedente', details: err.message });
    }
};
const deleteMallaPrecedentePrecedente = async (req, res) => {
    const { nombre_materia_prece } = req.body;

    if (!nombre_materia_prece) {
        return res.status(400).json({ error: 'El campo nombre_materia_prece no puede ser nulo.' });
    }

    try {
        // Verificar que la materia precedente precedente existe en la tabla malla_precedente_precedente
        const materiaPrecedentePrecedenteResult = await pool.query('SELECT * FROM malla_precedente_precedente WHERE nombre_materia_prece = $1', [nombre_materia_prece]);

        if (materiaPrecedentePrecedenteResult.rowCount === 0) {
            return res.status(400).json({ error: 'La materia precedente precedente no existe en la tabla malla_precedente_precedente.' });
        }

        // Eliminar la materia precedente precedente
        await pool.query('DELETE FROM malla_precedente_precedente WHERE nombre_materia_prece = $1', [nombre_materia_prece]);

        res.status(200).json({ message: 'Materia precedente precedente eliminada exitosamente' });
    } catch (err) {
        console.error('Error al eliminar la materia precedente precedente:', err);
        res.status(500).json({ error: 'Error al eliminar la materia precedente precedente', details: err.message });
    }
};
module.exports = {
    addMallaPrecedente,
    getMallaPrecedente,
    addNewPrecedenteBasedOnExisting,
    getPrecedentesByNivel,
    updateMallaPrecedente,
    deleteMallaPrecedente,
    getMallaPrecedenteByCarrera,
    getMallaPrecedentePrecedenteByCarrera,
    updateMallaPrecedentePrecedente,
    deleteMallaPrecedentePrecedente
};