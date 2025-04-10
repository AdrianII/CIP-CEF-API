
const express = require('express');
const router = express.Router();
const pool = require('../config/conectionBD');

// /api/caliente/temperatura?fechaInicio=2025-03-10&fechaFin=2025-03-10
router.use('/temperatura', async (req, res) => {

    const fechaI = req.query.fechaInicio;
    const fechaF = req.query.fechaFin;
    const operacion = req.query.Operacion;

    const OP = typeof operacion === 'undefinded' ? '' : operacion === 'N/A' ? '' : ` AND "FolioOperacion"=${operacion}`;

    try {
        const query = `
            SELECT "TemperaturaEntrada" AS "Entrada", "TemperaturaSalida" AS "Salida", to_char("Fecha", 'HH24:MI') AS "Fecha"
	            FROM "Coca-cola"."tblCipCaliente"
	            WHERE "Fecha" BETWEEN '${fechaI} 00:00:00' AND '${fechaF} 23:59:59'${OP};
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
    const operacion = req.query.Operacion;

    const OP = typeof operacion === 'undefinded' ? '' : operacion === 'N/A' ? '' : ` AND "FolioOperacion"=${operacion}`;

    try {
        const query = `
            SELECT "Conductividad", to_char("Fecha", 'HH24:MI') AS "Fecha"
	            FROM "Coca-cola"."tblCipCaliente"
	            WHERE "Fecha" BETWEEN '${fechaI} 00:00:00' AND '${fechaF} 23:59:59'${OP};
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
    const operacion = req.query.Operacion;

    const OP = typeof operacion === 'undefinded' ? '' : operacion === 'N/A' ? '' : ` AND "FolioOperacion"=${operacion}`;

    try {
        const query = `
            SELECT "Flujo", to_char("Fecha", 'HH24:MI') AS "Fecha"
	            FROM "Coca-cola"."tblCipCaliente"
	            WHERE "Fecha" BETWEEN '${fechaI} 00:00:00' AND '${fechaF} 23:59:59'${OP};
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
    const operacion = req.query.Operacion;

    const OP = typeof operacion === 'undefinded' ? '' : operacion === 'N/A' ? '' : ` AND "FolioOperacion"=${operacion}`;

    try {
        const query = `
           WITH numerado AS (
            SELECT 
                "Operacion", 
                "Fecha",
                row_number() OVER (ORDER BY "Fecha") AS rn,
                row_number() OVER (PARTITION BY "Operacion" ORDER BY "Fecha") AS rn_op
            FROM "Coca-cola"."tblCipCaliente"
            WHERE "Fecha" BETWEEN '${fechaI} 00:00:00' AND '${fechaF} 23:59:59'${OP}
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
	            FROM "Coca-cola"."tblCipCaliente"
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
    try {
      const query = `
        SELECT 
          "Operacion", 
          MIN("Fecha") AS "Inicio",
          MAX("Fecha") AS "Fin",
          "FolioOperacion",
          AVG("TemperaturaEntrada") as avg_entrada,
          AVG("TemperaturaSalida") as avg_salida
        FROM "Coca-cola"."tblCipCaliente"
        WHERE "Fecha" BETWEEN $1 AND $2
          AND "Operacion" != 'INACTIVO'
        GROUP BY "Operacion", "FolioOperacion"
        ORDER BY MIN("Fecha");
      `;
  
      const result = await pool.query(query, [
        `${req.query.fecha} 00:00:00`,
        `${req.query.fecha} 23:59:59`
      ]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al obtener secuencias' });
    }
  });

  //http://127.0.0.1:8080/api/caliente/SecuenciasFolio?fecha=2025-04-07
  router.use('/SecuenciasFolio', async (req, res) => {
    try {
      const query = `
        SELECT "FolioOperacion"
	        From "Coca-cola"."tblCipCaliente"
	        WHERE "Fecha" BETWEEN $1 AND $2
	        GROUP BY "FolioOperacion"
      `;
  
      const result = await pool.query(query, [
        `${req.query.fecha} 00:00:00`,
        `${req.query.fecha} 23:59:59`
      ]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al obtener secuencias' });
    }
  });

  router.use('/datosCip', async (req, res) => {
    try {
      const query = `
        SELECT "Id", "Usuario", "Equipo", "TipoCip"
	        FROM "Coca-cola"."tblOperacionCaliente"
	        WHERE "Id" = $1;
      `;
  
      const result = await pool.query(query, [
        req.query.Folio
      ]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al obtener secuencias' });
    }
  });

module.exports = router;