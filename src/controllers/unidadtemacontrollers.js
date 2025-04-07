const pool = require('../db'); // Asegúrate de que la ruta sea correcta

const addUnidadTematica = async (req, res) => {
    const { id_malla, nombre_unidad, estado, cod_facultad, cod_carrera } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO unidad_tematica (id_malla, nombre_unidad, estado, cod_facultad, cod_carrera) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_malla, nombre_unidad, estado, cod_facultad, cod_carrera]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al añadir la unidad temática:', err);
        res.status(500).json({ error: 'Error al añadir la unidad temática', details: err.message });
    }
};
const getAllUnidadesTematicas = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT ut.id_unidad, ut.id_malla, ut.nombre_unidad, ut.estado, 
                    c.nom_carrera, f.nom_facultad, mc.version_malla 
             FROM unidad_tematica ut 
             JOIN malla_curricular mc ON ut.id_malla = mc.id_malla
             JOIN carrera c ON ut.cod_carrera = c.cod_carrera
             JOIN facultad f ON ut.cod_facultad = f.cod_facultad
             ORDER BY f.nom_facultad, c.nom_carrera`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las unidades temáticas:', err);
        res.status(500).json({ error: 'Error al obtener las unidades temáticas', details: err.message });
    }
};
const getAllUnidadTemat = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM unidad_temat');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las unidades temáticas:', err);
        res.status(500).json({ error: 'Error al obtener las unidades temáticas', details: err.message });
    }
};
const getUnidadesTematicasByTemario = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT ut.id_unidad, ut.id_malla, ut.nombre_unidad, ut.estado, 
                    f.nom_facultad, c.nom_carrera, t.nombre_temario 
             FROM unidad_tematica ut 
             JOIN temario t ON ut.id_unidad = t.id_unidad
             JOIN carrera c ON ut.cod_carrera = c.cod_carrera
             JOIN facultad f ON ut.cod_facultad = f.cod_facultad`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las unidades temáticas por temario:', err);
        res.status(500).json({ error: 'Error al obtener las unidades temáticas por temario', details: err.message });
    }
};
const getNivelesByNombreAsignatura = async (req, res) => {
    const { nombre_asignatura } = req.params;

    try {
        const result = await pool.query(
            `SELECT n.*, a.nombre_asignatura 
             FROM nivel n 
             JOIN asignatura a ON n.id_nivel = a.id_nivel 
             WHERE a.nombre_asignatura = $1`,
            [nombre_asignatura]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los niveles por nombre de la asignatura:', err);
        res.status(500).json({ error: 'Error al obtener los niveles por nombre de la asignatura', details: err.message });
    }
};
//ESPECIFICA EL NIVEL 
const getAsignaturasByNombreNivel = async (req, res) => {
    const { nombre_nivel } = req.params;

    try {
        const result = await pool.query(
            `SELECT a.*, n.nombre_nivel 
             FROM asignatura a 
             JOIN nivel n ON a.id_nivel = n.id_nivel 
             WHERE n.nombre_nivel = $1`,
            [nombre_nivel]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las asignaturas por nombre del nivel:', err);
        res.status(500).json({ error: 'Error al obtener las asignaturas por nombre del nivel', details: err.message });
    }
};
const getUnidadesTematicasConTemario = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                f.nom_facultad, 
                c.nom_carrera, 
                ut.nombre_unidad, 
                t.nombre_temario 
            FROM unidad_tematica ut
            JOIN malla_curricular mc ON ut.id_malla = mc.id_malla
            JOIN carrera c ON ut.cod_carrera = c.cod_carrera
            JOIN facultad f ON ut.cod_facultad = f.cod_facultad
            LEFT JOIN temario t ON ut.id_unidad = t.id_unidad
            ORDER BY f.nom_facultad, c.nom_carrera, ut.nombre_unidad
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las unidades temáticas con temario:', err);
        res.status(500).json({ error: 'Error al obtener las unidades temáticas con temario', details: err.message });
    }
};
//NO ESPECIFICA EL NIVEL
const getAllAsignaturasWithNiveles = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT a.*, n.nombre_nivel, f.nom_facultad, c.nom_carrera 
             FROM asignatura a 
             JOIN nivel n ON a.id_nivel = n.id_nivel
             JOIN carrera c ON a.cod_carrera = c.cod_carrera
             JOIN facultad f ON c.cod_facultad = f.cod_facultad
             ORDER BY 
                CASE 
                    WHEN n.nombre_nivel = 'I nivel' THEN 1
                    WHEN n.nombre_nivel = 'II nivel' THEN 2
                    WHEN n.nombre_nivel = 'III nivel' THEN 3
                    WHEN n.nombre_nivel = 'IV nivel' THEN 4
                    WHEN n.nombre_nivel = 'V nivel' THEN 5
                    WHEN n.nombre_nivel = 'VI nivel' THEN 6
                    WHEN n.nombre_nivel = 'VII nivel' THEN 7
                    WHEN n.nombre_nivel = 'VIII nivel' THEN 8
                    WHEN n.nombre_nivel = 'IX nivel' THEN 9
                    WHEN n.nombre_nivel = 'X nivel' THEN 10
                    ELSE 11
                END`
        );

        // Agrupar los resultados por nombre_nivel
        const groupedResults = result.rows.reduce((acc, row) => {
            if (!acc[row.nombre_nivel]) {
                acc[row.nombre_nivel] = [];
            }
            acc[row.nombre_nivel].push({
                id_asignatura: row.id_asignatura,
                codigo_unico: row.codigo_unico,
                id_nivel: row.id_nivel,
                nombre_asignatura: row.nombre_asignatura,
                estado: row.estado,
                horas: row.horas,
                nom_carrera: row.nom_carrera,
                nom_facultad: row.nom_facultad,
                nombre_nivel: row.nombre_nivel
            });
            return acc;
        }, {});

        res.status(200).json(groupedResults);
    } catch (err) {
        console.error('Error al obtener las asignaturas con niveles:', err);
        res.status(500).json({ error: 'Error al obtener las asignaturas con niveles', details: err.message });
    }
};



module.exports = {
    addUnidadTematica,
    getAllUnidadesTematicas,
    getUnidadesTematicasByTemario,
    getNivelesByNombreAsignatura,
    getAsignaturasByNombreNivel,
    getAllAsignaturasWithNiveles,
    getUnidadesTematicasConTemario,
    getAllUnidadTemat
};