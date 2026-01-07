const pool = require("./db");
const fs = require("fs");
const path = require("path");

(async () => {
  try {
    console.log("🚀 Début de l'export des données PostgreSQL vers JSON...");

    // Objet pour stocker toutes les données
    const data = {};

    // Liste des tables à exporter
    const tables = [
      "Evenement",
      "Utilisateur",
      "Type_utilisateur",
      "Zone",
      "Terrain",
      "Prestataire",
      "Panier",
      "Services",
      "Panier_Service",
      "Pays",
      "Organisateur",
      "Equipe",
      "Match",
      "Panier_Siege",
      "Siege",
      "Joueur",
      "ClassementPoule",
      "Type_restauration",
      "Type_animation",
      "Type_utilisateur",
      "Type_boutique",
    ];

    // Exporter chaque table
    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT * FROM ${table}`);
        data[table] = result.rows;
        console.log(
          `✅ ${table}: ${result.rows.length} enregistrements exportés`
        );
      } catch (err) {
        console.error(`❌ Erreur lors de l'export de ${table}:`, err.message);
        data[table] = [];
      }
    }

    // Créer le dossier de sortie s'il n'existe pas
    const outputDir = path.join(__dirname, "exported_data");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Sauvegarder toutes les données dans un seul fichier
    const allDataPath = path.join(outputDir, "mintonette_cup_data.json");
    fs.writeFileSync(allDataPath, JSON.stringify(data, null, 2));
    console.log(`\n✅ Toutes les données exportées dans: ${allDataPath}`);

    // Optionnel: Sauvegarder chaque table dans un fichier séparé
    for (const [tableName, tableData] of Object.entries(data)) {
      const tablePath = path.join(outputDir, `${tableName}.json`);
      fs.writeFileSync(tablePath, JSON.stringify(tableData, null, 2));
    }
    console.log(`✅ Fichiers individuels créés dans: ${outputDir}`);

    // Créer un fichier de résumé
    const summary = {
      exportDate: new Date().toISOString(),
      totalTables: tables.length,
      tables: Object.entries(data).map(([name, rows]) => ({
        name,
        count: rows.length,
      })),
    };

    const summaryPath = path.join(outputDir, "export_summary.json");
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`✅ Résumé de l'export créé: ${summaryPath}`);

    console.log("\n🎉 Export terminé avec succès!");
  } catch (err) {
    console.error("❌ Erreur générale lors de l'export:", err);
  } finally {
    await pool.end();
    console.log("Connexion PostgreSQL fermée.");
  }
})();
