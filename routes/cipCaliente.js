
const express = require('express');
const router = express.Router();
const pool = require('../config/conectionBD');

// /api/caliente/temperatura?fechaInicio=2025-03-10&fechaFin=2025-03-10
router.use('/temperatura', async (req, res) => {

    const fechaI = req.query.fechaInicio;
    const fechaF = req.query.fechaFin;

    try {
        const query = `
            SELECT "TemperaturaEntrada" AS "Entrada", "TemperaturaSalida" AS "Salida", to_char("Fecha", 'HH24:MI') AS "Fecha"
	            FROM "Coca-cola"."tblCipCaliente"
	            WHERE "Fecha" BETWEEN '${fechaI} 00:00:00' AND '${fechaF} 23:59:59';
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error al obtener las temperaturas' });
    }
});

// /api/caliente/conductividad?fechaInicio=2025-03-10&fechaFin=2025-03-10
router.use('/conductividad', async (req, res) => {

    const fechaI = req.query.fechaInicio;
    const fechaF = req.query.fechaFin;

    try {
        const query = `
            SELECT "Conductividad", to_char("Fecha", 'HH24:MI') AS "Fecha"
	            FROM "Coca-cola"."tblCipCaliente"
	            WHERE "Fecha" BETWEEN '${fechaI} 00:00:00' AND '${fechaF} 23:59:59';
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error al obtener las temperaturas' });
    }
});

// /api/caliente/flujo?fechaInicio=2025-03-10&fechaFin=2025-03-10
router.use('/flujo', async (req, res) => {

    const fechaI = req.query.fechaInicio;
    const fechaF = req.query.fechaFin;

    try {
        const query = `
            SELECT "Flujo", to_char("Fecha", 'HH24:MI') AS "Fecha"
	            FROM "Coca-cola"."tblCipCaliente"
	            WHERE "Fecha" BETWEEN '${fechaI} 00:00:00' AND '${fechaF} 23:59:59';
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error al obtener las temperaturas' });
    }
});

// /api/caliente/operacion?fechaInicio=2025-03-10&fechaFin=2025-03-10
router.use('/operacion', async (req, res) => {

    const fechaI = req.query.fechaInicio;
    const fechaF = req.query.fechaFin;

    try {
        const query = `
            SELECT "Operacion", to_char("Fecha", 'HH24:MI') AS "Fecha"
	            FROM "Coca-cola"."tblCipCaliente"
	            WHERE "Fecha" BETWEEN '${fechaI} 00:00:00' AND '${fechaF} 23:59:59';
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error al obtener las temperaturas' });
    }
});

// /api/caliente/operacionTiempo?fechaInicio=2025-03-10&fechaFin=2025-03-10
router.use('/operacionTiempo', async (req, res) => {

    const fechaI = req.query.fechaInicio;
    const fechaF = req.query.fechaFin;

    try {
        const query = `
           WITH numerado AS (
            SELECT 
                "Operacion", 
                "Fecha",
                row_number() OVER (ORDER BY "Fecha") AS rn,
                row_number() OVER (PARTITION BY "Operacion" ORDER BY "Fecha") AS rn_op
            FROM "Coca-cola"."tblCipCaliente"
            WHERE "Fecha" BETWEEN '${fechaI} 00:00:00' AND '${fechaF} 23:59:59'
            ),
            agrupado AS (
                SELECT 
                    "Operacion", 
                    "Fecha", 
                    rn - rn_op AS grupo
                FROM numerado
            )
            SELECT 
                "Operacion", 
                COUNT(*) AS cantidad,
                MIN("Fecha") AS inicio,
                MAX("Fecha") AS fin
            FROM agrupado
            GROUP BY "Operacion", grupo
            ORDER BY inicio;
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error al obtener las temperaturas' });
    }
});

module.exports = router;