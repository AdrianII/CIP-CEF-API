
const express = require('express');
const router = express.Router();
const pool = require('../config/conectionBD');

// /api/frio/ozono?fechaInicio=2025-03-10&fechaFin=2025-03-10
router.use('/ozono', async (req, res) => {

    const fechaI = req.query.fechaInicio;
    const fechaF = req.query.fechaFin;

    try {
        const query = `
            SELECT "OzonoEntrada", "OzonoSalida", to_char("Fecha", 'HH24:MI') AS "Fecha"
                FROM "Coca-cola"."tblCipFrio"
                WHERE "Fecha" BETWEEN '${fechaI} 00:00:00' AND '${fechaF} 23:59:59';
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error al obtener las temperaturas' });
    }
});

// /api/frio/operacion?fechaInicio=2025-03-10&fechaFin=2025-03-10
router.use('/operacion', async (req, res) => {

    const fechaI = req.query.fechaInicio;
    const fechaF = req.query.fechaFin;

    try {
        const query = `
            SELECT "Operacion", to_char("Fecha", 'HH24:MI') AS "Fecha"
                FROM "Coca-cola"."tblCipFrio"
                WHERE "Fecha" BETWEEN '${fechaI} 00:00:00' AND '${fechaF} 23:59:59';
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error al obtener las temperaturas' });
    }
});

module.exports = router;