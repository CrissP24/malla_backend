const pool = require('../db'); // Asegúrate de tener la ruta correcta a tu conexión de base de datos

const getNivelesYMateriasByCarrera = async (req, res) => {
    const { cod_carrera } = req.params;

    try {
        // Consultar el nombre de la carrera
        const carreraResult = await pool.query(
            'SELECT nom_carrera FROM carrera WHERE cod_carrera = $1',
            [cod_carrera]
        );

        if (carreraResult.rows.length === 0) {
            return res.status(404).json({ error: 'Carrera no encontrada' });
        }

        const nom_carrera = carreraResult.rows[0].nom_carrera;

        // Consultar los niveles por carrera
        const nivelesResult = await pool.query(
            'SELECT id_nivel, nombre_nivel FROM nivel WHERE cod_carrera = $1',
            [cod_carrera]
        );

        const niveles = nivelesResult.rows;

        // Consultar las materias por cada nivel
        for (let nivel of niveles) {
            const materiasResult = await pool.query(
                'SELECT id_materia, nombre_materia FROM materias WHERE id_nivel = $1 AND cod_carrera = $2',
                [nivel.id_nivel, cod_carrera]
            );
            nivel.materias = materiasResult.rows;

            // Consultar las materias precedentes por nivel
            const precedentesResult = await pool.query(
                'SELECT id_materia, id_materia_precedente, nombre_materia_prece FROM malla_precedente WHERE id_nivel = $1 AND cod_carrera = $2',
                [nivel.id_nivel, cod_carrera]
            );
            nivel.precedentes = precedentesResult.rows;
        }

        res.status(200).json({ nom_carrera, niveles });
    } catch (err) {
        console.error('Error al consultar los niveles y materias:', err);
        res.status(500).json({ error: 'Error al consultar los niveles y materias', details: err.message });
    }
};

module.exports = {
    getNivelesYMateriasByCarrera
};