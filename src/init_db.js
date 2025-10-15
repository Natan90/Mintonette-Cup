const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mintonette_cup.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {

  db.run("PRAGMA foreign_keys = ON;");

  db.run(`CREATE TABLE IF NOT EXISTS Utilisateur(
    id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom_utilisateur TEXT,
    nom_utilisateur TEXT,
    login_utilisateur TEXT,
    mdp_utilisateur TEXT,
    mail_utilisateur TEXT,
    date_naissance_utilisateur DATE,
    sexe_utilisateur TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Type_utilisateur(
    id_type_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_type_utilisateur TEXT,
    droit_type_utilisateur TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Organisateur(
    id_organisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    id_utilisateur INTEGER NOT NULL,
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Club(
    id_club INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_club TEXT,
    couleur_maillot TEXT,
    nom_mascotte TEXT,
    id_utilisateur INTEGER NOT NULL,
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Equipe(
    id_equipe INTEGER PRIMARY KEY AUTOINCREMENT,
    sexe_equipe TEXT,
    nb_joueurs INTEGER,
    id_club INTEGER NOT NULL,
    FOREIGN KEY(id_club) REFERENCES Club(id_club)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Joueur(
    id_joueur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_joueur TEXT,
    prenom_joueur TEXT,
    sexe_joueur TEXT,
    date_naissance_joueur DATE,
    numero_joueur INTEGER,
    id_equipe INTEGER NOT NULL,
    FOREIGN KEY(id_equipe) REFERENCES Equipe(id_equipe)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Aliment(
    id_aliment INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_aliment TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Date_du_jour(
    JJ_MM_AAAA DATE PRIMARY KEY,
    hh_mm TIME
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Type_animation(
    id_type_animation INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_type_animation TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Agent_securite(
    id_agent_securite INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_agent_securite TEXT,
    prenom_agent_securite TEXT,
    id_utilisateur INTEGER NOT NULL,
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Article(
    id_article INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_article TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Zone(
    id_zone INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_zone TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Plat(
    id_plat INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_plat TEXT,
    description_plat TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Match_volley(
    id_match INTEGER PRIMARY KEY AUTOINCREMENT,
    prix_place_match REAL,
    score_match TEXT,
    vainqueur_match TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Stade(
    id_stade INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_stade TEXT,
    id_zone INTEGER NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Restauration(
    id_restauration INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_restaurant TEXT,
    nb_couverts INTEGER,
    id_zone INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Animation(
    id_animation INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_animation TEXT,
    capacite_animation INTEGER,
    animation_dans_un_stade BOOLEAN,
    id_zone INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    id_type_animation INTEGER NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY(id_type_animation) REFERENCES Type_animation(id_type_animation)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Poste_secouriste(
    id_poste_secouriste TEXT PRIMARY KEY,
    nb_lits_occupes INTEGER,
    nb_lits_disponibles INTEGER,
    id_zone INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Boutique(
    id_boutique INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_boutique TEXT,
    commande_disponible BOOLEAN,
    capacite_boutique INTEGER,
    id_zone INTEGER NOT NULL,
    id_utilisateur INTEGER NOT NULL,
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Reservation(
    id_reservation INTEGER PRIMARY KEY AUTOINCREMENT,
    jour_reservation DATE,
    nb_couverts_reservation INTEGER,
    nom_reservation TEXT,
    heure_reservation TIME,
    id_restauration INTEGER NOT NULL,
    FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS present_dans_restaurant(
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

  db.run(`CREATE TABLE IF NOT EXISTS present_dans_boutique(
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
    prix_article REAL,
    PRIMARY KEY(id_boutique, id_article),
    FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique),
    FOREIGN KEY(id_article) REFERENCES Article(id_article)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS utilisateur_de_type(
    id_utilisateur INTEGER,
    id_type_utilisateur INTEGER,
    PRIMARY KEY(id_utilisateur, id_type_utilisateur),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY(id_type_utilisateur) REFERENCES Type_utilisateur(id_type_utilisateur)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS nb_secouristes(
    JJ_MM_AAAA DATE,
    id_poste_secouriste TEXT,
    nb_secouristes_affectes INTEGER,
    PRIMARY KEY(JJ_MM_AAAA, id_poste_secouriste),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_poste_secouriste) REFERENCES Poste_secouriste(id_poste_secouriste)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS est_affecte(
    JJ_MM_AAAA DATE,
    id_agent_securite INTEGER,
    id_zone INTEGER,
    PRIMARY KEY(JJ_MM_AAAA, id_agent_securite, id_zone),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_agent_securite) REFERENCES Agent_securite(id_agent_securite),
    FOREIGN KEY(id_zone) REFERENCES Zone(id_zone)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS a_la_carte(
    id_restauration INTEGER,
    id_plat INTEGER,
    prix_plat REAL,
    PRIMARY KEY(id_restauration, id_plat),
    FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
    FOREIGN KEY(id_plat) REFERENCES Plat(id_plat)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS a_pour_ingredient(
    id_aliment INTEGER,
    id_plat INTEGER,
    quantite TEXT,
    PRIMARY KEY(id_aliment, id_plat),
    FOREIGN KEY(id_aliment) REFERENCES Aliment(id_aliment),
    FOREIGN KEY(id_plat) REFERENCES Plat(id_plat)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS equipe_1(
    id_equipe INTEGER,
    id_match INTEGER,
    PRIMARY KEY(id_equipe, id_match),
    FOREIGN KEY(id_equipe) REFERENCES Equipe(id_equipe),
    FOREIGN KEY(id_match) REFERENCES Match_volley(id_match)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS equipe_2(
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

  db.run(`CREATE TABLE IF NOT EXISTS a_lieu(
    JJ_MM_AAAA DATE,
    id_match INTEGER,
    id_stade INTEGER,
    PRIMARY KEY(JJ_MM_AAAA, id_match, id_stade),
    FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
    FOREIGN KEY(id_match) REFERENCES Match_volley(id_match),
    FOREIGN KEY(id_stade) REFERENCES Stade(id_stade)
  )`);

});

console.log('✅ Base SQLite Mintonette-Cup initialisée avec toutes les tables !');

