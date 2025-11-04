const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mintonette_cup.sqlite');
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
    id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom_utilisateur VARCHAR(50),
    nom_utilisateur VARCHAR(50),
    login_utilisateur VARCHAR(200),
    mdp_utilisateur VARCHAR(200),
    mail_utilisateur VARCHAR(200),
    date_naissance_utilisateur DATE,
    sexe_utilisateur VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Type_utilisateur(
    id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_type_utilisateur VARCHAR(50),
    droit_type_utilisateur VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Organisateur(
    id_organisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    id_utilisateur INTEGER NOT NULL,
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Club(
    id_club INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_club VARCHAR(50),
    couleur_maillot VARCHAR(50),
    nom_mascotte VARCHAR(50),
    id_utilisateur INTEGER NOT NULL,
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Equipe(
    id_equipe INTEGER PRIMARY KEY AUTOINCREMENT,
    sexe_equipe VARCHAR(50),
    nb_joueurs INTEGER,
    id_club INTEGER NOT NULL,
    FOREIGN KEY(id_club) REFERENCES Club(id_club)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Joueur(
    id_joueur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_joueur VARCHAR(50),
    prenom_joueur VARCHAR(50),
    sexe_joueur VARCHAR(50),
    date_naissance_joueur DATE,
    numero_joueur INTEGER,
    id_equipe INTEGER NOT NULL,
    FOREIGN KEY(id_equipe) REFERENCES Equipe(id_equipe)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Aliment(
    id_aliment INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_aliment VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Date_du_jour(
    JJ_MM_AAAA DATE PRIMARY KEY,
    hh_mm TIME
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Type_animation(
    id_type_animation INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_type_animation VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Agent_securité(
    id_agent_securité INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_agent_securité VARCHAR(50),
    prenom_agent_securité VARCHAR(50),
    id_utilisateur INTEGER NOT NULL,
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Article(
    id_article INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_article VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Zone(
    id_zone INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_zone VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Plat(
    id_plat INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_plat VARCHAR(50),
    description_plat VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Match_volley(
    id_match INTEGER PRIMARY KEY AUTOINCREMENT,
    prix_place_match DECIMAL(19,4),
    score_match VARCHAR(50),
    vainqueur_match VARCHAR(50)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Stade(
    id_stade INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_stade VARCHAR(50),
    id_zone INTEGER NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Restauration(
    id_restauration INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_restaurant VARCHAR(50),
    nb_couverts INTEGER,
    id_zone INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Animation(
    id_animation INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_animation VARCHAR(50),
    capacité_animation INTEGER,
    animation_dans_un_stade BOOLEAN,
    id_zone INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    id_type_animation INTEGER NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY(id_type_animation) REFERENCES Type_animation(id_type_animation)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Poste_secouriste(
    id_poste_secouriste VARCHAR(50) PRIMARY KEY,
    nb_lits_occupés INTEGER,
    nb_lits_disponibles INTEGER,
    id_zone INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Boutique(
    id_boutique INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_boutique VARCHAR(50),
    commande_disponnible BOOLEAN,
    capacité_boutique INTEGER,
    id_zone INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Reservation(
    id_reservation INTEGER PRIMARY KEY AUTOINCREMENT,
    jour_reservation DATE,
    nb_couverts_reservation INTEGER,
    nom_reservation VARCHAR(50),
    heure_reservation TIME,
    id_restauration INTEGER NOT NULL,
    FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS présent_dans_restaurant(
    id_restauration INTEGER,
    id_aliment INTEGER,
    stock_aliment INTEGER,
    PRIMARY KEY(id_restauration, id_aliment),
    FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
    FOREIGN KEY(id_aliment) REFERENCES Aliment(id_aliment)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS clients_restaurant(
    id_restauration INTEGER,
    JJ_MM_AAAA DATE,
    PRIMARY KEY(id_restauration, JJ_MM_AAAA),
    FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS visiteurs_animation(
    JJ_MM_AAAA DATE,
    id_animation INTEGER,
    nb_visiteurs_animation INTEGER,
    PRIMARY KEY(JJ_MM_AAAA, id_animation),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_animation) REFERENCES Animation(id_animation)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS présent_dans_boutique(
    id_boutique INTEGER,
    id_article INTEGER,
    stock_article INTEGER,
    PRIMARY KEY(id_boutique, id_article),
    FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique),
    FOREIGN KEY(id_article) REFERENCES Article(id_article)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS client_boutique(
    JJ_MM_AAAA DATE,
    id_boutique INTEGER,
    nb_clients_boutique INTEGER,
    PRIMARY KEY(JJ_MM_AAAA, id_boutique),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS commandes_resto(
    id_restauration INTEGER,
    JJ_MM_AAAA DATE,
    id_plat INTEGER,
    PRIMARY KEY(id_restauration, JJ_MM_AAAA, id_plat),
    FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_plat) REFERENCES Plat(id_plat)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS article_vendu(
    id_boutique INTEGER,
    id_article INTEGER,
    nb_article_vendu INTEGER,
    PRIMARY KEY(id_boutique, id_article),
    FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique),
    FOREIGN KEY(id_article) REFERENCES Article(id_article)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS prix_article_boutique(
    id_boutique INTEGER,
    id_article INTEGER,
    prix_article DECIMAL(19,4),
    PRIMARY KEY(id_boutique, id_article),
    FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique),
    FOREIGN KEY(id_article) REFERENCES Article(id_article)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS utilisateur_de_type(
    id_utilisateur INTEGER,
    id_utilisateur_1 INTEGER,
    PRIMARY KEY(id_utilisateur, id_utilisateur_1),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY(id_utilisateur_1) REFERENCES Type_utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS nb_secouristes(
    JJ_MM_AAAA DATE,
    id_poste_secouriste VARCHAR(50),
    nb_secouristes_affectés INTEGER,
    PRIMARY KEY(JJ_MM_AAAA, id_poste_secouriste),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_poste_secouriste) REFERENCES Poste_secouriste(id_poste_secouriste)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS est_affecté(
    JJ_MM_AAAA DATE,
    id_agent_securité INTEGER,
    id_zone INTEGER,
    PRIMARY KEY(JJ_MM_AAAA, id_agent_securité, id_zone),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_agent_securité) REFERENCES Agent_securité(id_agent_securité),
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS à_la_carte(
    id_restauration INTEGER,
    id_plat INTEGER,
    prix_plat DECIMAL(19,4),
    PRIMARY KEY(id_restauration, id_plat),
    FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
    FOREIGN KEY(id_plat) REFERENCES Plat(id_plat)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS à_pour_ingrédient(
    id_aliment INTEGER,
    id_plat INTEGER,
    quantité VARCHAR(50),
    PRIMARY KEY(id_aliment, id_plat),
    FOREIGN KEY(id_aliment) REFERENCES Aliment(id_aliment),
    FOREIGN KEY(id_plat) REFERENCES Plat(id_plat)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS équipe_1(
    id_equipe INTEGER,
    id_match INTEGER,
    PRIMARY KEY(id_equipe, id_match),
    FOREIGN KEY(id_equipe) REFERENCES Equipe(id_equipe),
    FOREIGN KEY(id_match) REFERENCES Match_volley(id_match)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS équipe_2(
    id_equipe INTEGER,
    id_match INTEGER,
    PRIMARY KEY(id_equipe, id_match),
    FOREIGN KEY(id_equipe) REFERENCES Equipe(id_equipe),
    FOREIGN KEY(id_match) REFERENCES Match_volley(id_match)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS prend_une_place(
    id_utilisateur INTEGER,
    id_match INTEGER,
    PRIMARY KEY(id_utilisateur, id_match),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY(id_match) REFERENCES Match_volley(id_match)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS à_lieu(
    JJ_MM_AAAA DATE,
    id_match INTEGER,
    id_stade INTEGER,
    PRIMARY KEY(JJ_MM_AAAA, id_match, id_stade),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_match) REFERENCES Match_volley(id_match),
    FOREIGN KEY(id_stade) REFERENCES Stade(id_stade)
  )`);

  
  db.run(`INSERT INTO Utilisateur 
    (prenom_utilisateur, nom_utilisateur, login_utilisateur, mdp_utilisateur, mail_utilisateur, date_naissance_utilisateur, sexe_utilisateur)
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
