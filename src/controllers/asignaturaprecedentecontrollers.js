const pool = require('../db'); 
const addAsignaturaPrecedente = async (req, res) => {
    const { id_asignatura, id_asignatura_precedente, nombre_asignatura_prece, horas, cod_carrera, cod_facultad } = req.body;

    if (!id_asignatura_precedente) {
        return res.status(400).json({ error: 'El campo id_asignatura_precedente no puede ser nulo.' });
    }

    try {
        // Obtener el valor actual máximo de precedente_index para el id_asignatura_precedente dado
        const maxIndexResult = await pool.query(
            'SELECT COALESCE(MAX(precedente_index), 0) AS max_index FROM asignatura_precedente WHERE id_asignatura_precedente = $1',
            [id_asignatura_precedente]
        );
        const maxIndex = maxIndexResult.rows[0].max_index;

        // Incrementar el índice en 1
        const precedente_index = maxIndex + 1;

        // Verificar que no se exceda el límite de 5 registros con el mismo id_asignatura_precedente
        if (precedente_index > 3) {
            return res.status(400).json({ error: 'No se pueden añadir más de 5 registros con el mismo id_asignatura_precedente' });
        }

        const result = await pool.query(
            'INSERT INTO asignatura_precedente (id_asignatura, id_asignatura_precedente, nombre_asignatura_prece, horas, cod_carrera, cod_facultad, precedente_index) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id_asignatura, id_asignatura_precedente, nombre_asignatura_prece, horas, cod_carrera, cod_facultad, precedente_index]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            // Manejar el error de clave duplicada
            return res.status(400).json({ error: 'La combinación de id_asignatura y id_asignatura_precedente ya existe.' });
        }
        console.error('Error al añadir la asignatura precedente:', err);
        res.status(500).json({ error: 'Error al añadir la asignatura precedente', details: err.message });
    }
};

const addAsignaturaPrecedenteDePrecedente = async (req, res) => {
    const { id_asignatura_precedente, id_asignatura_precedente_nueva, nombre_asignatura_prece, horas, cod_carrera, cod_facultad, codigo_asignatura_precedente_nueva } = req.body;

    if (!id_asignatura_precedente_nueva) {
        return res.status(400).json({ error: 'El campo id_asignatura_precedente_nueva no puede ser nulo.' });
    }

    try {
        // Obtener el valor actual máximo de precedente_index para el id_asignatura_precedente_nueva dado
        const maxIndexResult = await pool.query(
            'SELECT COALESCE(MAX(precedente_index), 0) AS max_index FROM asignatura_precedente_relacion WHERE id_asignatura_precedente = $1',
            [id_asignatura_precedente_nueva]
        );
        const maxIndex = maxIndexResult.rows[0].max_index;

        // Incrementar el índice en 1
        const precedente_index = maxIndex + 1;

        // Verificar que no se exceda el límite de 5 registros con el mismo id_asignatura_precedente_nueva
        if (precedente_index > 5) {
            return res.status(400).json({ error: 'No se pueden añadir más de 5 registros con el mismo id_asignatura_precedente_nueva' });
        }

        const result = await pool.query(
            'INSERT INTO asignatura_precedente_relacion (id_asignatura_precedente, id_asignatura_precedente_nueva, nombre_asignatura_prece, horas, cod_carrera, cod_facultad, precedente_index, codigo_asignatura_precedente_nueva) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [id_asignatura_precedente, id_asignatura_precedente_nueva, nombre_asignatura_prece, horas, cod_carrera, cod_facultad, precedente_index, codigo_asignatura_precedente_nueva]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            // Manejar el error de clave duplicada
            return res.status(400).json({ error: 'La combinación de id_asignatura_precedente y id_asignatura_precedente_nueva ya existe.' });
        }
        console.error('Error al añadir la asignatura precedente de precedente:', err);
        res.status(500).json({ error: 'Error al añadir la asignatura precedente de precedente', details: err.message });
    }
};

const getAsignaturaPrecedenteRelacion = async (req, res) => {
    const { id_asignatura_precedente, id_asignatura_precedente_nueva } = req.query;

    try {
        let query = 'SELECT * FROM asignatura_precedente_relacion WHERE 1=1';
        const queryParams = [];

        if (id_asignatura_precedente) {
            queryParams.push(id_asignatura_precedente);
            query += ` AND id_asignatura_precedente = $${queryParams.length}`;
        }

        if (id_asignatura_precedente_nueva) {
            queryParams.push(id_asignatura_precedente_nueva);
            query += ` AND id_asignatura_precedente_nueva = $${queryParams.length}`;
        }

        const result = await pool.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al consultar la asignatura precedente relación:', err);
        res.status(500).json({ error: 'Error al consultar la asignatura precedente relación', details: err.message });
    }
};
const updateAsignaturaPrecedenteRelacion = async (req, res) => {
    const { nombre_asignatura_prece } = req.params;
    const { id_asignatura_precedente_nueva, horas, cod_carrera, cod_facultad, codigo_asignatura_precedente_nueva } = req.body;

    try {
        const result = await pool.query(
            'UPDATE asignatura_precedente_relacion SET id_asignatura_precedente_nueva = $1, horas = $2, cod_carrera = $3, cod_facultad = $4, codigo_asignatura_precedente_nueva = $5 WHERE nombre_asignatura_prece = $6 RETURNING *',
            [id_asignatura_precedente_nueva, horas, cod_carrera, cod_facultad, codigo_asignatura_precedente_nueva, nombre_asignatura_prece]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Asignatura precedente no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar la asignatura precedente relación:', err);
        res.status(500).json({ error: 'Error al actualizar la asignatura precedente relación', details: err.message });
    }
};
const deleteAsignaturaPrecedente = async (req, res) => {
    const { nombre_asignatura_prece } = req.params; // Usar 'nombre_asignatura_prece' para coincidir con el parámetro de la ruta

    try {
        const result = await pool.query(
            'DELETE FROM asignatura_precedente WHERE nombre_asignatura_prece = $1 RETURNING *',
            [nombre_asignatura_prece] // Usar 'nombre_asignatura_prece' para coincidir con el parámetro de la ruta
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Asignatura Precedente no encontrada' });
        }

        res.status(200).json({ message: 'Asignatura Precedente eliminada exitosamente', data: result.rows });
    } catch (err) {
        console.error('Error al eliminar la asignatura precedente:', err);
        res.status(500).json({ error: 'Error al eliminar la asignatura precedente', details: err.message });
    }
};

const getAsignaturaConPrecedente = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                a.id_asignatura, 
                a.nombre_asignatura, 
                c.nom_carrera, 
                f.nom_facultad, 
                ap.nombre_asignatura_prece
            FROM asignatura a
            JOIN asignatura_precedente ap ON a.id_asignatura = ap.id_asignatura
            JOIN carrera c ON a.cod_carrera = c.cod_carrera
            JOIN facultad f ON a.cod_facultad = f.cod_facultad
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las asignaturas con sus precedentes:', err);
        res.status(500).json({ error: 'Error al obtener las asignaturas con sus precedentes', details: err.message });
    }
};
const getEstructuraCompleta = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                f.nom_facultad, 
                c.nom_carrera, 
                mc.version_malla, 
                ut.nombre_unidad, 
                t.nombre_temario, 
                n.nombre_nivel, 
                a.id_asignatura, 
                a.nombre_asignatura, 
                a.codigo_unico, 
                a.horas, 
                ap.nombre_asignatura_prece,
                ap.horas AS horas_precedente,  -- Añadir el campo horas para la asignatura precedente
                n.id_nivel AS nivel_actual
            FROM facultad f
            JOIN carrera c ON f.cod_facultad = c.cod_facultad
            JOIN unidad_tematica ut ON c.cod_carrera = ut.cod_carrera
            JOIN malla_curricular mc ON ut.id_malla = mc.id_malla
            LEFT JOIN temario t ON ut.id_unidad = t.id_unidad
            LEFT JOIN nivel n ON t.id_temario = n.id_temario
            LEFT JOIN asignatura a ON n.id_nivel = a.id_nivel
            LEFT JOIN asignatura_precedente ap ON a.id_asignatura = ap.id_asignatura
            ORDER BY f.nom_facultad, c.nom_carrera, mc.version_malla, ut.nombre_unidad, t.nombre_temario, n.nombre_nivel, a.nombre_asignatura
        `);

        // Función para obtener el siguiente nivel
        const getNextLevel = (currentLevel) => {
            const levels = ["I nivel", "II nivel", "III nivel", "IV nivel", "V nivel", "VI nivel", "VII nivel", "VIII nivel", "IX nivel", "X nivel"];
            const currentIndex = levels.indexOf(currentLevel);
            return currentIndex !== -1 && currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
        };

        // Agrupar los resultados por facultad, carrera, malla curricular, unidad temática, nivel y asignatura
        const groupedResults = result.rows.reduce((acc, row) => {
            if (!acc[row.nom_facultad]) {
                acc[row.nom_facultad] = {};
            }
            if (!acc[row.nom_facultad][row.nom_carrera]) {
                acc[row.nom_facultad][row.nom_carrera] = {};
            }
            if (!acc[row.nom_facultad][row.nom_carrera][row.version_malla]) {
                acc[row.nom_facultad][row.nom_carrera][row.version_malla] = {};
            }
            if (!acc[row.nom_facultad][row.nom_carrera][row.version_malla][row.nombre_unidad]) {
                acc[row.nom_facultad][row.nom_carrera][row.version_malla][row.nombre_unidad] = {
                    niveles: {}
                };
            }
            if (row.nombre_nivel) {
                if (!acc[row.nom_facultad][row.nom_carrera][row.version_malla][row.nombre_unidad].niveles[row.nombre_nivel]) {
                    acc[row.nom_facultad][row.nom_carrera][row.version_malla][row.nombre_unidad].niveles[row.nombre_nivel] = {
                        asignaturas: [],
                        predecesoras: []
                    };
                }
                const asignatura = {
                    id_asignatura: row.id_asignatura,
                    nombre_asignatura: row.nombre_asignatura,
                    codigo_unico: row.codigo_unico,
                    horas: row.horas,
                    nombre_temario: row.nombre_temario
                };
                if (!acc[row.nom_facultad][row.nom_carrera][row.version_malla][row.nombre_unidad].niveles[row.nombre_nivel].asignaturas.some(a => a.id_asignatura === row.id_asignatura)) {
                    acc[row.nom_facultad][row.nom_carrera][row.version_malla][row.nombre_unidad].niveles[row.nombre_nivel].asignaturas.push(asignatura);
                }
            }

            // Añadir la asignatura precedente al siguiente nivel
            if (row.nombre_asignatura_prece && row.nombre_nivel) {
                const siguienteNivel = getNextLevel(row.nombre_nivel);

                if (siguienteNivel) {
                    if (!acc[row.nom_facultad][row.nom_carrera][row.version_malla][row.nombre_unidad].niveles[siguienteNivel]) {
                        acc[row.nom_facultad][row.nom_carrera][row.version_malla][row.nombre_unidad].niveles[siguienteNivel] = {
                            asignaturas: [],
                            predecesoras: []
                        };
                    }
                    acc[row.nom_facultad][row.nom_carrera][row.version_malla][row.nombre_unidad].niveles[siguienteNivel].predecesoras.push({
                        nombre_asignatura_prece: row.nombre_asignatura_prece,
                        horas: row.horas_precedente,  // Añadir el campo horas para la asignatura precedente
                        nombre_temario: row.nombre_temario
                    });
                }
            }

            return acc;
        }, {});

        // Ordenar los niveles
        for (const facultad in groupedResults) {
            for (const carrera in groupedResults[facultad]) {
                for (const malla in groupedResults[facultad][carrera]) {
                    for (const unidad in groupedResults[facultad][carrera][malla]) {
                        const niveles = groupedResults[facultad][carrera][malla][unidad].niveles;
                        const sortedNiveles = Object.keys(niveles).sort((a, b) => {
                            const levels = ["I nivel", "II nivel", "III nivel", "IV nivel", "V nivel", "VI nivel", "VII nivel", "VIII nivel", "IX nivel", "X nivel"];
                            return levels.indexOf(a) - levels.indexOf(b);
                        }).reduce((acc, key) => {
                            acc[key] = niveles[key];
                            return acc;
                        }, {});
                        groupedResults[facultad][carrera][malla][unidad].niveles = sortedNiveles;
                    }
                }
            }
        }

        res.status(200).json(groupedResults);
    } catch (err) {
        console.error('Error al obtener la estructura completa:', err);
        res.status(500).json({ error: 'Error al obtener la estructura completa', details: err.message });
    }
};
const getAllAsignaturasPrecedentes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM asignatura_precedente');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las asignaturas precedentes:', err);
        res.status(500).json({ error: 'Error al obtener las asignaturas precedentes', details: err.message });
    }
};
const getAsignaturasPrecedentesById = async (req, res) => {
    const { id_asignatura_precedente } = req.params;
    try {
        const result = await pool.query('SELECT * FROM asignatura_precedente WHERE id_asignatura_precedente = $1', [id_asignatura_precedente]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las asignaturas precedentes:', err);
        res.status(500).json({ error: 'Error al obtener las asignaturas precedentes', details: err.message });
    }
};

const updateAsignaturaPrecedente = async (req, res) => {
    const { nombre_asignatura_prece, nuevo_nombre } = req.body;

    if (!nombre_asignatura_prece || !nuevo_nombre) {
        return res.status(400).json({ error: 'El campo nombre_asignatura_prece y nuevo_nombre no pueden ser nulos.' });
    }

    try {
        const result = await pool.query(
            'UPDATE asignatura_precedente SET nombre_asignatura_prece = $1 WHERE nombre_asignatura_prece = $2 RETURNING *',
            [nuevo_nombre, nombre_asignatura_prece]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Asignatura precedente no encontrada.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al modificar la asignatura precedente:', err);
        res.status(500).json({ error: 'Error al modificar la asignatura precedente', details: err.message });
    }
};
const deleteAsignaturaPrecedenteRelacion = async (req, res) => {
    const { nombre_asignatura_prece } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM asignatura_precedente_relacion WHERE nombre_asignatura_prece = $1 RETURNING *',
            [nombre_asignatura_prece]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Asignatura precedente no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al eliminar la asignatura precedente relación:', err);
        res.status(500).json({ error: 'Error al eliminar la asignatura precedente relación', details: err.message });
    }
};
module.exports = {
    addAsignaturaPrecedente,
    deleteAsignaturaPrecedente,
    updateAsignaturaPrecedente,
    getAsignaturaConPrecedente,
    getEstructuraCompleta,
    addAsignaturaPrecedenteDePrecedente,
    getAllAsignaturasPrecedentes,
    updateAsignaturaPrecedente,
    getAsignaturasPrecedentesById,
    getAsignaturaPrecedenteRelacion,
    updateAsignaturaPrecedenteRelacion,
    deleteAsignaturaPrecedenteRelacion
};