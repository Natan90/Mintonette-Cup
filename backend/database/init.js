const pool = require("./db");

(async () => {
  try {
    console.log("🚀 Initialisation de la base Mintonette Cup...");

    const schemaSQL = `
      DROP TABLE IF EXISTS a_lieu CASCADE;
      DROP TABLE IF EXISTS prend_une_place CASCADE;
      DROP TABLE IF EXISTS equipe_2 CASCADE;
      DROP TABLE IF EXISTS equipe_1 CASCADE;
      DROP TABLE IF EXISTS a_pour_ingredient CASCADE;
      DROP TABLE IF EXISTS a_la_carte CASCADE;
      DROP TABLE IF EXISTS est_affecte CASCADE;
      DROP TABLE IF EXISTS nb_secouristes CASCADE;
      DROP TABLE IF EXISTS utilisateur_de_type CASCADE;
      DROP TABLE IF EXISTS prix_article_boutique CASCADE;
      DROP TABLE IF EXISTS article_vendu CASCADE;
      DROP TABLE IF EXISTS commandes_resto CASCADE;
      DROP TABLE IF EXISTS client_boutique CASCADE;
      DROP TABLE IF EXISTS present_dans_boutique CASCADE;
      DROP TABLE IF EXISTS visiteurs_animation CASCADE;
      DROP TABLE IF EXISTS clients_restaurant CASCADE;
      DROP TABLE IF EXISTS present_dans_restaurant CASCADE;
      DROP TABLE IF EXISTS Reservation CASCADE;
      DROP TABLE IF EXISTS Boutique CASCADE;
      DROP TABLE IF EXISTS Poste_secouriste CASCADE;
      DROP TABLE IF EXISTS Animation CASCADE;
      DROP TABLE IF EXISTS Restauration CASCADE;
      DROP TABLE IF EXISTS Stade CASCADE;
      DROP TABLE IF EXISTS Match_volley CASCADE;
      DROP TABLE IF EXISTS Plat CASCADE;
      DROP TABLE IF EXISTS Zone CASCADE;
      DROP TABLE IF EXISTS Article CASCADE;
      DROP TABLE IF EXISTS Agent_securite CASCADE;
      DROP TABLE IF EXISTS Type_boutique CASCADE;
      DROP TABLE IF EXISTS Type_restauration CASCADE;
      DROP TABLE IF EXISTS Type_animation CASCADE;
      DROP TABLE IF EXISTS Date_du_jour CASCADE;
      DROP TABLE IF EXISTS Aliment CASCADE;
      DROP TABLE IF EXISTS ClassementPoule CASCADE;
      DROP TABLE IF EXISTS Joueur CASCADE;
      DROP TABLE IF EXISTS Equipe CASCADE;
      DROP TABLE IF EXISTS Pays CASCADE;
      DROP TABLE IF EXISTS Organisateur CASCADE;
      DROP TABLE IF EXISTS Prestataire CASCADE;
      DROP TABLE IF EXISTS Type_prestataire CASCADE;
      DROP TABLE IF EXISTS Type_utilisateur CASCADE;
      DROP TABLE IF EXISTS Siege CASCADE;
      DROP TABLE IF EXISTS Utilisateur CASCADE;


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

      CREATE TABLE IF NOT EXISTS Siege(
      numero_colonne VARCHAR(2) ,
      numero_ligne INTEGER ,
      est_reserve BOOLEAN DEFAULT FALSE, 
      zone VARCHAR(20),
      id_utilisateur INTEGER,
      PRIMARY KEY (numero_colonne, numero_ligne, zone),
      FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
      );

      CREATE TABLE IF NOT EXISTS Type_utilisateur(
        id_utilisateur SERIAL PRIMARY KEY,
        nom_type_utilisateur VARCHAR(50),
        droit_type_utilisateur VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Zone(
        id_zone SERIAL PRIMARY KEY,
        nom_zone VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Date_du_jour(
        JJ_MM_AAAA DATE PRIMARY KEY,
        hh_mm TIME
      );

      CREATE TABLE IF NOT EXISTS Type_animation(
        id_type_animation SERIAL PRIMARY KEY,
        nom_type_animation VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Type_boutique(
        id_type_boutique SERIAL PRIMARY KEY,
        nom_type_boutique VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Type_restauration(
        id_type_restauration SERIAL PRIMARY KEY,
        nom_type_restauration VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Type_prestataire(
        id_type_prestataire SERIAL PRIMARY KEY,
        nom_type_prestataire VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Prestataire(
        id_prestataire SERIAL PRIMARY KEY,
        nom_prestataire VARCHAR(50),
        type_prestataire_id INTEGER NOT NULL REFERENCES Type_prestataire(id_type_prestataire)
      );

      CREATE TABLE IF NOT EXISTS Aliment(
        id_aliment SERIAL PRIMARY KEY,
        nom_aliment VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS Article(
        id_article SERIAL PRIMARY KEY,
        nom_article VARCHAR(50)
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

      CREATE TABLE IF NOT EXISTS Pays(
        id_pays SERIAL PRIMARY KEY,
        nom_pays VARCHAR(50),
        couleur_maillot VARCHAR(50),
        nom_mascotte VARCHAR(50),
        qualifie BOOLEAN,
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur)
      );

      CREATE TABLE IF NOT EXISTS Equipe(
        id_equipe SERIAL PRIMARY KEY,
        sexe_equipe VARCHAR(50),
        nb_joueurs INTEGER,
        id_pays INTEGER NOT NULL REFERENCES Pays(id_pays)
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

      CREATE TABLE IF NOT EXISTS ClassementPoule (
        id_classement SERIAL PRIMARY KEY,
        id_equipe INTEGER NOT NULL REFERENCES Equipe(id_equipe),
        poule CHAR(1) NOT NULL,
        matchs_joues INTEGER,
        victoires INTEGER,
        defaites INTEGER,
        points INTEGER,
        sets_gagnes INTEGER,
        sets_perdus INTEGER,
        points_pour INTEGER,
        points_contre INTEGER,
        qualifie BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS Stade(
        id_stade SERIAL PRIMARY KEY,
        nom_stade VARCHAR(50),
        id_zone INTEGER NOT NULL REFERENCES Zone(id_zone)
      );

      CREATE TABLE IF NOT EXISTS Restauration(
        id_restauration SERIAL PRIMARY KEY,
        nom_restaurant VARCHAR(50),
        nb_tables INTEGER,
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

      CREATE TABLE IF NOT EXISTS Animation(
        id_animation SERIAL PRIMARY KEY,
        nom_animation VARCHAR(50),
        capacite_animation INTEGER,
        animation_dans_un_stade BOOLEAN,
        id_zone INTEGER NOT NULL REFERENCES Zone(id_zone),
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur),
        id_type_animation INTEGER NOT NULL REFERENCES Type_animation(id_type_animation)
      );

      CREATE TABLE IF NOT EXISTS Boutique(
        id_boutique SERIAL PRIMARY KEY,
        nom_boutique VARCHAR(50),
        commande_disponnible BOOLEAN,
        capacite_boutique INTEGER,
        id_zone INTEGER NOT NULL REFERENCES Zone(id_zone),
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur),
        id_type_boutique INTEGER NOT NULL REFERENCES Type_boutique(id_type_boutique)
      );

      CREATE TABLE IF NOT EXISTS Poste_secouriste(
        id_poste_secouriste VARCHAR(50) PRIMARY KEY,
        nb_lits_occupes INTEGER,
        nb_lits_disponibles INTEGER,
        id_zone INTEGER NOT NULL REFERENCES Zone(id_zone),
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur)
      );

      CREATE TABLE IF NOT EXISTS Agent_securite(
        id_agent_securite SERIAL PRIMARY KEY,
        nom_agent_securite VARCHAR(50),
        prenom_agent_securite VARCHAR(50),
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur)
      );

      CREATE TABLE IF NOT EXISTS Organisateur(
        id_organisateur SERIAL PRIMARY KEY,
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur)
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
        ('Thomas', 'Garcia', 'thomg', 'thomas66', 'thomas.garcia@gmail.com', '1997-02-13', 'M');
    `;
    await pool.query(insertUsers);

    const insertTypeAnimation = `
    INSERT INTO Type_animation (nom_type_animation) VALUES
      ('Animation musicale'),
      ('Show artistique'),
      ('Animation public'),
      ('Animation sportive'),
      ('Animation festive'),
      ('Média / Photo / Vidéo'),
      ('Technique / Son & lumière')  
    `;
    await pool.query(insertTypeAnimation);

    const insertTypeRestauration = `
    INSERT INTO Type_restauration (nom_type_restauration) VALUES
      ('Restauration chaude'),
      ('Restauration saine / végétarienne / vegan'),
      ('Boissons et rafraîchissements'),
      ('Desserts et gourmandises'),
      ('Food trucks / street food')
    `
    await pool.query(insertTypeRestauration);

    const insertTypeBoutique = `
    INSERT INTO Type_boutique (nom_type_boutique) VALUES
      ('Vêtements et accessoires'),
      ('Objets et souvenirs'),
      ('Livres et supports média'),
      ('Articles créatifs / personnalisables')
    `
    await pool.query(insertTypeBoutique);

    const insertTypePrestataire = `
    INSERT INTO Type_prestataire (nom_type_prestataire) VALUES
      ('Restauration'),
      ('Animation'),
      ('Equipe'),
      ('Boutique');
    `;
    await pool.query(insertTypePrestataire);

    const insertPrestataire = `
    INSERT INTO Prestataire (nom_prestataire, type_prestataire_id) VALUES
      ('FoodExpress', 1),
      ('AnimEvent', 2),
      ('SportMerch', 4);
    `;
    await pool.query(insertPrestataire);

    const insertPays = `
    INSERT INTO Pays (nom_pays, couleur_maillot, nom_mascotte, qualifie, id_utilisateur) VALUES
    ('France', 'Bleu / Blanc', 'José le portemanteau', true, 1),
    ('Allemagne', 'Noir / Rouge', 'Adler', true, 1),
    ('Argentine', 'Bleu ciel / Blanc', 'El Cóndor', true, 1),
    ('Italie', 'Bleu (Azzurro)', 'Il Leone Azzurro', true, 1),
    ('Canada', 'Rouge / Blanc', 'Maple Leaf', true, 1),
    ('Bulgarie', 'Vert / Blanc', 'Le Lion Vert', true, 1),
    ('Brésil', 'Jaune / Vert', 'Curupira', true, 1),
    ('Cuba', 'Rouge / Bleu', 'Le Taureau Cubain', true, 1),
    ('États-Unis', 'Bleu marine / Rouge', 'Stars & Stripes Eagle', true, 1),
    ('Slovénie', 'Bleu‑clair / Blanc', 'Le Lynx Slovène', true, 1),
    ('Iran', 'Vert / Blanc', 'Le Lion Perse', true, 1),
    ('Ukraine', 'Bleu / Jaune', 'L’Ourson Bleu‑Jaune', true, 1),
    ('Chine', 'Rouge / Jaune', 'Le Dragon Rouge', true, 1),
    ('Japon', 'Blanc / Rouge', 'Le Samouraï Rouge', true, 1),
    ('Pologne', 'Blanc / Rouge', 'La Bête Blanche', true, 1),
    ('Serbie', 'Bleu / Rouge', 'Le Faucon Serbe', true, 1),
    ('Pays‑Bas', 'Orange', 'Le Lion Orange', true, 1),
    ('Turquie', 'Rouge / Blanc', 'Le Croissant Rouge', false, 1),
    ('Belgique', 'Noir / Jaune', 'Le Tricolore', false, 1),
    ('Espagne', 'Rouge / Jaune', 'Le Taureau Furia', false, 1),
    ('Angleterre', 'Blanc / Bleu', 'Le Lion Britannique', false, 1),
    ('Thaïlande', 'Bleu / Rouge', 'Le Garuda Bleu', false, 1),
    ('Kazakhstan', 'Bleu ciel / Jaune', 'L’Aigle d’Or', false, 1),
    ('Corée du Sud', 'Blanc / Rouge', 'Le Tigre Blanc', false, 1),
    ('Australie', 'Vert / Or', 'Le Kangourou Vert', false, 1),
    ('Paraguay', 'Rouge / Blanc', 'Le Guarani Rouge', false, 1),
    ('Uruguay', 'Bleu ciel / Blanc', 'Le Carrousel Bleu', false, 1),
    ('Afrique du Sud', 'Vert / Or', 'Le Springbok Jaune‑Vert', false, 1),
    ('Maroc', 'Rouge / Vert', 'Le Lion de l’Atlas', false, 1),
    ('Arabie Saoudite', 'Vert / Blanc', 'Le Faucon Saoudien', false, 1),
    ('Tunisie', 'Rouge / Blanc', 'Le Scorpion Rouge', false, 1),
    ('Saint‑Marin', 'Bleu / Blanc', 'Le Gardien du Roc', false, 1);
    `;

    await pool.query(insertPays);

    const insertEquipes = `
    INSERT INTO Equipe (sexe_equipe, nb_joueurs, id_pays) VALUES
    ('Homme', 12, 1),  -- France
    ('Homme', 12, 2),  -- Allemagne
    ('Homme', 12, 3),  -- Argentine
    ('Homme', 12, 4),  -- Italie
    ('Homme', 12, 5),  -- Canada
    ('Homme', 12, 6),  -- Bulgarie
    ('Homme', 12, 7),  -- Brésil
    ('Homme', 12, 8),  -- Cuba
    ('Homme', 12, 9),  -- États-Unis
    ('Homme', 12, 10), -- Slovénie
    ('Homme', 12, 11), -- Iran
    ('Homme', 12, 12), -- Ukraine
    ('Homme', 12, 13), -- Chine
    ('Homme', 12, 14), -- Japon
    ('Homme', 12, 15), -- Pologne
    ('Homme', 12, 16), -- Serbie
    ('Homme', 12, 17), -- Pays-Bas
    ('Homme', 12, 18), -- Turquie
    ('Homme', 12, 19), -- Belgique
    ('Homme', 12, 20), -- Espagne
    ('Homme', 12, 21), -- Angleterre
    ('Homme', 12, 22), -- Thaïlande
    ('Homme', 12, 23), -- Kazakhstan
    ('Homme', 12, 24), -- Corée du Sud
    ('Homme', 12, 25), -- Australie
    ('Homme', 12, 26), -- Paraguay
    ('Homme', 12, 27), -- Uruguay
    ('Homme', 12, 28), -- Afrique du Sud
    ('Homme', 12, 29), -- Maroc
    ('Homme', 12, 30), -- Arabie Saoudite
    ('Homme', 12, 31), -- Tunisie
    ('Homme', 12, 32), -- Saint Marin
    ('Femme', 12, 1),  -- France
    ('Femme', 12, 2),  -- Allemagne
    ('Femme', 12, 3),  -- Argentine
    ('Femme', 12, 4),  -- Italie
    ('Femme', 12, 5),  -- Canada
    ('Femme', 12, 6),  -- Bulgarie
    ('Femme', 12, 7),  -- Brésil
    ('Femme', 12, 8),  -- Cuba
    ('Femme', 12, 9),  -- États-Unis
    ('Femme', 12, 10), -- Slovénie
    ('Femme', 12, 11), -- Iran
    ('Femme', 12, 12), -- Ukraine
    ('Femme', 12, 13), -- Chine
    ('Femme', 12, 14), -- Japon
    ('Femme', 12, 15), -- Pologne
    ('Femme', 12, 16), -- Serbie
    ('Femme', 12, 17), -- Pays-Bas
    ('Femme', 12, 18), -- Turquie
    ('Femme', 12, 19), -- Belgique
    ('Femme', 12, 20), -- Espagne
    ('Femme', 12, 21), -- Angleterre
    ('Femme', 12, 22), -- Thaïlande
    ('Femme', 12, 23), -- Kazakhstan
    ('Femme', 12, 24), -- Corée du Sud
    ('Femme', 12, 25), -- Australie
    ('Femme', 12, 26), -- Paraguay
    ('Femme', 12, 27), -- Uruguay
    ('Femme', 12, 28), -- Afrique du Sud
    ('Femme', 12, 29), -- Maroc
    ('Femme', 12, 30), -- Arabie Saoudite
    ('Femme', 12, 31), -- Tunisie
    ('Femme', 12, 32); -- Saint Marin
    `;

    await pool.query(insertEquipes);

    const insertClassementPoule = `
    INSERT INTO ClassementPoule
    (id_equipe, poule, matchs_joues, victoires, defaites, points, sets_gagnes, sets_perdus, points_pour, points_contre, qualifie)
    VALUES
    -- Poule A
    (1, 'A', 6, 4, 2, 10, 14, 6, 300, 240, TRUE),
    (2, 'A', 6, 3, 3, 6, 10, 12, 280, 290, TRUE),
    (23, 'A', 6, 2, 4, 2, 4, 16, 220, 300, FALSE),
    (26, 'A', 6, 1, 5, -2, 2, 12, 200, 260, FALSE),
    -- Poule B
    (14, 'B', 6, 4, 2, 10, 18, 4, 320, 240, TRUE),
    (8, 'B', 6, 4, 2, 10, 14, 8, 300, 260, TRUE),
    (29, 'B', 6, 2, 4, 2, 10, 14, 280, 290, FALSE),
    (32, 'B', 6, 0, 6, -6, 4, 14, 240, 320, FALSE),
    -- Poule C
    (7, 'C', 6, 6, 0, 18, 16, 2, 310, 230, TRUE),
    (16, 'C', 6, 4, 2, 10, 12, 6, 290, 250, TRUE),
    (19, 'C', 6, 2, 4, 2, 8, 14, 260, 280, FALSE),
    (31, 'C', 6, 0, 6, -6, 4, 14, 240, 310, FALSE),
    -- Poule D
    (3, 'D', 6, 6, 0, 18, 18, 4, 320, 240, TRUE),
    (6, 'D', 6, 4, 2, 10, 14, 8, 300, 260, TRUE),
    (17, 'D', 6, 2, 4, 2, 10, 14, 280, 290, FALSE),
    (25, 'D', 6, 0, 6, -6, 4, 16, 240, 320, FALSE),
    -- Poule E
    (4, 'E', 6, 6, 0, 18, 18, 4, 320, 240, TRUE),
    (12, 'E', 6, 4, 2, 10, 14, 8, 300, 260, TRUE),
    (22, 'E', 6, 2, 4, 2, 10, 14, 280, 290, FALSE),
    (28, 'E', 6, 0, 6, -6, 4, 16, 240, 320, FALSE),
    -- Poule F
    (10, 'F', 6, 6, 0, 18, 18, 4, 320, 240, TRUE),
    (18, 'F', 6, 4, 2, 10, 14, 8, 300, 260, TRUE),
    (21, 'F', 6, 2, 4, 2, 10, 14, 280, 290, FALSE),
    (27, 'F', 6, 0, 6, -6, 4, 16, 240, 320, FALSE),
    -- Poule G
    (15, 'G', 6, 6, 0, 18, 18, 4, 320, 240, TRUE),
    (9, 'G', 6, 4, 2, 10, 14, 8, 300, 260, TRUE),
    (13, 'G', 6, 2, 4, 2, 10, 14, 280, 290, FALSE),
    (30, 'G', 6, 0, 6, -6, 4, 16, 240, 320, FALSE),
    -- Poule H
    (5, 'H', 6, 6, 0, 18, 18, 4, 320, 240, TRUE),
    (11, 'H', 6, 4, 2, 10, 14, 8, 300, 260, TRUE),
    (20, 'H', 6, 2, 4, 2, 10, 14, 280, 290, FALSE),
    (24, 'H', 6, 0, 6, -6, 4, 16, 240, 320, FALSE);
    `;

    await pool.query(insertClassementPoule);

    const insertSiege = `
    INSERT INTO Siege (numero_colonne, numero_ligne, est_reserve, id_utilisateur, zone) VALUES
    ('A', 1, TRUE, NULL, 'NORD'), ('A', 2, TRUE, NULL, 'NORD'), ('A', 3, TRUE, NULL, 'NORD'), ('A', 4, FALSE, NULL, 'NORD'),
    ('A', 5, FALSE, NULL, 'NORD'), ('A', 6, FALSE, NULL, 'NORD'), ('A', 7, FALSE, NULL, 'NORD'), ('A', 8, FALSE, NULL, 'NORD'),
    ('A', 9, FALSE, NULL, 'NORD'), ('A', 10, FALSE, NULL, 'NORD'), ('A', 11, FALSE, NULL, 'NORD'), ('A', 12, FALSE, NULL, 'NORD'),

    ('B', 1, FALSE, NULL, 'NORD'), ('B', 2, FALSE, NULL, 'NORD'), ('B', 3, FALSE, NULL, 'NORD'), ('B', 4, FALSE, NULL, 'NORD'),
    ('B', 5, FALSE, NULL, 'NORD'), ('B', 6, FALSE, NULL, 'NORD'), ('B', 7, FALSE, NULL, 'NORD'), ('B', 8, FALSE, NULL, 'NORD'),
    ('B', 9, FALSE, NULL, 'NORD'), ('B', 10, FALSE, NULL, 'NORD'), ('B', 11, FALSE, NULL, 'NORD'), ('B', 12, FALSE, NULL, 'NORD'),

    ('C', 1, FALSE, NULL, 'NORD'), ('C', 2, FALSE, NULL, 'NORD'), ('C', 3, FALSE, NULL, 'NORD'), ('C', 4, FALSE, NULL, 'NORD'),
    ('C', 5, FALSE, NULL, 'NORD'), ('C', 6, FALSE, NULL, 'NORD'), ('C', 7, FALSE, NULL, 'NORD'), ('C', 8, FALSE, NULL, 'NORD'),
    ('C', 9, FALSE, NULL, 'NORD'), ('C', 10, FALSE, NULL, 'NORD'), ('C', 11, FALSE, NULL, 'NORD'), ('C', 12, FALSE, NULL, 'NORD'),

    ('D', 1, FALSE, NULL, 'NORD'), ('D', 2, FALSE, NULL, 'NORD'), ('D', 3, FALSE, NULL, 'NORD'), ('D', 4, FALSE, NULL, 'NORD'),
    ('D', 5, FALSE, NULL, 'NORD'), ('D', 6, FALSE, NULL, 'NORD'), ('D', 7, FALSE, NULL, 'NORD'), ('D', 8, FALSE, NULL, 'NORD'),
    ('D', 9, FALSE, NULL, 'NORD'), ('D', 10, FALSE, NULL, 'NORD'), ('D', 11, FALSE, NULL, 'NORD'), ('D', 12, FALSE, NULL, 'NORD'),

    ('E', 1, FALSE, NULL, 'NORD'), ('E', 2, FALSE, NULL, 'NORD'), ('E', 3, FALSE, NULL, 'NORD'), ('E', 4, FALSE, NULL, 'NORD'),
    ('E', 5, FALSE, NULL, 'NORD'), ('E', 6, FALSE, NULL, 'NORD'), ('E', 7, FALSE, NULL, 'NORD'), ('E', 8, FALSE, NULL, 'NORD'),
    ('E', 9, FALSE, NULL, 'NORD'), ('E', 10, FALSE, NULL, 'NORD'), ('E', 11, FALSE, NULL, 'NORD'), ('E', 12, FALSE, NULL, 'NORD'),

    ('F', 1, FALSE, NULL, 'NORD'), ('F', 2, FALSE, NULL, 'NORD'), ('F', 3, FALSE, NULL, 'NORD'), ('F', 4, FALSE, NULL, 'NORD'),
    ('F', 5, FALSE, NULL, 'NORD'), ('F', 6, FALSE, NULL, 'NORD'), ('F', 7, FALSE, NULL, 'NORD'), ('F', 8, FALSE, NULL, 'NORD'),
    ('F', 9, FALSE, NULL, 'NORD'), ('F', 10, FALSE, NULL, 'NORD'), ('F', 11, FALSE, NULL, 'NORD'), ('F', 12, FALSE, NULL, 'NORD'),

    ('G', 1, FALSE, NULL, 'NORD'), ('G', 2, FALSE, NULL, 'NORD'), ('G', 3, FALSE, NULL, 'NORD'), ('G', 4, FALSE, NULL, 'NORD'),
    ('G', 5, FALSE, NULL, 'NORD'), ('G', 6, FALSE, NULL, 'NORD'), ('G', 7, FALSE, NULL, 'NORD'), ('G', 8, FALSE, NULL, 'NORD'),
    ('G', 9, FALSE, NULL, 'NORD'), ('G', 10, FALSE, NULL, 'NORD'), ('G', 11, FALSE, NULL, 'NORD'), ('G', 12, FALSE, NULL, 'NORD'),

    ('H', 1, FALSE, NULL, 'NORD'), ('H', 2, FALSE, NULL, 'NORD'), ('H', 3, FALSE, NULL, 'NORD'), ('H', 4, FALSE, NULL, 'NORD'),
    ('H', 5, FALSE, NULL, 'NORD'), ('H', 6, FALSE, NULL, 'NORD'), ('H', 7, FALSE, NULL, 'NORD'), ('H', 8, FALSE, NULL, 'NORD'),
    ('H', 9, FALSE, NULL, 'NORD'), ('H', 10, FALSE, NULL, 'NORD'), ('H', 11, FALSE, NULL, 'NORD'), ('H', 12, FALSE, NULL, 'NORD'),

    ('I', 1, FALSE, NULL, 'NORD'), ('I', 2, FALSE, NULL, 'NORD'), ('I', 3, FALSE, NULL, 'NORD'), ('I', 4, FALSE, NULL, 'NORD'),

    ('A', 1, FALSE, NULL, 'EST'), ('A', 2, FALSE, NULL, 'EST'), ('A', 3, FALSE, NULL, 'EST'), ('A', 4, TRUE, NULL, 'EST'),
    ('A', 5, TRUE, NULL, 'EST'), ('A', 6, TRUE, NULL, 'EST'), ('A', 7, FALSE, NULL, 'EST'), ('A', 8, FALSE, NULL, 'EST'),
    ('A', 9, FALSE, NULL, 'EST'), ('A', 10, FALSE, NULL, 'EST'), ('A', 11, FALSE, NULL, 'EST'), ('A', 12, FALSE, NULL, 'EST'),

    ('B', 1, FALSE, NULL, 'EST'), ('B', 2, FALSE, NULL, 'EST'), ('B', 3, FALSE, NULL, 'EST'), ('B', 4, FALSE, NULL, 'EST'),
    ('B', 5, FALSE, NULL, 'EST'), ('B', 6, FALSE, NULL, 'EST'), ('B', 7, FALSE, NULL, 'EST'), ('B', 8, FALSE, NULL, 'EST'),
    ('B', 9, FALSE, NULL, 'EST'), ('B', 10, FALSE, NULL, 'EST'), ('B', 11, FALSE, NULL, 'EST'), ('B', 12, FALSE, NULL, 'EST'),

    ('C', 1, FALSE, NULL, 'EST'), ('C', 2, FALSE, NULL, 'EST'), ('C', 3, FALSE, NULL, 'EST'), ('C', 4, FALSE, NULL, 'EST'),
    ('C', 5, FALSE, NULL, 'EST'), ('C', 6, FALSE, NULL, 'EST'), ('C', 7, FALSE, NULL, 'EST'), ('C', 8, FALSE, NULL, 'EST'),
    ('C', 9, FALSE, NULL, 'EST'), ('C', 10, FALSE, NULL, 'EST'), ('C', 11, FALSE, NULL, 'EST'), ('C', 12, FALSE, NULL, 'EST'),

    ('D', 1, FALSE, NULL, 'EST'), ('D', 2, FALSE, NULL, 'EST'), ('D', 3, FALSE, NULL, 'EST'), ('D', 4, FALSE, NULL, 'EST'),
    ('D', 5, FALSE, NULL, 'EST'), ('D', 6, FALSE, NULL, 'EST'), ('D', 7, FALSE, NULL, 'EST'), ('D', 8, FALSE, NULL, 'EST'),
    ('D', 9, FALSE, NULL, 'EST'), ('D', 10, FALSE, NULL, 'EST'), ('D', 11, FALSE, NULL, 'EST'), ('D', 12, FALSE, NULL, 'EST'),

    ('E', 1, FALSE, NULL, 'EST'), ('E', 2, FALSE, NULL, 'EST'), ('E', 3, FALSE, NULL, 'EST'), ('E', 4, FALSE, NULL, 'EST'),
    ('E', 5, FALSE, NULL, 'EST'), ('E', 6, FALSE, NULL, 'EST'), ('E', 7, FALSE, NULL, 'EST'), ('E', 8, FALSE, NULL, 'EST'),
    ('E', 9, FALSE, NULL, 'EST'), ('E', 10, FALSE, NULL, 'EST'), ('E', 11, FALSE, NULL, 'EST'), ('E', 12, FALSE, NULL, 'EST'),

    ('F', 1, FALSE, NULL, 'EST'), ('F', 2, FALSE, NULL, 'EST'), ('F', 3, FALSE, NULL, 'EST'), ('F', 4, FALSE, NULL, 'EST'),
    ('F', 5, FALSE, NULL, 'EST'), ('F', 6, FALSE, NULL, 'EST'), ('F', 7, FALSE, NULL, 'EST'), ('F', 8, FALSE, NULL, 'EST'),
    ('F', 9, FALSE, NULL, 'EST'), ('F', 10, FALSE, NULL, 'EST'), ('F', 11, FALSE, NULL, 'EST'), ('F', 12, FALSE, NULL, 'EST'),

    ('G', 1, FALSE, NULL, 'EST'), ('G', 2, FALSE, NULL, 'EST'), ('G', 3, FALSE, NULL, 'EST'), ('G', 4, FALSE, NULL, 'EST'),
    ('G', 5, FALSE, NULL, 'EST'), ('G', 6, FALSE, NULL, 'EST'), ('G', 7, FALSE, NULL, 'EST'), ('G', 8, FALSE, NULL, 'EST'),
    ('G', 9, FALSE, NULL, 'EST'), ('G', 10, FALSE, NULL, 'EST'), ('G', 11, FALSE, NULL, 'EST'), ('G', 12, FALSE, NULL, 'EST'),

    ('H', 1, FALSE, NULL, 'EST'), ('H', 2, FALSE, NULL, 'EST'), ('H', 3, FALSE, NULL, 'EST'), ('H', 4, FALSE, NULL, 'EST'),
    ('H', 5, FALSE, NULL, 'EST'), ('H', 6, FALSE, NULL, 'EST'), ('H', 7, FALSE, NULL, 'EST'), ('H', 8, FALSE, NULL, 'EST'),
    ('H', 9, FALSE, NULL, 'EST'), ('H', 10, FALSE, NULL, 'EST'), ('H', 11, FALSE, NULL, 'EST'), ('H', 12, FALSE, NULL, 'EST'),

    ('I', 1, FALSE, NULL, 'EST'), ('I', 2, FALSE, NULL, 'EST'), ('I', 3, FALSE, NULL, 'EST'), ('I', 4, FALSE, NULL, 'EST'),
    
    ('A', 1, FALSE, NULL, 'SUD'), ('A', 2, FALSE, NULL, 'SUD'), ('A', 3, FALSE, NULL, 'SUD'), ('A', 4, FALSE, NULL, 'SUD'),
  ('A', 5, FALSE, NULL, 'SUD'), ('A', 6, FALSE, NULL, 'SUD'), ('A', 7, TRUE, NULL, 'SUD'), ('A', 8, TRUE, NULL, 'SUD'),
  ('A', 9, TRUE, NULL, 'SUD'), ('A', 10, FALSE, NULL, 'SUD'), ('A', 11, FALSE, NULL, 'SUD'), ('A', 12, FALSE, NULL, 'SUD'),

  ('B', 1, FALSE, NULL, 'SUD'), ('B', 2, FALSE, NULL, 'SUD'), ('B', 3, FALSE, NULL, 'SUD'), ('B', 4, FALSE, NULL, 'SUD'),
  ('B', 5, FALSE, NULL, 'SUD'), ('B', 6, FALSE, NULL, 'SUD'), ('B', 7, FALSE, NULL, 'SUD'), ('B', 8, FALSE, NULL, 'SUD'),
  ('B', 9, FALSE, NULL, 'SUD'), ('B', 10, FALSE, NULL, 'SUD'), ('B', 11, FALSE, NULL, 'SUD'), ('B', 12, FALSE, NULL, 'SUD'),

  ('C', 1, FALSE, NULL, 'SUD'), ('C', 2, FALSE, NULL, 'SUD'), ('C', 3, FALSE, NULL, 'SUD'), ('C', 4, FALSE, NULL, 'SUD'),
  ('C', 5, FALSE, NULL, 'SUD'), ('C', 6, FALSE, NULL, 'SUD'), ('C', 7, FALSE, NULL, 'SUD'), ('C', 8, FALSE, NULL, 'SUD'),
  ('C', 9, FALSE, NULL, 'SUD'), ('C', 10, FALSE, NULL, 'SUD'), ('C', 11, FALSE, NULL, 'SUD'), ('C', 12, FALSE, NULL, 'SUD'),

  ('D', 1, FALSE, NULL, 'SUD'), ('D', 2, FALSE, NULL, 'SUD'), ('D', 3, FALSE, NULL, 'SUD'), ('D', 4, FALSE, NULL, 'SUD'),
  ('D', 5, FALSE, NULL, 'SUD'), ('D', 6, FALSE, NULL, 'SUD'), ('D', 7, FALSE, NULL, 'SUD'), ('D', 8, FALSE, NULL, 'SUD'),
  ('D', 9, FALSE, NULL, 'SUD'), ('D', 10, FALSE, NULL, 'SUD'), ('D', 11, FALSE, NULL, 'SUD'), ('D', 12, FALSE, NULL, 'SUD'),

  ('E', 1, FALSE, NULL, 'SUD'), ('E', 2, FALSE, NULL, 'SUD'), ('E', 3, FALSE, NULL, 'SUD'), ('E', 4, FALSE, NULL, 'SUD'),
  ('E', 5, FALSE, NULL, 'SUD'), ('E', 6, FALSE, NULL, 'SUD'), ('E', 7, FALSE, NULL, 'SUD'), ('E', 8, FALSE, NULL, 'SUD'),
  ('E', 9, FALSE, NULL, 'SUD'), ('E', 10, FALSE, NULL, 'SUD'), ('E', 11, FALSE, NULL, 'SUD'), ('E', 12, FALSE, NULL, 'SUD'),

  ('F', 1, FALSE, NULL, 'SUD'), ('F', 2, FALSE, NULL, 'SUD'), ('F', 3, FALSE, NULL, 'SUD'), ('F', 4, FALSE, NULL, 'SUD'),
  ('F', 5, FALSE, NULL, 'SUD'), ('F', 6, FALSE, NULL, 'SUD'), ('F', 7, FALSE, NULL, 'SUD'), ('F', 8, FALSE, NULL, 'SUD'),
  ('F', 9, FALSE, NULL, 'SUD'), ('F', 10, FALSE, NULL, 'SUD'), ('F', 11, FALSE, NULL, 'SUD'), ('F', 12, FALSE, NULL, 'SUD'),

  ('G', 1, FALSE, NULL, 'SUD'), ('G', 2, FALSE, NULL, 'SUD'), ('G', 3, FALSE, NULL, 'SUD'), ('G', 4, FALSE, NULL, 'SUD'),
  ('G', 5, FALSE, NULL, 'SUD'), ('G', 6, FALSE, NULL, 'SUD'), ('G', 7, FALSE, NULL, 'SUD'), ('G', 8, FALSE, NULL, 'SUD'),
  ('G', 9, FALSE, NULL, 'SUD'), ('G', 10, FALSE, NULL, 'SUD'), ('G', 11, FALSE, NULL, 'SUD'), ('G', 12, FALSE, NULL, 'SUD'),

  ('H', 1, FALSE, NULL, 'SUD'), ('H', 2, FALSE, NULL, 'SUD'), ('H', 3, FALSE, NULL, 'SUD'), ('H', 4, FALSE, NULL, 'SUD'),
  ('H', 5, FALSE, NULL, 'SUD'), ('H', 6, FALSE, NULL, 'SUD'), ('H', 7, FALSE, NULL, 'SUD'), ('H', 8, FALSE, NULL, 'SUD'),
  ('H', 9, FALSE, NULL, 'SUD'), ('H', 10, FALSE, NULL, 'SUD'), ('H', 11, FALSE, NULL, 'SUD'), ('H', 12, FALSE, NULL, 'SUD'),

  ('I', 1, FALSE, NULL, 'SUD'), ('I', 2, FALSE, NULL, 'SUD'), ('I', 3, FALSE, NULL, 'SUD'), ('I', 4, FALSE, NULL, 'SUD'),

  ('A', 1, FALSE, NULL, 'OUEST'), ('A', 2, FALSE, NULL, 'OUEST'), ('A', 3, FALSE, NULL, 'OUEST'), ('A', 4, FALSE, NULL, 'OUEST'),
  ('A', 5, FALSE, NULL, 'OUEST'), ('A', 6, FALSE, NULL, 'OUEST'), ('A', 7, FALSE, NULL, 'OUEST'), ('A', 8, FALSE, NULL, 'OUEST'),
  ('A', 9, FALSE, NULL, 'OUEST'), ('A', 10, TRUE, NULL, 'OUEST'), ('A', 11, TRUE, NULL, 'OUEST'), ('A', 12, TRUE, NULL, 'OUEST'),

  ('B', 1, FALSE, NULL, 'OUEST'), ('B', 2, FALSE, NULL, 'OUEST'), ('B', 3, FALSE, NULL, 'OUEST'), ('B', 4, FALSE, NULL, 'OUEST'),
  ('B', 5, FALSE, NULL, 'OUEST'), ('B', 6, FALSE, NULL, 'OUEST'), ('B', 7, FALSE, NULL, 'OUEST'), ('B', 8, FALSE, NULL, 'OUEST'),
  ('B', 9, FALSE, NULL, 'OUEST'), ('B', 10, FALSE, NULL, 'OUEST'), ('B', 11, FALSE, NULL, 'OUEST'), ('B', 12, FALSE, NULL, 'OUEST'),

  ('C', 1, FALSE, NULL, 'OUEST'), ('C', 2, FALSE, NULL, 'OUEST'), ('C', 3, FALSE, NULL, 'OUEST'), ('C', 4, FALSE, NULL, 'OUEST'),
  ('C', 5, FALSE, NULL, 'OUEST'), ('C', 6, FALSE, NULL, 'OUEST'), ('C', 7, FALSE, NULL, 'OUEST'), ('C', 8, FALSE, NULL, 'OUEST'),
  ('C', 9, FALSE, NULL, 'OUEST'), ('C', 10, FALSE, NULL, 'OUEST'), ('C', 11, FALSE, NULL, 'OUEST'), ('C', 12, FALSE, NULL, 'OUEST'),

  ('D', 1, FALSE, NULL, 'OUEST'), ('D', 2, FALSE, NULL, 'OUEST'), ('D', 3, FALSE, NULL, 'OUEST'), ('D', 4, FALSE, NULL, 'OUEST'),
  ('D', 5, FALSE, NULL, 'OUEST'), ('D', 6, FALSE, NULL, 'OUEST'), ('D', 7, FALSE, NULL, 'OUEST'), ('D', 8, FALSE, NULL, 'OUEST'),
  ('D', 9, FALSE, NULL, 'OUEST'), ('D', 10, FALSE, NULL, 'OUEST'), ('D', 11, FALSE, NULL, 'OUEST'), ('D', 12, FALSE, NULL, 'OUEST'),

  ('E', 1, FALSE, NULL, 'OUEST'), ('E', 2, FALSE, NULL, 'OUEST'), ('E', 3, FALSE, NULL, 'OUEST'), ('E', 4, FALSE, NULL, 'OUEST'),
  ('E', 5, FALSE, NULL, 'OUEST'), ('E', 6, FALSE, NULL, 'OUEST'), ('E', 7, FALSE, NULL, 'OUEST'), ('E', 8, FALSE, NULL, 'OUEST'),
  ('E', 9, FALSE, NULL, 'OUEST'), ('E', 10, FALSE, NULL, 'OUEST'), ('E', 11, FALSE, NULL, 'OUEST'), ('E', 12, FALSE, NULL, 'OUEST'),

  ('F', 1, FALSE, NULL, 'OUEST'), ('F', 2, FALSE, NULL, 'OUEST'), ('F', 3, FALSE, NULL, 'OUEST'), ('F', 4, FALSE, NULL, 'OUEST'),
  ('F', 5, FALSE, NULL, 'OUEST'), ('F', 6, FALSE, NULL, 'OUEST'), ('F', 7, FALSE, NULL, 'OUEST'), ('F', 8, FALSE, NULL, 'OUEST'),
  ('F', 9, FALSE, NULL, 'OUEST'), ('F', 10, FALSE, NULL, 'OUEST'), ('F', 11, FALSE, NULL, 'OUEST'), ('F', 12, FALSE, NULL, 'OUEST'),

  ('G', 1, FALSE, NULL, 'OUEST'), ('G', 2, FALSE, NULL, 'OUEST'), ('G', 3, FALSE, NULL, 'OUEST'), ('G', 4, FALSE, NULL, 'OUEST'),
  ('G', 5, FALSE, NULL, 'OUEST'), ('G', 6, FALSE, NULL, 'OUEST'), ('G', 7, FALSE, NULL, 'OUEST'), ('G', 8, FALSE, NULL, 'OUEST'),
  ('G', 9, FALSE, NULL, 'OUEST'), ('G', 10, FALSE, NULL, 'OUEST'), ('G', 11, FALSE, NULL, 'OUEST'), ('G', 12, FALSE, NULL, 'OUEST'),

  ('H', 1, FALSE, NULL, 'OUEST'), ('H', 2, FALSE, NULL, 'OUEST'), ('H', 3, FALSE, NULL, 'OUEST'), ('H', 4, FALSE, NULL, 'OUEST'),
  ('H', 5, FALSE, NULL, 'OUEST'), ('H', 6, FALSE, NULL, 'OUEST'), ('H', 7, FALSE, NULL, 'OUEST'), ('H', 8, FALSE, NULL, 'OUEST'),
  ('H', 9, FALSE, NULL, 'OUEST'), ('H', 10, FALSE, NULL, 'OUEST'), ('H', 11, FALSE, NULL, 'OUEST'), ('H', 12, FALSE, NULL, 'OUEST'),

  ('I', 1, FALSE, NULL, 'OUEST'), ('I', 2, FALSE, NULL, 'OUEST'), ('I', 3, FALSE, NULL, 'OUEST'), ('I', 4, FALSE, NULL, 'OUEST');


`;
    await pool.query(insertSiege);

    console.log("Base PostgreSQL Mintonette Cup initialisée !");
  } catch (err) {
    console.error("Erreur lors de l’initialisation :", err);
  } finally {
    await pool.end();

    console.log("Connexion PostgreSQL fermée.");
  }
})();
