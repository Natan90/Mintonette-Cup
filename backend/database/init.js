const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'mintonette_cup.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error("❌ Impossible d'ouvrir la DB :", err.message);
    process.exit(1);
  }
  console.log("✅ Base de données ouverte avec succès !");
});

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON;");

  db.run(`CREATE TABLE IF NOT EXISTS Utilisateur(
    id_utilisateur INT PRIMARY KEY AUTOINCREMENT,
    prenom_utilisateur VARCHAR(50),
    nom_utilisateur VARCHAR(50),
    login_utilisateur VARCHAR(200),
    mdp_utilisateur VARCHAR(200),
    mail_utilisateur VARCHAR(200),
    date_naissance_utiisateur DATE,
    sexe_utilisateur VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Type_utilisateur(
    id_utilisateur INT PRIMARY KEY AUTOINCREMENT,
    nom_type_utilisateur VARCHAR(50),
    droit_type_utilisateur VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Organisateur(
    id_organisateur INT PRIMARY KEY AUTOINCREMENT,
    id_utilisateur INT NOT NULL,
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Club(
    id_club INT PRIMARY KEY AUTOINCREMENT,
    nom_club VARCHAR(50),
    couleur_maillot VARCHAR(50),
    nom_mascotte VARCHAR(50),
    id_utilisateur INT NOT NULL,
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Equipe(
    id_equipe INT PRIMARY KEY AUTOINCREMENT,
    sexe_equipe VARCHAR(50),
    nb_joueurs INT,
    id_club INT NOT NULL,
    FOREIGN KEY(id_club) REFERENCES Club(id_club)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Joueur(
    id_joueur INT PRIMARY KEY AUTOINCREMENT,
    nom_joueur VARCHAR(50),
    prenom_joueur VARCHAR(50),
    sexe_joueur VARCHAR(50),
    date_naissance_joueur DATE,
    numero_joueur INT,
    id_equipe INT NOT NULL,
    FOREIGN KEY(id_equipe) REFERENCES Equipe(id_equipe)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Aliment(
    id_aliment INT PRIMARY KEY AUTOINCREMENT,
    nom_aliment VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Date_du_jour(
    JJ_MM_AAAA DATE PRIMARY KEY,
    hh_mm TIME
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Type_animation(
    id_type_animation INT PRIMARY KEY AUTOINCREMENT,
    nom_type_animation VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Agent_securité(
    id_agent_securité INT PRIMARY KEY AUTOINCREMENT,
    nom_agent_securité VARCHAR(50),
    prenom_agent_securité VARCHAR(50),
    id_utilisateur INT NOT NULL,
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Article(
    id_article INT PRIMARY KEY AUTOINCREMENT,
    nom_article VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Zone(
    id_zone INT PRIMARY KEY AUTOINCREMENT,
    nom_zone VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Plat(
    id_plat INT PRIMARY KEY AUTOINCREMENT,
    nom_plat VARCHAR(50),
    description_plat VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Match_volley(
    id_match INT PRIMARY KEY AUTOINCREMENT,
    prix_place_match DECIMAL(19,4),
    score_match VARCHAR(50),
    vainqueur_match VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Stade(
    id_stade INT PRIMARY KEY AUTOINCREMENT,
    nom_stade VARCHAR(50),
    id_zone INT NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Restauration(
    id_restauration INT PRIMARY KEY AUTOINCREMENT,
    nom_restaurant VARCHAR(50),
    nb_couverts INT,
    id_zone INT NOT NULL,
    id_utilisateur INT NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Animation(
    id_animation INT PRIMARY KEY AUTOINCREMENT,
    nom_animation VARCHAR(50),
    capacité_animation INT,
    animation_dans_un_stade BOOLEAN,
    id_zone INT NOT NULL,
    id_utilisateur INT NOT NULL,
    id_type_animation INT NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY(id_type_animation) REFERENCES Type_animation(id_type_animation)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Poste_secouriste(
    id_poste_secouriste VARCHAR(50) PRIMARY KEY,
    nb_lits_occupés INT,
    nb_lits_disponibles INT,
    id_zone INT NOT NULL,
    id_utilisateur INT NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Boutique(
    id_boutique INT PRIMARY KEY AUTOINCREMENT,
    nom_boutique VARCHAR(50),
    commande_disponnible BOOLEAN,
    capacité_boutique INT,
    id_zone INT NOT NULL,
    id_utilisateur INT NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Reservation(
    id_reservation INT PRIMARY KEY AUTOINCREMENT,
    jour_reservation DATE,
    nb_couverts_reservation INT,
    nom_reservation VARCHAR(50),
    heure_reservation TIME,
    id_restauration INT NOT NULL,
    FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS présent_dans_restaurant(
    id_restauration INT,
    id_aliment INT,
    stock_aliment INT,
    PRIMARY KEY(id_restauration, id_aliment),
    FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
    FOREIGN KEY(id_aliment) REFERENCES Aliment(id_aliment)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS clients_restaurant(
    id_restauration INT,
    JJ_MM_AAAA DATE,
    PRIMARY KEY(id_restauration, JJ_MM_AAAA),
    FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS visiteurs_animation(
    JJ_MM_AAAA DATE,
    id_animation INT,
    nb_visiteurs_animation INT,
    PRIMARY KEY(JJ_MM_AAAA, id_animation),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_animation) REFERENCES Animation(id_animation)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS présent_dans_boutique(
    id_boutique INT,
    id_article INT,
    stock_article INT,
    PRIMARY KEY(id_boutique, id_article),
    FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique),
    FOREIGN KEY(id_article) REFERENCES Article(id_article)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS client_boutique(
    JJ_MM_AAAA DATE,
    id_boutique INT,
    nb_clients_boutique INT,
    PRIMARY KEY(JJ_MM_AAAA, id_boutique),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS commandes_resto(
    id_restauration INT,
    JJ_MM_AAAA DATE,
    id_plat INT,
    PRIMARY KEY(id_restauration, JJ_MM_AAAA, id_plat),
    FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_plat) REFERENCES Plat(id_plat)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS article_vendu(
    id_boutique INT,
    id_article INT,
    nb_article_vendu INT,
    PRIMARY KEY(id_boutique, id_article),
    FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique),
    FOREIGN KEY(id_article) REFERENCES Article(id_article)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS prix_article_boutique(
    id_boutique INT,
    id_article INT,
    prix_article DECIMAL(19,4),
    PRIMARY KEY(id_boutique, id_article),
    FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique),
    FOREIGN KEY(id_article) REFERENCES Article(id_article)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS utilisateur_de_type(
    id_utilisateur INT,
    id_utilisateur_1 INT,
    PRIMARY KEY(id_utilisateur, id_utilisateur_1),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY(id_utilisateur_1) REFERENCES Type_utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS nb_secouristes(
    JJ_MM_AAAA DATE,
    id_poste_secouriste VARCHAR(50),
    nb_secouristes_affectés INT,
    PRIMARY KEY(JJ_MM_AAAA, id_poste_secouriste),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_poste_secouriste) REFERENCES Poste_secouriste(id_poste_secouriste)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS est_affecté(
    JJ_MM_AAAA DATE,
    id_agent_securité INT,
    id_zone INT,
    PRIMARY KEY(JJ_MM_AAAA, id_agent_securité, id_zone),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_agent_securité) REFERENCES Agent_securité(id_agent_securité),
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS à_la_carte(
    id_restauration INT,
    id_plat INT,
    prix_plat DECIMAL(19,4),
    PRIMARY KEY(id_restauration, id_plat),
    FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
    FOREIGN KEY(id_plat) REFERENCES Plat(id_plat)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS à_pour_ingrédient(
    id_aliment INT,
    id_plat INT,
    quantité VARCHAR(50),
    PRIMARY KEY(id_aliment, id_plat),
    FOREIGN KEY(id_aliment) REFERENCES Aliment(id_aliment),
    FOREIGN KEY(id_plat) REFERENCES Plat(id_plat)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS équipe_1(
    id_equipe INT,
    id_match INT,
    PRIMARY KEY(id_equipe, id_match),
    FOREIGN KEY(id_equipe) REFERENCES Equipe(id_equipe),
    FOREIGN KEY(id_match) REFERENCES Match_volley(id_match)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS équipe_2(
    id_equipe INT,
    id_match INT,
    PRIMARY KEY(id_equipe, id_match),
    FOREIGN KEY(id_equipe) REFERENCES Equipe(id_equipe),
    FOREIGN KEY(id_match) REFERENCES Match_volley(id_match)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS prend_une_place(
    id_utilisateur INT,
    id_match INT,
    PRIMARY KEY(id_utilisateur, id_match),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY(id_match) REFERENCES Match_volley(id_match)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS à_lieu(
    JJ_MM_AAAA DATE,
    id_match INT,
    id_stade INT,
    PRIMARY KEY(JJ_MM_AAAA, id_match, id_stade),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_match) REFERENCES Match_volley(id_match),
    FOREIGN KEY(id_stade) REFERENCES Stade(id_stade)
  )`);

  // INSERT initial
  db.run(`INSERT INTO Utilisateur 
    (prenom_utilisateur, nom_utilisateur, login_utilisateur, mdp_utilisateur, mail_utilisateur, date_naissance_utiisateur, sexe_utilisateur)
    VALUES
    ('Alban', 'Robin', 'albanr', 'admin123', 'alban.robin@gmail.com', '2004-05-12', 'M'),
    ('Emma', 'Durand', 'emmad', 'user123', 'emma.durand@gmail.com', '2002-10-22', 'F'),
    ('Lucas', 'Martin', 'lucasm', 'lucas01', 'lucas.martin@gmail.com', '1999-08-17', 'M'),
    ('Chloé', 'Petit', 'chloep', 'chloe22', 'chloe.petit@gmail.com', '2001-03-09', 'F'),
    ('Nathan', 'Dupont', 'nathand', 'nathan44', 'nathan.dupont@gmail.com', '2000-12-01', 'M'),
    ('Julie', 'Bernard', 'julieb', 'julie33', 'julie.bernard@gmail.com', '2003-06-15', 'F'),
    ('Sophie', 'Moreau', 'sophiem', 'sophie11', 'sophie.moreau@gmail.com', '1998-11-25', 'F'),
    ('Maxime', 'Lefevre', 'maxl', 'maxime77', 'maxime.lefevre@gmail.com', '2005-09-30', 'M'),
    ('Camille', 'Roux', 'camr', 'camille88', 'camille.roux@gmail.com', '2001-04-20', 'F'),
    ('Thomas', 'Garcia', 'thomg', 'thomas66', 'thomas.garcia@gmail.com', '1997-02-13', 'M')
  `);

  console.log('Base SQLite Mintonette-Cup initialisée avec toutes les tables !');
});
