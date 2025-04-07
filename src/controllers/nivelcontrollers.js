const pool = require('../db'); // Asegúrate de que la ruta sea correcta

const addNivel = async (req, res) => {
    const { id_temario, nombre_nivel, estado, cod_carrera, cod_facultad } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO nivel (id_temario, nombre_nivel, estado, cod_carrera, cod_facultad) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_temario, nombre_nivel, estado, cod_carrera, cod_facultad]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al añadir el nivel:', err);
        res.status(500).json({ error: 'Error al añadir el nivel', details: err.message });
    }
};
const getNivelesByCodCarrera = async (req, res) => {
    const { cod_carrera } = req.params;

    try {
        const result = await pool.query('SELECT * FROM nivel WHERE cod_carrera = $1', [cod_carrera]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los niveles:', err);
        res.status(500).json({ error: 'Error al obtener los niveles', details: err.message });
    }
};
const getAllNivelesWithTemarios = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT n.*, t.nombre_temario, c.nom_carrera, f.nom_facultad 
             FROM nivel n 
             JOIN temario t ON n.id_temario = t.id_temario
             JOIN carrera c ON n.cod_carrera = c.cod_carrera
             JOIN facultad f ON c.cod_facultad = f.cod_facultad`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los niveles con temarios:', err);
        res.status(500).json({ error: 'Error al obtener los niveles con temarios', details: err.message });
    }
};

module.exports = {
    addNivel,
    getAllNivelesWithTemarios,
    getNivelesByCodCarrera
};