const express = require("express");
const router = express.Router();
const pool = require("../../database/db");
const { error } = require("console");

router.get("/show", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Pays ORDER BY id_pays");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/showPlayer", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Joueur ORDER BY id_equipe, poste, numero_joueur"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/showMatch", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Match ORDER BY id_terrain ");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/match/terrain/:idTerrain", async (req, res) => {
  try {
    const { idTerrain } = req.params;

    const result = await pool.query(
      `
      SELECT 
        m.id_match,
        m.date_match,
        m.score_equipe1,
        m.score_equipe2,

        e1.id_equipe AS team1_id,
        p1.nom_pays AS team1_country,
        e1.entraineur AS team1_coach,

        e2.id_equipe AS team2_id,
        p2.nom_pays AS team2_country,
        e2.entraineur AS team2_coach

      FROM Match m
      JOIN Equipe e1 ON m.id_equipe1 = e1.id_equipe
      JOIN Pays p1 ON e1.id_pays = p1.id_pays
      JOIN Equipe e2 ON m.id_equipe2 = e2.id_equipe
      JOIN Pays p2 ON e2.id_pays = p2.id_pays

      WHERE m.id_terrain = $1
      ORDER BY m.date_match
    `,
      [idTerrain]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/players", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM Joueur
      ORDER BY id_equipe, poste
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/showTeam", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Equipe ORDER BY id_pays ");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/showQualifie", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Pays WHERE qualifie = 'true' ORDER BY id_pays"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/classementPoule", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ClassementPoule ORDER BY poule ASC, points ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/huitiemeFinale", async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT c.id_equipe, p.nom_pays, c.poule
            FROM ClassementPoule c
            JOIN Equipe eq ON eq.id_equipe = c.id_equipe
            JOIN Pays p ON p.id_pays = eq.id_pays
            WHERE c.qualifie = TRUE AND eq.sexe_equipe = 'Homme'
            ORDER BY c.poule ASC, c.points DESC 
            `);
    const qualifies = result.rows;

    const poules = {};
    qualifies.forEach((equipe) => {
      if (!poules[equipe.poule]) {
        poules[equipe.poule] = [];
      }
      poules[equipe.poule].push(equipe);
    });

    const getEquipe = (poule, index) => {
      if (!poules[poule] || !poules[poule][index]) {
        return null;
      }
      return poules[poule][index];
    };

    const left = {
      match1: {
        equipe1: getEquipe("A", 0),
        equipe2: getEquipe("H", 1),
      },
      match2: {
        equipe1: getEquipe("B", 0),
        equipe2: getEquipe("D", 1),
      },
      match3: {
        equipe1: getEquipe("C", 0),
        equipe2: getEquipe("G", 1),
      },
      match4: {
        equipe1: getEquipe("E", 0),
        equipe2: getEquipe("F", 1),
      },
    };

    const right = {
      match1: {
        equipe1: getEquipe("D", 0),
        equipe2: getEquipe("B", 1),
      },
      match2: {
        equipe1: getEquipe("F", 0),
        equipe2: getEquipe("C", 1),
      },
      match3: {
        equipe1: getEquipe("G", 0),
        equipe2: getEquipe("A", 1),
      },
      match4: {
        equipe1: getEquipe("H", 0),
        equipe2: getEquipe("E", 1),
      },
    };

    res.json({ left, right });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;