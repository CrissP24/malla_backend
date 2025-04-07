const pool = require('../db');

const getNivelesWithMateriasAndPrecedentes = async (req, res) => {
    const { cod_carrera } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                m.id_nivel,
                m.id_unidad,
                SUM(m.horas) AS total_horas_nivel,
                json_agg(json_build_object(
                    'id_materia', m.id_materia,
                    'nombre_materia', m.nombre_materia,
                    'horas', m.horas,
                    'precedentes', (
                        SELECT json_agg(json_build_object(
                            'id_materia_precedente', mp.id_materia_precedente,
                            'nombre_materia_prece', mp.nombre_materia_prece,
                            'horas', mp.horas,
                            'id_nivel', mp.id_nivel,
                            'precedentes_de_precedentes', (
                                SELECT json_agg(json_build_object(
                                    'id_materia_precedente_precedente', mpp.id_materia_precedente_precedente,
                                    'nombre_materia_prece', mpp.nombre_materia_prece,
                                    'horas', mpp.horas,
                                    'id_nivel', mpp.id_nivel
                                ))
                                FROM malla_precedente_precedente mpp
                                WHERE mpp.id_materia_precedente = mp.id_materia_precedente
                            )
                        ))
                        FROM malla_precedente mp
                        WHERE mp.id_materia = m.id_materia
                    )
                )) AS materias
            FROM 
                materias m
            WHERE 
                m.cod_carrera = $1
            GROUP BY 
                m.id_nivel, m.id_unidad
            ORDER BY 
                m.id_nivel
        `, [cod_carrera]);

        // Filtrar la columna total_horas_precedente_precedente de la respuesta
        const filteredResult = result.rows.map(row => ({
            id_nivel: row.id_nivel,
            id_unidad: row.id_unidad,
            total_horas_nivel: row.total_horas_nivel,
            materias: row.materias
        }));

        res.status(200).json(filteredResult);
    } catch (err) {
        console.error('Error al obtener los niveles con materias y precedentes:', err);
        res.status(500).json({ error: 'Error al obtener los niveles con materias y precedentes', details: err.message });
    }
};

module.exports = {
    getNivelesWithMateriasAndPrecedentes,
};