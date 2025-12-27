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
        tel_utilisateur VARCHAR(10),
        sexe_utilisateur VARCHAR(50),
        photo_profil_utilisateur BYTEA,
        date_creation_utilisateur TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS Siege(
      numero_colonne VARCHAR(2) ,
      numero_ligne INTEGER ,
      est_reserve BOOLEAN DEFAULT FALSE, 
      dans_panier BOOLEAN DEFAULT FALSE,
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
        descri_prestataire VARCHAR(500),
        nb_participants NUMERIC(10, 2),
        tarif_prestataire NUMERIC(10, 2),
        mail_prestataire VARCHAR(255) NOT NULL,
        tel_prestataire VARCHAR(10) NOT NULL,
        waitingForAdmin BOOLEAN,
        specificite VARCHAR(100),
        id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur),
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
        taille FLOAT,
        numero_joueur INTEGER,
        pays VARCHAR(50),
        poste VARCHAR (50),
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
        (prenom_utilisateur, nom_utilisateur, login_utilisateur, mdp_utilisateur, mail_utilisateur, tel_utilisateur, sexe_utilisateur)
      VALUES
        ('Alban', 'Robin', 'albanr', 'admin123', 'alban.robin@gmail.com', '0763749895', 'M'),
        ('Emma', 'Durand', 'emmad', 'user123', 'emma.durand@gmail.com', '0612345678', 'F'),
        ('Lucas', 'Martin', 'lucasm', 'lucas01', 'lucas.martin@gmail.com', '0652437595', 'M'),
        ('Chloe', 'Petit', 'chloep', 'chloe22', 'chloe.petit@gmail.com', '0610423571', 'F'),
        ('Nathan', 'Dupont', 'nathand', 'nathan44', 'nathan.dupont@gmail.com', '0752435010', 'M'),
        ('Julie', 'Bernard', 'julieb', 'julie33', 'julie.bernard@gmail.com', '0630102040', 'F'),
        ('Sophie', 'Moreau', 'sophiem', 'sophie11', 'sophie.moreau@gmail.com', '0693759150', 'F'),
        ('Maxime', 'Lefevre', 'maxl', 'maxime77', 'maxime.lefevre@gmail.com', '0630102040', 'M'),
        ('Camille', 'Roux', 'camr', 'camille88', 'camille.roux@gmail.com', '0750402342', 'F'),
        ('Thomas', 'Garcia', 'thomg', 'thomas66', 'thomas.garcia@gmail.com', '0682759641', 'M');
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
    `;
    await pool.query(insertTypeRestauration);

    const insertTypeBoutique = `
    INSERT INTO Type_boutique (nom_type_boutique) VALUES
      ('Vêtements et accessoires'),
      ('Objets et souvenirs'),
      ('Livres et supports média'),
      ('Articles créatifs / personnalisables')
    `;
    await pool.query(insertTypeBoutique);

    const insertTypePrestataire = `
    INSERT INTO Type_prestataire (nom_type_prestataire) VALUES
      ('Animation'),
      ('Boutique'),
      ('Restauration');
    `;
    await pool.query(insertTypePrestataire);

    const insertPrestataire = `
    INSERT INTO Prestataire (nom_prestataire, descri_prestataire, nb_participants, tarif_prestataire, mail_prestataire, tel_prestataire, waitingForAdmin, specificite, id_utilisateur, type_prestataire_id) VALUES
      ('FoodExpress', 'Service de restauration rapide pour événements', 50, 5.00, 'contact@foodexpress.com', '0123456789', false, 'Animation festive', 2, 1),
      ('AnimEvent', 'Animations pour tous types d’événements', 100, 15.00, 'contact@animevent.com', '0987654321', false, 'Livres et supports média', 3, 2),
      ('SportMerch', 'Boutique spécialisée en articles sportifs', 20, 0.00, 'contact@sportmerch.com', '0112233445', false, 'Vêtements et accessoires', 4, 2);
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

    const insertJoueurEquipe = `
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    -- France
    ('Ngapeth', 'Earvin', 'Masculin', '1991-02-12', 1.96, 9, 'France', 'Attaquant', 1),
    ('Grebennikov', 'Jenia', 'Masculin', '1990-08-13', 1.87, 3, 'France', 'Libero', 1),
    ('Brizard', 'Antoine', 'Masculin', '1994-05-22', 1.88, 11, 'France', 'Receveur-Attaquant', 1),
    ('Le Goff', 'Barthélémy', 'Masculin', '1988-09-27', 2.02, 4, 'France', 'Central', 1),
    ('Patry', 'Jean', 'Masculin', '1996-06-20', 1.97, 10, 'France', 'Attaquant', 1),
    ('Clevenot', 'Nicolas', 'Masculin', '1994-07-23', 1.97, 7, 'France', 'Receveur-Attaquant', 1),
    ('Chinenyeze', 'Barthélémy', 'Masculin', '1998-01-22', 2.03, 5, 'France', 'Central', 1),
    ('Toniutti', 'Benjamin', 'Masculin', '1989-11-30', 1.80, 6, 'France', 'Passeur', 1),
    ('Tillie', 'Kévin', 'Masculin', '1990-11-24', 2.02, 8, 'France', 'Receveur-Attaquant', 1),
    ('Faure', 'Théo', 'Masculin', '1999-10-12', 2.00, 12, 'France', 'Central', 1),
    ('Diez', 'Yacine', 'Masculin', '1991-11-14', 1.95, 2, 'France', 'Receveur-Attaquant', 1),
    ('Louati', 'Trevor', 'Masculin', '1996-02-04', 1.97, 14, 'France', 'Central', 1),
    ('Henno', 'Dorian', 'Masculin', '1994-01-21', 1.87, 1, 'France', 'Libero', 1),
    ('Tual', 'Lucas', 'Masculin', '1998-10-12', 2.01, 13, 'France', 'Attaquant', 1);

    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    -- Allemagne
    ('Stern', 'Christian', 'Masculin', '1990-07-07', 1.98, 1, 'Allemagne', 'Passeur', 2),
    ('Friedrich', 'Denis', 'Masculin', '1995-03-03', 2.01, 2, 'Allemagne', 'Attaquant', 2),
    ('Schott', 'Markus', 'Masculin', '1994-08-14', 1.97, 3, 'Allemagne', 'Central', 2),
    ('Höper', 'Joachim', 'Masculin', '1991-05-21', 1.96, 4, 'Allemagne', 'Receveur-Attaquant', 2),
    ('Vettori', 'Alexander', 'Masculin', '1988-02-11', 2.02, 5, 'Allemagne', 'Central', 2),
    ('Klinkenberg', 'Simon', 'Masculin', '1997-09-17', 1.95, 6, 'Allemagne', 'Attaquant', 2),
    ('Wickler', 'Moritz', 'Masculin', '1994-06-06', 2.01, 7, 'Allemagne', 'Receveur-Attaquant', 2),
    ('Schweiger', 'Lukas', 'Masculin', '1992-01-18', 1.90, 8, 'Allemagne', 'Libero', 2),
    ('Huber', 'Tobias', 'Masculin', '1995-04-20', 2.00, 9, 'Allemagne', 'Attaquant', 2),
    ('Strohbach', 'Max', 'Masculin', '1996-12-02', 1.98, 10, 'Allemagne', 'Receveur-Attaquant', 2),
    ('Maase', 'Nils', 'Masculin', '1989-03-28', 1.97, 11, 'Allemagne', 'Central', 2),
    ('Höfflin', 'Patrick', 'Masculin', '1993-05-16', 1.99, 12, 'Allemagne', 'Attaquant', 2),
    ('Reinhardt', 'Tobias', 'Masculin', '1992-07-11', 1.92, 13, 'Allemagne', 'Libero', 2),
    ('Tille', 'Fabian', 'Masculin', '1997-09-30', 1.96, 14, 'Allemagne', 'Receveur-Attaquant', 2);

    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    -- Argentine
    ('Conte', 'Santiago', 'Masculin', '1985-07-22', 1.98, 1, 'Argentine', 'Passeur', 3),
    ('Ezequiel', 'Palacios', 'Masculin', '1992-11-16', 1.99, 2, 'Argentine', 'Attaquant', 3),
    ('Quintana', 'Luciano', 'Masculin', '1994-02-08', 2.00, 3, 'Argentine', 'Central', 3),
    ('Lazo', 'Luciano', 'Masculin', '1995-04-21', 1.97, 4, 'Argentine', 'Receveur-Attaquant', 3),
    ('Schirru', 'Matias', 'Masculin', '1990-12-30', 2.01, 5, 'Argentine', 'Central', 3),
    ('Bertolino', 'Facundo', 'Masculin', '1997-06-14', 1.95, 6, 'Argentine', 'Attaquant', 3),
    ('Urra', 'Bruno', 'Masculin', '1996-09-12', 1.98, 7, 'Argentine', 'Receveur-Attaquant', 3),
    ('Vernazza', 'Matias', 'Masculin', '1992-03-05', 1.90, 8, 'Argentine', 'Libero', 3),
    ('Dalmasso', 'Juan', 'Masculin', '1993-07-01', 2.00, 9, 'Argentine', 'Attaquant', 3),
    ('Molina', 'Leandro', 'Masculin', '1994-05-11', 1.96, 10, 'Argentine', 'Receveur-Attaquant', 3),
    ('Sosa', 'Matias', 'Masculin', '1995-10-20', 1.98, 11, 'Argentine', 'Central', 3),
    ('Torenzi', 'Agustin', 'Masculin', '1996-08-15', 1.95, 12, 'Argentine', 'Attaquant', 3),
    ('Hernandez', 'Facundo', 'Masculin', '1997-01-25', 1.99, 13, 'Argentine', 'Libero', 3),
    ('Zapata', 'Nicolas', 'Masculin', '1998-04-12', 1.97, 14, 'Argentine', 'Receveur-Attaquant', 3);

    -- Italie 
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Zaytsev', 'Ivan', 'Masculin', '1988-10-02', 2.02, 9, 'Italie', 'Attaquant', 4),
    ('Michieletto', 'Alessandro', 'Masculin', '1999-04-06', 1.95, 7, 'Italie', 'Receveur-Attaquant', 4),
    ('Lanza', 'Simone', 'Masculin', '1989-10-21', 1.95, 10, 'Italie', 'Receveur-Attaquant', 4),
    ('Recine', 'Gianluca', 'Masculin', '1996-02-04', 2.00, 8, 'Italie', 'Attaquant', 4),
    ('Romanò', 'Davide', 'Masculin', '1997-06-26', 2.01, 4, 'Italie', 'Central', 4),
    ('Pinali', 'Federico', 'Masculin', '2000-07-14', 1.97, 6, 'Italie', 'Receveur-Attaquant', 4),
    ('Cebulj', 'Alessandro', 'Masculin', '1991-11-07', 2.03, 5, 'Italie', 'Central', 4),
    ('Giannelli', 'Luca', 'Masculin', '1997-05-24', 1.90, 2, 'Italie', 'Passeur', 4),
    ('Cester', 'Mattia', 'Masculin', '1994-09-16', 2.02, 12, 'Italie', 'Central', 4),
    ('Colaci', 'Salvatore', 'Masculin', '1983-12-04', 1.90, 1, 'Italie', 'Libero', 4),
    ('Martini', 'Alessandro', 'Masculin', '1992-03-22', 1.97, 3, 'Italie', 'Attaquant', 4),
    ('Pietrini', 'Marco', 'Masculin', '2001-02-11', 1.96, 11, 'Italie', 'Receveur-Attaquant', 4),
    ('Buti', 'Gianluca', 'Masculin', '1996-08-19', 1.98, 13, 'Italie', 'Attaquant', 4),
    ('Galassi', 'Gianluca', 'Masculin', '1995-03-12', 2.04, 14, 'Italie', 'Central', 4);

    -- Canada
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Laflamme', 'Eric', 'Masculin', '1992-04-15', 1.98, 1, 'Canada', 'Passeur', 5),
    ('Hoag', 'Nick', 'Masculin', '1992-01-08', 1.98, 2, 'Canada', 'Attaquant', 5),
    ('Sander', 'Chris', 'Masculin', '1991-02-21', 1.97, 3, 'Canada', 'Central', 5),
    ('Schurman', 'Lucas', 'Masculin', '1995-06-03', 1.95, 4, 'Canada', 'Receveur-Attaquant', 5),
    ('Morrison', 'Daniel', 'Masculin', '1996-03-17', 2.00, 5, 'Canada', 'Central', 5),
    ('Lafrenière', 'Alex', 'Masculin', '1993-12-12', 1.96, 6, 'Canada', 'Attaquant', 5),
    ('Champagne', 'Simon', 'Masculin', '1997-07-21', 1.97, 7, 'Canada', 'Receveur-Attaquant', 5),
    ('Van Berkel', 'Ryan', 'Masculin', '1994-05-11', 1.90, 8, 'Canada', 'Libero', 5),
    ('Dove', 'Brandon', 'Masculin', '1992-08-30', 2.02, 9, 'Canada', 'Attaquant', 5),
    ('Hogg', 'Jeremy', 'Masculin', '1990-03-25', 1.98, 10, 'Canada', 'Receveur-Attaquant', 5),
    ('Lavoie', 'Maxime', 'Masculin', '1995-10-16', 1.95, 11, 'Canada', 'Central', 5),
    ('Taylor', 'Cameron', 'Masculin', '1996-12-02', 1.97, 12, 'Canada', 'Attaquant', 5),
    ('Boucher', 'Olivier', 'Masculin', '1994-09-20', 1.98, 13, 'Canada', 'Libero', 5),
    ('Martin', 'Samuel', 'Masculin', '1997-11-05', 2.01, 14, 'Canada', 'Attaquant', 5);

    -- Bulgarie
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Pavlov', 'Todor', 'Masculin', '1994-05-14', 2.00, 1, 'Bulgarie', 'Passeur', 6),
    ('Kolev', 'Dimitri', 'Masculin', '1991-08-22', 1.98, 2, 'Bulgarie', 'Attaquant', 6),
    ('Kalimonov', 'Georgi', 'Masculin', '1995-03-19', 1.97, 3, 'Bulgarie', 'Central', 6),
    ('Mihaylov', 'Tsvetan', 'Masculin', '1987-05-12', 2.01, 4, 'Bulgarie', 'Receveur-Attaquant', 6),
    ('Vasilev', 'Petar', 'Masculin', '1993-09-03', 1.95, 5, 'Bulgarie', 'Central', 6),
    ('Ivanov', 'Stoyan', 'Masculin', '1996-12-08', 1.96, 6, 'Bulgarie', 'Attaquant', 6),
    ('Kostov', 'Kristiyan', 'Masculin', '1994-06-21', 1.97, 7, 'Bulgarie', 'Receveur-Attaquant', 6),
    ('Petrov', 'Viktor', 'Masculin', '1992-02-15', 1.90, 8, 'Bulgarie', 'Libero', 6),
    ('Spasov', 'Tomas', 'Masculin', '1995-11-30', 2.02, 9, 'Bulgarie', 'Attaquant', 6),
    ('Georgiev', 'Alexander', 'Masculin', '1993-07-07', 1.98, 10, 'Bulgarie', 'Receveur-Attaquant', 6),
    ('Ivanov', 'Milan', 'Masculin', '1996-05-26', 1.95, 11, 'Bulgarie', 'Central', 6),
    ('Stefanov', 'Nikolay', 'Masculin', '1997-09-18', 1.97, 12, 'Bulgarie', 'Attaquant', 6),
    ('Dimitrov', 'Martin', 'Masculin', '1994-04-12', 1.98, 13, 'Bulgarie', 'Libero', 6),
    ('Kirilov', 'Angel', 'Masculin', '1998-01-20', 2.01, 14, 'Bulgarie', 'Attaquant', 6);

    -- Brésil
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Lucarelli', 'Ricardo', 'Masculin', '1992-10-14', 1.98, 9, 'Brésil', 'Attaquant', 7),
    ('Fakih', 'Mauricio', 'Masculin', '1989-05-25', 1.97, 3, 'Brésil', 'Receveur-Attaquant', 7),
    ('Héctor', 'Bruno', 'Masculin', '1991-07-21', 2.02, 4, 'Brésil', 'Central', 7),
    ('Leal', 'Yoandy', 'Masculin', '1985-11-23', 1.96, 10, 'Brésil', 'Attaquant', 7),
    ('Giba', 'Gilberto', 'Masculin', '1980-12-23', 1.95, 7, 'Brésil', 'Receveur-Attaquant', 7),
    ('Raphael', 'Bruno', 'Masculin', '1987-03-10', 1.99, 2, 'Brésil', 'Libero', 7),
    ('Renan', 'Santos', 'Masculin', '1990-09-14', 2.01, 5, 'Brésil', 'Central', 7),
    ('Douglas', 'Leonardo', 'Masculin', '1993-01-19', 1.97, 6, 'Brésil', 'Receveur-Attaquant', 7),
    ('Wallace', 'de Souza', 'Masculin', '1987-06-26', 2.05, 8, 'Brésil', 'Attaquant', 7),
    ('Lipe', 'Lucas', 'Masculin', '1994-02-02', 1.96, 12, 'Brésil', 'Central', 7),
    ('Thales', 'Hortencio', 'Masculin', '1990-08-30', 1.98, 11, 'Brésil', 'Receveur-Attaquant', 7),
    ('Mauricio', 'Nascimento', 'Masculin', '1988-03-15', 1.97, 1, 'Brésil', 'Passeur', 7),
    ('Leonardo', 'Zorro', 'Masculin', '1992-12-12', 1.99, 13, 'Brésil', 'Attaquant', 7),
    ('Alan', 'Souza', 'Masculin', '1991-05-19', 2.00, 14, 'Brésil', 'Central', 7);

    -- Cuba
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Lorenzo', 'Tapia', 'Masculin', '1993-03-17', 2.01, 1, 'Cuba', 'Passeur', 8),
    ('Gonzalez', 'Miguel', 'Masculin', '1994-06-20', 1.99, 2, 'Cuba', 'Attaquant', 8),
    ('Rodriguez', 'Yosvani', 'Masculin', '1992-09-30', 1.97, 3, 'Cuba', 'Central', 8),
    ('Santos', 'Victor', 'Masculin', '1995-01-05', 1.98, 4, 'Cuba', 'Receveur-Attaquant', 8),
    ('Perez', 'Luis', 'Masculin', '1991-12-19', 2.00, 5, 'Cuba', 'Central', 8),
    ('Fernandez', 'Carlos', 'Masculin', '1993-07-22', 1.97, 6, 'Cuba', 'Attaquant', 8),
    ('Diaz', 'Javier', 'Masculin', '1994-11-02', 1.98, 7, 'Cuba', 'Receveur-Attaquant', 8),
    ('Martinez', 'Ricardo', 'Masculin', '1990-05-25', 1.90, 8, 'Cuba', 'Libero', 8),
    ('Rojas', 'Alberto', 'Masculin', '1992-08-12', 2.01, 9, 'Cuba', 'Attaquant', 8),
    ('Vega', 'Fernando', 'Masculin', '1993-02-28', 1.96, 10, 'Cuba', 'Receveur-Attaquant', 8),
    ('Alvarez', 'Pedro', 'Masculin', '1995-06-17', 1.98, 11, 'Cuba', 'Central', 8),
    ('Garcia', 'Victor', 'Masculin', '1996-09-10', 1.97, 12, 'Cuba', 'Attaquant', 8),
    ('Lopez', 'Andres', 'Masculin', '1994-04-22', 1.99, 13, 'Cuba', 'Libero', 8),
    ('Mendez', 'Oscar', 'Masculin', '1997-12-05', 2.00, 14, 'Cuba', 'Central', 8);

    -- États-Unis
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Anderson', 'Matthew', 'Masculin', '1990-04-07', 2.00, 1, 'États-Unis', 'Passeur', 9),
    ('Sander', 'Taylor', 'Masculin', '1992-07-16', 1.98, 2, 'États-Unis', 'Attaquant', 9),
    ('McKenzie', 'Aaron', 'Masculin', '1991-03-12', 1.97, 3, 'États-Unis', 'Central', 9),
    ('Knack', 'Micah', 'Masculin', '1993-06-22', 1.99, 4, 'États-Unis', 'Receveur-Attaquant', 9),
    ('Chapman', 'David', 'Masculin', '1994-09-15', 2.02, 5, 'États-Unis', 'Central', 9),
    ('Dearing', 'Aaron', 'Masculin', '1995-01-18', 1.96, 6, 'États-Unis', 'Attaquant', 9),
    ('Smyth', 'James', 'Masculin', '1992-05-20', 1.97, 7, 'États-Unis', 'Receveur-Attaquant', 9),
    ('Larson', 'Paul', 'Masculin', '1990-08-30', 1.90, 8, 'États-Unis', 'Libero', 9),
    ('Thompson', 'Brian', 'Masculin', '1993-11-11', 2.00, 9, 'États-Unis', 'Attaquant', 9),
    ('Knox', 'David', 'Masculin', '1991-12-02', 1.98, 10, 'États-Unis', 'Receveur-Attaquant', 9),
    ('Phillips', 'John', 'Masculin', '1992-03-19', 1.95, 11, 'États-Unis', 'Central', 9),
    ('Walker', 'Chris', 'Masculin', '1994-10-10', 1.97, 12, 'États-Unis', 'Attaquant', 9),
    ('Anderson', 'Luke', 'Masculin', '1990-06-25', 1.99, 13, 'États-Unis', 'Libero', 9),
    ('Gibbs', 'Kyle', 'Masculin', '1995-05-07', 2.01, 14, 'États-Unis', 'Central', 9);

    -- Slovénie
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Podržaj', 'Jan', 'Masculin', '1994-03-15', 1.98, 1, 'Slovénie', 'Passeur', 10),
    ('Klančnik', 'Žiga', 'Masculin', '1993-07-10', 1.97, 2, 'Slovénie', 'Attaquant', 10),
    ('Skrab', 'Miha', 'Masculin', '1995-02-28', 2.00, 3, 'Slovénie', 'Central', 10),
    ('Petković', 'David', 'Masculin', '1992-06-19', 1.96, 4, 'Slovénie', 'Receveur-Attaquant', 10),
    ('Zorman', 'Klemen', 'Masculin', '1991-04-07', 2.01, 5, 'Slovénie', 'Central', 10),
    ('Majcen', 'Alen', 'Masculin', '1996-08-03', 1.95, 6, 'Slovénie', 'Attaquant', 10),
    ('Kolar', 'Tilen', 'Masculin', '1993-12-21', 1.97, 7, 'Slovénie', 'Receveur-Attaquant', 10),
    ('Bregar', 'Urban', 'Masculin', '1992-05-17', 1.90, 8, 'Slovénie', 'Libero', 10),
    ('Šket', 'Alen', 'Masculin', '1994-11-09', 2.00, 9, 'Slovénie', 'Attaquant', 10),
    ('Gerguri', 'Benjamin', 'Masculin', '1995-01-12', 1.98, 10, 'Slovénie', 'Receveur-Attaquant', 10),
    ('Klemencic', 'Matej', 'Masculin', '1996-03-30', 1.95, 11, 'Slovénie', 'Central', 10),
    ('Krystof', 'Niko', 'Masculin', '1997-09-22', 1.97, 12, 'Slovénie', 'Attaquant', 10),
    ('Horvat', 'Luka', 'Masculin', '1994-07-05', 1.99, 13, 'Slovénie', 'Libero', 10),
    ('Poredoš', 'Tadej', 'Masculin', '1995-10-14', 2.01, 14, 'Slovénie', 'Central', 10);

    -- Iran
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Mousavi', 'Saeid', 'Masculin', '1989-12-22', 2.04, 1, 'Iran', 'Passeur', 11),
    ('Ebadipour', 'Saeid', 'Masculin', '1993-02-23', 1.98, 2, 'Iran', 'Attaquant', 11),
    ('Kazemi', 'Milad', 'Masculin', '1991-06-07', 2.01, 3, 'Iran', 'Central', 11),
    ('Shahbazi', 'Mohammad', 'Masculin', '1992-11-16', 1.97, 4, 'Iran', 'Receveur-Attaquant', 11),
    ('Kazemi', 'Amir', 'Masculin', '1994-09-30', 2.00, 5, 'Iran', 'Central', 11),
    ('Ghiasi', 'Ali', 'Masculin', '1996-05-11', 1.95, 6, 'Iran', 'Attaquant', 11),
    ('Hosseini', 'Mohammad', 'Masculin', '1990-03-21', 1.98, 7, 'Iran', 'Receveur-Attaquant', 11),
    ('Shahroodi', 'Behzad', 'Masculin', '1995-07-07', 1.90, 8, 'Iran', 'Libero', 11),
    ('Miri', 'Reza', 'Masculin', '1993-10-12', 2.01, 9, 'Iran', 'Attaquant', 11),
    ('Tajik', 'Omid', 'Masculin', '1992-05-15', 1.96, 10, 'Iran', 'Receveur-Attaquant', 11),
    ('Alizadeh', 'Mehdi', 'Masculin', '1996-08-19', 1.98, 11, 'Iran', 'Central', 11),
    ('Rafiee', 'Mohammad', 'Masculin', '1994-02-10', 1.97, 12, 'Iran', 'Attaquant', 11),
    ('Shiri', 'Saman', 'Masculin', '1995-01-25', 1.99, 13, 'Iran', 'Libero', 11),
    ('Mousavi', 'Hamid', 'Masculin', '1997-06-18', 2.00, 14, 'Iran', 'Central', 11);

    -- Ukraine
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Yavorsky', 'Oleh', 'Masculin', '1992-03-08', 1.98, 1, 'Ukraine', 'Passeur', 12),
    ('Filipov', 'Ivan', 'Masculin', '1991-06-19', 1.97, 2, 'Ukraine', 'Attaquant', 12),
    ('Kravets', 'Andriy', 'Masculin', '1993-09-21', 2.00, 3, 'Ukraine', 'Central', 12),
    ('Petrenko', 'Serhiy', 'Masculin', '1994-12-05', 1.96, 4, 'Ukraine', 'Receveur-Attaquant', 12),
    ('Shevchenko', 'Volodymyr', 'Masculin', '1990-07-12', 2.01, 5, 'Ukraine', 'Central', 12),
    ('Ivanov', 'Dmytro', 'Masculin', '1995-05-17', 1.95, 6, 'Ukraine', 'Attaquant', 12),
    ('Bondarenko', 'Mykola', 'Masculin', '1992-11-03', 1.97, 7, 'Ukraine', 'Receveur-Attaquant', 12),
    ('Kovalchuk', 'Andriy', 'Masculin', '1993-08-10', 1.90, 8, 'Ukraine', 'Libero', 12),
    ('Lysenko', 'Viktor', 'Masculin', '1994-04-22', 2.00, 9, 'Ukraine', 'Attaquant', 12),
    ('Romanov', 'Oleh', 'Masculin', '1995-02-14', 1.96, 10, 'Ukraine', 'Receveur-Attaquant', 12),
    ('Stepanenko', 'Andriy', 'Masculin', '1991-09-28', 1.98, 11, 'Ukraine', 'Central', 12),
    ('Tkachenko', 'Dmytro', 'Masculin', '1996-01-30', 1.97, 12, 'Ukraine', 'Attaquant', 12),
    ('Kravchuk', 'Mykhailo', 'Masculin', '1993-03-12', 1.99, 13, 'Ukraine', 'Libero', 12),
    ('Moroz', 'Oleksandr', 'Masculin', '1994-05-16', 2.01, 14, 'Ukraine', 'Central', 12);

    -- Chine
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Zhu', 'Cheng', 'Masculin', '1990-05-12', 2.01, 1, 'Chine', 'Passeur', 13),
    ('Zhang', 'Chen', 'Masculin', '1992-07-19', 1.98, 2, 'Chine', 'Attaquant', 13),
    ('Li', 'Yang', 'Masculin', '1991-09-03', 2.00, 3, 'Chine', 'Central', 13),
    ('Wang', 'Bin', 'Masculin', '1993-02-14', 1.97, 4, 'Chine', 'Receveur-Attaquant', 13),
    ('Xu', 'Jie', 'Masculin', '1994-11-23', 2.02, 5, 'Chine', 'Central', 13),
    ('Chen', 'Kai', 'Masculin', '1995-04-10', 1.96, 6, 'Chine', 'Attaquant', 13),
    ('Zhao', 'Peng', 'Masculin', '1993-06-18', 1.97, 7, 'Chine', 'Receveur-Attaquant', 13),
    ('Li', 'Wei', 'Masculin', '1992-08-12', 1.90, 8, 'Chine', 'Libero', 13),
    ('Sun', 'Yiming', 'Masculin', '1994-03-05', 2.00, 9, 'Chine', 'Attaquant', 13),
    ('Wang', 'Chao', 'Masculin', '1995-09-27', 1.98, 10, 'Chine', 'Receveur-Attaquant', 13),
    ('Tang', 'Jun', 'Masculin', '1993-12-11', 1.95, 11, 'Chine', 'Central', 13),
    ('Liu', 'Tao', 'Masculin', '1996-01-29', 1.97, 12, 'Chine', 'Attaquant', 13),
    ('Gao', 'Feng', 'Masculin', '1994-05-22', 1.99, 13, 'Chine', 'Libero', 13),
    ('Deng', 'Kai', 'Masculin', '1995-07-13', 2.01, 14, 'Chine', 'Central', 13);

    -- Japon
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Nagaoka', 'Yuji', 'Masculin', '1994-05-31', 1.97, 1, 'Japon', 'Passeur', 14),
    ('Yamagishi', 'Masahiro', 'Masculin', '1993-08-20', 1.98, 2, 'Japon', 'Attaquant', 14),
    ('Yoshida', 'Ryoma', 'Masculin', '1992-03-15', 1.99, 3, 'Japon', 'Central', 14),
    ('Fujita', 'Kei', 'Masculin', '1991-11-06', 1.96, 4, 'Japon', 'Receveur-Attaquant', 14),
    ('Murai', 'Takuya', 'Masculin', '1995-02-28', 2.00, 5, 'Japon', 'Central', 14),
    ('Ono', 'Toshiki', 'Masculin', '1993-07-14', 1.95, 6, 'Japon', 'Attaquant', 14),
    ('Yamamoto', 'Shota', 'Masculin', '1994-04-12', 1.97, 7, 'Japon', 'Receveur-Attaquant', 14),
    ('Sakai', 'Hiroshi', 'Masculin', '1992-12-23', 1.90, 8, 'Japon', 'Libero', 14),
    ('Tanaka', 'Kenta', 'Masculin', '1995-06-10', 2.01, 9, 'Japon', 'Attaquant', 14),
    ('Kobayashi', 'Shun', 'Masculin', '1993-09-02', 1.98, 10, 'Japon', 'Receveur-Attaquant', 14),
    ('Sato', 'Ryo', 'Masculin', '1994-01-18', 1.95, 11, 'Japon', 'Central', 14),
    ('Matsumoto', 'Taku', 'Masculin', '1996-03-30', 1.97, 12, 'Japon', 'Attaquant', 14),
    ('Kawasaki', 'Daiki', 'Masculin', '1995-05-14', 1.99, 13, 'Japon', 'Libero', 14),
    ('Hirano', 'Yuki', 'Masculin', '1994-07-07', 2.00, 14, 'Japon', 'Central', 14);

    -- Pologne
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Kurek', 'Bart', 'Masculin', '1988-08-29', 2.01, 1, 'Pologne', 'Passeur', 15),
    ('Zatorski', 'Fabian', 'Masculin', '1990-12-23', 1.95, 2, 'Pologne', 'Libero', 15),
    ('Wlazly', 'Mariusz', 'Masculin', '1983-08-22', 1.98, 3, 'Pologne', 'Attaquant', 15),
    ('Bednorz', 'Bartosz', 'Masculin', '1994-07-25', 1.97, 4, 'Pologne', 'Receveur-Attaquant', 15),
    ('Kubiak', 'Michał', 'Masculin', '1988-02-11', 2.00, 5, 'Pologne', 'Central', 15),
    ('Nowakowski', 'Piotr', 'Masculin', '1987-08-02', 2.02, 6, 'Pologne', 'Central', 15),
    ('Buszek', 'Jakub', 'Masculin', '1991-06-30', 1.97, 7, 'Pologne', 'Attaquant', 15),
    ('Konarski', 'Bartosz', 'Masculin', '1994-11-13', 1.96, 8, 'Pologne', 'Receveur-Attaquant', 15),
    ('Sliwka', 'Wilfred', 'Masculin', '1995-03-23', 1.99, 9, 'Pologne', 'Attaquant', 15),
    ('Klos', 'Michał', 'Masculin', '1988-06-08', 2.01, 10, 'Pologne', 'Central', 15),
    ('Mozdzonek', 'Grzegorz', 'Masculin', '1986-03-31', 2.02, 11, 'Pologne', 'Central', 15),
    ('Wojtaszek', 'Adam', 'Masculin', '1990-09-19', 1.98, 12, 'Pologne', 'Receveur-Attaquant', 15),
    ('Lisinac', 'Bartosz', 'Masculin', '1992-01-12', 2.03, 13, 'Pologne', 'Central', 15),
    ('Jankowski', 'Mateusz', 'Masculin', '1995-05-21', 1.97, 14, 'Pologne', 'Attaquant', 15);

    -- Serbie
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Podrascanin', 'Marko', 'Masculin', '1987-10-29', 2.04, 1, 'Serbie', 'Central', 16),
    ('Kovacevic', 'Aleksandar', 'Masculin', '1995-06-11', 1.98, 2, 'Serbie', 'Attaquant', 16),
    ('Atanasijevic', 'Nemanja', 'Masculin', '1987-08-14', 2.03, 3, 'Serbie', 'Receveur-Attaquant', 16),
    ('Lisinac', 'Marko', 'Masculin', '1990-06-03', 2.06, 4, 'Serbie', 'Central', 16),
    ('Petkovic', 'Aleksa', 'Masculin', '1992-09-20', 1.97, 5, 'Serbie', 'Attaquant', 16),
    ('Milenkovic', 'Uros', 'Masculin', '1994-05-14', 1.96, 6, 'Serbie', 'Receveur-Attaquant', 16),
    ('Aleksic', 'Vuk', 'Masculin', '1993-02-21', 1.95, 7, 'Serbie', 'Central', 16),
    ('Kovacevic', 'Marko', 'Masculin', '1991-08-18', 1.90, 8, 'Serbie', 'Libero', 16),
    ('Tomic', 'Sasa', 'Masculin', '1995-04-10', 2.01, 9, 'Serbie', 'Attaquant', 16),
    ('Stevanovic', 'Nikola', 'Masculin', '1992-07-07', 1.98, 10, 'Serbie', 'Receveur-Attaquant', 16),
    ('Gocic', 'Uros', 'Masculin', '1993-03-22', 1.97, 11, 'Serbie', 'Central', 16),
    ('Mitic', 'Aleksandar', 'Masculin', '1994-05-19', 1.99, 12, 'Serbie', 'Attaquant', 16),
    ('Petrovic', 'Nikola', 'Masculin', '1990-12-03', 1.98, 13, 'Serbie', 'Libero', 16),
    ('Zivkovic', 'Milan', 'Masculin', '1995-09-25', 2.00, 14, 'Serbie', 'Central', 16);

    -- Pays-Bas
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Verhoeven', 'Wout', 'Masculin', '1990-03-12', 2.00, 1, 'Pays-Bas', 'Passeur', 17),
    ('Akkerman', 'Ruben', 'Masculin', '1993-06-05', 1.97, 2, 'Pays-Bas', 'Attaquant', 17),
    ('Hoogendoorn', 'Niek', 'Masculin', '1992-09-17', 2.02, 3, 'Pays-Bas', 'Central', 17),
    ('Vermunt', 'Gijs', 'Masculin', '1994-01-08', 1.98, 4, 'Pays-Bas', 'Receveur-Attaquant', 17),
    ('Kooij', 'Thijs', 'Masculin', '1995-05-21', 2.01, 5, 'Pays-Bas', 'Central', 17),
    ('Steenbergen', 'Bas', 'Masculin', '1993-03-14', 1.96, 6, 'Pays-Bas', 'Attaquant', 17),
    ('Overbeek', 'Jasper', 'Masculin', '1994-11-30', 1.97, 7, 'Pays-Bas', 'Receveur-Attaquant', 17),
    ('Dijkstra', 'Tom', 'Masculin', '1992-07-19', 1.90, 8, 'Pays-Bas', 'Libero', 17),
    ('Smit', 'Rick', 'Masculin', '1991-12-12', 2.00, 9, 'Pays-Bas', 'Attaquant', 17),
    ('Brouwer', 'Harmen', 'Masculin', '1995-08-15', 1.98, 10, 'Pays-Bas', 'Receveur-Attaquant', 17),
    ('Vonk', 'Koen', 'Masculin', '1993-10-22', 1.95, 11, 'Pays-Bas', 'Central', 17),
    ('Visser', 'Jelle', 'Masculin', '1994-04-02', 1.97, 12, 'Pays-Bas', 'Attaquant', 17),
    ('Dekker', 'Arjan', 'Masculin', '1992-05-09', 1.99, 13, 'Pays-Bas', 'Libero', 17),
    ('Hendriks', 'Maarten', 'Masculin', '1995-06-27', 2.01, 14, 'Pays-Bas', 'Central', 17);

    -- Turquie
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Yilmaz', 'Berk', 'Masculin', '1991-04-15', 1.98, 1, 'Turquie', 'Passeur', 18),
    ('Kurt', 'Ahmet', 'Masculin', '1992-07-11', 1.97, 2, 'Turquie', 'Attaquant', 18),
    ('Demir', 'Ozan', 'Masculin', '1993-02-23', 2.00, 3, 'Turquie', 'Central', 18),
    ('Sahin', 'Emre', 'Masculin', '1994-06-05', 1.96, 4, 'Turquie', 'Receveur-Attaquant', 18),
    ('Aydin', 'Mert', 'Masculin', '1995-09-19', 2.01, 5, 'Turquie', 'Central', 18),
    ('Celik', 'Yusuf', 'Masculin', '1993-01-29', 1.96, 6, 'Turquie', 'Attaquant', 18),
    ('Kaya', 'Burak', 'Masculin', '1994-03-17', 1.97, 7, 'Turquie', 'Receveur-Attaquant', 18),
    ('Tekin', 'Ali', 'Masculin', '1992-08-08', 1.90, 8, 'Turquie', 'Libero', 18),
    ('Ozturk', 'Can', 'Masculin', '1991-11-20', 2.00, 9, 'Turquie', 'Attaquant', 18),
    ('Karaca', 'Hakan', 'Masculin', '1993-05-13', 1.98, 10, 'Turquie', 'Receveur-Attaquant', 18),
    ('Demirtaş', 'Serkan', 'Masculin', '1994-09-27', 1.95, 11, 'Turquie', 'Central', 18),
    ('Gunes', 'Onur', 'Masculin', '1995-12-11', 1.97, 12, 'Turquie', 'Attaquant', 18),
    ('Polat', 'Kerem', 'Masculin', '1992-04-07', 1.99, 13, 'Turquie', 'Libero', 18),
    ('Özdemir', 'Ege', 'Masculin', '1993-06-30', 2.01, 14, 'Turquie', 'Central', 18);

    -- Belgique
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Van Dijk', 'Jasper', 'Masculin', '1990-03-28', 2.00, 1, 'Belgique', 'Passeur', 19),
    ('Claes', 'Tom', 'Masculin', '1992-06-14', 1.97, 2, 'Belgique', 'Attaquant', 19),
    ('Peeters', 'Dries', 'Masculin', '1993-02-21', 2.01, 3, 'Belgique', 'Central', 19),
    ('Hermans', 'Joren', 'Masculin', '1994-09-05', 1.96, 4, 'Belgique', 'Receveur-Attaquant', 19),
    ('Vandenberg', 'Koen', 'Masculin', '1995-12-12', 2.00, 5, 'Belgique', 'Central', 19),
    ('Bastiaens', 'Lars', 'Masculin', '1993-07-08', 1.95, 6, 'Belgique', 'Attaquant', 19),
    ('Cools', 'Niels', 'Masculin', '1994-04-23', 1.97, 7, 'Belgique', 'Receveur-Attaquant', 19),
    ('Vandenbroucke', 'Mathias', 'Masculin', '1992-11-16', 1.90, 8, 'Belgique', 'Libero', 19),
    ('Rombouts', 'Stijn', 'Masculin', '1991-08-30', 2.00, 9, 'Belgique', 'Attaquant', 19),
    ('Martens', 'Jelle', 'Masculin', '1994-01-10', 1.98, 10, 'Belgique', 'Receveur-Attaquant', 19),
    ('Jacobs', 'Kevin', 'Masculin', '1993-05-19', 1.95, 11, 'Belgique', 'Central', 19),
    ('Maes', 'Lukas', 'Masculin', '1995-09-22', 1.97, 12, 'Belgique', 'Attaquant', 19),
    ('Wouters', 'Mathieu', 'Masculin', '1992-02-11', 1.99, 13, 'Belgique', 'Libero', 19),
    ('Hermans', 'Thijs', 'Masculin', '1994-06-07', 2.01, 14, 'Belgique', 'Central', 19);

    -- Espagne
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Ruiz', 'Pablo', 'Masculin', '1991-07-12', 1.98, 1, 'Espagne', 'Passeur', 20),
    ('Gonzalez', 'Miguel', 'Masculin', '1993-03-21', 1.97, 2, 'Espagne', 'Attaquant', 20),
    ('Hernandez', 'Carlos', 'Masculin', '1990-11-04', 2.00, 3, 'Espagne', 'Central', 20),
    ('Martinez', 'Alvaro', 'Masculin', '1992-08-18', 1.96, 4, 'Espagne', 'Receveur-Attaquant', 20),
    ('Sanchez', 'Diego', 'Masculin', '1994-01-30', 2.01, 5, 'Espagne', 'Central', 20),
    ('Lopez', 'Antonio', 'Masculin', '1995-05-05', 1.95, 6, 'Espagne', 'Attaquant', 20),
    ('Garcia', 'Javier', 'Masculin', '1993-09-14', 1.97, 7, 'Espagne', 'Receveur-Attaquant', 20),
    ('Rodriguez', 'Luis', 'Masculin', '1992-04-22', 1.90, 8, 'Espagne', 'Libero', 20),
    ('Navarro', 'Fernando', 'Masculin', '1991-12-12', 2.00, 9, 'Espagne', 'Attaquant', 20),
    ('Vargas', 'Sergio', 'Masculin', '1994-06-11', 1.98, 10, 'Espagne', 'Receveur-Attaquant', 20),
    ('Blanco', 'Jorge', 'Masculin', '1993-05-07', 1.95, 11, 'Espagne', 'Central', 20),
    ('Cruz', 'Pablo', 'Masculin', '1995-10-09', 1.97, 12, 'Espagne', 'Attaquant', 20),
    ('Ramos', 'Miguel', 'Masculin', '1992-08-15', 1.99, 13, 'Espagne', 'Libero', 20),
    ('Molina', 'Andres', 'Masculin', '1994-11-28', 2.01, 14, 'Espagne', 'Central', 20);

    -- Angleterre
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Smith', 'James', 'Masculin', '1992-03-12', 1.98, 1, 'Angleterre', 'Passeur', 21),
    ('Brown', 'Daniel', 'Masculin', '1993-06-08', 1.97, 2, 'Angleterre', 'Attaquant', 21),
    ('Taylor', 'Michael', 'Masculin', '1991-09-22', 2.00, 3, 'Angleterre', 'Central', 21),
    ('Johnson', 'Andrew', 'Masculin', '1994-01-15', 1.96, 4, 'Angleterre', 'Receveur-Attaquant', 21),
    ('Wilson', 'Christopher', 'Masculin', '1995-05-19', 2.01, 5, 'Angleterre', 'Central', 21),
    ('Evans', 'Matthew', 'Masculin', '1993-03-03', 1.95, 6, 'Angleterre', 'Attaquant', 21),
    ('Robinson', 'David', 'Masculin', '1994-08-20', 1.97, 7, 'Angleterre', 'Receveur-Attaquant', 21),
    ('Walker', 'John', 'Masculin', '1992-12-10', 1.90, 8, 'Angleterre', 'Libero', 21),
    ('Hall', 'James', 'Masculin', '1991-07-14', 2.00, 9, 'Angleterre', 'Attaquant', 21),
    ('Allen', 'Joseph', 'Masculin', '1994-04-06', 1.98, 10, 'Angleterre', 'Receveur-Attaquant', 21),
    ('Young', 'Robert', 'Masculin', '1993-11-22', 1.95, 11, 'Angleterre', 'Central', 21),
    ('King', 'Thomas', 'Masculin', '1995-09-18', 1.97, 12, 'Angleterre', 'Attaquant', 21),
    ('Wright', 'Steven', 'Masculin', '1992-05-03', 1.99, 13, 'Angleterre', 'Libero', 21),
    ('Scott', 'Anthony', 'Masculin', '1994-06-25', 2.01, 14, 'Angleterre', 'Central', 21);

    -- Thaïlande
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Anurak', 'Somsak', 'Masculin', '1993-02-17', 1.95, 1, 'Thaïlande', 'Passeur', 22),
    ('Chatchai', 'Prasit', 'Masculin', '1992-07-21', 1.94, 2, 'Thaïlande', 'Attaquant', 22),
    ('Somsak', 'Niwat', 'Masculin', '1994-05-12', 1.96, 3, 'Thaïlande', 'Central', 22),
    ('Nattapong', 'Preecha', 'Masculin', '1995-09-30', 1.93, 4, 'Thaïlande', 'Receveur-Attaquant', 22),
    ('Chaiwat', 'Wichai', 'Masculin', '1991-11-02', 1.97, 5, 'Thaïlande', 'Central', 22),
    ('Sakda', 'Pongsak', 'Masculin', '1992-03-18', 1.92, 6, 'Thaïlande', 'Attaquant', 22),
    ('Kittisak', 'Somchai', 'Masculin', '1993-06-11', 1.94, 7, 'Thaïlande', 'Receveur-Attaquant', 22),
    ('Prasit', 'Anucha', 'Masculin', '1994-12-09', 1.90, 8, 'Thaïlande', 'Libero', 22),
    ('Somchai', 'Wutthichai', 'Masculin', '1995-04-27', 1.96, 9, 'Thaïlande', 'Attaquant', 22),
    ('Wichai', 'Chalerm', 'Masculin', '1993-08-05', 1.95, 10, 'Thaïlande', 'Receveur-Attaquant', 22),
    ('Anucha', 'Nattapong', 'Masculin', '1992-10-20', 1.94, 11, 'Thaïlande', 'Central', 22),
    ('Wutthichai', 'Sakda', 'Masculin', '1994-01-30', 1.95, 12, 'Thaïlande', 'Attaquant', 22),
    ('Preecha', 'Chatchai', 'Masculin', '1993-03-17', 1.97, 13, 'Thaïlande', 'Libero', 22),
    ('Somchai', 'Kittisak', 'Masculin', '1995-06-11', 1.96, 14, 'Thaïlande', 'Central', 22);

    -- Kazakhstan
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Akhmetov', 'Daniyar', 'Masculin', '1992-03-05', 1.98, 1, 'Kazakhstan', 'Passeur', 23),
    ('Sabitov', 'Azamat', 'Masculin', '1993-06-18', 1.97, 2, 'Kazakhstan', 'Attaquant', 23),
    ('Nursultan', 'Alikhan', 'Masculin', '1991-09-21', 2.00, 3, 'Kazakhstan', 'Central', 23),
    ('Tulegenov', 'Marat', 'Masculin', '1994-01-12', 1.96, 4, 'Kazakhstan', 'Receveur-Attaquant', 23),
    ('Zhanibek', 'Serik', 'Masculin', '1995-05-08', 2.01, 5, 'Kazakhstan', 'Central', 23),
    ('Yerzhan', 'Baurzhan', 'Masculin', '1993-02-26', 1.95, 6, 'Kazakhstan', 'Attaquant', 23),
    ('Aruzhan', 'Ermek', 'Masculin', '1994-07-19', 1.97, 7, 'Kazakhstan', 'Receveur-Attaquant', 23),
    ('Rustem', 'Timur', 'Masculin', '1992-11-03', 1.90, 8, 'Kazakhstan', 'Libero', 23),
    ('Daniyar', 'Murad', 'Masculin', '1991-08-27', 2.00, 9, 'Kazakhstan', 'Attaquant', 23),
    ('Azamat', 'Ruslan', 'Masculin', '1993-04-16', 1.98, 10, 'Kazakhstan', 'Receveur-Attaquant', 23),
    ('Alikhan', 'Bekzat', 'Masculin', '1994-12-10', 1.95, 11, 'Kazakhstan', 'Central', 23),
    ('Marat', 'Erbol', 'Masculin', '1995-03-28', 1.97, 12, 'Kazakhstan', 'Attaquant', 23),
    ('Serik', 'Erlan', 'Masculin', '1992-06-15', 1.99, 13, 'Kazakhstan', 'Libero', 23),
    ('Baurzhan', 'Kanat', 'Masculin', '1994-09-22', 2.01, 14, 'Kazakhstan', 'Central', 23);

    -- Corée du Sud
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Lee', 'Jin', 'Masculin', '1992-02-18', 1.97, 1, 'Corée du Sud', 'Passeur', 24),
    ('Kim', 'Min', 'Masculin', '1993-06-22', 1.96, 2, 'Corée du Sud', 'Attaquant', 24),
    ('Park', 'Joon', 'Masculin', '1991-09-14', 1.99, 3, 'Corée du Sud', 'Central', 24),
    ('Choi', 'Sung', 'Masculin', '1994-01-07', 1.95, 4, 'Corée du Sud', 'Receveur-Attaquant', 24),
    ('Jung', 'Hyun', 'Masculin', '1995-05-25', 2.00, 5, 'Corée du Sud', 'Central', 24),
    ('Oh', 'Seok', 'Masculin', '1993-03-18', 1.94, 6, 'Corée du Sud', 'Attaquant', 24),
    ('Kang', 'Dong', 'Masculin', '1994-07-11', 1.96, 7, 'Corée du Sud', 'Receveur-Attaquant', 24),
    ('Yoon', 'Sang', 'Masculin', '1992-12-03', 1.90, 8, 'Corée du Sud', 'Libero', 24),
    ('Lim', 'Hyuk', 'Masculin', '1991-08-21', 2.00, 9, 'Corée du Sud', 'Attaquant', 24),
    ('Seo', 'Jae', 'Masculin', '1993-04-17', 1.98, 10, 'Corée du Sud', 'Receveur-Attaquant', 24),
    ('Hwang', 'Min', 'Masculin', '1994-11-05', 1.95, 11, 'Corée du Sud', 'Central', 24),
    ('Baek', 'Jin', 'Masculin', '1995-02-28', 1.97, 12, 'Corée du Sud', 'Attaquant', 24),
    ('Chung', 'Woo', 'Masculin', '1992-06-09', 1.99, 13, 'Corée du Sud', 'Libero', 24),
    ('Han', 'Seung', 'Masculin', '1994-09-14', 2.01, 14, 'Corée du Sud', 'Central', 24);

    -- Australie
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Smith', 'Liam', 'Masculin', '1992-04-12', 1.98, 1, 'Australie', 'Passeur', 25),
    ('Brown', 'Ethan', 'Masculin', '1993-07-18', 1.97, 2, 'Australie', 'Attaquant', 25),
    ('Wilson', 'Jack', 'Masculin', '1991-10-22', 2.00, 3, 'Australie', 'Central', 25),
    ('Taylor', 'Noah', 'Masculin', '1994-01-15', 1.96, 4, 'Australie', 'Receveur-Attaquant', 25),
    ('Johnson', 'Lucas', 'Masculin', '1995-05-10', 2.01, 5, 'Australie', 'Central', 25),
    ('Evans', 'Mason', 'Masculin', '1993-03-04', 1.95, 6, 'Australie', 'Attaquant', 25),
    ('Martin', 'Ryan', 'Masculin', '1994-08-21', 1.97, 7, 'Australie', 'Receveur-Attaquant', 25),
    ('Lee', 'Owen', 'Masculin', '1992-12-09', 1.90, 8, 'Australie', 'Libero', 25),
    ('Harris', 'Thomas', 'Masculin', '1991-07-25', 2.00, 9, 'Australie', 'Attaquant', 25),
    ('Walker', 'Cameron', 'Masculin', '1994-04-18', 1.98, 10, 'Australie', 'Receveur-Attaquant', 25),
    ('King', 'Samuel', 'Masculin', '1993-11-11', 1.95, 11, 'Australie', 'Central', 25),
    ('Wright', 'Benjamin', 'Masculin', '1995-09-05', 1.97, 12, 'Australie', 'Attaquant', 25),
    ('Scott', 'Alexander', 'Masculin', '1992-05-02', 1.99, 13, 'Australie', 'Libero', 25),
    ('Adams', 'Nathan', 'Masculin', '1994-06-28', 2.01, 14, 'Australie', 'Central', 25);

    -- Paraguay
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Gonzalez', 'Luis', 'Masculin', '1992-02-14', 1.97, 1, 'Paraguay', 'Passeur', 26),
    ('Lopez', 'Carlos', 'Masculin', '1993-06-19', 1.96, 2, 'Paraguay', 'Attaquant', 26),
    ('Rodriguez', 'Miguel', 'Masculin', '1991-09-25', 1.99, 3, 'Paraguay', 'Central', 26),
    ('Fernandez', 'Jorge', 'Masculin', '1994-01-30', 1.95, 4, 'Paraguay', 'Receveur-Attaquant', 26),
    ('Martinez', 'Diego', 'Masculin', '1995-05-12', 2.00, 5, 'Paraguay', 'Central', 26),
    ('Vega', 'Antonio', 'Masculin', '1993-03-17', 1.94, 6, 'Paraguay', 'Attaquant', 26),
    ('Silva', 'Juan', 'Masculin', '1994-08-21', 1.96, 7, 'Paraguay', 'Receveur-Attaquant', 26),
    ('Ortiz', 'Pedro', 'Masculin', '1992-12-03', 1.90, 8, 'Paraguay', 'Libero', 26),
    ('Ramirez', 'Javier', 'Masculin', '1991-07-15', 2.00, 9, 'Paraguay', 'Attaquant', 26),
    ('Torres', 'Victor', 'Masculin', '1994-04-22', 1.98, 10, 'Paraguay', 'Receveur-Attaquant', 26),
    ('Alvarez', 'Emilio', 'Masculin', '1993-11-05', 1.95, 11, 'Paraguay', 'Central', 26),
    ('Sanchez', 'Hector', 'Masculin', '1995-09-18', 1.97, 12, 'Paraguay', 'Attaquant', 26),
    ('Gimenez', 'Felipe', 'Masculin', '1992-05-10', 1.99, 13, 'Paraguay', 'Libero', 26),
    ('Diaz', 'Rafael', 'Masculin', '1994-06-23', 2.01, 14, 'Paraguay', 'Central', 26);

    -- Uruguay
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Gomez', 'Matias', 'Masculin', '1992-03-16', 1.98, 1, 'Uruguay', 'Passeur', 27),
    ('Rodriguez', 'Diego', 'Masculin', '1993-07-21', 1.97, 2, 'Uruguay', 'Attaquant', 27),
    ('Fernandez', 'Lucas', 'Masculin', '1991-10-28', 2.00, 3, 'Uruguay', 'Central', 27),
    ('Martinez', 'Nicolas', 'Masculin', '1994-01-11', 1.96, 4, 'Uruguay', 'Receveur-Attaquant', 27),
    ('Diaz', 'Joaquin', 'Masculin', '1995-05-20', 2.01, 5, 'Uruguay', 'Central', 27),
    ('Alvarez', 'Martin', 'Masculin', '1993-03-19', 1.95, 6, 'Uruguay', 'Attaquant', 27),
    ('Silva', 'Facundo', 'Masculin', '1994-08-25', 1.97, 7, 'Uruguay', 'Receveur-Attaquant', 27),
    ('Perez', 'Santiago', 'Masculin', '1992-12-05', 1.90, 8, 'Uruguay', 'Libero', 27),
    ('Gimenez', 'Federico', 'Masculin', '1991-07-17', 2.00, 9, 'Uruguay', 'Attaquant', 27),
    ('Lopez', 'Andres', 'Masculin', '1994-04-24', 1.98, 10, 'Uruguay', 'Receveur-Attaquant', 27),
    ('Torres', 'Bruno', 'Masculin', '1993-11-07', 1.95, 11, 'Uruguay', 'Central', 27),
    ('Vega', 'Maximiliano', 'Masculin', '1995-09-20', 1.97, 12, 'Uruguay', 'Attaquant', 27),
    ('Morales', 'Emiliano', 'Masculin', '1992-05-13', 1.99, 13, 'Uruguay', 'Libero', 27),
    ('Castro', 'Diego', 'Masculin', '1994-06-27', 2.01, 14, 'Uruguay', 'Central', 27);

    -- Afrique du Sud
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Nkosi', 'Thabo', 'Masculin', '1992-04-22', 1.98, 1, 'Afrique du Sud', 'Passeur', 28),
    ('van der Merwe', 'Johan', 'Masculin', '1993-07-30', 1.97, 2, 'Afrique du Sud', 'Attaquant', 28),
    ('Botha', 'Siyabonga', 'Masculin', '1991-10-15', 2.00, 3, 'Afrique du Sud', 'Central', 28),
    ('Pieterse', 'Leroy', 'Masculin', '1994-01-19', 1.96, 4, 'Afrique du Sud', 'Receveur-Attaquant', 28),
    ('Smith', 'Kagiso', 'Masculin', '1995-05-14', 2.01, 5, 'Afrique du Sud', 'Central', 28),
    ('Mokoena', 'Sipho', 'Masculin', '1993-03-23', 1.95, 6, 'Afrique du Sud', 'Attaquant', 28),
    ('Mahlangu', 'Thulani', 'Masculin', '1994-08-08', 1.97, 7, 'Afrique du Sud', 'Receveur-Attaquant', 28),
    ('Dlamini', 'Sabelo', 'Masculin', '1992-12-11', 1.90, 8, 'Afrique du Sud', 'Libero', 28),
    ('van Wyk', 'Hendrik', 'Masculin', '1991-07-21', 2.00, 9, 'Afrique du Sud', 'Attaquant', 28),
    ('Jansen', 'Ruan', 'Masculin', '1994-04-25', 1.98, 10, 'Afrique du Sud', 'Receveur-Attaquant', 28),
    ('Steyn', 'Gerrit', 'Masculin', '1993-11-12', 1.95, 11, 'Afrique du Sud', 'Central', 28),
    ('Coetzee', 'Dylan', 'Masculin', '1995-09-08', 1.97, 12, 'Afrique du Sud', 'Attaquant', 28),
    ('Botha', 'Riaan', 'Masculin', '1992-05-21', 1.99, 13, 'Afrique du Sud', 'Libero', 28),
    ('van der Westhuizen', 'Frans', 'Masculin', '1994-06-29', 2.01, 14, 'Afrique du Sud', 'Central', 28);

    -- Maroc
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('El Amrani', 'Youssef', 'Masculin', '1992-04-18', 1.97, 1, 'Maroc', 'Passeur', 29),
    ('Bouazza', 'Mohamed', 'Masculin', '1993-07-23', 1.96, 2, 'Maroc', 'Attaquant', 29),
    ('Haddadi', 'Mehdi', 'Masculin', '1991-10-12', 2.00, 3, 'Maroc', 'Central', 29),
    ('Benali', 'Rachid', 'Masculin', '1994-01-21', 1.96, 4, 'Maroc', 'Receveur-Attaquant', 29),
    ('Bennani', 'Adil', 'Masculin', '1995-05-17', 2.01, 5, 'Maroc', 'Central', 29),
    ('El Fassi', 'Yassine', 'Masculin', '1993-03-21', 1.95, 6, 'Maroc', 'Attaquant', 29),
    ('Zeroual', 'Amine', 'Masculin', '1994-08-13', 1.97, 7, 'Maroc', 'Receveur-Attaquant', 29),
    ('Ouhaddou', 'Rayan', 'Masculin', '1992-12-07', 1.90, 8, 'Maroc', 'Libero', 29),
    ('Cherkaoui', 'Anas', 'Masculin', '1991-07-17', 2.00, 9, 'Maroc', 'Attaquant', 29),
    ('El Idrissi', 'Sofiane', 'Masculin', '1994-04-22', 1.98, 10, 'Maroc', 'Receveur-Attaquant', 29),
    ('Boukadida', 'Hamid', 'Masculin', '1993-11-09', 1.95, 11, 'Maroc', 'Central', 29),
    ('Bouhaddi', 'Yassir', 'Masculin', '1995-09-25', 1.97, 12, 'Maroc', 'Attaquant', 29),
    ('Amrani', 'Omar', 'Masculin', '1992-05-05', 1.99, 13, 'Maroc', 'Libero', 29),
    ('El Khalfi', 'Mohammed', 'Masculin', '1994-06-20', 2.01, 14, 'Maroc', 'Central', 29);

    -- Arabie Saoudite
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Al-Shehri', 'Fahad', 'Masculin', '1992-03-14', 1.97, 1, 'Arabie Saoudite', 'Passeur', 30),
    ('Al-Qahtani', 'Mohammed', 'Masculin', '1993-07-19', 1.96, 2, 'Arabie Saoudite', 'Attaquant', 30),
    ('Al-Mutairi', 'Abdullah', 'Masculin', '1991-10-11', 2.00, 3, 'Arabie Saoudite', 'Central', 30),
    ('Al-Harbi', 'Nasser', 'Masculin', '1994-01-19', 1.96, 4, 'Arabie Saoudite', 'Receveur-Attaquant', 30),
    ('Al-Fahad', 'Saad', 'Masculin', '1995-05-21', 2.01, 5, 'Arabie Saoudite', 'Central', 30),
    ('Al-Rashid', 'Khalid', 'Masculin', '1993-03-15', 1.95, 6, 'Arabie Saoudite', 'Attaquant', 30),
    ('Al-Jaber', 'Yousef', 'Masculin', '1994-08-09', 1.97, 7, 'Arabie Saoudite', 'Receveur-Attaquant', 30),
    ('Al-Zahrani', 'Omar', 'Masculin', '1992-12-08', 1.90, 8, 'Arabie Saoudite', 'Libero', 30),
    ('Al-Hassan', 'Riyadh', 'Masculin', '1991-07-17', 2.00, 9, 'Arabie Saoudite', 'Attaquant', 30),
    ('Al-Shammari', 'Fahad', 'Masculin', '1994-04-23', 1.98, 10, 'Arabie Saoudite', 'Receveur-Attaquant', 30),
    ('Al-Mansour', 'Sami', 'Masculin', '1993-11-07', 1.95, 11, 'Arabie Saoudite', 'Central', 30),
    ('Al-Khalid', 'Ahmed', 'Masculin', '1995-09-19', 1.97, 12, 'Arabie Saoudite', 'Attaquant', 30),
    ('Al-Saud', 'Majed', 'Masculin', '1992-05-07', 1.99, 13, 'Arabie Saoudite', 'Libero', 30),
    ('Al-Farsi', 'Tariq', 'Masculin', '1994-06-25', 2.01, 14, 'Arabie Saoudite', 'Central', 30);

    -- Tunisie
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Ben Salah', 'Mohamed', 'Masculin', '1992-03-19', 1.97, 1, 'Tunisie', 'Passeur', 31),
    ('Khemiri', 'Ahmed', 'Masculin', '1993-07-22', 1.96, 2, 'Tunisie', 'Attaquant', 31),
    ('Trabelsi', 'Sami', 'Masculin', '1991-10-13', 2.00, 3, 'Tunisie', 'Central', 31),
    ('Haddad', 'Youssef', 'Masculin', '1994-01-18', 1.96, 4, 'Tunisie', 'Receveur-Attaquant', 31),
    ('Ben Youssef', 'Amine', 'Masculin', '1995-05-16', 2.01, 5, 'Tunisie', 'Central', 31),
    ('Jaziri', 'Omar', 'Masculin', '1993-03-12', 1.95, 6, 'Tunisie', 'Attaquant', 31),
    ('Masmoudi', 'Mohamed', 'Masculin', '1994-08-14', 1.97, 7, 'Tunisie', 'Receveur-Attaquant', 31),
    ('Bouazizi', 'Ali', 'Masculin', '1992-12-09', 1.90, 8, 'Tunisie', 'Libero', 31),
    ('Ben Amor', 'Sofiene', 'Masculin', '1991-07-21', 2.00, 9, 'Tunisie', 'Attaquant', 31),
    ('Gharbi', 'Anis', 'Masculin', '1994-04-20', 1.98, 10, 'Tunisie', 'Receveur-Attaquant', 31),
    ('Chakroun', 'Rami', 'Masculin', '1993-11-08', 1.95, 11, 'Tunisie', 'Central', 31),
    ('Ben Ali', 'Hatem', 'Masculin', '1995-09-19', 1.97, 12, 'Tunisie', 'Attaquant', 31),
    ('Triki', 'Mohamed', 'Masculin', '1992-05-06', 1.99, 13, 'Tunisie', 'Libero', 31),
    ('Khaldi', 'Firas', 'Masculin', '1994-06-24', 2.01, 14, 'Tunisie', 'Central', 31);

    -- Saint-Marin
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe) VALUES
    ('Berti', 'Marco', 'Masculin', '1992-03-20', 1.97, 1, 'Saint-Marin', 'Passeur', 32),
    ('Pettinelli', 'Luca', 'Masculin', '1993-07-24', 1.96, 2, 'Saint-Marin', 'Attaquant', 32),
    ('Gasperoni', 'Matteo', 'Masculin', '1991-10-14', 2.00, 3, 'Saint-Marin', 'Central', 32),
    ('Berardi', 'Alessandro', 'Masculin', '1994-01-20', 1.96, 4, 'Saint-Marin', 'Receveur-Attaquant', 32),
    ('Mancini', 'Fabio', 'Masculin', '1995-05-18', 2.01, 5, 'Saint-Marin', 'Central', 32),
    ('Toni', 'Daniele', 'Masculin', '1993-03-14', 1.95, 6, 'Saint-Marin', 'Attaquant', 32),
    ('Cecchini', 'Andrea', 'Masculin', '1994-08-15', 1.97, 7, 'Saint-Marin', 'Receveur-Attaquant', 32),
    ('Battistini', 'Francesco', 'Masculin', '1992-12-10', 1.90, 8, 'Saint-Marin', 'Libero', 32),
    ('Mularoni', 'Gabriele', 'Masculin', '1991-07-22', 2.00, 9, 'Saint-Marin', 'Attaquant', 32),
    ('Baldacci', 'Stefano', 'Masculin', '1994-04-21', 1.98, 10, 'Saint-Marin', 'Receveur-Attaquant', 32),
    ('Guidi', 'Simone', 'Masculin', '1993-11-09', 1.95, 11, 'Saint-Marin', 'Central', 32),
    ('Canti', 'Lorenzo', 'Masculin', '1995-09-20', 1.97, 12, 'Saint-Marin', 'Attaquant', 32),
    ('Tomassini', 'Alberto', 'Masculin', '1992-05-07', 1.99, 13, 'Saint-Marin', 'Libero', 32),
    ('Fabbri', 'Riccardo', 'Masculin', '1994-06-26', 2.01, 14, 'Saint-Marin', 'Central', 32);

    `;
    await pool.query(insertJoueurEquipe);

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
    INSERT INTO Siege (numero_colonne, numero_ligne, est_reserve, dans_panier, id_utilisateur, zone) VALUES
    ('A', 1, TRUE, FALSE, NULL, 'NORD'), ('A', 2, TRUE, FALSE, NULL, 'NORD'), ('A', 3, TRUE, FALSE, NULL, 'NORD'), ('A', 4, FALSE, FALSE, NULL, 'NORD'),
    ('A', 5, FALSE, FALSE, NULL, 'NORD'), ('A', 6, FALSE, FALSE, NULL, 'NORD'), ('A', 7, FALSE, FALSE, NULL, 'NORD'), ('A', 8, FALSE, FALSE, NULL, 'NORD'),
    ('A', 9, FALSE, FALSE, NULL, 'NORD'), ('A', 10, FALSE, FALSE, NULL, 'NORD'), ('A', 11, FALSE, FALSE, NULL, 'NORD'), ('A', 12, FALSE, FALSE, NULL, 'NORD'),

    ('B', 1, FALSE, FALSE, NULL, 'NORD'), ('B', 2, FALSE, FALSE, NULL, 'NORD'), ('B', 3, FALSE, FALSE, NULL, 'NORD'), ('B', 4, FALSE, FALSE, NULL, 'NORD'),
    ('B', 5, FALSE, FALSE, NULL, 'NORD'), ('B', 6, FALSE, FALSE, NULL, 'NORD'), ('B', 7, FALSE, FALSE, NULL, 'NORD'), ('B', 8, FALSE, FALSE, NULL, 'NORD'),
    ('B', 9, FALSE, FALSE, NULL, 'NORD'), ('B', 10, FALSE, FALSE, NULL, 'NORD'), ('B', 11, FALSE, FALSE, NULL, 'NORD'), ('B', 12, FALSE, FALSE, NULL, 'NORD'),

    ('C', 1, FALSE, FALSE, NULL, 'NORD'), ('C', 2, FALSE, FALSE, NULL, 'NORD'), ('C', 3, FALSE, FALSE, NULL, 'NORD'), ('C', 4, FALSE, FALSE, NULL, 'NORD'),
    ('C', 5, FALSE, FALSE, NULL, 'NORD'), ('C', 6, FALSE, FALSE, NULL, 'NORD'), ('C', 7, FALSE, FALSE, NULL, 'NORD'), ('C', 8, FALSE, FALSE, NULL, 'NORD'),
    ('C', 9, FALSE, FALSE, NULL, 'NORD'), ('C', 10, FALSE, FALSE, NULL, 'NORD'), ('C', 11, FALSE, FALSE, NULL, 'NORD'), ('C', 12, FALSE, FALSE, NULL, 'NORD'),

    ('D', 1, FALSE, FALSE, NULL, 'NORD'), ('D', 2, FALSE, FALSE, NULL, 'NORD'), ('D', 3, FALSE, FALSE, NULL, 'NORD'), ('D', 4, FALSE, FALSE, NULL, 'NORD'),
    ('D', 5, FALSE, FALSE, NULL, 'NORD'), ('D', 6, FALSE, FALSE, NULL, 'NORD'), ('D', 7, FALSE, FALSE, NULL, 'NORD'), ('D', 8, FALSE, FALSE, NULL, 'NORD'),
    ('D', 9, FALSE, FALSE, NULL, 'NORD'), ('D', 10, FALSE, FALSE, NULL, 'NORD'), ('D', 11, FALSE, FALSE, NULL, 'NORD'), ('D', 12, FALSE, FALSE, NULL, 'NORD'),

    ('E', 1, FALSE, FALSE, NULL, 'NORD'), ('E', 2, FALSE, FALSE, NULL, 'NORD'), ('E', 3, FALSE, FALSE, NULL, 'NORD'), ('E', 4, FALSE, FALSE, NULL, 'NORD'),
    ('E', 5, FALSE, FALSE, NULL, 'NORD'), ('E', 6, FALSE, FALSE, NULL, 'NORD'), ('E', 7, FALSE, FALSE, NULL, 'NORD'), ('E', 8, FALSE, FALSE, NULL, 'NORD'),
    ('E', 9, FALSE, FALSE, NULL, 'NORD'), ('E', 10, FALSE, FALSE, NULL, 'NORD'), ('E', 11, FALSE, FALSE, NULL, 'NORD'), ('E', 12, FALSE, FALSE, NULL, 'NORD'),

    ('F', 1, FALSE, FALSE, NULL, 'NORD'), ('F', 2, FALSE, FALSE, NULL, 'NORD'), ('F', 3, FALSE, FALSE, NULL, 'NORD'), ('F', 4, FALSE, FALSE, NULL, 'NORD'),
    ('F', 5, FALSE, FALSE, NULL, 'NORD'), ('F', 6, FALSE, FALSE, NULL, 'NORD'), ('F', 7, FALSE, FALSE, NULL, 'NORD'), ('F', 8, FALSE, FALSE, NULL, 'NORD'),
    ('F', 9, FALSE, FALSE, NULL, 'NORD'), ('F', 10, FALSE, FALSE, NULL, 'NORD'), ('F', 11, FALSE, FALSE, NULL, 'NORD'), ('F', 12, FALSE, FALSE, NULL, 'NORD'),

    ('G', 1, FALSE, FALSE, NULL, 'NORD'), ('G', 2, FALSE, FALSE, NULL, 'NORD'), ('G', 3, FALSE, FALSE, NULL, 'NORD'), ('G', 4, FALSE, FALSE, NULL, 'NORD'),
    ('G', 5, FALSE, FALSE, NULL, 'NORD'), ('G', 6, FALSE, FALSE, NULL, 'NORD'), ('G', 7, FALSE, FALSE, NULL, 'NORD'), ('G', 8, FALSE, FALSE, NULL, 'NORD'),
    ('G', 9, FALSE, FALSE, NULL, 'NORD'), ('G', 10, FALSE, FALSE, NULL, 'NORD'), ('G', 11, FALSE, FALSE, NULL, 'NORD'), ('G', 12, FALSE, FALSE, NULL, 'NORD'),

    ('H', 1, FALSE, FALSE, NULL, 'NORD'), ('H', 2, FALSE, FALSE, NULL, 'NORD'), ('H', 3, FALSE, FALSE, NULL, 'NORD'), ('H', 4, FALSE, FALSE, NULL, 'NORD'),
    ('H', 5, FALSE, FALSE, NULL, 'NORD'), ('H', 6, FALSE, FALSE, NULL, 'NORD'), ('H', 7, FALSE, FALSE, NULL, 'NORD'), ('H', 8, FALSE, FALSE, NULL, 'NORD'),
    ('H', 9, FALSE, FALSE, NULL, 'NORD'), ('H', 10, FALSE, FALSE, NULL, 'NORD'), ('H', 11, FALSE, FALSE, NULL, 'NORD'), ('H', 12, FALSE, FALSE, NULL, 'NORD'),

    ('I', 1, FALSE, FALSE, NULL, 'NORD'), ('I', 2, FALSE, FALSE, NULL, 'NORD'), ('I', 3, FALSE, FALSE, NULL, 'NORD'), ('I', 4, FALSE, FALSE, NULL, 'NORD'),


    ('A', 1, FALSE, FALSE, NULL, 'EST'), ('A', 2, FALSE, FALSE, NULL, 'EST'), ('A', 3, FALSE, FALSE, NULL, 'EST'), ('A', 4, TRUE, FALSE, NULL, 'EST'),
    ('A', 5, TRUE, FALSE, NULL, 'EST'), ('A', 6, TRUE, FALSE, NULL, 'EST'), ('A', 7, FALSE, FALSE, NULL, 'EST'), ('A', 8, FALSE, FALSE, NULL, 'EST'),
    ('A', 9, FALSE, FALSE, NULL, 'EST'), ('A', 10, FALSE, FALSE, NULL, 'EST'), ('A', 11, FALSE, FALSE, NULL, 'EST'), ('A', 12, FALSE, FALSE, NULL, 'EST'),

    ('B', 1, FALSE, FALSE, NULL, 'EST'), ('B', 2, FALSE, FALSE, NULL, 'EST'), ('B', 3, FALSE, FALSE, NULL, 'EST'), ('B', 4, FALSE, FALSE, NULL, 'EST'),
    ('B', 5, FALSE, FALSE, NULL, 'EST'), ('B', 6, FALSE, FALSE, NULL, 'EST'), ('B', 7, FALSE, FALSE, NULL, 'EST'), ('B', 8, FALSE, FALSE, NULL, 'EST'),
    ('B', 9, FALSE, FALSE, NULL, 'EST'), ('B', 10, FALSE, FALSE, NULL, 'EST'), ('B', 11, FALSE, FALSE, NULL, 'EST'), ('B', 12, FALSE, FALSE, NULL, 'EST'),

    ('C', 1, FALSE, FALSE, NULL, 'EST'), ('C', 2, FALSE, FALSE, NULL, 'EST'), ('C', 3, FALSE, FALSE, NULL, 'EST'), ('C', 4, FALSE, FALSE, NULL, 'EST'),
    ('C', 5, FALSE, FALSE, NULL, 'EST'), ('C', 6, FALSE, FALSE, NULL, 'EST'), ('C', 7, FALSE, FALSE, NULL, 'EST'), ('C', 8, FALSE, FALSE, NULL, 'EST'),
    ('C', 9, FALSE, FALSE, NULL, 'EST'), ('C', 10, FALSE, FALSE, NULL, 'EST'), ('C', 11, FALSE, FALSE, NULL, 'EST'), ('C', 12, FALSE, FALSE, NULL, 'EST'),

    ('D', 1, FALSE, FALSE, NULL, 'EST'), ('D', 2, FALSE, FALSE, NULL, 'EST'), ('D', 3, FALSE, FALSE, NULL, 'EST'), ('D', 4, FALSE, FALSE, NULL, 'EST'),
    ('D', 5, FALSE, FALSE, NULL, 'EST'), ('D', 6, FALSE, FALSE, NULL, 'EST'), ('D', 7, FALSE, FALSE, NULL, 'EST'), ('D', 8, FALSE, FALSE, NULL, 'EST'),
    ('D', 9, FALSE, FALSE, NULL, 'EST'), ('D', 10, FALSE, FALSE, NULL, 'EST'), ('D', 11, FALSE, FALSE, NULL, 'EST'), ('D', 12, FALSE, FALSE, NULL, 'EST'),

    ('E', 1, FALSE, FALSE, NULL, 'EST'), ('E', 2, FALSE, FALSE, NULL, 'EST'), ('E', 3, FALSE, FALSE, NULL, 'EST'), ('E', 4, FALSE, FALSE, NULL, 'EST'),
    ('E', 5, FALSE, FALSE, NULL, 'EST'), ('E', 6, FALSE, FALSE, NULL, 'EST'), ('E', 7, FALSE, FALSE, NULL, 'EST'), ('E', 8, FALSE, FALSE, NULL, 'EST'),
    ('E', 9, FALSE, FALSE, NULL, 'EST'), ('E', 10, FALSE, FALSE, NULL, 'EST'), ('E', 11, FALSE, FALSE, NULL, 'EST'), ('E', 12, FALSE, FALSE, NULL, 'EST'),

    ('F', 1, FALSE, FALSE, NULL, 'EST'), ('F', 2, FALSE, FALSE, NULL, 'EST'), ('F', 3, FALSE, FALSE, NULL, 'EST'), ('F', 4, FALSE, FALSE, NULL, 'EST'),
    ('F', 5, FALSE, FALSE, NULL, 'EST'), ('F', 6, FALSE, FALSE, NULL, 'EST'), ('F', 7, FALSE, FALSE, NULL, 'EST'), ('F', 8, FALSE, FALSE, NULL, 'EST'),
    ('F', 9, FALSE, FALSE, NULL, 'EST'), ('F', 10, FALSE, FALSE, NULL, 'EST'), ('F', 11, FALSE, FALSE, NULL, 'EST'), ('F', 12, FALSE, FALSE, NULL, 'EST'),

    ('G', 1, FALSE, FALSE, NULL, 'EST'), ('G', 2, FALSE, FALSE, NULL, 'EST'), ('G', 3, FALSE, FALSE, NULL, 'EST'), ('G', 4, FALSE, FALSE, NULL, 'EST'),
    ('G', 5, FALSE, FALSE, NULL, 'EST'), ('G', 6, FALSE, FALSE, NULL, 'EST'), ('G', 7, FALSE, FALSE, NULL, 'EST'), ('G', 8, FALSE, FALSE, NULL, 'EST'),
    ('G', 9, FALSE, FALSE, NULL, 'EST'), ('G', 10, FALSE, FALSE, NULL, 'EST'), ('G', 11, FALSE, FALSE, NULL, 'EST'), ('G', 12, FALSE, FALSE, NULL, 'EST'),

    ('H', 1, FALSE, FALSE, NULL, 'EST'), ('H', 2, FALSE, FALSE, NULL, 'EST'), ('H', 3, FALSE, FALSE, NULL, 'EST'), ('H', 4, FALSE, FALSE, NULL, 'EST'),
    ('H', 5, FALSE, FALSE, NULL, 'EST'), ('H', 6, FALSE, FALSE, NULL, 'EST'), ('H', 7, FALSE, FALSE, NULL, 'EST'), ('H', 8, FALSE, FALSE, NULL, 'EST'),
    ('H', 9, FALSE, FALSE, NULL, 'EST'), ('H', 10, FALSE, FALSE, NULL, 'EST'), ('H', 11, FALSE, FALSE, NULL, 'EST'), ('H', 12, FALSE, FALSE, NULL, 'EST'),

    ('I', 1, FALSE, FALSE, NULL, 'EST'), ('I', 2, FALSE, FALSE, NULL, 'EST'), ('I', 3, FALSE, FALSE, NULL, 'EST'), ('I', 4, FALSE, FALSE, NULL, 'EST'),

    
    ('A', 1, FALSE, FALSE, NULL, 'SUD'), ('A', 2, FALSE, FALSE, NULL, 'SUD'), ('A', 3, FALSE, FALSE, NULL, 'SUD'), ('A', 4, FALSE, FALSE, NULL, 'SUD'),
    ('A', 5, FALSE, FALSE, NULL, 'SUD'), ('A', 6, FALSE, FALSE, NULL, 'SUD'), ('A', 7, TRUE, FALSE, NULL, 'SUD'), ('A', 8, TRUE, FALSE, NULL, 'SUD'),
    ('A', 9, TRUE, FALSE, NULL, 'SUD'), ('A', 10, FALSE, FALSE, NULL, 'SUD'), ('A', 11, FALSE, FALSE, NULL, 'SUD'), ('A', 12, FALSE, FALSE, NULL, 'SUD'),

    ('B', 1, FALSE, FALSE, NULL, 'SUD'), ('B', 2, FALSE, FALSE, NULL, 'SUD'), ('B', 3, FALSE, FALSE, NULL, 'SUD'), ('B', 4, FALSE, FALSE, NULL, 'SUD'),
    ('B', 5, FALSE, FALSE, NULL, 'SUD'), ('B', 6, FALSE, FALSE, NULL, 'SUD'), ('B', 7, FALSE, FALSE, NULL, 'SUD'), ('B', 8, FALSE, FALSE, NULL, 'SUD'),
    ('B', 9, FALSE, FALSE, NULL, 'SUD'), ('B', 10, FALSE, FALSE, NULL, 'SUD'), ('B', 11, FALSE, FALSE, NULL, 'SUD'), ('B', 12, FALSE, FALSE, NULL, 'SUD'),

    ('C', 1, FALSE, FALSE, NULL, 'SUD'), ('C', 2, FALSE, FALSE, NULL, 'SUD'), ('C', 3, FALSE, FALSE, NULL, 'SUD'), ('C', 4, FALSE, FALSE, NULL, 'SUD'),
    ('C', 5, FALSE, FALSE, NULL, 'SUD'), ('C', 6, FALSE, FALSE, NULL, 'SUD'), ('C', 7, FALSE, FALSE, NULL, 'SUD'), ('C', 8, FALSE, FALSE, NULL, 'SUD'),
    ('C', 9, FALSE, FALSE, NULL, 'SUD'), ('C', 10, FALSE, FALSE, NULL, 'SUD'), ('C', 11, FALSE, FALSE, NULL, 'SUD'), ('C', 12, FALSE, FALSE, NULL, 'SUD'),

    ('D', 1, FALSE, FALSE, NULL, 'SUD'), ('D', 2, FALSE, FALSE, NULL, 'SUD'), ('D', 3, FALSE, FALSE, NULL, 'SUD'), ('D', 4, FALSE, FALSE, NULL, 'SUD'),
    ('D', 5, FALSE, FALSE, NULL, 'SUD'), ('D', 6, FALSE, FALSE, NULL, 'SUD'), ('D', 7, FALSE, FALSE, NULL, 'SUD'), ('D', 8, FALSE, FALSE, NULL, 'SUD'),
    ('D', 9, FALSE, FALSE, NULL, 'SUD'), ('D', 10, FALSE, FALSE, NULL, 'SUD'), ('D', 11, FALSE, FALSE, NULL, 'SUD'), ('D', 12, FALSE, FALSE, NULL, 'SUD'),

    ('E', 1, FALSE, FALSE, NULL, 'SUD'), ('E', 2, FALSE, FALSE, NULL, 'SUD'), ('E', 3, FALSE, FALSE, NULL, 'SUD'), ('E', 4, FALSE, FALSE, NULL, 'SUD'),
    ('E', 5, FALSE, FALSE, NULL, 'SUD'), ('E', 6, FALSE, FALSE, NULL, 'SUD'), ('E', 7, FALSE, FALSE, NULL, 'SUD'), ('E', 8, FALSE, FALSE, NULL, 'SUD'),
    ('E', 9, FALSE, FALSE, NULL, 'SUD'), ('E', 10, FALSE, FALSE, NULL, 'SUD'), ('E', 11, FALSE, FALSE, NULL, 'SUD'), ('E', 12, FALSE, FALSE, NULL, 'SUD'),

    ('F', 1, FALSE, FALSE, NULL, 'SUD'), ('F', 2, FALSE, FALSE, NULL, 'SUD'), ('F', 3, FALSE, FALSE, NULL, 'SUD'), ('F', 4, FALSE, FALSE, NULL, 'SUD'),
    ('F', 5, FALSE, FALSE, NULL, 'SUD'), ('F', 6, FALSE, FALSE, NULL, 'SUD'), ('F', 7, FALSE, FALSE, NULL, 'SUD'), ('F', 8, FALSE, FALSE, NULL, 'SUD'),
    ('F', 9, FALSE, FALSE, NULL, 'SUD'), ('F', 10, FALSE, FALSE, NULL, 'SUD'), ('F', 11, FALSE, FALSE, NULL, 'SUD'), ('F', 12, FALSE, FALSE, NULL, 'SUD'),

    ('G', 1, FALSE, FALSE, NULL, 'SUD'), ('G', 2, FALSE, FALSE, NULL, 'SUD'), ('G', 3, FALSE, FALSE, NULL, 'SUD'), ('G', 4, FALSE, FALSE, NULL, 'SUD'),
    ('G', 5, FALSE, FALSE, NULL, 'SUD'), ('G', 6, FALSE, FALSE, NULL, 'SUD'), ('G', 7, FALSE, FALSE, NULL, 'SUD'), ('G', 8, FALSE, FALSE, NULL, 'SUD'),
    ('G', 9, FALSE, FALSE, NULL, 'SUD'), ('G', 10, FALSE, FALSE, NULL, 'SUD'), ('G', 11, FALSE, FALSE, NULL, 'SUD'), ('G', 12, FALSE, FALSE, NULL, 'SUD'),

    ('H', 1, FALSE, FALSE, NULL, 'SUD'), ('H', 2, FALSE, FALSE, NULL, 'SUD'), ('H', 3, FALSE, FALSE, NULL, 'SUD'), ('H', 4, FALSE, FALSE, NULL, 'SUD'),
    ('H', 5, FALSE, FALSE, NULL, 'SUD'), ('H', 6, FALSE, FALSE, NULL, 'SUD'), ('H', 7, FALSE, FALSE, NULL, 'SUD'), ('H', 8, FALSE, FALSE, NULL, 'SUD'),
    ('H', 9, FALSE, FALSE, NULL, 'SUD'), ('H', 10, FALSE, FALSE, NULL, 'SUD'), ('H', 11, FALSE, FALSE, NULL, 'SUD'), ('H', 12, FALSE, FALSE, NULL, 'SUD'),

    ('I', 1, FALSE, FALSE, NULL, 'SUD'), ('I', 2, FALSE, FALSE, NULL, 'SUD'), ('I', 3, FALSE, FALSE, NULL, 'SUD'), ('I', 4, FALSE, FALSE, NULL, 'SUD'),


    ('A', 1, FALSE, FALSE, NULL, 'OUEST'), ('A', 2, FALSE, FALSE, NULL, 'OUEST'), ('A', 3, FALSE, FALSE, NULL, 'OUEST'), ('A', 4, FALSE, FALSE, NULL, 'OUEST'),
    ('A', 5, FALSE, FALSE, NULL, 'OUEST'), ('A', 6, FALSE, FALSE, NULL, 'OUEST'), ('A', 7, FALSE, FALSE, NULL, 'OUEST'), ('A', 8, FALSE, FALSE, NULL, 'OUEST'),
    ('A', 9, FALSE, FALSE, NULL, 'OUEST'), ('A', 10, TRUE, FALSE, NULL, 'OUEST'), ('A', 11, TRUE, FALSE, NULL, 'OUEST'), ('A', 12, TRUE, FALSE, NULL, 'OUEST'),

    ('B', 1, FALSE, FALSE, NULL, 'OUEST'), ('B', 2, FALSE, FALSE, NULL, 'OUEST'), ('B', 3, FALSE, FALSE, NULL, 'OUEST'), ('B', 4, FALSE, FALSE, NULL, 'OUEST'),
    ('B', 5, FALSE, FALSE, NULL, 'OUEST'), ('B', 6, FALSE, FALSE, NULL, 'OUEST'), ('B', 7, FALSE, FALSE, NULL, 'OUEST'), ('B', 8, FALSE, FALSE, NULL, 'OUEST'),
    ('B', 9, FALSE, FALSE, NULL, 'OUEST'), ('B', 10, FALSE, FALSE, NULL, 'OUEST'), ('B', 11, FALSE, FALSE, NULL, 'OUEST'), ('B', 12, FALSE, FALSE, NULL, 'OUEST'),

    ('C', 1, FALSE, FALSE, NULL, 'OUEST'), ('C', 2, FALSE, FALSE, NULL, 'OUEST'), ('C', 3, FALSE, FALSE, NULL, 'OUEST'), ('C', 4, FALSE, FALSE, NULL, 'OUEST'),
    ('C', 5, FALSE, FALSE, NULL, 'OUEST'), ('C', 6, FALSE, FALSE, NULL, 'OUEST'), ('C', 7, FALSE, FALSE, NULL, 'OUEST'), ('C', 8, FALSE, FALSE, NULL, 'OUEST'),
    ('C', 9, FALSE, FALSE, NULL, 'OUEST'), ('C', 10, FALSE, FALSE, NULL, 'OUEST'), ('C', 11, FALSE, FALSE, NULL, 'OUEST'), ('C', 12, FALSE, FALSE, NULL, 'OUEST'),

    ('D', 1, FALSE, FALSE, NULL, 'OUEST'), ('D', 2, FALSE, FALSE, NULL, 'OUEST'), ('D', 3, FALSE, FALSE, NULL, 'OUEST'), ('D', 4, FALSE, FALSE, NULL, 'OUEST'),
    ('D', 5, FALSE, FALSE, NULL, 'OUEST'), ('D', 6, FALSE, FALSE, NULL, 'OUEST'), ('D', 7, FALSE, FALSE, NULL, 'OUEST'), ('D', 8, FALSE, FALSE, NULL, 'OUEST'),
    ('D', 9, FALSE, FALSE, NULL, 'OUEST'), ('D', 10, FALSE, FALSE, NULL, 'OUEST'), ('D', 11, FALSE, FALSE, NULL, 'OUEST'), ('D', 12, FALSE, FALSE, NULL, 'OUEST'),

    ('E', 1, FALSE, FALSE, NULL, 'OUEST'), ('E', 2, FALSE, FALSE, NULL, 'OUEST'), ('E', 3, FALSE, FALSE, NULL, 'OUEST'), ('E', 4, FALSE, FALSE, NULL, 'OUEST'),
    ('E', 5, FALSE, FALSE, NULL, 'OUEST'), ('E', 6, FALSE, FALSE, NULL, 'OUEST'), ('E', 7, FALSE, FALSE, NULL, 'OUEST'), ('E', 8, FALSE, FALSE, NULL, 'OUEST'),
    ('E', 9, FALSE, FALSE, NULL, 'OUEST'), ('E', 10, FALSE, FALSE, NULL, 'OUEST'), ('E', 11, FALSE, FALSE, NULL, 'OUEST'), ('E', 12, FALSE, FALSE, NULL, 'OUEST'),

    ('F', 1, FALSE, FALSE, NULL, 'OUEST'), ('F', 2, FALSE, FALSE, NULL, 'OUEST'), ('F', 3, FALSE, FALSE, NULL, 'OUEST'), ('F', 4, FALSE, FALSE, NULL, 'OUEST'),
    ('F', 5, FALSE, FALSE, NULL, 'OUEST'), ('F', 6, FALSE, FALSE, NULL, 'OUEST'), ('F', 7, FALSE, FALSE, NULL, 'OUEST'), ('F', 8, FALSE, FALSE, NULL, 'OUEST'),
    ('F', 9, FALSE, FALSE, NULL, 'OUEST'), ('F', 10, FALSE, FALSE, NULL, 'OUEST'), ('F', 11, FALSE, FALSE, NULL, 'OUEST'), ('F', 12, FALSE, FALSE, NULL, 'OUEST'),

    ('G', 1, FALSE, FALSE, NULL, 'OUEST'), ('G', 2, FALSE, FALSE, NULL, 'OUEST'), ('G', 3, FALSE, FALSE, NULL, 'OUEST'), ('G', 4, FALSE, FALSE, NULL, 'OUEST'),
    ('G', 5, FALSE, FALSE, NULL, 'OUEST'), ('G', 6, FALSE, FALSE, NULL, 'OUEST'), ('G', 7, FALSE, FALSE, NULL, 'OUEST'), ('G', 8, FALSE, FALSE, NULL, 'OUEST'),
    ('G', 9, FALSE, FALSE, NULL, 'OUEST'), ('G', 10, FALSE, FALSE, NULL, 'OUEST'), ('G', 11, FALSE, FALSE, NULL, 'OUEST'), ('G', 12, FALSE, FALSE, NULL, 'OUEST'),

    ('H', 1, FALSE, FALSE, NULL, 'OUEST'), ('H', 2, FALSE, FALSE, NULL, 'OUEST'), ('H', 3, FALSE, FALSE, NULL, 'OUEST'), ('H', 4, FALSE, FALSE, NULL, 'OUEST'),
    ('H', 5, FALSE, FALSE, NULL, 'OUEST'), ('H', 6, FALSE, FALSE, NULL, 'OUEST'), ('H', 7, FALSE, FALSE, NULL, 'OUEST'), ('H', 8, FALSE, FALSE, NULL, 'OUEST'),
    ('H', 9, FALSE, FALSE, NULL, 'OUEST'), ('H', 10, FALSE, FALSE, NULL, 'OUEST'), ('H', 11, FALSE, FALSE, NULL, 'OUEST'), ('H', 12, FALSE, FALSE, NULL, 'OUEST'),

    ('I', 1, FALSE, FALSE, NULL, 'OUEST'), ('I', 2, FALSE, FALSE, NULL, 'OUEST'), ('I', 3, FALSE, FALSE, NULL, 'OUEST'), ('I', 4, FALSE, FALSE, NULL, 'OUEST');
    

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
