const { Router } = require('express');
const { getFacultades,getFacultadesActivas } = require('../controllers/facultadcontrollers'); 
const { getCarrerasActivas } = require('../controllers/carrerascontrollers'); 
const { addMallaCurricular,getMallaCurricular,addMateria ,deleteMateriaByNombre,getMateriasByCodigo,updateMateria,getMallaCurricularByCodCarrera} = require('../controllers/mallacurricularcontrollers'); 
const { addUnidadTematica,getAllUnidadesTematicas,getUnidadesTematicasByTemario,getNivelesByNombreAsignatura,getAllUnidadTemat } = require('../controllers/unidadtemacontrollers'); 
const { addTemario } = require('../controllers/temariocontrollers'); 
const { addNivel } = require('../controllers/nivelcontrollers'); 
const { addAsignatura,getAllAsignaturas,updateAsignatura, deleteAsignatura} = require('../controllers/asignaturacontrollers'); 
const { addProyectoIntegrador } = require('../controllers/proyectointegradorcontrollers'); 
const {
    addAsignaturaPrecedente,
    deleteAsignaturaPrecedente,
    getAsignaturaConPrecedente,
    getEstructuraCompleta,
    addAsignaturaPrecedenteDePrecedente,
    getAllAsignaturasPrecedentes,
    getAsignaturasPrecedentesById,
    updateAsignaturaPrecedente,
    getAsignaturaPrecedenteRelacion,
    updateAsignaturaPrecedenteRelacion,
    deleteAsignaturaPrecedenteRelacion
} = require('../controllers/asignaturaprecedentecontrollers');
const pool = require('../db');
const router = Router();
const { getAllNivelesWithTemarios,getNivelesByCodCarrera} = require('../controllers/nivelcontrollers');
const { getAsignaturasByNombreNivel,getAllAsignaturasWithNiveles,getUnidadesTematicasConTemario } = require('../controllers/unidadtemacontrollers');
const asignaturaController = require('../controllers/getCarrerasYNivelesByFacultad'); // Asegúrate de tener la ruta correcta a tu controlador
const { addMallaPrecedente,deleteMallaPrecedente,getMallaPrecedenteByCarrera, getMallaPrecedente,addNewPrecedenteBasedOnExisting,getPrecedentesByNivel,updateMallaPrecedente,getMallaPrecedentePrecedenteByCarrera,updateMallaPrecedentePrecedente,deleteMallaPrecedentePrecedente} = require('../controllers/materiaController'); // Asegúrate de tener la ruta correcta a tu controlador
const { getNivelesWithMateriasAndPrecedentes } = require('../controllers/mostreocontrollers.js');
const {  getUnidadByMateria ,getUnidadByMateriaNombre,getUnidadByMateriaPrecedentePrecedenteNombre} = require('../controllers/materiascontro'); // Ajusta la ruta según tu estructura de proyecto
const {  getAllDataByCarrera,getNivelUnidadByNombreMateria ,getNivelUnidadByNombreMateriaPrece,getNivelUnidadByNombreMateriaPrecePrece } = require('../controllers/resu.js');
const { addMateriaDetalle,getMateriasDetalles } = require('../controllers/materiasDetallesController');

//CONSULTAS POST
router.get('/facultades', getFacultades);
router.get('/carreras/:cod_facultad', getCarrerasActivas); 
router.get('/facultades/activas', getFacultadesActivas); 
router.post('/malla_curricular', addMallaCurricular);
router.post('/unidad_tematica', addUnidadTematica); 
router.post('/temario', addTemario); 
router.post('/nivel', addNivel); 
router.post('/asignatura', addAsignatura); 
router.post('/asignatura_precedente', addAsignaturaPrecedente); 
router.post('/proyecto_integrador', addProyectoIntegrador); 
router.post('/asignatura_precedente_de_precedente',addAsignaturaPrecedenteDePrecedente);
router.post('/malla_precedente', addMallaPrecedente);
router.delete('/asignatura_precedente/:nombre_asignatura_prece', deleteAsignaturaPrecedente);
router.get('/malla_precedente/:cod_carrera', getNivelesWithMateriasAndPrecedentes);
router.get('/carrera/:cod_carrera', async (req, res) => {
    const { cod_carrera } = req.params;
    try {
        const result = await pool.query('SELECT * FROM carrera WHERE cod_carrera = $1', [cod_carrera]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Carrera not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/facultad/:cod_facultad', async (req, res) => {
    const { cod_facultad } = req.params;
    try {
        const result = await pool.query('SELECT * FROM facultad WHERE cod_facultad = $1', [cod_facultad]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Facultad not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

//CONSULTAS GET 
router.get('/unidad_tematica', getAllUnidadesTematicas);
router.get('/unidad_tematica/temario', getUnidadesTematicasByTemario); 
router.get('/niveles', getAllNivelesWithTemarios);
router.get('/niveles/asignatura/:nombre_asignatura', getNivelesByNombreAsignatura);
router.get('/asignaturas/nivel/:nombre_nivel', getAsignaturasByNombreNivel);
router.get('/asignaturas/niveles', getAllAsignaturasWithNiveles);
router.get('/asignaturas-con-precedentes', getAsignaturaConPrecedente);
router.get('/unidades-tematicas-con-temario', getUnidadesTematicasConTemario);
router.get('/estructura-completa', getEstructuraCompleta);
router.get('/asignaturas_precedentes', getAllAsignaturasPrecedentes);
router.get('/carreras/:cod_carrera/niveles-materias', asignaturaController.getNivelesYMateriasByCarrera);
router.put('/asignatura_precedente', updateAsignaturaPrecedente);
router.get('/asignatura_precedente/:id_asignatura_precedente', getAsignaturasPrecedentesById);
router.get('/asignatura_precedente/:cod_carrera', getMallaPrecedente);
router.get('/relacion', getAsignaturaPrecedenteRelacion);
router.put('/relacion/:nombre_asignatura_prece', updateAsignaturaPrecedenteRelacion);
router.delete('/relacion/:nombre_asignatura_prece', deleteAsignaturaPrecedenteRelacion);
router.get('/asignaturas', getAllAsignaturas);
router.put('/asignatura', updateAsignatura);
router.delete('/asignatura/:nombre_asignatura', deleteAsignatura);
router.get('/malla-curricular', getMallaCurricular);
router.get('/unidad-temat', getAllUnidadTemat);
router.post('/addNewPrecedenteBasedOnExisting', addNewPrecedenteBasedOnExisting);
router.get('/precedente/nivel/:id_nivel', getPrecedentesByNivel);
router.get('/malla-precedente/:cod_carrera', getMallaPrecedenteByCarrera);
router.post('/materias', addMateria);
router.get('/materias/:cod_facultad/:cod_carrera', getMateriasByCodigo);
router.put('/materias/:id_materia', updateMateria);
router.put('/malla-precedentee', updateMallaPrecedente);
router.delete('/malla-precedenteee', deleteMallaPrecedente);
router.get('/malla-precedente-precedente/:cod_carrera', getMallaPrecedentePrecedenteByCarrera);
router.put('/malla-precedente-precedente', updateMallaPrecedentePrecedente);
router.delete('/malla-precedenteeeee', deleteMallaPrecedentePrecedente);
router.get('/niveles/:cod_carrera', getNivelesByCodCarrera);
router.get('/malla-curricular/:cod_carrera', getMallaCurricularByCodCarrera);
router.get('/unidad/:nombre_materia', getUnidadByMateria);
router.get('/unidad/nombre/:nombre_materia',getUnidadByMateriaNombre);
router.get('/unidad/nombre/precedente_precedente/:nombre_materia', getUnidadByMateriaPrecedentePrecedenteNombre);
router.get('/all-data/:cod_carrera',  getAllDataByCarrera);
router.get('/nivel-unidad/:nombre_materia', getNivelUnidadByNombreMateria);
router.get('/nivel-unidad-prece/:nombre_materia_prece', getNivelUnidadByNombreMateriaPrece);
router.get('/nivel-unidad-prece-prece/:nombre_materia_prece', getNivelUnidadByNombreMateriaPrecePrece);
router.post('/materias-detalles', addMateriaDetalle);
router.get('/materias-detalles/:cod_carrera', getMateriasDetalles);
router.delete('/materias/:codigo_materia', deleteMateriaByNombre);



module.exports = router;