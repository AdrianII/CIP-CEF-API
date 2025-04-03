
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
            FROM "Coca-cola"."tblCipFrio"
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

router.use('/secuencia', async (req, res) => {

    const folio = req.query.folio;

    try {
        const query = `
            SELECT "Operacion", to_char(MIN("Fecha"), 'HH24:MI') AS "Inicio", to_char(MAX("Fecha"), 'HH24:MI') AS "Fin", "FolioOperacion"
	            FROM "Coca-cola"."tblCipFrio"
	            WHERE "FolioOperacion" = ${folio} AND "Operacion"!='INACTIVO'
	            GROUP BY "Operacion", "FolioOperacion"
	            ORDER BY "Inicio" DESC;
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error al obtener las temperaturas' });
    }
});

router.use('/secuenciaFecha', async (req, res) => {

    const fecha = req.query.fecha;

    try {
        const query = `
            SELECT "Operacion", to_char(MIN("Fecha"), 'HH24:MI') AS "Inicio", to_char(MAX("Fecha"), 'HH24:MI') AS "Fin", "FolioOperacion"
	            FROM "Coca-cola"."tblCipFrio"
	            WHERE "Fecha" > '${fecha} 00:00:00' AND "Fecha" > '${fecha} 23:59:59' AND "Operacion"!='INACTIVO'
	            GROUP BY "Operacion", "FolioOperacion"
	            ORDER BY "Inicio" DESC;
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error al obtener las temperaturas' });
    }
});

module.exports = router;