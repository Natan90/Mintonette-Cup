const pool = require("./db"); 

(async () => {
  try {
    console.log("🚀 Initialisation de la base Mintonette Cup...");

    const schemaSQL = `
      CREATE TABLE IF NOT EXISTS Utilisateur(
        id_utilisateur SERIAL PRIMARY KEY,
        prenom_utilisateur VARCHAR(50),
        nom_utilisateur VARCHAR(50),
        login_utilisateur VARCHAR(200),
        mdp_utilisateur VARCHAR(200),
        mail_utilisateur VARCHAR(200),
        date_naissance_utilisateur DATE,
        sexe_utilisateur VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Type_utilisateur(
        id_utilisateur SERIAL PRIMARY KEY,
        nom_type_utilisateur VARCHAR(50),
        droit_type_utilisateur VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Organisateur(
        id_organisateur SERIAL PRIMARY KEY,
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur)
      );

      CREATE TABLE IF NOT EXISTS Club(
        id_club SERIAL PRIMARY KEY,
        nom_club VARCHAR(50),
        couleur_maillot VARCHAR(50),
        nom_mascotte VARCHAR(50),
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur)
      );

      CREATE TABLE IF NOT EXISTS Equipe(
        id_equipe SERIAL PRIMARY KEY,
        sexe_equipe VARCHAR(50),
        nb_joueurs INTEGER,
        id_club INTEGER NOT NULL REFERENCES Club(id_club)
      );

      CREATE TABLE IF NOT EXISTS Joueur(
        id_joueur SERIAL PRIMARY KEY,
        nom_joueur VARCHAR(50),
        prenom_joueur VARCHAR(50),
        sexe_joueur VARCHAR(50),
        date_naissance_joueur DATE,
        numero_joueur INTEGER,
        id_equipe INTEGER NOT NULL REFERENCES Equipe(id_equipe)
      );

      CREATE TABLE IF NOT EXISTS Aliment(
        id_aliment SERIAL PRIMARY KEY,
        nom_aliment VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Date_du_jour(
        JJ_MM_AAAA DATE PRIMARY KEY,
        hh_mm TIME
      );

      CREATE TABLE IF NOT EXISTS Type_animation(
        id_type_animation SERIAL PRIMARY KEY,
        nom_type_animation VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Agent_securite(
        id_agent_securite SERIAL PRIMARY KEY,
        nom_agent_securite VARCHAR(50),
        prenom_agent_securite VARCHAR(50),
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur)
      );

      CREATE TABLE IF NOT EXISTS Article(
        id_article SERIAL PRIMARY KEY,
        nom_article VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Zone(
        id_zone SERIAL PRIMARY KEY,
        nom_zone VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Plat(
        id_plat SERIAL PRIMARY KEY,
        nom_plat VARCHAR(50),
        description_plat VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Match_volley(
        id_match SERIAL PRIMARY KEY,
        prix_place_match NUMERIC(19,4),
        score_match VARCHAR(50),
        vainqueur_match VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Stade(
        id_stade SERIAL PRIMARY KEY,
        nom_stade VARCHAR(50),
        id_zone INTEGER NOT NULL REFERENCES Zone(id_zone)
      );

      CREATE TABLE IF NOT EXISTS Restauration(
        id_restauration SERIAL PRIMARY KEY,
        nom_restaurant VARCHAR(50),
        nb_couverts INTEGER,
        id_zone INTEGER NOT NULL REFERENCES Zone(id_zone),
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur)
      );

      CREATE TABLE IF NOT EXISTS Animation(
        id_animation SERIAL PRIMARY KEY,
        nom_animation VARCHAR(50),
        capacite_animation INTEGER,
        animation_dans_un_stade BOOLEAN,
        id_zone INTEGER NOT NULL REFERENCES Zone(id_zone),
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur),
        id_type_animation INTEGER NOT NULL REFERENCES Type_animation(id_type_animation)
      );

      CREATE TABLE IF NOT EXISTS Poste_secouriste(
        id_poste_secouriste VARCHAR(50) PRIMARY KEY,
        nb_lits_occupes INTEGER,
        nb_lits_disponibles INTEGER,
        id_zone INTEGER NOT NULL REFERENCES Zone(id_zone),
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur)
      );

      CREATE TABLE IF NOT EXISTS Boutique(
        id_boutique SERIAL PRIMARY KEY,
        nom_boutique VARCHAR(50),
        commande_disponnible BOOLEAN,
        capacite_boutique INTEGER,
        id_zone INTEGER NOT NULL REFERENCES Zone(id_zone),
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur)
      );

      CREATE TABLE IF NOT EXISTS Reservation(
        id_reservation SERIAL PRIMARY KEY,
        jour_reservation DATE,
        nb_couverts_reservation INTEGER,
        nom_reservation VARCHAR(50),
        heure_reservation TIME,
        id_restauration INTEGER NOT NULL REFERENCES Restauration(id_restauration)
      );

      CREATE TABLE IF NOT EXISTS present_dans_restaurant(
        id_restauration INTEGER,
        id_aliment INTEGER,
        stock_aliment INTEGER,
        PRIMARY KEY(id_restauration, id_aliment),
        FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
        FOREIGN KEY(id_aliment) REFERENCES Aliment(id_aliment)
      );

      CREATE TABLE IF NOT EXISTS clients_restaurant(
        id_restauration INTEGER,
        JJ_MM_AAAA DATE,
        PRIMARY KEY(id_restauration, JJ_MM_AAAA),
        FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
        FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA)
      );

      CREATE TABLE IF NOT EXISTS visiteurs_animation(
        JJ_MM_AAAA DATE,
        id_animation INTEGER,
        nb_visiteurs_animation INTEGER,
        PRIMARY KEY(JJ_MM_AAAA, id_animation),
        FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
        FOREIGN KEY(id_animation) REFERENCES Animation(id_animation)
      );

      CREATE TABLE IF NOT EXISTS present_dans_boutique(
        id_boutique INTEGER,
        id_article INTEGER,
        stock_article INTEGER,
        PRIMARY KEY(id_boutique, id_article),
        FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique),
        FOREIGN KEY(id_article) REFERENCES Article(id_article)
      );

      CREATE TABLE IF NOT EXISTS client_boutique(
        JJ_MM_AAAA DATE,
        id_boutique INTEGER,
        nb_clients_boutique INTEGER,
        PRIMARY KEY(JJ_MM_AAAA, id_boutique),
        FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
        FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique)
      );

      CREATE TABLE IF NOT EXISTS commandes_resto(
        id_restauration INTEGER,
        JJ_MM_AAAA DATE,
        id_plat INTEGER,
        PRIMARY KEY(id_restauration, JJ_MM_AAAA, id_plat),
        FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
        FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
        FOREIGN KEY(id_plat) REFERENCES Plat(id_plat)
      );

      CREATE TABLE IF NOT EXISTS article_vendu(
        id_boutique INTEGER,
        id_article INTEGER,
        nb_article_vendu INTEGER,
        PRIMARY KEY(id_boutique, id_article),
        FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique),
        FOREIGN KEY(id_article) REFERENCES Article(id_article)
      );

      CREATE TABLE IF NOT EXISTS prix_article_boutique(
        id_boutique INTEGER,
        id_article INTEGER,
        prix_article NUMERIC(19,4),
        PRIMARY KEY(id_boutique, id_article),
        FOREIGN KEY(id_boutique) REFERENCES Boutique(id_boutique),
        FOREIGN KEY(id_article) REFERENCES Article(id_article)
      );

      CREATE TABLE IF NOT EXISTS utilisateur_de_type(
        id_utilisateur INTEGER,
        id_utilisateur_1 INTEGER,
        PRIMARY KEY(id_utilisateur, id_utilisateur_1),
        FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
        FOREIGN KEY(id_utilisateur_1) REFERENCES Type_utilisateur(id_utilisateur)
      );

      CREATE TABLE IF NOT EXISTS nb_secouristes(
        JJ_MM_AAAA DATE,
        id_poste_secouriste VARCHAR(50),
        nb_secouristes_affectes INTEGER,
        PRIMARY KEY(JJ_MM_AAAA, id_poste_secouriste),
        FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
        FOREIGN KEY(id_poste_secouriste) REFERENCES Poste_secouriste(id_poste_secouriste)
      );

      CREATE TABLE IF NOT EXISTS est_affecte(
        JJ_MM_AAAA DATE,
        id_agent_securite INTEGER,
        id_zone INTEGER,
        PRIMARY KEY(JJ_MM_AAAA, id_agent_securite, id_zone),
        FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
        FOREIGN KEY(id_agent_securite) REFERENCES Agent_securite(id_agent_securite),
        FOREIGN KEY(id_zone) REFERENCES Zone(id_zone)
      );

      CREATE TABLE IF NOT EXISTS a_la_carte(
        id_restauration INTEGER,
        id_plat INTEGER,
        prix_plat NUMERIC(19,4),
        PRIMARY KEY(id_restauration, id_plat),
        FOREIGN KEY(id_restauration) REFERENCES Restauration(id_restauration),
        FOREIGN KEY(id_plat) REFERENCES Plat(id_plat)
      );

      CREATE TABLE IF NOT EXISTS a_pour_ingredient(
        id_aliment INTEGER,
        id_plat INTEGER,
        quantite VARCHAR(50),
        PRIMARY KEY(id_aliment, id_plat),
        FOREIGN KEY(id_aliment) REFERENCES Aliment(id_aliment),
        FOREIGN KEY(id_plat) REFERENCES Plat(id_plat)
      );

      CREATE TABLE IF NOT EXISTS equipe_1(
        id_equipe INTEGER,
        id_match INTEGER,
        PRIMARY KEY(id_equipe, id_match),
        FOREIGN KEY(id_equipe) REFERENCES Equipe(id_equipe),
        FOREIGN KEY(id_match) REFERENCES Match_volley(id_match)
      );

      CREATE TABLE IF NOT EXISTS equipe_2(
        id_equipe INTEGER,
        id_match INTEGER,
        PRIMARY KEY(id_equipe, id_match),
        FOREIGN KEY(id_equipe) REFERENCES Equipe(id_equipe),
        FOREIGN KEY(id_match) REFERENCES Match_volley(id_match)
      );

      CREATE TABLE IF NOT EXISTS prend_une_place(
        id_utilisateur INTEGER,
        id_match INTEGER,
        PRIMARY KEY(id_utilisateur, id_match),
        FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
        FOREIGN KEY(id_match) REFERENCES Match_volley(id_match)
      );

      CREATE TABLE IF NOT EXISTS a_lieu(
        JJ_MM_AAAA DATE,
        id_match INTEGER,
        id_stade INTEGER,
        PRIMARY KEY(JJ_MM_AAAA, id_match, id_stade),
        FOREIGN KEY(JJ_MM_AAAA) REFERENCES Date_du_jour(JJ_MM_AAAA),
        FOREIGN KEY(id_match) REFERENCES Match_volley(id_match),
        FOREIGN KEY(id_stade) REFERENCES Stade(id_stade)
      );
    `;

    await pool.query(schemaSQL);

    const insertUsers = `
      INSERT INTO Utilisateur 
        (prenom_utilisateur, nom_utilisateur, login_utilisateur, mdp_utilisateur, mail_utilisateur, date_naissance_utilisateur, sexe_utilisateur)
      VALUES
        ('Alban', 'Robin', 'albanr', 'admin123', 'alban.robin@gmail.com', '2004-05-12', 'M'),
        ('Emma', 'Durand', 'emmad', 'user123', 'emma.durand@gmail.com', '2002-10-22', 'F'),
        ('Lucas', 'Martin', 'lucasm', 'lucas01', 'lucas.martin@gmail.com', '1999-08-17', 'M'),
        ('Chloe', 'Petit', 'chloep', 'chloe22', 'chloe.petit@gmail.com', '2001-03-09', 'F'),
        ('Nathan', 'Dupont', 'nathand', 'nathan44', 'nathan.dupont@gmail.com', '2000-12-01', 'M'),
        ('Julie', 'Bernard', 'julieb', 'julie33', 'julie.bernard@gmail.com', '2003-06-15', 'F'),
        ('Sophie', 'Moreau', 'sophiem', 'sophie11', 'sophie.moreau@gmail.com', '1998-11-25', 'F'),
        ('Maxime', 'Lefevre', 'maxl', 'maxime77', 'maxime.lefevre@gmail.com', '2005-09-30', 'M'),
        ('Camille', 'Roux', 'camr', 'camille88', 'camille.roux@gmail.com', '2001-04-20', 'F'),
        ('Thomas', 'Garcia', 'thomg', 'thomas66', 'thomas.garcia@gmail.com', '1997-02-13', 'M')
      ON CONFLICT DO NOTHING;
    `;
    await pool.query(insertUsers);

    console.log("Base PostgreSQL Mintonette Cup initialisée !");
  } catch (err) {
    console.error("Erreur lors de l’initialisation :", err);
  } finally {
    await pool.end();

    console.log("Connexion PostgreSQL fermée.");
  }
})();
