const pool = require("./db");

(async () => {
  try {
    console.log("🚀 Initialisation de la base Mintonette Cup...");

    const schemaSQL = `
  DROP TABLE IF EXISTS Mailbox_Message CASCADE;
  DROP TABLE IF EXISTS Type_Message CASCADE;
  DROP TABLE IF EXISTS Nombre_Connexion CASCADE;
  DROP TABLE IF EXISTS Commande CASCADE;
  DROP TABLE IF EXISTS Commande_Siege CASCADE;
  DROP TABLE IF EXISTS Commande_Service CASCADE;
  DROP TABLE IF EXISTS Panier_Siege CASCADE;
  DROP TABLE IF EXISTS Siege CASCADE;
  DROP TABLE IF EXISTS Match CASCADE;
  DROP TABLE IF EXISTS ClassementPoule CASCADE;
  DROP TABLE IF EXISTS Joueur CASCADE;
  DROP TABLE IF EXISTS Equipe CASCADE;
  DROP TABLE IF EXISTS Pays CASCADE;
  DROP TABLE IF EXISTS Zone CASCADE;
  DROP TABLE IF EXISTS Organisateur CASCADE;
  DROP TABLE IF EXISTS Panier_Service CASCADE;
  DROP TABLE IF EXISTS Article CASCADE;
  DROP TABLE IF EXISTS Activite CASCADE;  
  DROP TABLE IF EXISTS Services CASCADE;
  DROP TABLE IF EXISTS Panier CASCADE;  
  DROP TABLE IF EXISTS Prestataire CASCADE;
  DROP TABLE IF EXISTS Type_prestataire CASCADE;
  DROP TABLE IF EXISTS Type_boutique CASCADE;
  DROP TABLE IF EXISTS Type_restauration CASCADE;
  DROP TABLE IF EXISTS Type_animation CASCADE;
  DROP TABLE IF EXISTS Type_utilisateur CASCADE;
  DROP TABLE IF EXISTS Utilisateur CASCADE;
  DROP TABLE IF EXISTS Evenement CASCADE;
  DROP TABLE IF EXISTS Terrain CASCADE;

  CREATE TABLE IF NOT EXISTS Terrain(
    id_terrain SERIAL PRIMARY KEY,
    nom_terrain VARCHAR(50)
  );

  CREATE TABLE IF NOT EXISTS Evenement(
    id_evenement SERIAL PRIMARY KEY,
    nom_evenement VARCHAR(50),  
    color_title VARCHAR(50),
    text_font VARCHAR(100),
    image_evenement VARCHAR(255),
    descri_evenement JSONB
  );

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
    date_creation_utilisateur TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ispresta BOOLEAN DEFAULT FALSE,
    isadmin BOOLEAN DEFAULT FALSE,
    reset_token VARCHAR(255),
    reset_token_expire TIMESTAMP,
    google_id TEXT,
    provider VARCHAR(50) DEFAULT 'local'
  );

  CREATE TABLE IF NOT EXISTS Type_utilisateur(
    id_type_utilisateur SERIAL PRIMARY KEY,
    nom_type_utilisateur VARCHAR(50),
    droit_type_utilisateur VARCHAR(50)
  );

  CREATE TABLE IF NOT EXISTS Zone(
    id_zone SERIAL PRIMARY KEY,
    nom_zone VARCHAR(50)
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
    nom_type_prestataire JSONB,
    is_activity BOOLEAN
  );
 
  CREATE TABLE IF NOT EXISTS Prestataire(
    id_prestataire SERIAL PRIMARY KEY,
    nom_prestataire VARCHAR(50),
    descri_prestataire VARCHAR(500),
    mail_prestataire VARCHAR(255) NOT NULL,
    tel_prestataire VARCHAR(10) NOT NULL,
    waitingforadmin BOOLEAN DEFAULT FALSE,
    refused BOOLEAN DEFAULT FALSE,
    message_ajout BOOLEAN,
    specificite VARCHAR(100),
    id_zone INTEGER,
    id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur),
    type_prestataire_id INTEGER NOT NULL REFERENCES Type_prestataire(id_type_prestataire),
    type_animation_id INTEGER REFERENCES Type_animation(id_type_animation),
    type_restauration_id INTEGER REFERENCES Type_restauration(id_type_restauration),
    type_boutique_id INTEGER REFERENCES Type_boutique(id_type_boutique)
    );

    CREATE TABLE IF NOT EXISTS Panier (
      id_panier SERIAL PRIMARY KEY,
      utilisateur_id INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur),
      actif BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS Services(
      id_service SERIAL PRIMARY KEY,
      nom_service VARCHAR(100),
      descri_service JSONB,
      visible_public BOOLEAN DEFAULT TRUE,
      besoin JSONB,
      activate BOOLEAN,
      prestataire_id INTEGER NOT NULL REFERENCES Prestataire(id_prestataire)
    );

    CREATE TABLE IF NOT EXISTS Article (
      id_article SERIAL PRIMARY KEY,
      nom_article VARCHAR(250),
      stock INT,
      prix_article NUMERIC(10, 2),
      service_id INTEGER NOT NULL REFERENCES Services(id_service)
    );

    CREATE TABLE IF NOT EXISTS Activite (
      id_activite SERIAL PRIMARY KEY,
      nom_activite VARCHAR(250),
      nb_participant INT,
      prix_activite NUMERIC(10, 2),
      date_activite TIMESTAMP,
      service_id INTEGER NOT NULL REFERENCES Services(id_service)
    );

    CREATE TABLE IF NOT EXISTS Panier_Service (
      id_panier INTEGER NOT NULL REFERENCES Panier(id_panier) ON DELETE CASCADE,
      service_id INTEGER NOT NULL REFERENCES Services(id_service),
      quantite INTEGER DEFAULT 1,
      prix_unitaire NUMERIC(10,2) NOT NULL,
      PRIMARY KEY (id_panier, service_id)
    );


  CREATE TABLE IF NOT EXISTS Pays(
    id_pays SERIAL PRIMARY KEY,
    nom_pays VARCHAR(50),
    couleur_maillot VARCHAR(50),
    nom_mascotte VARCHAR(50),
    qualifie BOOLEAN,
    id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur)
  );

  CREATE TABLE IF NOT EXISTS Organisateur(
    id_organisateur SERIAL PRIMARY KEY,
    id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur)
  );

  CREATE TABLE IF NOT EXISTS Equipe(
    id_equipe SERIAL PRIMARY KEY,
    sexe_equipe VARCHAR(50),
    nb_joueurs INTEGER,
    entraineur VARCHAR(50),
    id_pays INTEGER NOT NULL REFERENCES Pays(id_pays)
  );

  CREATE TABLE IF NOT EXISTS Match(
    id_match SERIAL PRIMARY KEY,
    id_terrain INTEGER NOT NULL REFERENCES Terrain(id_terrain),
    id_equipe1 INTEGER NOT NULL REFERENCES Equipe(id_equipe),
    id_equipe2 INTEGER NOT NULL REFERENCES Equipe(id_equipe),
    date_match TIMESTAMP,
    score_equipe1 INTEGER,
    score_equipe2 INTEGER,
    statut VARCHAR(20) DEFAULT 'A venir',
    CHECK (id_equipe1 != id_equipe2)
  );

  CREATE TABLE IF NOT EXISTS Panier_Siege (
    id_panier INTEGER NOT NULL REFERENCES Panier(id_panier) ON DELETE CASCADE,
    numero_colonne VARCHAR(2) NOT NULL,
    numero_ligne INTEGER NOT NULL,
    zone VARCHAR(20) NOT NULL,
    match_id INTEGER NOT NULL REFERENCES Match(id_match),
    PRIMARY KEY (id_panier, numero_colonne, numero_ligne, zone, match_id)
  );


  CREATE TABLE IF NOT EXISTS Siege(
    numero_colonne VARCHAR(2) NOT NULL,
    numero_ligne INTEGER NOT NULL,
    match_id INTEGER NOT NULL,
    est_reserve BOOLEAN DEFAULT FALSE,
    zone VARCHAR(20) NOT NULL,
    id_utilisateur INTEGER NULL,
    PRIMARY KEY (numero_colonne, numero_ligne, zone, match_id),
    FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY(match_id) REFERENCES Match(id_match)
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
    poste VARCHAR(50),
    photo VARCHAR(255),
    id_equipe INTEGER NOT NULL REFERENCES Equipe(id_equipe)
  );

  CREATE TABLE IF NOT EXISTS ClassementPoule(
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

  CREATE TABLE Commande (
    id_commande SERIAL PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    date_commande TIMESTAMP DEFAULT NOW(),
    statut VARCHAR(20) DEFAULT 'payee'
  );

  CREATE TABLE Commande_Siege (
    id_commande INT REFERENCES Commande(id_commande) ON DELETE CASCADE,
    match_id INT,
    numero_colonne VARCHAR(5),
    numero_ligne INT,
    zone VARCHAR(10),
    prix NUMERIC(10,2),
    PRIMARY KEY (id_commande, match_id, numero_colonne, numero_ligne, zone)
  );

  CREATE TABLE Commande_Service (
    id_commande INT REFERENCES Commande(id_commande) ON DELETE CASCADE,
    service_id INT REFERENCES Services(id_service),
    quantite INT,
    prix_unitaire NUMERIC(10,2)
  );

  CREATE TABLE Nombre_Connexion (
    id_nb_connexion SERIAL PRIMARY KEY,
    login_tentative VARCHAR(255) NOT NULL,
    nb_tentative INT NOT NULL DEFAULT 0,
    first_attempt_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_attempt_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    succes BOOLEAN NOT NULL DEFAULT false,
    message VARCHAR(255),
    blocked_until TIMESTAMP
  );

  CREATE TABLE Type_Message (
    id_type_message SERIAL PRIMARY KEY,
    nom_type_message VARCHAR(255)
  );

  CREATE TABLE Mailbox_Message (
    id_message SERIAL PRIMARY KEY,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    type_message_id INT NOT NULL REFERENCES Type_Message(id_type_message) ON DELETE CASCADE,
    sender_id INT NOT NULL REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    recipient_id INT NOT NULL REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE NULL,
    is_deleted_by_sender BOOLEAN DEFAULT FALSE,
    is_deleted_by_recipient BOOLEAN DEFAULT FALSE
  );
`;

    await pool.query(schemaSQL);

    const insertEvenement = `
      INSERT INTO Evenement
      (nom_evenement, color_title, text_font, image_evenement, descri_evenement)
      VALUES
      (
        'Mintonette Cup',
        '#ffffff',
        'Meie Script',
        '/photo_fond.png',
        $$
        {
          "fr": {
            "texte": "Le grand <b>tournoi de Volley mondial</b> Mintonette Cup arrive <b>à Montpellier</b> ! Notre troisième édition s'annonce folle.<br>Vous êtes <b>adèpte de volley-ball</b>, aimez suivre de <b>grands évenements sportifs</b> qui regroupent <b>passionnés</b> et <b>bonne ambiance</b> ? <b>La Mintonnette Cup vous attend !</b><br>Au programmes : des <b>matchs époustouflants</b>, un <b>public de folie</b> et une <b>ambiance débordante</b>.<br>On vous attends dans les gradins !<br>"
          },
          "en": {
            "texte": "The great <b>world Volleyball tournament</b> Mintonette Cup is coming <b>to Montpellier</b>! Our third edition promises to be amazing.<br>Are you a <b>sports enthusiast</b>, do you love following <b>major sporting events</b> that bring together <b>passionate fans</b> and <b>a great atmosphere</b>? <b>The Mintonette Cup awaits you !</b><br>On the agenda: <b>thrilling matches</b>, an <b>amazing audience</b> and a <b>bustling atmosphere</b>.<br>We look forward to seeing you in the stands !<br>"
          }
        }
        $$::jsonb
      );
      `;

    await pool.query(insertEvenement);

    const insertUsers = `
      INSERT INTO Utilisateur 
        (prenom_utilisateur, nom_utilisateur, login_utilisateur, mdp_utilisateur, mail_utilisateur, tel_utilisateur, sexe_utilisateur, ispresta, isadmin)
      VALUES
        ('Alban', 'Robin', 'albanr', '$2b$10$JealGklfPfDgZl1cWuQp3.eLGlL12k8HsWp2Eq52wMITcSWUD44cq', 'alban70robin@gmail.com', '0763749895', 'M', FALSE, TRUE),
        ('Emma', 'Durand', 'emmad', '$2b$10$QZUK7Ed97ZzAjQzUrzzTHuzh2pfRT/iPYPttR4CaIfaQKYZQRTxO6', 'emma.durand@gmail.com', '0612345678', 'F', TRUE, FALSE),
        ('Lucas', 'Martin', 'lucasm', '$2b$10$SqwwG.GoZgR/bxl2IZ49U.tNkpkMhMpBIbA2yQE3lF/qG9QHktGQ6', 'lucas.martin@gmail.com', '0652437595', 'M', TRUE, FALSE),
        ('Chloe', 'Petit', 'chloep', '$2b$10$GGtE3KIzPl6Soav1tutWtOEgajIowmwP9uJIwb/QsRJZBsLmd8/62', 'chloe.petit@gmail.com', '0610423571', 'F', TRUE, FALSE),
        ('Nathan', 'Dupont', 'nathand', '$2b$10$X1l9xYZpXcXlgwCtbfRsheTndo2qcc9nYvf/RiVgB7uU2L8/AOo7.', 'nathan.dupont@gmail.com', '0752435010', 'M', FALSE, FALSE),
        ('Julie', 'Bernard', 'julieb', '$2b$10$wD/ncJrAaw5bL5ja38nxtOBXm2ZA1ZJ33rv4NifrPeWNKZSFDuoNO', 'julie.bernard@gmail.com', '0630102040', 'F', FALSE, FALSE),
        ('Sophie', 'Moreau', 'sophiem', '$2b$10$Z42qZv1Iqjw41dgirvwJP.K6QbGDRR1uX.OeQJQTdwjNhfSw/w1kS', 'sophie.moreau@gmail.com', '0693759150', 'F', FALSE, FALSE),
        ('Maxime', 'Lefevre', 'maxl', '$2b$10$TfJqSCXzfqDHYoqSustMperZj7Dl3bb5AemeSPRMVwbocJrQ.Oob6', 'maxime.lefevre@gmail.com', '0630102040', 'M', FALSE, FALSE),
        ('Camille', 'Roux', 'camr', '$2b$10$9Osya.DbkM5Si/Zg0DiwhuCT9IXwE5PUDwQ2iBc3beuwQOqcMFwiq', 'camille.roux@gmail.com', '0750402342', 'F', FALSE, FALSE),
        ('Thomas', 'Garcia', 'thomg', '$2b$10$nWMa6gw35daf2xJI4sbFHe7AWVbcO9Djd1t1ZzkYnYn56KlkGY3T.', 'thomas.garcia@gmail.com', '0682759641', 'M', FALSE, FALSE),
        ('f', 'f', 'f', '$2b$10$pCnEX05CtGo4eqxHontD7.rshyasZbTanv5WNzkjTB3uXSyZTfpUy', 'f.f@gmail.com', '0768401922', 'M', FALSE, FALSE);
    `;
    await pool.query(insertUsers);

    const insertTypeMessage = `
      INSERT INTO Type_Message (nom_type_message)
      VALUES 
      ('Demande pour devenir prestataire'),
      ('Demande pour modifier son profil prestataire'),
      ('Achat de billets'),
      ('Assistance')
    `;
    await pool.query(insertTypeMessage);

    const insertMailbox = `
    INSERT INTO Mailbox_Message (subject, message, type_message_id, sender_id, recipient_id)
    VALUES 
    ('Demande d’information', 'Bonjour, je souhaiterais avoir plus de détails sur la compétition.', 1, 2, 1);`

    await pool.query(insertMailbox);

    const insertTerrains = `
    INSERT INTO Terrain (nom_terrain) VALUES
      ('Terrain 1'),
      ('Terrain 2'),
      ('Terrain 3'),
      ('Terrain 4');
    `;
    await pool.query(insertTerrains);

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
    INSERT INTO Type_prestataire (nom_type_prestataire, is_activity) VALUES
      ('{
        "fr": "Animation",
        "en": "Activity"
      }', true),
      ('{
        "fr": "Boutique",
        "en": "Shop"
      }', false),
      ('{
        "fr": "Restauration",
        "en": "Food"
      }', false);
    `;
    await pool.query(insertTypePrestataire);

    const insertPrestataire = `
    INSERT INTO Prestataire (nom_prestataire, descri_prestataire, mail_prestataire, tel_prestataire, waitingforadmin, specificite, message_ajout, id_utilisateur, type_prestataire_id, id_zone) VALUES
      ('FoodExpress', 'Service de restauration rapide pour événements', 'contact@foodexpress.com', '0123456789', false, 'Animation festive', true, 2, 3, 1),
      ('AnimEvent', 'Animations pour tous types d’événements', 'contact@animevent.com', '0987654321', false, 'Livres et supports média', true, 3, 1, 22),
      ('SportMerch', 'Boutique spécialisée en articles sportifs', 'contact@sportmerch.com', '0112233445', false, 'Vêtements et accessoires', true, 4, 2, 4);
    `;
    await pool.query(insertPrestataire);

    const insertServices = `
      INSERT INTO Services 
      (nom_service, descri_service, visible_public, besoin, activate, prestataire_id) VALUES
      (
        'Stand de burgers sur place',
        '{
          "fr": { "texte": "Profitez d’un <b>stand de burgers préparés sur place</b> avec des produits frais et savoureux.<br>Une solution idéale pour offrir une <b>restauration rapide et conviviale</b>." },
          "en": { "texte": "Enjoy a <b>freshly prepared burger stand</b> with quality ingredients.<br>An ideal solution for <b>quick and friendly catering</b>." }
        }',
        true,
        '{
          "fr": "Accès à une prise électrique et un espace de 6m² minimum",
          "en": "Access to a power outlet and minimum 6m² space"
        }',
        true,
        1
      ),

      (
        'Service de boissons fraîches',
        '{
          "fr": { "texte": "Un <b>service de boissons fraîches</b> pour désaltérer vos invités tout au long de la journée." },
          "en": { "texte": "A <b>cold drinks service</b> to keep your guests refreshed all day long." }
        }',
        true,
        '{
          "fr": "Point d’eau requis à proximité",
          "en": "Nearby water access required"
        }',
        false,
        1
      ),

      (
        'Restauration rapide événementielle',
        '{
          "fr": { "texte": "Une solution de <b>restauration rapide pensée pour l’événementiel</b>, efficace même lors de fortes affluences." },
          "en": { "texte": "A <b>fast food catering solution designed for events</b>, even during high attendance." }
        }',
        false,
        '{
          "fr": "Zone de cuisson autorisée obligatoire",
          "en": "Authorized cooking area required"
        }',
        false,
        1
      ),

      (
        'Snacking sucré et salé',
        '{
          "fr": { "texte": "Un large choix de <b>snacks sucrés et salés</b> pour satisfaire toutes les envies." },
          "en": { "texte": "A wide selection of <b>sweet and savory snacks</b> for all tastes." }
        }',
        true,
        '{
          "fr": "Table de service requise",
          "en": "Service table required"
        }',
        true,
        1
      ),

      (
        'Animation musicale sur scène',
        '{
          "fr": { "texte": "Une <b>animation musicale live</b> pour créer une ambiance festive et dynamique." },
          "en": { "texte": "A <b>live music performance</b> to create a festive and dynamic atmosphere." }
        }',
        true,
        '{
          "fr": "Scène et système son requis",
          "en": "Stage and sound system required"
        }',
        false,
        2
      ),

      (
        'Animation micro et public',
        '{
          "fr": { "texte": "Un animateur pour <b>interagir avec le public</b> et rythmer votre événement." },
          "en": { "texte": "A host to <b>interact with the audience</b> and energize your event." }
        }',
        true,
        '{
          "fr": "Système audio requis",
          "en": "Audio system required"
        }',
        true,
        2
      ),

      (
        'Jeux et animations interactives',
        '{
          "fr": { "texte": "Des <b>animations participatives</b> pour engager le public et créer des moments mémorables." },
          "en": { "texte": "Interactive activities to engage the audience and create <b>memorable moments</b>." }
        }',
        false,
        '{
          "fr": "Espace sécurisé requis",
          "en": "Secure area required"
        }',
        false,
        2
      ),

      (
        'Animation pour enfants sur place',
        '{
          "fr": { "texte": "Des animations ludiques et encadrées pour offrir aux enfants un <b>moment sûr et amusant</b>." },
          "en": { "texte": "Fun and supervised activities to offer children a <b>safe and enjoyable experience</b>." }
        }',
        true,
        '{
          "fr": "Espace clos obligatoire",
          "en": "Enclosed area required"
        }',
        true,
        2
      ),

      (
        'Stand de vente de produits sportifs',
        '{
          "fr": { "texte": "Un stand dédié à la <b>vente de produits sportifs</b> directement sur votre événement." },
          "en": { "texte": "A stand dedicated to the <b>sale of sports products</b> at your event." }
        }',
        false,
        '{
          "fr": "Surface plane requise",
          "en": "Flat surface required"
        }',
        false,
        3
      ),

      (
        'Personnalisation de maillots sur place',
        '{
          "fr": { "texte": "Un service de <b>personnalisation en direct</b> pour repartir avec un maillot unique." },
          "en": { "texte": "A <b>live customization service</b> to leave with a unique jersey." }
        }',
        false,
        '{
          "fr": "Accès électrique requis",
          "en": "Power access required"
        }',
        false,
        3
      ),

      (
        'Vente d’accessoires sportifs',
        '{
          "fr": { "texte": "Une sélection d’<b>accessoires sportifs</b> pour compléter votre équipement." },
          "en": { "texte": "A selection of <b>sports accessories</b> to complete your equipment." }
        }',
        false,
        '{
          "fr": "Stand couvert recommandé",
          "en": "Covered stand recommended"
        }',
        false,
        3
      ),

      (
        'Boutique éphémère événementielle',
        '{
          "fr": { "texte": "Une <b>boutique temporaire</b> pour offrir une expérience d’achat immersive lors de votre événement." },
          "en": { "texte": "A <b>temporary pop-up store</b> offering an immersive shopping experience." }
        }',
        true,
        '{
          "fr": "Espace couvert requis",
          "en": "Covered space required"
        }',
        true,
        3
      );
      `;

    await pool.query(insertServices);

    const insertArticles = `
    INSERT INTO Article (nom_article, stock, prix_article, service_id) VALUES
      ('Maillot Mintonette Cup 2026', 150, 49.99, 9),
      ('Short de volley officiel', 100, 29.99, 9),
      ('Casquette Mintonette Cup', 200, 19.99, 9),
      ('Écharpe supporter', 300, 14.99, 9),
      ('Ballon de volley officiel', 50, 39.99, 9),
      ('Sac à dos Mintonette Cup', 80, 34.99, 9),
      ('Bouteille isotherme logo MC', 120, 24.99, 9),
      ('Porte-clés Mintonette Cup', 500, 4.99, 9),
      ('Poster officiel du tournoi', 250, 9.99, 9),
      ('Pack supporter (maillot + écharpe)', 60, 59.99, 9),
      ('Burger Classic', 200, 8.50, 1),
      ('Burger Double Cheese', 200, 10.50, 1),
      ('Menu Burger + Frites', 150, 13.00, 1),
      ('Frites maison', 300, 3.50, 1),
      ('Eau minérale 50cl', 500, 1.50, 2),
      ('Soda 33cl', 400, 2.50, 2),
      ('Jus de fruit 25cl', 300, 2.00, 2),
      ('Smoothie du jour', 100, 4.50, 2),
      ('Hot-dog', 250, 5.00, 3),
      ('Wrap poulet', 200, 7.50, 3),
      ('Salade César', 150, 8.00, 3),
      ('Sandwich jambon-fromage', 200, 5.50, 3),
      ('Sachet de chips', 400, 2.00, 4),
      ('Barre chocolatée', 350, 1.50, 4),
      ('Madeleine individuelle', 300, 1.00, 4),
      ('Mix apéritif 100g', 250, 3.00, 4);
    `;
    await pool.query(insertArticles);


    const insertActivite = `
    INSERT INTO Activite (nom_activite, nb_participant, prix_activite, date_activite, service_id) VALUES
      ('Initiation au volley-ball', 12, 15.00, '2026-07-15T10:00:00', 7),
      ('Tournoi 3x3 amateur', 24, 10.00, '2026-07-15T14:00:00', 7),
      ('Séance de dédicaces joueurs', 30, 25.00, '2026-07-16T11:00:00', 8),
      ('Atelier smash avec coach', 8, 20.00, '2026-07-16T15:00:00', 7),
      ('Photo avec le trophée', 1, 5.00, '2026-07-15T09:00:00', 8),
      ('Quiz volley géant', 50, 0.00, '2026-07-17T18:00:00', 6),
      ('Parcours de réception ballon', 6, 12.00, '2026-07-17T10:00:00', 7);
    `;
    await pool.query(insertActivite);

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
    ('Croatie', 'Rouge / Blanc', 'Le Damier Croate', false, 1),
    ('Russie', 'Blanc / Rouge', 'L’Ours Rouge', false, 1),    
    ('Égypte', 'Rouge / Blanc ', 'Le Faucon du Nil', false, 1),
    ('République tchèque', 'Rouge / Blanc', 'Le Lion de Bohême', false, 1),
    ('Estonie', 'Bleu / Noir', 'L’Hirondelle Baltique', false, 1),
    ('Grèce', 'Bleu / Blanc', 'Le Phénix Hellénique', false, 1),
    ('Tunisie', 'Rouge / Blanc', 'Le Scorpion Rouge', false, 1),
    ('Saint‑Marin', 'Bleu / Blanc', 'Le Gardien du Roc', false, 1);
    `;

    await pool.query(insertPays);

    const insertZone = `
    INSERT INTO Zone (id_zone) VALUES
    (1), (2), (3), (4), (5), (6), (7), (8), (9), (10), (11), (12), (13), (14), (15), (16),
    (17), (18), (19), (20), (21), (22), (23), (24), (25), (26), (27), (28), (29), (30), (31), (32)
    `;

    await pool.query(insertZone);

    const insertEquipes = `
    INSERT INTO Equipe (sexe_equipe, nb_joueurs, id_pays, entraineur) VALUES
    ('Homme', 14, 1, 'Andrea Giani'),  -- France
    ('Homme', 14, 2, 'Michał Winiarski'),  -- Allemagne
    ('Homme', 14, 3, 'Marcelo Méndez'),  -- Argentine
    ('Homme', 14, 4, 'Ferdinando De Giorgi'),  -- Italie
    ('Homme', 14, 5, 'Daniel Lewis'),  -- Canada
    ('Homme', 14, 6, 'Gianlorenzo Blengini'),  -- Bulgarie
    ('Homme', 14, 7, 'Bernardo Rezende'),  -- Brésil
    ('Homme', 14, 8, 'Jesús Cruz'),  -- Cuba
    ('Homme', 14, 9, 'Karch Kiraly'),  -- États-Unis
    ('Homme', 14, 10, 'Fabio Soli'), -- Slovénie
    ('Homme', 14, 11, 'Roberto Piazza'), -- Iran
    ('Homme', 14, 12, 'Raúl Lozano'), -- Ukraine
    ('Homme', 14, 13, 'Vital Heynen'), -- Chine
    ('Homme', 14, 14, 'Laurent Tillie'), -- Japon
    ('Homme', 14, 15, 'Nikola Grbić'), -- Pologne
    ('Homme', 14, 16, 'Gheorghe Crețu'), -- Serbie
    ('Homme', 14, 17, 'Joel Banks'), -- Pays-Bas
    ('Homme', 14, 18, 'Slobodan Kovač'), -- Turquie
    ('Homme', 14, 19, 'Emanuele Zanini'), -- Belgique
    ('Homme', 14, 20, 'Julio Velasco'), -- Espagne
    ('Homme', 14, 21, 'Harry Brokking'), -- Angleterre
    ('Homme', 14, 22, 'Supajirakul Monchai'), -- Thaïlande
    ('Homme', 14, 23, 'Genadijs Parsins'), -- Kazakhstan
    ('Homme', 14, 24, 'Issanayê Ramires Ferraz'), -- Corée du Sud
    ('Homme', 14, 25, 'Zlatko Dalić'), -- Croatie
    ('Homme', 14, 26, 'Valeri Karpine'), -- Russie
    ('Homme', 14, 27, 'Hossam Hassan'), -- Égypte
    ('Homme', 14, 28, 'Ivan Hašek'), -- République Tchèque
    ('Homme', 14, 29, 'Jürgen Henn'), -- Estonie
    ('Homme', 14, 30, 'Gustavo Poyet'), -- Grèce
    ('Homme', 14, 31, 'Camillo Placi'), -- Tunisie
    ('Homme', 14, 32, 'Stefano Mascetti'), -- Saint Marin 
    ('Femme', 12, 1, NULL),  -- France
    ('Femme', 12, 2, NULL),  -- Allemagne
    ('Femme', 12, 3, NULL),  -- Argentine
    ('Femme', 12, 4, NULL),  -- Italie
    ('Femme', 12, 5, NULL),  -- Canada
    ('Femme', 12, 6, NULL),  -- Bulgarie
    ('Femme', 12, 7, NULL),  -- Brésil
    ('Femme', 12, 8, NULL),  -- Cuba
    ('Femme', 12, 9, NULL),  -- États-Unis
    ('Femme', 12, 10, NULL), -- Slovénie
    ('Femme', 12, 11, NULL), -- Iran
    ('Femme', 12, 12, NULL), -- Ukraine
    ('Femme', 12, 13, NULL), -- Chine
    ('Femme', 12, 14, NULL), -- Japon
    ('Femme', 12, 15, NULL), -- Pologne
    ('Femme', 12, 16, NULL), -- Serbie
    ('Femme', 12, 17, NULL), -- Pays-Bas
    ('Femme', 12, 18, NULL), -- Turquie
    ('Femme', 12, 19, NULL), -- Belgique
    ('Femme', 12, 20, NULL), -- Espagne
    ('Femme', 12, 21, NULL), -- Angleterre
    ('Femme', 12, 22, NULL), -- Thaïlande
    ('Femme', 12, 23, NULL), -- Kazakhstan
    ('Femme', 12, 24, NULL), -- Corée du Sud
    ('Femme', 12, 25, NULL), -- Croatie
    ('Femme', 12, 26, NULL), -- Russie
    ('Femme', 12, 27, NULL), -- Égypte
    ('Femme', 12, 28, NULL), -- République Tchèque
    ('Femme', 12, 29, NULL), -- Estonie
    ('Femme', 12, 30, NULL), -- Grèce
    ('Femme', 12, 31, NULL), -- Tunisie
    ('Femme', 12, 32, NULL); -- Saint Marin
    `;

    await pool.query(insertEquipes);

    const insertMatchs = `
      INSERT INTO Match (id_terrain, id_equipe1, id_equipe2, date_match) VALUES
      -- Terrain 1 (4 matchs)
      (1, 1, 5, '2026-06-06 10:00:00'),    -- France vs Canada
      (1, 2, 18, '2026-06-06 14:00:00'),   -- Allemagne vs Turquie
      (1, 3, 19, '2026-06-06 18:00:00'),   -- Argentine vs Belgique
      (1, 4, 20, '2026-06-06 21:00:00'),   -- Italie vs Espagne
      
      -- Terrain 2 (4 matchs)
      (2, 17, 21, '2026-06-07 10:00:00'),  -- Pays-Bas vs Angleterre
      (2, 6, 22, '2026-06-07 14:00:00'),   -- Bulgarie vs Thaïlande
      (2, 7, 23, '2026-06-07 18:00:00'),   -- Brésil vs Kazakhstan
      (2, 8, 24, '2026-06-07 21:00:00'),   -- Cuba vs Corée du Sud
      
      -- Terrain 3 (4 matchs)
      (3, 9, 25, '2026-06-08 10:00:00'),   -- États-Unis vs Croatie
      (3, 10, 26, '2026-06-08 14:00:00'),  -- Slovénie vs Russie
      (3, 11, 27, '2026-06-08 18:00:00'),  -- Iran vs Égypte
      (3, 12, 28, '2026-06-08 21:00:00'),  -- Ukraine vs République Tchèque 
      
      -- Terrain 4 (4 matchs)
      (4, 13, 29, '2026-06-09 10:00:00'),  -- Chine vs Estonie
      (4, 14, 30, '2026-06-09 14:00:00'),  -- Japon vs Grèce
      (4, 15, 31, '2026-06-09 18:00:00'),  -- Pologne vs Tunisie
      (4, 16, 32, '2026-06-09 21:00:00');  -- Serbie vs Saint-Marin
  `;
    await pool.query(insertMatchs);

    const insertJoueurEquipe = `
    INSERT INTO Joueur (nom_joueur, prenom_joueur, sexe_joueur, date_naissance_joueur, taille, numero_joueur, pays, poste, id_equipe, photo) VALUES
    -- France
    ('Ngapeth', 'Earvin', 'Masculin', '1991-02-12', 1.96, 9, 'France', 'Attaquant', 1, 'Ngapeth.png'),
    ('Grebennikov', 'Jenia', 'Masculin', '1990-08-13', 1.87, 3, 'France', 'Libero', 1, 'Grebennikov.png'),
    ('Brizard', 'Antoine', 'Masculin', '1994-05-22', 1.88, 11, 'France', 'Receveur-Attaquant', 1, 'Brizard.png'),
    ('Le Goff', 'Nicolas', 'Masculin', '1988-09-27', 2.02, 4, 'France', 'Central', 1, 'Le Goff.png'),
    ('Patry', 'Jean', 'Masculin', '1996-06-20', 1.97, 10, 'France', 'Attaquant', 1, NULL),
    ('Clevenot', 'Trevors', 'Masculin', '1994-07-23', 1.97, 7, 'France', 'Receveur-Attaquant', 1, 'Clevenot.png'),
    ('Chinenyeze', 'Barthélémy', 'Masculin', '1998-01-22', 2.03, 5, 'France', 'Central', 1, NULL),
    ('Toniutti', 'Benjamin', 'Masculin', '1989-11-30', 1.80, 6, 'France', 'Passeur', 1, 'Toniutti.png'),
    ('Tillie', 'Kévin', 'Masculin', '1990-11-24', 2.02, 8, 'France', 'Receveur-Attaquant', 1, NULL),
    ('Faure', 'Théo', 'Masculin', '1999-10-12', 2.00, 12, 'France', 'Central', 1, NULL),
    ('Diez', 'Yacine', 'Masculin', '1991-11-14', 1.95, 2, 'France', 'Receveur-Attaquant', 1, NULL),
    ('Louati', 'Trevor', 'Masculin', '1996-02-04', 1.97, 14, 'France', 'Central', 1, NULL),
    ('Henno', 'Dorian', 'Masculin', '1994-01-21', 1.87, 1, 'France', 'Libero', 1, NULL),
    ('Tual', 'Lucas', 'Masculin', '1998-10-12', 2.01, 13, 'France', 'Attaquant', 1, NULL),

    -- Allemagne
    ('Fromm ', 'Christian', 'Masculin', '1990-08-15', 2.04, 1, 'Allemagne', 'Receveur-Attaquant', 2, 'Fromm.png'),
    ('Steuerwald ', 'Markus', 'Masculin', '1989-03-07', 1.82, 2, 'Allemagne', 'Libero', 2, 'Steuerwald.png'),
    ('Böhme ', 'Marcus', 'Masculin', '1985-08-25', 2.11, 3, 'Allemagne', 'Central', 2, 'Böhme.png'),
    ('Zimmermann', 'Jan', 'Masculin', '1993-02-12', 1.90, 4, 'Allemagne', 'Passeur', 2, 'Zimmermann.png'),
    ('Vettori', 'Alexander', 'Masculin', '1988-02-11', 2.02, 5, 'Allemagne', 'Central', 2, NULL),
    ('Schöps', 'Jochen', 'Masculin', '1983-11-08', 1.95, 6, 'Allemagne', 'Attaquant', 2, 'Schöps.png'),
    ('Wickler', 'Moritz', 'Masculin', '1994-06-06', 2.01, 7, 'Allemagne', 'Receveur-Attaquant', 2, NULL),
    ('Schweiger', 'Lukas', 'Masculin', '1992-01-18', 1.90, 8, 'Allemagne', 'Libero', 2, NULL),
    ('Huber', 'Tobias', 'Masculin', '1995-04-20', 2.00, 9, 'Allemagne', 'Attaquant', 2, NULL),
    ('Strohbach', 'Tom', 'Masculin', '1996-12-02', 1.98, 10, 'Allemagne', 'Receveur-Attaquant', 2, 'Strohbach.png'),
    ('Maase', 'Nils', 'Masculin', '1989-03-28', 1.97, 11, 'Allemagne', 'Central', 2, NULL),
    ('Höfflin', 'Patrick', 'Masculin', '1993-05-16', 1.99, 12, 'Allemagne', 'Attaquant', 2, NULL),
    ('Reinhardt', 'Tobias', 'Masculin', '1992-07-11', 1.92, 13, 'Allemagne', 'Libero', 2, NULL),
    ('Tille', 'Fabian', 'Masculin', '1997-09-30', 1.96, 14, 'Allemagne', 'Receveur-Attaquant', 2, NULL),

    -- Argentine
    ('Sanchez', 'Matias', 'Masculin', '1996-09-20', 1.73, 1, 'Argentine', 'Passeur', 3, 'Sanchez.png'),
    ('Martinez Franchi', 'Jan', 'Masculin', '1998-01-28', 1.90, 2, 'Argentine', 'Attaquant', 3, 'Martinez Franchi.png'),
    ('Gallego', 'Joaquin', 'Masculin', '1996-11-21', 2.04, 3, 'Argentine', 'Central', 3, 'Gallego.png'),
    ('Conte', 'Facundo', 'Masculin', '1989-08-25', 1.97, 4, 'Argentine', 'Receveur-Attaquant', 3, 'Conte.png'),
    ('Loser', 'Agustin', 'Masculin', '1997-10-12', 1.98, 5, 'Argentine', 'Central', 3, NULL),
    ('Danani', 'Santiago', 'Masculin', '1995-12-12', 1.76, 6, 'Argentine', 'Attaquant', 3, NULL),
    ('Lima', 'Bruno', 'Masculin', '1996-02-04', 1.98, 7, 'Argentine', 'Receveur-Attaquant', 3, 'Lima.png'),
    ('Palacios', 'Ezequiel', 'Masculin', '1992-10-02', 1.98, 8, 'Argentine', 'Libero', 3, 'Palacios.png'),
    ('De Cecco', 'Luciano', 'Masculin', '1988-06-02', 1.94, 9, 'Argentine', 'Attaquant', 3, NULL),
    ('Kukartsev', 'Pablo', 'Masculin', '1993-03-25', 2.03, 10, 'Argentine', 'Receveur-Attaquant', 3, NULL),
    ('Vicentin', 'Luciano', 'Masculin', '2000-04-04', 1.99, 11, 'Argentine', 'Central', 3, NULL),
    ('Ramos', 'Martin', 'Masculin', '1991-08-26', 1.97, 12, 'Argentine', 'Attaquant', 3, NULL),
    ('Palonsky', 'Luciano', 'Masculin', '1999-07-08', 1.98, 13, 'Argentine', 'Libero', 3, NULL),
    ('Zerba', 'Nicolas', 'Masculin', '1999-06-13', 2.04, 14, 'Argentine', 'Receveur-Attaquant', 3, NULL),

    -- Italie 
    ('Porro', 'Paolo', 'Masculin', '2001-10-27', 1.85, 2, 'Italie', 'Attaquant', 4, 'Porro.png'),
    ('Falaschi', 'Marco', 'Masculin', '1987-09-18', 1.87, 3, 'Italie', 'Receveur-Attaquant', 4, 'Falaschi.png'),
    ('Balaso', 'Fabio', 'Masculin', '1995-10-20', 1.82, 7, 'Italie', 'Receveur-Attaquant', 4, 'Balaso.png'),
    ('Recine', 'Francesco', 'Masculin', '1999-02-07', 1.85, 9, 'Italie', 'Attaquant', 4, NULL),
    ('Gardini', 'Davide', 'Masculin', '1999-02-11', 2.05, 11, 'Italie', 'Central', 4, 'Gardini.png'),
    ('Bottolo', 'Mattia', 'Masculin', '2000-01-03', 1.96, 12, 'Italie', 'Receveur-Attaquant', 4, NULL),
    ('Cortesia', 'Lorenzo', 'Masculin', '1999-07-26', 2.02, 13, 'Italie', 'Central', 4, NULL),
    ('Romano', 'Yuri', 'Masculin', '1997-07-26', 2.03, 16, 'Italie', 'Passeur', 4, 'Romano.png'),
    ('Gironi', 'Fabrizio', 'Masculin', '2000-03-18', 2.00, 18, 'Italie', 'Central', 4, NULL),
    ('Rinaldi', 'Tommaso', 'Masculin', '1991-01-18', 2.00, 20, 'Italie', 'Libero', 4, 'Rinaldi.png'),
    ('Vitelli', 'Marco', 'Masculin', '1996-04-04', 2.03, 25, 'Italie', 'Attaquant', 4, NULL),
    ('Sanguinetti', 'Giovanni', 'Masculin', '2000-04-14', 2.02, 28, 'Italie', 'Receveur-Attaquant', 4, NULL),
    ('Mosca', 'Leandro', 'Masculin', '2000-09-05', 2.09, 30, 'Italie', 'Attaquant', 4, NULL),
    ('Zaytsev', 'Ivan', 'Masculin', '1988-10-02', 2.02, 9, 'Italie', 'Attaquant', 4, NULL),
   
    -- Canada
    ('Gyimah', 'Daenan', 'Masculin', '1998-01-15', 2.00, 1, 'Canada', 'Passeur', 5, 'Gyimah.png'),
    ('Herr', 'Luke', 'Masculin', '1994-07-18', 1.94, 2, 'Canada', 'Attaquant', 5, 'Herr.png'),
    ('Hofer', 'Brodie', 'Masculin', '2000-04-27', 1.99, 5, 'Canada', 'Central', 5, 'Hofer.png'),
    ('Greves', 'Mason', 'Masculin', '2003-02-26', 1.86, 8, 'Canada', 'Receveur-Attaquant', 5, 'Greves.png'),
    ('Sclater', 'Ryan', 'Masculin', '1994-02-10', 2.00, 10, 'Canada', 'Central', 5, NULL),
    ('Ketrzynski', 'Xander', 'Masculin', '2000-01-27', 2.08, 11, 'Canada', 'Attaquant', 5, NULL),
    ('Elgert', 'Maxwell', 'Masculin', '1998-08-31', 1.91, 13, 'Canada', 'Receveur-Attaquant', 5, 'Elgert.png'),
    ('Young', 'Jackson', 'Masculin', '2001-07-29', 1.95, 15, 'Canada', 'Libero', 5, 'Young.png'),
    ('Schnitzer', 'Jordan', 'Masculin', '1999-07-28', 1.98, 16, 'Canada', 'Attaquant', 5, NULL),
    ('Lui', 'Justin', 'Masculin', '2000-05-08', 1.77, 18, 'Canada', 'Receveur-Attaquant', 5, NULL),
    ('Heslinga', 'Isaac', 'Masculin', '2002-01-22', 2.00, 22, 'Canada', 'Central', 5, NULL),
    ('McCarthy', 'Fynn', 'Masculin', '1999-12-04', 2.00, 33, 'Canada', 'Attaquant', 5, NULL),
    ('Currie', 'Landon', 'Masculin', '1999-10-16', 1.76, 97, 'Canada', 'Libero', 5, NULL),
    ('Varga', 'Skyler', 'Masculin', '2003-03-06', 2.00, 99, 'Canada', 'Attaquant', 5, NULL),


    -- Bulgarie
    ('Bratoev', 'Georgi', 'Masculin', '1990-03-18', 1.85, 7, 'Bulgarie', 'Passeur', 6, 'Bratoev.png'),
    ('Dimitrov', 'Dobromir', 'Masculin', '1995-06-12', 1.88, 9, 'Bulgarie', 'Attaquant', 6, 'Dimitrov.png'),
    ('Seganov', 'Georgi', 'Masculin', '1996-01-04', 1.86, 1, 'Bulgarie', 'Central', 6, 'Seganov.png'),
    ('Ivanov', 'Vladislav', 'Masculin', '1989-11-22', 1.80, 16, 'Bulgarie', 'Receveur-Attaquant', 6, 'Ivanov.png'),
    ('Dobrev', 'Simeon', 'Masculin', '2004-05-09', 1.98, 21, 'Bulgarie', 'Central', 6, NULL),
    ('Grozdanov', 'Aleks', 'Masculin', '2001-02-17', 2.05, 11, 'Bulgarie', 'Attaquant', 6, NULL),
    ('Salparov', 'Teodor', 'Masculin', '1986-08-27', 2.08, 13, 'Bulgarie', 'Receveur-Attaquant', 6, 'Salparov.png'),
    ('Chavdarov', 'Stefan', 'Masculin', '1999-04-03', 2.02, 2, 'Bulgarie', 'Libero', 6, 'Chavdarov.png'),
    ('Petkov', 'Iliya', 'Masculin', '1998-12-14', 2.01, 24, 'Bulgarie', 'Attaquant', 6, NULL),
    ('Kolev', 'Nikolay', 'Masculin', '2001-07-30', 2.00, 3, 'Bulgarie', 'Receveur-Attaquant', 6, NULL),
    ('Gotsev', 'Svetoslav', 'Masculin', '1994-09-11', 2.07, 5, 'Bulgarie', 'Central', 6, NULL),
    ('Sokolov', 'Tsvetan', 'Masculin', '1993-04-25', 2.06, 19, 'Bulgarie', 'Attaquant', 6, NULL),
    ('Asparuhov', 'Asparuh', 'Masculin', '2004-01-19', 1.96, 14, 'Bulgarie', 'Receveur-Attaquant', 6, NULL),
    ('Skrimov', 'Todor', 'Masculin', '1989-01-13', 1.92, 8, 'Bulgarie', 'Attaquant', 6, NULL),


    -- Brésil
    ('Rezende', 'Bruno', 'Masculin', '1986-07-02', 1.90, 1, 'Brésil', 'Passeur', 7, 'Rezende.png'),
    ('Bergmann', 'Lukas', 'Masculin', '2004-03-25', 2.04, 2, 'Brésil', 'Libero', 7, 'Bergmann.png'),
    ('Xavier', 'Adriano', 'Masculin', '2002-02-06', 2.01, 6, 'Brésil', 'Central', 7, 'Xavier.png'),
    ('Honorato', 'Henrique', 'Masculin', '1997-03-18', 1.90, 8, 'Brésil', 'Attaquant', 7, NULL),
    ('Leal Hidalgo', 'Yoandy', 'Masculin', '1988-08-31', 2.01, 9, 'Brésil', 'Receveur-Attaquant', 7, 'Leal Hidalgo.png'),
    ('Santos', 'Isac', 'Masculin', '1990-12-13', 2.08, 12, 'Brésil', 'Central', 7, NULL),
    ('Kreling', 'Fernando', 'Masculin', '1996-01-13', 1.85, 14, 'Brésil', 'Attaquant', 7, NULL),
    ('Saatkamp', 'Lucas', 'Masculin', '1986-03-06', 2.09, 16, 'Brésil', 'Receveur-Attaquant', 7, 'Saatkamp.png'),
    ('Hoss', 'Thales', 'Masculin', '1989-04-27', 1.90, 17, 'Brésil', 'Central', 7, NULL),
    ('Lucarelli', 'Ricardo', 'Masculin', '1992-02-14', 1.96, 18, 'Brésil', 'Receveur-Attaquant', 7, NULL),
    ('Borges Silva', 'Mauricio', 'Masculin', '1989-02-04', 1.99, 19, 'Brésil', 'Receveur-Attaquant', 7, NULL),
    ('Souza', 'Alan', 'Masculin', '1994-03-21', 2.02, 21, 'Brésil', 'Attaquant', 7, 'Souza.png'),
    ('Gualberto', 'Flavio', 'Masculin', '1993-04-22', 2.00, 23, 'Brésil', 'Attaquant', 7, NULL),
    ('Souza', 'Darlan', 'Masculin', '2002-06-24', 1.93, 28, 'Brésil', 'Central', 7, NULL),


    -- Cuba
    ('Masso', 'Israel', 'Masculin', '1997-12-02', 2.04, 1, 'Cuba', 'Central', 8, 'Masso.png'),
    ('Melgarejo', 'Osniel', 'Masculin', '1997-12-18', 1.97, 2, 'Cuba', 'Receveur-Attaquant', 8, 'Melgarejo.png'),
    ('Sanchez', 'Michael', 'Masculin', '1986-06-05', 2.06, 4, 'Cuba', 'Attaquant', 8, 'Sanchez.png'),
    ('Concepcion', 'Javier', 'Masculin', '1997-12-27', 2.00, 5, 'Cuba', 'Central', 8, NULL),
    ('Mejias', 'Christian', 'Masculin', '2001-05-28', 1.95, 6, 'Cuba', 'Passeur', 8, 'Mejias.png'),
    ('Garcia', 'Yonder', 'Masculin', '1993-02-26', 1.83, 7, 'Cuba', 'Libero', 8, 'Garcia.png'),
    ('Taboada', 'Livan', 'Masculin', '1998-10-04', 1.99, 11, 'Cuba', 'Passeur', 8, NULL),
    ('Simon Aties', 'Robertlandy', 'Masculin', '1996-06-11', 2.08, 13, 'Cuba', 'Central', 8, NULL),
    ('Camino', 'Bryan', 'Masculin', '2003-02-23', 1.86, 15, 'Cuba', 'Receveur-Attaquant', 8, 'Camino.png'),
    ('Alonso', 'Roamy', 'Masculin', '1997-07-24', 2.03, 17, 'Cuba', 'Central', 8, NULL),
    ('Lopez', 'Miguel Angel', 'Masculin', '1997-03-25', 1.89, 18, 'Cuba', 'Receveur-Attaquant', 8, NULL),
    ('Yant', 'Marlon', 'Masculin', '2001-05-23', 2.04, 23, 'Cuba', 'Receveur-Attaquant', 8, NULL),
    ('Gorguet Salas', 'Alain', 'Masculin', '1993-12-28', 1.89, 24, 'Cuba', 'Libero', 8, NULL),
    ('Charles', 'Carlos', 'Masculin', '2000-10-04', 1.98, 31, 'Cuba', 'Attaquant', 8, NULL),



    -- États-Unis
    ('Anderson', 'Matt', 'Masculin', '1987-04-18', 2.02, 1, 'États-Unis', 'Passeur', 9, 'Anderson.png'),
    ('Russell', 'Aaron', 'Masculin', '1993-06-04', 2.05, 2, 'États-Unis', 'Attaquant', 9, 'Russell.png'),
    ('Jendryk', 'Jeff', 'Masculin', '1995-09-15', 2.08, 4, 'États-Unis', 'Central', 9, 'Jendryk.png'),
    ('DeFalco', 'TJ', 'Masculin', '1997-04-10', 1.98, 8, 'États-Unis', 'Receveur-Attaquant', 9, 'DeFalco.png'),
    ('Christenson', 'Micah', 'Masculin', '1993-05-08', 1.98, 11, 'États-Unis', 'Central', 9, NULL),
    ('Holt', 'Max', 'Masculin', '1987-03-12', 2.08, 12, 'États-Unis', 'Attaquant', 9, NULL),
    ('Ma''a', 'Micah', 'Masculin', '1997-01-26', 1.91, 14, 'États-Unis', 'Receveur-Attaquant', 9, 'Maa.png'),
    ('Jaeschke', 'Thomas', 'Masculin', '1993-08-15', 2.01, 17, 'États-Unis', 'Libero', 9, 'Jaeschke.png'),
    ('Muagututia', 'Garrett', 'Masculin', '1994-11-09', 1.88, 18, 'États-Unis', 'Attaquant', 9, NULL),
    ('Averill', 'Taylor', 'Masculin', '1993-03-28', 2.06, 19, 'États-Unis', 'Receveur-Attaquant', 9, NULL),
    ('Smith', 'David', 'Masculin', '1985-05-15', 2.03, 20, 'États-Unis', 'Central', 9, NULL),
    ('Shoji', 'Erik', 'Masculin', '1989-08-24', 1.84, 22, 'États-Unis', 'Attaquant', 9, NULL),
    ('Ensing', 'Kyle', 'Masculin', '1995-03-20', 2.06, 5, 'États-Unis', 'Libero', 9, NULL),
    ('Speraw', 'John', 'Masculin', '1966-01-01', 1.85, 99, 'États-Unis', 'Central', 9, NULL),

    -- Slovénie
    ('Štern', 'Tonček', 'Masculin', '1995-11-14', 2.00, 1, 'Slovénie', 'Passeur', 10, 'Stern.png'),
    ('Pajenk', 'Alen', 'Masculin', '1986-04-23', 2.05, 2, 'Slovénie', 'Central', 10, 'Pajenk.png'),
    ('Planinšič', 'Uroš', 'Masculin', '1997-10-15', 1.88, 3, 'Slovénie', 'Passeur', 10, NULL),
    ('Kozamernik', 'Jan', 'Masculin', '1995-12-24', 2.04, 4, 'Slovénie', 'Central', 10, NULL),
    ('Vinčić', 'Dejan', 'Masculin', '1987-01-27', 2.02, 9, 'Slovénie', 'Attaquant', 10, 'Vincic.png'),
    ('Štalekar', 'Sašo', 'Masculin', '1995-06-18', 2.14, 10, 'Slovénie', 'Receveur-Attaquant', 10, 'Stalekar.png'),
    ('Kovačič', 'Jani', 'Masculin', '1991-10-09', 1.86, 13, 'Slovénie', 'Libero', 10, 'Kovacic.png'),
    ('Štern', 'Žiga', 'Masculin', '1994-01-02', 1.93, 14, 'Slovénie', 'Attaquant', 10, NULL),
    ('Ropret', 'Gregor', 'Masculin', '1989-03-12', 1.92, 16, 'Slovénie', 'Receveur-Attaquant', 10, 'Ropret.png'),
    ('Urnaut', 'Tine', 'Masculin', '1988-09-03', 2.00, 17, 'Slovénie', 'Attaquant', 10, NULL),
    ('Čebulj', 'Klemen', 'Masculin', '1992-02-21', 2.02, 18, 'Slovénie', 'Attaquant', 10, NULL),
    ('Možič', 'Rok', 'Masculin', '2002-01-17', 1.99, 19, 'Slovénie', 'Attaquant', 10, NULL),
    ('Mujanović', 'Matic', 'Masculin', '1997-06-15', 1.95, 20, 'Slovénie', 'Passeur', 10, NULL),
    ('Toman', 'Urban', 'Masculin', '1997-10-21', 1.85, 21, 'Slovénie', 'Libero', 10, NULL),

    -- Iran
    ('Marouf', 'Saeid', 'Masculin', '1985-10-20', 1.95, 1, 'Iran', 'Passeur', 11, 'Marouf.png'),
    ('Ebadipour', 'Milad', 'Masculin', '1993-10-17', 1.98, 2, 'Iran', 'Attaquant', 11, 'Ebadipour.png'),
    ('Mousavi', 'Seyed Mohammad', 'Masculin', '1990-08-28', 2.06, 3, 'Iran', 'Central', 11, 'Mousavi.png'),
    ('Ghafour', 'Amir', 'Masculin', '1991-06-20', 1.98, 4, 'Iran', 'Libero', 11, 'Ghafour.png'),
    ('Mahmoudi', 'Shahram', 'Masculin', '1988-07-20', 1.98, 5, 'Iran', 'Receveur-Attaquant', 11, 'Mahmoudi.png'),
    ('Salehi', 'Meysam', 'Masculin', '1996-02-17', 1.92, 6, 'Iran', 'Receveur-Attaquant', 11, NULL),
    ('Mojarad', 'Aliasghar', 'Masculin', '1990-01-21', 2.05, 7, 'Iran', 'Central', 11, NULL),
    ('Marandi', 'Mehdi', 'Masculin', '1986-05-12', 1.86, 8, 'Iran', 'Receveur-Attaquant', 11, 'Marandi.png'),
    ('Sharifi', 'Morteza', 'Masculin', '1992-03-15', 1.97, 9, 'Iran', 'Attaquant', 11, NULL),
    ('Karimi', 'Javad', 'Masculin', '1992-09-08', 1.94, 10, 'Iran', 'Passeur', 11, NULL),
    ('Kazemi', 'Saber', 'Masculin', '1991-12-29', 2.00, 11, 'Iran', 'Passeur', 11, NULL),
    ('Chaparli', 'Salim', 'Masculin', '1995-06-11', 1.96, 12, 'Iran', 'Attaquant', 11, NULL),
    ('Salehi', 'Arman', 'Masculin', '1992-11-24', 1.88, 13, 'Iran', 'Libero', 11, NULL),
    ('Hazratpour', 'Mohammadreza', 'Masculin', '1994-07-19', 2.03, 14, 'Iran', 'Central', 11, NULL),

    -- Ukraine
    ('Rohozhyn', 'Andrii', 'Masculin', '1995-01-19', 2.00, 1, 'Ukraine', 'Central', 12, 'Rohozhyn.png'),
    ('Ostapenko', 'Volodymyr', 'Masculin', '1996-08-22', 1.98, 2, 'Ukraine', 'Attaquant', 12, 'Ostapenko.png'),
    ('Didenko', 'Vladyslav', 'Masculin', '1993-03-17', 1.92, 3, 'Ukraine', 'Passeur', 12, 'Didenko.png'),
    ('Shchytkov', 'Vitaliy', 'Masculin', '1995-11-08', 1.90, 4, 'Ukraine', 'Libero', 12, 'Shchytkov.png'),
    ('Fomin', 'Denys', 'Masculin', '1997-06-14', 2.03, 5, 'Ukraine', 'Receveur-Attaquant', 12, 'Fomin.png'),
    ('Kisiliuk', 'Yevhenii', 'Masculin', '1994-09-23', 1.97, 6, 'Ukraine', 'Receveur-Attaquant', 12, 'Kisiliuk.png'),
    ('Stebletskyy', 'Andriy', 'Masculin', '1993-05-11', 1.92, 7, 'Ukraine', 'Passeur', 12, NULL),
    ('Zhukov', 'Andriy', 'Masculin', '1992-07-06', 1.90, 8, 'Ukraine', 'Libero', 12, NULL),
    ('Luban', 'Mykyta', 'Masculin', '1998-12-30', 1.99, 9, 'Ukraine', 'Attaquant', 12, NULL),
    ('Shteryk', 'Eduard', 'Masculin', '1996-04-11', 1.95, 10, 'Ukraine', 'Attaquant', 12, NULL),
    ('Dolgopolov', 'Dmytro', 'Masculin', '1991-10-27', 2.02, 11, 'Ukraine', 'Opposite', 12, NULL),
    ('Shapoval', 'Dmytro', 'Masculin', '1995-08-15', 1.98, 12, 'Ukraine', 'Opposite', 12, NULL),
    ('Boyko', 'Oleksandr', 'Masculin', '1994-02-20', 1.88, 13, 'Ukraine', 'Libero', 12, NULL),
    ('Kuts', 'Mykola', 'Masculin', '1992-03-06', 2.10, 14, 'Ukraine', 'Central', 12, NULL), 

    -- Chine
    ('Shi', 'Hairong', 'Masculin', '1981-06-01', 1.98, 1, 'Chine', 'Central', 13, 'Shi.png'),
    ('Shen', 'Qiong', 'Masculin', '1981-10-29', 1.94, 2, 'Chine', 'Attaquant', 13, 'Shen.png'),
    ('Jiang', 'Fudong', 'Masculin', '1985-02-18', 1.96, 3, 'Chine', 'Libero', 13, 'Jiang.png'),
    ('Guo', 'Peng', 'Masculin', '1982-08-07', 2.01, 4, 'Chine', 'Passeur', 13, 'Guo.png'),
    ('Fang', 'Yingchao', 'Masculin', '1986-03-12', 2.00, 5, 'Chine', 'Receveur-Attaquant', 13, 'Fang.png'),
    ('Bian', 'Hongmin', 'Masculin', '1983-11-21', 1.93, 6, 'Chine', 'Receveur-Attaquant', 13, 'Bian.png'),
    ('Li', 'Yongzhen', 'Masculin', '1998-01-04', 2.05, 7, 'Chine', 'Central', 13, NULL),
    ('Miao', 'Ruantong', 'Masculin', '1997-07-23', 1.89, 8, 'Chine', 'Libero', 13, NULL),
    ('Wang', 'Hebin', 'Masculin', '1996-09-11', 1.90, 9, 'Chine', 'Passeur', 13, NULL),
    ('Yu', 'Yuantai', 'Masculin', '1994-12-08', 1.95, 10, 'Chine', 'Attaquant', 13, NULL),
    ('Yang', 'Tianyuan', 'Masculin', '1996-11-17', 1.93, 11, 'Chine', 'Passeur', 13, NULL),
    ('Zhang', 'Binglong', 'Masculin', '1999-03-21', 2.00, 12, 'Chine', 'Passeur', 13, NULL),
    ('Dai', 'Qingyao', 'Masculin', '1993-07-02', 1.87, 13, 'Chine', 'Attaquant', 13, NULL),
    ('Yuan', 'Dangyi', 'Masculin', '2000-02-18', 2.06, 14, 'Chine', 'Central', 13, NULL),

    -- Japon
    ('Nishida', 'Yuji', 'Masculin', '2000-01-30', 1.86, 1, 'Japon', 'Passeur', 14, 'Nishida.png'),
    ('Onodera', 'Taishi', 'Masculin', '1992-12-10', 2.04, 2, 'Japon', 'Central', 14, 'Onodera.png'),
    ('Fukatsu', 'Hiroaki', 'Masculin', '1987-08-15', 1.84, 3, 'Japon', 'Libero', 14, 'Fukatsu.png'),
    ('Miyaura', 'Tatsunori', 'Masculin', '1993-10-05', 1.88, 4, 'Japon', 'Passeur', 14, NULL),
    ('Otsuka', 'Yuki', 'Masculin', '1997-12-21', 1.87, 5, 'Japon', 'Attaquant', 14, NULL),
    ('Yamauchi', 'Akihiro', 'Masculin', '1995-08-11', 2.05, 6, 'Japon', 'Central', 14, NULL),
    ('Sekita', 'Masahiro', 'Masculin', '1991-05-11', 1.90, 8, 'Japon', 'Attaquant', 14, 'Sekita.png'),
    ('Takahashi', 'Kentaro', 'Masculin', '1991-07-12', 2.02, 10, 'Japon', 'Receveur-Attaquant', 14,'Takahashi.png'),
    ('Takahashi', 'Ran', 'Masculin', '1998-09-07', 1.90, 12, 'Japon', 'Attaquant', 14, NULL),
    ('Ishikawa', 'Yuki', 'Masculin', '1991-12-11', 1.91, 14, 'Japon', 'Receveur-Attaquant', 14, 'Ishikawa.png'),
    ('Yamagiwa', 'Kai', 'Masculin', '2002-01-06', 1.85, 15, 'Japon', 'Attaquant', 14, NULL),
    ('Yamamoto', 'Taiki', 'Masculin', '1997-07-12', 1.82, 20, 'Japon', 'Libero', 14, NULL),
    ('Tomita', 'Haku', 'Masculin', '1998-03-19', 1.87, 11, 'Japon', 'Attaquant', 14, NULL),
    ('Nishikawa', 'Takuya', 'Masculin', '1992-05-17', 1.98, 9, 'Japon', 'Libero', 14, NULL),

    -- Pologne
    ('Popiwczak', 'Jakub', 'Masculin', '1996-01-01', 1.80, 3, 'Pologne', 'Libero', 15, 'Popiwczak.png'),
    ('Komenda', 'Marcin', 'Masculin', '1996-01-01', 1.98, 4, 'Pologne', 'Passeur', 15, NULL),
    ('Kaczmarek', 'Łukasz', 'Masculin', '1994-01-01', 2.04, 5, 'Pologne', 'Passeur', 15, 'Kaczmarek.png'),
    ('Kurek', 'Bartosz', 'Masculin', '1988-08-29', 2.01, 6, 'Pologne', 'Attaquant', 15, NULL),
    ('Kłos', 'Karol', 'Masculin', '1989-01-01', 2.01, 7, 'Pologne', 'Central', 15, 'Klos.png'),
    ('Leon', 'Wilfredo', 'Masculin', '1993-07-31', 2.01, 9, 'Pologne', 'Attaquant', 15, 'Leon.png'),
    ('Bednorz', 'Bartosz', 'Masculin', '1994-01-01', 2.01, 10, 'Pologne', 'Receveur-Attaquant', 15, 'Bednorz.png'),
    ('Śliwka', 'Aleksander', 'Masculin', '1995-03-05', 1.96, 11, 'Pologne', 'Receveur-Attaquant', 15, 'Sliwka.png'),
    ('Łomacz', 'Grzegorz', 'Masculin', '1987-01-01', 1.88, 12, 'Pologne', 'Passeur', 15, NULL),
    ('Kochanowski', 'Jakub', 'Masculin', '1997-08-15', 1.99, 15, 'Pologne', 'Central', 15, NULL),
    ('Semeniuk', 'Kamil', 'Masculin', '1996-01-01', 1.94, 16, 'Pologne', 'Attaquant', 15, NULL),
    ('Zatorski', 'Paweł', 'Masculin', '1990-06-21', 1.84, 17, 'Pologne', 'Libero', 15, NULL),
    ('Janusz', 'Marcin', 'Masculin', '1994-01-01', 1.95, 19, 'Pologne', 'Passeur', 15, NULL),
    ('Bieniek', 'Mateusz', 'Masculin', '1994-01-01', 2.08, 20, 'Pologne', 'Central', 15, NULL),

    -- Serbie
    ('Okolić', 'Aleksandar', 'Masculin', '1993-01-01', 2.06, 1, 'Serbie', 'Central', 16, 'Okolic.png'),
    ('Kovačević', 'Uroš', 'Masculin', '1993-01-01', 1.98, 2, 'Serbie', 'Attaquant', 16, 'Kovacevic.png'),
    ('Peković', 'Nikola', 'Masculin', '1990-01-01', 1.76, 6, 'Serbie', 'Libero', 16, NULL),
    ('Krsmаnović', 'Petar', 'Masculin', '1990-01-01', 2.04, 7, 'Serbie', 'Libero', 16, 'Krsmanovic.png'),
    ('Ivović', 'Marko', 'Masculin', '1990-01-01', 1.94, 8, 'Serbie', 'Receveur-Attaquant', 16, 'Ivovic.png'),
    ('Jovović', 'Nikola', 'Masculin', '1992-01-01', 1.99, 9, 'Serbie', 'Passeur', 16, 'Jovovic.png'),
    ('Perić', 'Pavle', 'Masculin', '1998-01-01', 2.07, 12, 'Serbie', 'Attaquant', 16, NULL),
    ('Atanasijević', 'Aleksandar', 'Masculin', '1991-01-01', 2.02, 14, 'Serbie', 'Opposé', 16, NULL),
    ('Luburić', 'Dražen', 'Masculin', '1993-01-01', 2.02, 16, 'Serbie', 'Receveur-Attaquant', 16, 'Luburic.png'),
    ('Majstorović', 'Neven', 'Masculin', '1989-01-01', 1.93, 17, 'Serbie', 'Libero', 16, NULL),
    ('Podraščanin', 'Marko', 'Masculin', '1987-10-29', 2.04, 18, 'Serbie', 'Central', 16, NULL),
    ('Lisinac', 'Srećko', 'Masculin', '1992-01-01', 2.05, 20, 'Serbie', 'Central', 16, NULL),
    ('Todorović', 'Vuk', 'Masculin', '1998-01-01', 1.91, 21, 'Serbie', 'Passeur', 16, NULL),
    
    -- Pays-Bas
    ('Jorna', 'Gijs', 'Masculin', '1989-05-30', 1.84, 7, 'Pays-Bas', 'Libero', 17, 'Jorna.png'),
    ('Ter Horst', 'Thijs', 'Masculin', '1991-09-18', 2.03, 4, 'Pays-Bas', 'Attaquant', 17, 'Ter Horst.png'),
    ('Wiltenburg', 'Twan', 'Masculin', '1997-01-20', 2.06, 22, 'Pays-Bas', 'Central', 17, 'Wiltenburg.png'),
    ('Klok', 'Jeffrey', 'Masculin', '1998-01-01', 1.86, 2, 'Pays-Bas', 'Libero', 17, NULL),
    ('Tuinstra', 'Bennie', 'Masculin', '2000-01-01', 2.00, 5, 'Pays-Bas', 'Attaquant', 17, NULL),
    ('Wijkstra', 'Jasper', 'Masculin', '2002-01-01', 1.99, 6, 'Pays-Bas', 'Receveur-Attaquant', 17, 'Wijkstra.png'),
    ('Van Der Ent', 'Luuc', 'Masculin', '1998-07-27', 2.07, 1, 'Pays-Bas', 'Central', 17, NULL),
    ('Plak', 'Fabian', 'Masculin', '1996-05-01', 2.04, 8, 'Pays-Bas', 'Attaquant', 17, NULL),
    ('Ahyi', 'Michiel', 'Masculin', '1998-01-01', 2.02, 9, 'Pays-Bas', 'Attaquant', 17, NULL),
    ('Berkhout', 'Joris', 'Masculin', '1999-01-01', 1.92, 10, 'Pays-Bas', 'Receveur-Attaquant', 17, 'Berkhout.png'), 
    ('Meijs', 'Sil', 'Masculin', '2002-01-01', 1.90, 11, 'Pays-Bas', 'Passeur', 17, 'Meijs.png'),
    ('Keemink', 'Wessel', 'Masculin', '1993-05-29', 1.94, 12, 'Pays-Bas', 'Receveur-Attaquant', 17, NULL),
    ('Wortelboer', 'Beau', 'Masculin', '2002-01-01', 2.05, 13, 'Pays-Bas', 'Central', 17, NULL),
    ('Van Dijk', 'Ferdy', 'Masculin', '1999-01-01', 1.82, 14, 'Pays-Bas', 'Libero', 17, NULL),



    -- Turquie
    ('Lagumdzija', 'Adis', 'Masculin', '2000-05-12', 1.98, 1, 'Turquie', 'Attaquant', 18, 'Lagumdzija.png'),
    ('Gulmezoglu', 'Yigit', 'Masculin', '1996-09-21', 2.01, 2, 'Turquie', 'Receveur-Attaquant', 18, 'Gulmezoglu.png'),
    ('Bülbül', 'Bedirhan', 'Masculin', '2000-03-08', 2.00, 3, 'Turquie', 'Central', 18, 'Bülbül.png'),
    ('Done', 'Volkan', 'Masculin', '1988-07-14', 1.90, 4, 'Turquie', 'Libero', 18, 'Done.png'),
    ('Eksi', 'Arslan', 'Masculin', '1986-11-30', 1.95, 5, 'Turquie', 'Passeur', 18, 'Eksi.png'),
    ('Gunes', 'Faik', 'Masculin', '1994-02-17', 2.01, 6, 'Turquie', 'Central', 18, NULL),
    ('Lagumdzija', 'Mirza', 'Masculin', '2002-06-24', 1.99, 7, 'Turquie', 'Central', 18, NULL),
    ('Savas', 'Vahit Emre', 'Masculin', '1996-10-11', 2.00, 8, 'Turquie', 'Central', 18, NULL),
    ('Bayram', 'Efe', 'Masculin', '2003-08-05', 1.97, 9, 'Turquie', 'Receveur-Attaquant', 18, 'Bayram.png'),
    ('Bostan', 'Arda', 'Masculin', '2003-12-14', 1.96, 10, 'Turquie', 'Passeur', 18, NULL),
    ('Gungor', 'Baturalp Burak', 'Masculin', '1994-03-28', 2.02, 11, 'Turquie', 'Receveur-Attaquant', 18, NULL),
    ('Matic', 'Mert', 'Masculin', '1996-07-19', 2.00, 12, 'Turquie', 'Central', 18, NULL),
    ('Bayraktar', 'Berkay', 'Masculin', '1999-01-23', 1.89, 13, 'Turquie', 'Libero', 18, NULL),
    ('Subasi', 'Burutay', 'Masculin', '1991-04-12', 2.01, 14, 'Turquie', 'Receveur-Attaquant', 18, NULL),
    ('Gurbuz', 'Kaan', 'Masculin', '2002-09-07', 1.98, 15, 'Turquie', 'Attaquant', 18, NULL),
    ('Hatipoglu', 'Beytullah', 'Masculin', '1993-05-22', 1.90, 16, 'Turquie', 'Libero', 18, NULL),
    ('Ulu', 'Dogukan', 'Masculin', '1996-08-30', 2.01, 17, 'Turquie', 'Central', 18, NULL),
    ('Toy', 'Metin', 'Masculin', '1995-11-10', 1.99, 18, 'Turquie', 'Attaquant', 18, NULL),


    -- Belgique
    ('Lecat', 'François', 'Masculin', '1993-04-15', 2.00, 1, 'Belgique', 'Attaquant', 19, 'Lecat.png'),
    ('Tuerlinckx', 'Hendrik', 'Masculin', '1987-09-21', 1.95, 2, 'Belgique', 'Receveur-Attaquant', 19, 'Tuerlinckx.png'),
    ('Deroo', 'Sam', 'Masculin', '1992-02-03', 2.03, 3, 'Belgique', 'Attaquant', 19, NULL),
    ('Dhulst', 'Stijn', 'Masculin', '1991-07-14', 1.87, 4, 'Belgique', 'Passeur', 19, 'Dhulst.png'),
    ('Pieter', 'le mec cool', 'Masculin', '1989-05-30', 1.99, 5, 'Belgique', 'Central', 19, NULL),
    ('Van Elsen', 'Lennert', 'Masculin', '2001-11-05', 2.03, 7, 'Belgique', 'Receveur-Attaquant', 19, 'Van Elsen.png'),
    ('Verhanneman', 'Matthijs', 'Masculin', '1988-06-19', 1.98, 8, 'Belgique', 'Attaquant', 19, NULL),
    ('Dheer', 'Wout', 'Masculin', '2001-08-25', 2.05, 9, 'Belgique', 'Central', 19, 'Dheer.png'),
    ('Cox', 'Jolan', 'Masculin', '1991-01-12', 1.94, 10, 'Belgique', 'Receveur-Attaquant', 19, NULL),
    ('Van Hoyweghen', 'Seppe', 'Masculin', '2000-03-17', 1.98, 11, 'Belgique', 'Passeur', 19, NULL),
    ('Rotty', 'Seppe', 'Masculin', '2001-09-09', 1.90, 12, 'Belgique', 'Attaquant', 19, NULL),
    ('Thys', 'Elias', 'Masculin', '1998-04-21', 2.01, 13, 'Belgique', 'Central', 19, NULL),
    ('Côtes', 'Jelle', 'Masculin', '1992-12-03', 1.85, 14, 'Belgique', 'Libero', 19, 'Côtes.png'),
    ('Deroey', 'Dennis', 'Masculin', '1987-10-29', 1.91, 15, 'Belgique', 'Libero', 19, NULL),

    -- Espagne
    ('Ruiz', 'Borja', 'Masculin', '1992-02-12', 2.03, 1, 'Espagne', 'Central', 20, 'Ruiz.png'),
    ('Lorente', 'Ruben', 'Masculin', '1998-01-05', 1.88, 2, 'Espagne', 'Passeur', 20, 'Lorente.png'),
    ('Villena', 'Andres', 'Masculin', '1993-01-27', 2.01, 3, 'Espagne', 'Attaquant', 20, 'Villena.png'),
    ('Iribarne', 'Francisco', 'Masculin', '1998-03-19', 1.95, 4, 'Espagne', 'Receveur-Attaquant', 20, 'Iribarne.png'),
    ('Osorio', 'Gerard', 'Masculin', '1993-03-29', 1.98, 5, 'Espagne', 'Attaquant', 20, NULL),
    ('Vigil', 'Alejandro', 'Masculin', '1993-02-11', 2.04, 6, 'Espagne', 'Central', 20, NULL),
    ('De Amo', 'Miguel Angel', 'Masculin', '1985-04-20', 1.92, 7, 'Espagne', 'passeur', 20, NULL),
    ('Larrañaga', 'Unai', 'Masculin', '2000-06-14', 1.80, 8, 'Espagne', 'Libero', 20, 'Larrañaga.png'),
    ('Noda', 'Sergio', 'Masculin', '1987-03-23', 1.94, 9, 'Espagne', 'Receveur-Attaquant', 20, 'Noda.png'),
    ('Ruiz', 'Francisco', 'Masculin', '1991-06-07', 1.95, 10, 'Espagne', 'Receveur-Attaquant', 20, NULL),
    ('Forner', 'Miguel Angel', 'Masculin', '1993-09-18', 2.02, 11, 'Espagne', 'Central', 20, NULL),
    ('Ramon', 'Jordi', 'Masculin', '1999-07-02', 1.96, 12, 'Espagne', 'Receveur-Attaquant', 20, NULL),
    ('Gimeno', 'Alvaro', 'Masculin', '1999-11-21', 2.00, 13, 'Espagne', 'Libero', 20, NULL),
    ('Colito', 'Augusto', 'Masculin', '1997-01-23', 2.02, 14, 'Espagne', 'Attaquant', 20, NULL),


    -- Angleterre
    ('Bakare', 'Peter', 'Masculin', '1989-07-02', 1.95, 1, 'Angleterre', 'Attaquant', 21, 'Bakare.png'),
    ('Pipes', 'Ben', 'Masculin', '1986-10-21', 2.05, 2, 'Angleterre', 'Central', 21, 'Pipes.png'),
    ('Bakare', 'Dami', 'Masculin', '1988-09-22', 1.95, 3, 'Angleterre', 'Central', 21, NULL),
    ('Hunter', 'Daniel', 'Masculin', '1990-01-23', 1.80, 4, 'Angleterre', 'Libero', 21, 'Hunter.png'),
    ('Plotyczer', 'Mark', 'Masculin', '1987-02-19', 1.95, 5, 'Angleterre', 'Attaquant', 21, NULL),
    ('McGivern', 'Mark', 'Masculin', '1983-02-24', 1.95, 6, 'Angleterre', 'Central', 21, NULL),
    ('Haldane', 'Jason', 'Masculin', '1971-07-23', 2.03, 7, 'Angleterre', 'Central', 21, NULL),
    ('Pink', 'Andrew', 'Masculin', '1988-01-25', 1.92, 8, 'Angleterre', 'Receveur-Attaquant', 21, 'Pink.png'),
    ('French', 'Nathan', 'Masculin', '1990-01-20', 1.93, 9, 'Angleterre', 'Passeur', 21, 'French.png'),
    ('Miller', 'Joel', 'Masculin', '1988-12-15', 1.92, 10, 'Angleterre', 'Receveur-Attaquant', 21, 'Miller.png'),
    ('Lamont', 'Christopher', 'Masculin', '1982-12-07', 2.01, 11, 'Angleterre', 'Passeur', 21, NULL),
    ('OMalley', 'Kieran', 'Masculin', '1988-05-12', 1.88, 12, 'Angleterre', 'Receveur-Attaquant', 21, NULL),



    -- Thaïlande
    ('Vaenpradab', 'Montri', 'Masculin', '1987-08-18', 1.95, 1, 'Thaïlande', 'Central', 22, 'Vaenpradab.png'),
    ('Tabwises', 'Wanchai', 'Masculin', '1986-02-11', 1.86, 2, 'Thaïlande', 'Receveur-Attaquant', 22, 'Tabwises.png'),
    ('Kesapan', 'Nattapong', 'Masculin', '1989-07-25', 1.83, 3, 'Thaïlande', 'Passeur', 22, 'Kesapan.png'),
    ('Tivsuwan', 'Shotivat', 'Masculin', '1986-07-20', 1.90, 4, 'Thaïlande', 'Central', 22, NULL),
    ('Boudang', 'Uranan', 'Masculin', '1987-12-20', 1.85, 5, 'Thaïlande', 'Receveur-Attaquant', 22, NULL),
    ('Sriutthawong', 'Kittikun', 'Masculin', '1986-01-10', 1.92, 6, 'Thaïlande', 'Attaquant', 22, 'Sriutthawong.png'),
    ('Toontupthai', 'Piyarat', 'Masculin', '1987-12-10', 1.71, 7, 'Thaïlande', 'Libero', 22, 'Toontupthai.png'),
    ('Harnkhomtun', 'Pissanu', 'Masculin', '1986-05-01', 1.91, 8, 'Thaïlande', 'Central', 22, NULL),
    ('Wannaprapa', 'Somporn', 'Masculin', '1988-05-07', 1.90, 9, 'Thaïlande', 'Receveur-Attaquant', 22, 'Wannaprapa.png'),
    ('Somkane', 'Kritsada', 'Masculin', '1990-09-28', 1.90, 10, 'Thaïlande', 'Central', 22, NULL),
    ('Charoensuk', 'Saranchit', 'Masculin', '1987-07-20', 1.81, 11, 'Thaïlande', 'Passeur', 22, NULL),
    ('Sripon', 'Theerayut', 'Masculin', '1987-04-25', 1.74, 12, 'Thaïlande', 'Central', 22, NULL),
      

    -- Kazakhstan
    ('Boken', 'Yerikzhan', 'Masculin', '1996-07-31', 1.85, 1, 'Kazakhstan', 'Receveur-Attaquant', 23, 'Boken.png'),
    ('Kuznetsov', 'Sergey', 'Masculin', '1993-10-26', 1.97, 2, 'Kazakhstan', 'Attaquant', 23, 'Kuznetsov.png'),
    ('Stolnikov', 'Alexandr', 'Masculin', '1988-07-17', 1.97, 3, 'Kazakhstan', 'Attaquant', 23, NULL),
    ('Pogrebnyak', 'Eduard', 'Masculin', '1996-09-23', 2.02, 4, 'Kazakhstan', 'Attaquant', 23, NULL),
    ('Michshenko', 'Maxim', 'Masculin', '1990-09-10', 1.97, 5, 'Kazakhstan', 'Central', 23, 'Michshenko.png'),
    ('Akimov', 'Damir', 'Masculin', '1991-09-22', 2.02, 6, 'Kazakhstan', 'Passeur', 23, 'Akimov.png'),
    ('Kadirkhanov', 'Nodirkhan', 'Masculin', '1991-09-06', 2.03, 7, 'Kazakhstan', 'Central', 23, NULL),
    ('Netalin', 'Aibat', 'Masculin', '1992-03-30', 1.95, 8, 'Kazakhstan', 'Attaquant', 23, NULL),
    ('Ustinov', 'Mikhail', 'Masculin', '1989-12-22', 1.89, 9, 'Kazakhstan', 'Receveur-Attaquant', 23, 'Ustinov.png'),
    ('Erdshtein', 'Vitaliy', 'Masculin', '1992-05-05', 2.05, 10, 'Kazakhstan', 'Attaquant', 23, NULL),
    ('Vorivodin', 'Vitaliy', 'Masculin', '1990-07-31', 1.94, 11, 'Kazakhstan', 'Libero', 23, NULL),
    ('Prokofyev', 'Vladimir', 'Masculin', '1993-02-09', 2.03, 12, 'Kazakhstan', 'Libero', 23, 'Prokofyev.png'),


    -- Corée du Sud
    ('Shin', 'Young-Soo', 'Masculin', '1982-07-01', 1.97, 1, 'Corée du Sud', 'Receveur-Attaquant', 24, 'Shin.png'),
    ('Han', 'Sun-Soo', 'Masculin', '1985-12-16', 1.89, 2, 'Corée du Sud', 'Passeur', 24, 'Han.png'),
    ('Kwon', 'Young-Min', 'Masculin', '1980-07-05', 1.90, 3, 'Corée du Sud', 'Passeur', 24, NULL),
    ('Moon', 'Sung-Min', 'Masculin', '1986-09-14', 1.98, 4, 'Corée du Sud', 'Receveur-Attaquant', 24, 'Moon.png'),
    ('Yeo', 'Oh-Hyun', 'Masculin', '1978-09-02', 1.76, 5, 'Corée du Sud', 'Libero', 24, 'Yeo.png'),
    ('Choi', 'Tae-Woong', 'Masculin', '1976-04-09', 1.85, 6, 'Corée du Sud', 'Passeur', 24, NULL),
    ('Lee', 'Sun-Kyu', 'Masculin', '1981-03-14', 2.00, 7, 'Corée du Sud', 'Central', 24, 'Lee.png'),
    ('Kim', 'Hak-Min', 'Masculin', '1983-09-04', 1.92, 8, 'Corée du Sud', 'Receveur-Attaquant', 24, NULL),
    ('Kang', 'Dong-Jin', 'Masculin', '1983-08-31', 1.93, 9, 'Corée du Sud', 'Receveur-Attaquant', 24, NULL),
    ('Ko', 'Hee-Jin', 'Masculin', '1980-07-13', 1.98, 10, 'Corée du Sud', 'Central', 24, NULL),
    ('Lee', 'Kyung-Soo', 'Masculin', '1979-04-27', 1.97, 11, 'Corée du Sud', 'Receveur-Attaquant', 24, NULL),
    ('Kim', 'Hyun-Soo', 'Masculin', '1986-06-06', 1.96, 12, 'Corée du Sud', 'Passeur', 24, NULL),
    ('Park', 'Chul-Woo', 'Masculin', '1985-07-25', 1.98, 13, 'Corée du Sud', 'Attaquant', 24, 'Park.png'),
    ('Kim', 'Yo-Han', 'Masculin', '1985-08-16', 1.98, 14, 'Corée du Sud', 'Receveur-Attaquant', 24, NULL),

    -- Croatie
    ('Zhukouski', 'Tsimafei', 'Masculin', '1989-12-18', 1.96, 1, 'Croatie', 'Passeur', 25, NULL),
    ('Bakonji', 'Bernard', 'Masculin', '1994-03-22', 1.92, 2, 'Croatie', 'Passeur', 25, 'Bakonji.png'),
    ('Brčić', 'Dominik', 'Masculin', '1996-09-14', 2.02, 3, 'Croatie', 'Central', 25, NULL),
    ('Hanžić', 'Tino', 'Masculin', '2000-01-01', 1.98, 4, 'Croatie', 'Attaquant', 25, NULL),
    ('Mitrašinović', 'Tomislav', 'Masculin', '1993-06-11', 2.04, 5, 'Croatie', 'Central', 25, 'Mitrasinovic.png'),
    ('Raič', 'Ivan', 'Masculin', '1992-02-08', 2.01, 6, 'Croatie', 'Opposé', 25, NULL),
    ('Sedlaček', 'Marko', 'Masculin', '1996-07-29', 2.02, 7, 'Croatie', 'Libero', 25, 'Sedlacek.png'),
    ('Sarčević', 'Sven', 'Masculin', '1990-01-01', 1.80, 8, 'Croatie', 'Receveur-Attaquant', 25, 'Sarcevic.png'),
    ('Dukić', 'Sandro', 'Masculin', '1997-11-05', 1.97, 9, 'Croatie', 'Attaquant', 25, 'Dukic.png'),
    ('Šestan', 'Filip', 'Masculin', '1995-04-19', 1.99, 10, 'Croatie', 'Receveur-Attaquant', 25, NULL),
    ('Pervan', 'Hrvoje', 'Masculin', '1991-08-27', 1.83, 13, 'Croatie', 'Libero', 25, NULL),
    ('Andrić', 'Leo', 'Masculin', '1996-12-03', 2.02, 16, 'Croatie', 'Receveur-Attaquant', 25, 'Andric.png'),
    ('Zeljković', 'Ivan', 'Masculin', '1994-05-16', 1.98, 19, 'Croatie', 'Receveur-Attaquant', 25, NULL),
    ('Nikačević', 'Kruno', 'Masculin', '1992-10-09', 2.05, 20, 'Croatie', 'Central', 25, NULL),

    -- Russie
    ('Podlesnykh', 'Yaroslav', 'Masculin', '1994-01-01', 1.98, 1, 'Russie', 'Outside spiker', 26, 'Podlesnykh.png'),
    ('Vlasov', 'Ilia', 'Masculin', '1995-08-03', 2.12, 2, 'Russie', 'Middle blocker', 26, 'Vlasov.png'),
    ('Kovalev', 'Dmitry', 'Masculin', '1991-01-01', 1.98, 3, 'Russie', 'Passeur', 26, NULL),
    ('Volvich', 'Artem', 'Masculin', '1990-01-01', 2.11, 4, 'Russie', 'Middle blocker', 26, NULL),
    ('Semyshev', 'Anton', 'Masculin', '1997-01-01', 2.04, 5, 'Russie', 'Outside spiker', 26, 'Semyshev.png'),
    ('Baranov', 'Evgeny', 'Masculin', '1995-01-01', 1.83, 6, 'Russie', 'Libero', 26, NULL),
    ('Volkov', 'Dmitrii', 'Masculin', '1995-01-01', 2.01, 7, 'Russie', 'Outside spiker', 26, NULL),
    ('Tetyukhin', 'Pavel', 'Masculin', '2000-01-01', 1.96, 8, 'Russie', 'Outside spiker', 26, NULL),
    ('Iakovlev', 'Ivan', 'Masculin', '1995-04-17', 2.07, 9, 'Russie', 'Middle blocker', 26, NULL),
    ('Bogdan', 'Denis', 'Masculin', '1996-01-01', 2.00, 10, 'Russie', 'Outside spiker', 26, 'Bogdan.png'),
    ('Pankov', 'Pavel', 'Masculin', '1995-01-01', 1.97, 11, 'Russie', 'Passeur', 26, 'Pankov.png'),
    ('Butko', 'Alexander', 'Masculin', '1986-01-01', 1.98, 12, 'Russie', 'Passeur', 26, NULL),
    ('Muserskiy', 'Dmitriy', 'Masculin', '1988-01-01', 2.18, 13, 'Russie', 'Opposé', 26, NULL),
    ('Likhosherstov', 'Vadym', 'Masculin', '1989-01-01', 2.18, 14, 'Russie', 'Middle blocker', 26, 'Likhosherstov.png'),

    --Égypte
    ('Hamada', 'Mohamed', 'Masculin', '1998-06-14', 2.06, 1, 'Égypte', 'Central', 27, 'Hamada.png'),
    ('Seoudy', 'Mohamed', 'Masculin', '1997-11-22', 2.08, 5, 'Égypte', 'Libero', 27, 'Seoudy.png'),
    ('Reda', 'Mohamed', 'Masculin', '1996-05-28', 1.88, 6, 'Égypte', 'Libero', 27, NULL),
    ('Ramadan', 'Mohamed', 'Masculin', '1995-03-15', 1.86, 7, 'Égypte', 'Libero', 27, NULL),
    ('Elhossiny', 'Abd El-Aziz', 'Masculin', '1999-07-18', 2.00, 8, 'Égypte', 'Receveur-Attaquant', 27, NULL),
    ('Asran', 'Mohamed', 'Masculin', '1993-08-14', 2.01, 9, 'Égypte', 'Receveur-Attaquant', 27, 'Asran.png'),
    ('Yasso', 'Youssef', 'Masculin', '1998-01-10', 1.91, 11, 'Égypte', 'Passeur', 27, NULL),
    ('Seif Abed', 'Mohamed', 'Masculin', '1997-04-12', 2.06, 14, 'Égypte', 'Attaquant', 27, 'SeifAbed.png'),
    ('Said', 'Ahmed', 'Masculin', '1990-09-25', 2.02, 18, 'Égypte', 'Receveur-Attaquant', 27, NULL),
    ('Deyo', 'Omar', 'Masculin', '1996-02-18', 2.03, 19, 'Égypte', 'Receveur-Attaquant', 27, 'Deyo.png'),
    ('Azab', 'Ahmed', 'Masculin', '1997-03-17', 2.04, 22, 'Égypte', '¨Passeur', 27, 'Azab.png'),
    ('Ellakany', 'Ahmed', 'Masculin', '1989-12-20', 1.92, 23, 'Égypte', 'Passeur', 27, NULL),
    ('Elshahat', 'Ahmed', 'Masculin', '1999-08-11', 2.07, 24, 'Égypte', 'Central', 27, NULL),
    ('Osama', 'Zeyad', 'Masculin', '2000-05-28', 2.05, 4, 'Égypte', 'Attaquant', 27, NULL),

  -- République Tchèque 
  ('Galabov', 'Donco', 'Masculin', '1997-03-08', 1.96, 3, 'République Tchèque', 'Attaquant', 28, 'Galabov.png'),
  ('Drahonovsky', 'Jan', 'Masculin', '1999-10-08', 1.97, 4, 'République Tchèque', 'Receveur-Attaquant', 28, 'Drahonovsky.png'),
  ('Zajicek', 'Adam', 'Masculin', '1995-01-20', 2.05, 5, 'République Tchèque', 'Central', 28, 'Zajicek.png'),
  ('Monik', 'Jan', 'Masculin', '1998-02-14', 1.87, 6, 'République Tchèque', 'Libero', 28, 'Monik.png'),
  ('Bartunek', 'Lubos', 'Masculin', '1991-05-18', 1.95, 9, 'République Tchèque', 'Passeur', 28, 'Bartunek.png'),
  ('Vasina', 'Lukas', 'Masculin', '1996-08-14', 1.98, 11, 'République Tchèque', 'Receveur-Attaquant', 28, 'Vasina.png'),
  ('Licek', 'Martin', 'Masculin', '1993-07-12', 1.99, 12, 'République Tchèque', 'Receveur-Attaquant', 28, NULL),
  ('Srb', 'Filip', 'Masculin', '1999-06-18', 1.93, 16, 'République Tchèque', 'Passeur', 28, NULL),
  ('Sotola', 'Martin', 'Masculin', '1996-04-30', 2.06, 17, 'République Tchèque', 'Attaquant', 28, NULL),
  ('Kovarik', 'Adam', 'Masculin', '2001-08-25', 1.85, 19, 'République Tchèque', 'Libero', 28, NULL),
  ('Indra', 'Patrik', 'Masculin', '1993-09-22', 2.03, 23, 'République Tchèque', 'Attaquant', 28, NULL),
  ('Polak', 'Lukas', 'Masculin', '1995-11-25', 2.08, 25, 'République Tchèque', 'Central', 28, NULL),
  ('Klimes', 'Antonin', 'Masculin', '2005-03-12', 2.07, 39, 'République Tchèque', 'Central', 28, NULL),
  ('Benda', 'Vilem', 'Masculin', '2001-06-22', 2.00, 95, 'République Tchèque', 'Receveur-Attaquant', 28, NULL),

  -- Estonie 
  ('Treial', 'Henri', 'Masculin', '1992-03-15', 2.02, 1, 'Estonie', 'Central', 29, 'Treial.png'),
  ('Vanker', 'Renet', 'Masculin', '1998-05-22', 1.93, 2, 'Estonie', 'Passeur', 29, NULL),
  ('Allik', 'Karli', 'Masculin', '1996-08-12', 1.92, 3, 'Estonie', 'Receveur-Attaquant', 29, 'Allik.png'),
  ('Juhkami', 'Martti', 'Masculin', '1988-04-18', 1.95, 6, 'Estonie', 'Receveur-Attaquant', 29, 'Juhkami.png'),
  ('Teppan', 'Renee', 'Masculin', '1993-07-25', 1.98, 7, 'Estonie', 'Attaquant', 29, NULL),
  ('Tammearu', 'Märt', 'Masculin', '2001-02-14', 1.98, 8, 'Estonie', 'Passeur', 29, 'Tammearu.png'),
  ('Täht', 'Robert', 'Masculin', '1993-11-08', 1.92, 9, 'Estonie', 'Libero', 29, 'Taht.png'),
  ('Maar', 'Silver', 'Masculin', '1999-06-20', 1.84, 10, 'Estonie', 'Attaquant', 29, 'Maar.png'),
  ('Venno', 'Oliver', 'Masculin', '1990-09-12', 2.10, 11, 'Estonie', 'Attaquant', 29, NULL),
  ('Saar', 'Alari', 'Masculin', '1996-01-28', 1.77, 12, 'Estonie', 'Libero', 29, NULL),
  ('Viiber', 'Robert', 'Masculin', '1997-05-16', 2.05, 16, 'Estonie', 'Passeur', 29, NULL),
  ('Tammemaa', 'Timo', 'Masculin', '1991-08-30', 2.04, 17, 'Estonie', 'Central', 29, NULL),
  ('Saaremaa', 'Alex', 'Masculin', '2000-03-22', 2.08, 18, 'Estonie', 'Central', 29, NULL),
  ('Aganits', 'Andri', 'Masculin', '1993-12-15', 2.07, 19, 'Estonie', 'Central', 29, NULL),

-- Grèce 
('Kasampalis', 'Stavros', 'Masculin', '1995-04-15', 1.88, 1, 'Grèce', 'Passeur', 30, 'Kasampalis.png'),
('Pitakoudis', 'Lampros', 'Masculin', '2002-08-22', 2.02, 2, 'Grèce', 'Central', 30, 'Pitakoudis.png'),
('Chakas', 'Spyridon', 'Masculin', '2002-05-14', 1.87, 3, 'Grèce', 'Receveur-Attaquant', 30, 'Chakas.png'),
('Dalakouras', 'Anestis', 'Masculin', '1993-08-12', 1.96, 6, 'Grèce', 'Receveur-Attaquant', 30, 'Dalakouras.png'),
('Protopsaltis', 'Athanasios', 'Masculin', '1993-03-20', 1.85, 7, 'Grèce', 'Receveur-Attaquant', 30, 'Protopsaltis.png'),
('Kotsakis', 'Froixos', 'Masculin', '1999-06-18', 1.95, 8, 'Grèce', 'Receveur-Attaquant', 30, NULL),
('Petsias', 'Apostolos', 'Masculin', '2003-09-25', 1.93, 9, 'Grèce', 'Passeur', 30, NULL),
('Mouchlias', 'Dimitrios', 'Masculin', '2001-01-12', 2.00, 11, 'Grèce', 'Attaquant', 30, NULL),
('Voulkidis', 'Theodoros', 'Masculin', '1996-07-20', 2.01, 12, 'Grèce', 'Central', 30, 'Voulkidis.png'),
('Galiotos', 'Markos', 'Masculin', '1996-12-04', 1.94, 14, 'Grèce', 'Passeur', 30, NULL),
('Folias', 'Eleftherios', 'Masculin', '2003-03-25', 1.86, 16, 'Grèce', 'Libero', 30, NULL),
('Vaiopoulos', 'Evangelos', 'Masculin', '1997-08-14', 2.03, 17, 'Grèce', 'Central', 30, NULL),
('Aspiotis', 'Anastasios-Stamatios', 'Masculin', '1991-11-22', 2.00, 18, 'Grèce', 'Attaquant', 30, NULL),
('Tziavras', 'Dimitrios', 'Masculin', '1999-05-08', 1.76, 33, 'Grèce', 'Libero', 30, NULL),

-- Porto Rico (ID équipe: 31)
('Rivera', 'Maurice', 'Masculin', '1990-05-12', 1.93, 1, 'Porto Rico', 'Passeur', 31, NULL),
('Morales', 'Gabriel', 'Masculin', '1993-08-20', 2.01, 10, 'Porto Rico', 'Attaquant', 31, NULL),
('Torres', 'Victor', 'Masculin', '1995-11-15', 2.05, 11, 'Porto Rico', 'Central', 31, NULL),
('Rodriguez', 'Eddie', 'Masculin', '1992-02-28', 1.98, 7, 'Porto Rico', 'Receveur-Attaquant', 31, NULL),
('Gonzalez', 'Hector', 'Masculin', '1994-06-18', 1.82, 5, 'Porto Rico', 'Libero', 31, NULL),
('Cruz', 'Pablo', 'Masculin', '1996-09-25', 1.99, 8, 'Porto Rico', 'Attaquant', 31, NULL),
('Santiago', 'Luis', 'Masculin', '1991-12-04', 2.03, 12, 'Porto Rico', 'Central', 31, NULL),
('Diaz', 'Jose', 'Masculin', '1997-03-14', 1.90, 3, 'Porto Rico', 'Passeur', 31, NULL),
('Figueroa', 'Ramon', 'Masculin', '1993-07-22', 2.00, 9, 'Porto Rico', 'Receveur-Attaquant', 31, NULL),
('Delgado', 'Carlos', 'Masculin', '1995-10-08', 2.04, 13, 'Porto Rico', 'Central', 31, NULL),
('Colon', 'Angel', 'Masculin', '1994-01-30', 1.96, 4, 'Porto Rico', 'Attaquant', 31, NULL),
('Ramos', 'Miguel', 'Masculin', '1992-04-16', 1.85, 6, 'Porto Rico', 'Libero', 31, NULL),
('Vazquez', 'Christian', 'Masculin', '1998-08-11', 1.97, 2, 'Porto Rico', 'Receveur-Attaquant', 31, NULL),
('Pagan', 'Jorge', 'Masculin', '1996-11-28', 2.02, 14, 'Porto Rico', 'Central', 31, NULL),

-- Grèce (ID équipe: 32)
('Christoforidis', 'Nikos', 'Masculin', '1992-03-18', 1.94, 1, 'Grèce', 'Passeur', 32, NULL),
('Papadopoulos', 'Dimitris', 'Masculin', '1993-06-25', 2.03, 10, 'Grèce', 'Attaquant', 32, NULL),
('Kazazis', 'Georgios', 'Masculin', '1994-09-14', 2.06, 11, 'Grèce', 'Central', 32, NULL),
('Fragkos', 'Angelos', 'Masculin', '1991-11-22', 1.98, 7, 'Grèce', 'Receveur-Attaquant', 32, NULL),
('Zisimos', 'Michalis', 'Masculin', '1995-02-08', 1.84, 5, 'Grèce', 'Libero', 32, NULL),
('Tzioumakas', 'Kostas', 'Masculin', '1996-05-16', 2.00, 8, 'Grèce', 'Attaquant', 32, NULL),
('Athanasiadis', 'Mitar', 'Masculin', '1992-08-30', 2.05, 12, 'Grèce', 'Central', 32, NULL),
('Raptis', 'Theodoros', 'Masculin', '1997-12-04', 1.91, 3, 'Grèce', 'Passeur', 32, NULL),
('Manoloudis', 'Alexandros', 'Masculin', '1994-03-20', 2.01, 9, 'Grèce', 'Receveur-Attaquant', 32, NULL),
('Kagialis', 'Dimitrios', 'Masculin', '1993-07-12', 2.04, 13, 'Grèce', 'Central', 32, NULL),
('Spanos', 'Ioannis', 'Masculin', '1995-10-25', 1.97, 4, 'Grèce', 'Attaquant', 32, NULL),
('Masoutis', 'Thodoris', 'Masculin', '1996-01-18', 1.86, 6, 'Grèce', 'Libero', 32, NULL),
('Petreas', 'Andreas', 'Masculin', '1998-04-09', 1.99, 2, 'Grèce', 'Receveur-Attaquant', 32, NULL),
('Mouchlias', 'Stefanos', 'Masculin', '1994-06-28', 2.02, 14, 'Grèce', 'Central', 32, NULL);
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
    INSERT INTO Siege (numero_colonne, numero_ligne, est_reserve, id_utilisateur, zone, match_id) VALUES
    ('A', 1,  FALSE, NULL, 'NORD', 1), ('A', 2, FALSE,  NULL, 'NORD', 1), ('A', 3, FALSE,  NULL, 'NORD', 1), ('A', 4,  FALSE, NULL, 'NORD', 1),
    ('A', 5,  FALSE, NULL, 'NORD', 1), ('A', 6,  FALSE, NULL, 'NORD', 1), ('A', 7,  FALSE, NULL, 'NORD', 1), ('A', 8,  FALSE, NULL, 'NORD', 1),
    ('A', 9,  FALSE, NULL, 'NORD', 1), ('A', 10,  FALSE, NULL, 'NORD', 1), ('A', 11,  FALSE, NULL, 'NORD', 1), ('A', 12, FALSE, NULL, 'NORD', 1),

    ('B', 1,  FALSE, NULL, 'NORD', 1), ('B', 2,  FALSE, NULL, 'NORD', 1), ('B', 3,  FALSE, NULL, 'NORD', 1), ('B', 4,  FALSE, NULL, 'NORD', 1),
    ('B', 5,  FALSE, NULL, 'NORD', 1), ('B', 6,  FALSE, NULL, 'NORD', 1), ('B', 7,  FALSE, NULL, 'NORD', 1), ('B', 8,  FALSE, NULL, 'NORD', 1),
    ('B', 9, FALSE, NULL, 'NORD', 1), ('B', 10,  FALSE, NULL, 'NORD', 1), ('B', 11,  FALSE, NULL, 'NORD', 1), ('B', 12,  FALSE, NULL, 'NORD', 1),

    ('C', 1,  FALSE, NULL, 'NORD', 1), ('C', 2,  FALSE, NULL, 'NORD', 1), ('C', 3,  FALSE, NULL, 'NORD', 1), ('C', 4,  FALSE, NULL, 'NORD', 1),
    ('C', 5,  FALSE, NULL, 'NORD', 1), ('C', 6,  FALSE, NULL, 'NORD', 1), ('C', 7,  FALSE, NULL, 'NORD', 1), ('C', 8,  FALSE, NULL, 'NORD', 1),
    ('C', 9,  FALSE, NULL, 'NORD', 1), ('C', 10,  FALSE, NULL, 'NORD', 1), ('C', 11,  FALSE, NULL, 'NORD', 1), ('C', 12,  FALSE, NULL, 'NORD', 1),

    ('D', 1,  FALSE, NULL, 'NORD', 1), ('D', 2,  FALSE, NULL, 'NORD', 1), ('D', 3,  FALSE, NULL, 'NORD', 1), ('D', 4,  FALSE, NULL, 'NORD', 1),
    ('D', 5,  FALSE, NULL, 'NORD', 1), ('D', 6,  FALSE, NULL, 'NORD', 1), ('D', 7,  FALSE, NULL, 'NORD', 1), ('D', 8,  FALSE, NULL, 'NORD', 1),
    ('D', 9,  FALSE, NULL, 'NORD', 1), ('D', 10,  FALSE, NULL, 'NORD', 1), ('D', 11,  FALSE, NULL, 'NORD', 1), ('D', 12,  FALSE, NULL, 'NORD', 1),

    ('E', 1,  FALSE, NULL, 'NORD', 1), ('E', 2,  FALSE, NULL, 'NORD', 1), ('E', 3,  FALSE, NULL, 'NORD', 1), ('E', 4,  FALSE, NULL, 'NORD', 1),
    ('E', 5,  FALSE, NULL, 'NORD', 1), ('E', 6,  FALSE, NULL, 'NORD', 1), ('E', 7,  FALSE, NULL, 'NORD', 1), ('E', 8,  FALSE, NULL, 'NORD', 1),
    ('E', 9,  FALSE, NULL, 'NORD', 1), ('E', 10,  FALSE, NULL, 'NORD', 1), ('E', 11,  FALSE, NULL, 'NORD', 1), ('E', 12,  FALSE, NULL, 'NORD', 1),

    ('F', 1,  FALSE, NULL, 'NORD', 1), ('F', 2,  FALSE, NULL, 'NORD', 1), ('F', 3,  FALSE, NULL, 'NORD', 1), ('F', 4,  FALSE, NULL, 'NORD', 1),
    ('F', 5,  FALSE, NULL, 'NORD', 1), ('F', 6,  FALSE, NULL, 'NORD', 1), ('F', 7,  FALSE, NULL, 'NORD', 1), ('F', 8,  FALSE, NULL, 'NORD', 1),
    ('F', 9,  FALSE, NULL, 'NORD', 1), ('F', 10,  FALSE, NULL, 'NORD', 1), ('F', 11,  FALSE, NULL, 'NORD', 1), ('F', 12,  FALSE, NULL, 'NORD', 1),

    ('G', 1,  FALSE, NULL, 'NORD', 1), ('G', 2,  FALSE, NULL, 'NORD', 1), ('G', 3,  FALSE, NULL, 'NORD', 1), ('G', 4,  FALSE, NULL, 'NORD', 1),
    ('G', 5,  FALSE, NULL, 'NORD', 1), ('G', 6,  FALSE, NULL, 'NORD', 1), ('G', 7,  FALSE, NULL, 'NORD', 1), ('G', 8,  FALSE, NULL, 'NORD', 1),
    ('G', 9,  FALSE, NULL, 'NORD', 1), ('G', 10,  FALSE, NULL, 'NORD', 1), ('G', 11,  FALSE, NULL, 'NORD', 1), ('G', 12,  FALSE, NULL, 'NORD', 1),

    ('H', 1,  FALSE, NULL, 'NORD', 1), ('H', 2,  FALSE, NULL, 'NORD', 1), ('H', 3,  FALSE, NULL, 'NORD', 1), ('H', 4,  FALSE, NULL, 'NORD', 1),
    ('H', 5,  FALSE, NULL, 'NORD', 1), ('H', 6,  FALSE, NULL, 'NORD', 1), ('H', 7,  FALSE, NULL, 'NORD', 1), ('H', 8,  FALSE, NULL, 'NORD', 1),
    ('H', 9,  FALSE, NULL, 'NORD', 1), ('H', 10,  FALSE, NULL, 'NORD', 1), ('H', 11,  FALSE, NULL, 'NORD', 1), ('H', 12,  FALSE, NULL, 'NORD', 1),

    ('I', 1,  FALSE, NULL, 'NORD', 1), ('I', 2,  FALSE, NULL, 'NORD', 1), ('I', 3,  FALSE, NULL, 'NORD', 1), ('I', 4,  FALSE, NULL, 'NORD', 1),

    ('A', 1, FALSE,  NULL, 'NORD', 2), ('A', 2,  FALSE, NULL, 'NORD', 2), ('A', 3,  FALSE, NULL, 'NORD', 2),
    ('A', 4, FALSE,  NULL, 'NORD', 2), ('A', 5,  FALSE, NULL, 'NORD', 2), ('A', 6,  FALSE, NULL, 'NORD', 2),
    ('A', 7, FALSE,  NULL, 'NORD', 2), ('A', 8,  FALSE, NULL, 'NORD', 2), ('A', 9,  FALSE, NULL, 'NORD', 2),
    ('A', 10, FALSE,  NULL, 'NORD', 2), ('A', 11,  FALSE, NULL, 'NORD', 2), ('A', 12,  FALSE, NULL, 'NORD', 2),

    ('B', 1,  FALSE, NULL, 'NORD', 2), ('B', 2,  FALSE, NULL, 'NORD', 2), ('B', 3,  FALSE, NULL, 'NORD', 2),
    ('B', 4,  FALSE, NULL, 'NORD', 2), ('B', 5,  FALSE, NULL, 'NORD', 2), ('B', 6,  FALSE, NULL, 'NORD', 2),
    ('B', 7,  FALSE, NULL, 'NORD', 2), ('B', 8,  FALSE, NULL, 'NORD', 2), ('B', 9,  FALSE, NULL, 'NORD', 2),
    ('B', 10,  FALSE, NULL, 'NORD', 2), ('B', 11,  FALSE, NULL, 'NORD', 2), ('B', 12,  FALSE, NULL, 'NORD', 2),

    ('C', 1, FALSE,  NULL, 'NORD', 2), ('C', 2, FALSE,  NULL, 'NORD', 2), ('C', 3,  FALSE, NULL, 'NORD', 2),
    ('C', 4, FALSE,  NULL, 'NORD', 2), ('C', 5, FALSE,  NULL, 'NORD', 2), ('C', 6,  FALSE, NULL, 'NORD', 2),
    ('C', 7, FALSE,  NULL, 'NORD', 2), ('C', 8, FALSE,  NULL, 'NORD', 2), ('C', 9,  FALSE, NULL, 'NORD', 2),
    ('C', 10, FALSE,  NULL, 'NORD', 2), ('C', 11, FALSE,  NULL, 'NORD', 2), ('C', 12,  FALSE, NULL, 'NORD', 2),

    ('D', 1,  FALSE, NULL, 'NORD', 2), ('D', 2,  FALSE, NULL, 'NORD', 2), ('D', 3,  FALSE, NULL, 'NORD', 2),
    ('D', 4,  FALSE, NULL, 'NORD', 2), ('D', 5,  FALSE, NULL, 'NORD', 2), ('D', 6,  FALSE, NULL, 'NORD', 2),
    ('D', 7, FALSE,  NULL, 'NORD', 2), ('D', 8, FALSE, NULL, 'NORD', 2), ('D', 9, FALSE,  NULL, 'NORD', 2),
    ('D', 10,  FALSE, NULL, 'NORD', 2), ('D', 11,  FALSE, NULL, 'NORD', 2), ('D', 12,  FALSE, NULL, 'NORD', 2),

    ('E', 1,  FALSE, NULL, 'NORD', 2), ('E', 2,  FALSE, NULL, 'NORD', 2), ('E', 3,  FALSE, NULL, 'NORD', 2),
    ('E', 4,  FALSE, NULL, 'NORD', 2), ('E', 5,  FALSE, NULL, 'NORD', 2), ('E', 6,  FALSE, NULL, 'NORD', 2),
    ('E', 7,  FALSE, NULL, 'NORD', 2), ('E', 8,  FALSE, NULL, 'NORD', 2), ('E', 9,  FALSE, NULL, 'NORD', 2),
    ('E', 10,  FALSE, NULL, 'NORD', 2), ('E', 11,  FALSE, NULL, 'NORD', 2), ('E', 12,  FALSE, NULL, 'NORD', 2),

    ('F', 1, FALSE,  NULL, 'NORD', 2), ('F', 2, FALSE,  NULL, 'NORD', 2), ('F', 3,  FALSE, NULL, 'NORD', 2),
    ('F', 4, FALSE,  NULL, 'NORD', 2), ('F', 5, FALSE,  NULL, 'NORD', 2), ('F', 6,  FALSE, NULL, 'NORD', 2),
    ('F', 7, FALSE, NULL, 'NORD', 2), ('F', 8, FALSE,  NULL, 'NORD', 2), ('F', 9,  FALSE, NULL, 'NORD', 2),
    ('F', 10, FALSE,  NULL, 'NORD', 2), ('F', 11, FALSE,  NULL, 'NORD', 2), ('F', 12,  FALSE, NULL, 'NORD', 2),
    
    ('G', 1,  FALSE, NULL, 'NORD', 2), ('G', 2, FALSE, NULL, 'NORD', 2), ('G', 3,  FALSE, NULL, 'NORD', 2),
    ('G', 4,  FALSE, NULL, 'NORD', 2), ('G', 5, FALSE, NULL, 'NORD', 2), ('G', 6,  FALSE, NULL, 'NORD', 2),
    ('G', 7,  FALSE, NULL, 'NORD', 2), ('G', 8, FALSE, NULL, 'NORD', 2), ('G', 9, FALSE, NULL, 'NORD', 2),
    ('G', 10,  FALSE, NULL, 'NORD', 2), ('G', 11, FALSE, NULL, 'NORD', 2), ('G', 12,  FALSE, NULL, 'NORD', 2),

    ('H', 1,  FALSE, NULL, 'NORD', 2), ('H', 2,  FALSE, NULL, 'NORD', 2), ('H', 3,  FALSE, NULL, 'NORD', 2),
    ('H', 4,  FALSE, NULL, 'NORD', 2), ('H', 5,  FALSE, NULL, 'NORD', 2), ('H', 6,  FALSE, NULL, 'NORD', 2),
    ('H', 7,  FALSE, NULL, 'NORD', 2), ('H', 8,  FALSE, NULL, 'NORD', 2), ('H', 9,  FALSE, NULL, 'NORD', 2),
    ('H', 10,  FALSE, NULL, 'NORD', 2), ('H', 11,  FALSE, NULL, 'NORD', 2), ('H', 12,  FALSE, NULL, 'NORD', 2),

    ('I', 1,  FALSE, NULL, 'NORD', 2), ('I', 2, FALSE,  NULL, 'NORD', 2), ('I', 3, FALSE,  NULL, 'NORD', 2), ('I', 4, FALSE,  NULL, 'NORD', 2),

    ('A', 1, FALSE,  NULL, 'NORD', 3), ('A', 2, FALSE,  NULL, 'NORD', 3), ('A', 3, FALSE,  NULL, 'NORD', 3), ('A', 4,  FALSE, NULL, 'NORD', 3),
    ('A', 5, FALSE,  NULL, 'NORD', 3), ('A', 6, FALSE,  NULL, 'NORD', 3), ('A', 7, FALSE, NULL, 'NORD', 3), ('A', 8,  FALSE, NULL, 'NORD', 3),
    ('A', 9, FALSE,  NULL, 'NORD', 3), ('A', 10, FALSE,  NULL, 'NORD', 3), ('A', 11, FALSE,  NULL, 'NORD', 3), ('A', 12,  FALSE, NULL, 'NORD', 3),

    ('B', 1,  FALSE, NULL, 'NORD', 3), ('B', 2,  FALSE, NULL, 'NORD', 3), ('B', 3,  FALSE, NULL, 'NORD', 3), ('B', 4,  FALSE, NULL, 'NORD', 3),
    ('B', 5,  FALSE, NULL, 'NORD', 3), ('B', 6,  FALSE, NULL, 'NORD', 3), ('B', 7,  FALSE, NULL, 'NORD', 3), ('B', 8,  FALSE, NULL, 'NORD', 3),
    ('B', 9,  FALSE, NULL, 'NORD', 3), ('B', 10,  FALSE, NULL, 'NORD', 3), ('B', 11, FALSE, NULL, 'NORD', 3), ('B', 12,  FALSE, NULL, 'NORD', 3),

    ('C', 1, FALSE,  NULL, 'NORD', 3), ('C', 2, FALSE,  NULL, 'NORD', 3), ('C', 3, FALSE, NULL, 'NORD', 3), ('C', 4, FALSE, NULL, 'NORD', 3),
    ('C', 5, FALSE,  NULL, 'NORD', 3), ('C', 6, FALSE,  NULL, 'NORD', 3), ('C', 7,  FALSE, NULL, 'NORD', 3), ('C', 8,  FALSE, NULL, 'NORD', 3),
    ('C', 9, FALSE,  NULL, 'NORD', 3), ('C', 10, FALSE,  NULL, 'NORD', 3), ('C', 11,  FALSE, NULL, 'NORD', 3), ('C', 12,  FALSE, NULL, 'NORD', 3),

    ('D', 1,  FALSE, NULL, 'NORD', 3), ('D', 2,  FALSE, NULL, 'NORD', 3), ('D', 3,  FALSE, NULL, 'NORD', 3), ('D', 4,  FALSE, NULL, 'NORD', 3),
    ('D', 5,  FALSE, NULL, 'NORD', 3), ('D', 6,  FALSE, NULL, 'NORD', 3), ('D', 7,  FALSE, NULL, 'NORD', 3), ('D', 8,  FALSE, NULL, 'NORD', 3),
    ('D', 9,  FALSE, NULL, 'NORD', 3), ('D', 10,  FALSE, NULL, 'NORD', 3), ('D', 11,  FALSE, NULL, 'NORD', 3), ('D', 12,  FALSE, NULL, 'NORD', 3),

    ('E', 1, FALSE,  NULL, 'NORD', 3), ('E', 2, FALSE,  NULL, 'NORD', 3), ('E', 3, FALSE,  NULL, 'NORD', 3), ('E', 4,  FALSE, NULL, 'NORD', 3),
    ('E', 5, FALSE,  NULL, 'NORD', 3), ('E', 6, FALSE,  NULL, 'NORD', 3), ('E', 7, FALSE,  NULL, 'NORD', 3), ('E', 8,  FALSE, NULL, 'NORD', 3),
    ('E', 9, FALSE,  NULL, 'NORD', 3), ('E', 10, FALSE,  NULL, 'NORD', 3), ('E', 11, FALSE,  NULL, 'NORD', 3), ('E', 12,  FALSE, NULL, 'NORD', 3),

    ('F', 1, FALSE,  NULL, 'NORD', 3), ('F', 2, FALSE,  NULL, 'NORD', 3), ('F', 3, FALSE,  NULL, 'NORD', 3), ('F', 4,  FALSE, NULL, 'NORD', 3),
    ('F', 5, FALSE,  NULL, 'NORD', 3), ('F', 6, FALSE,  NULL, 'NORD', 3), ('F', 7, FALSE,  NULL, 'NORD', 3), ('F', 8,  FALSE, NULL, 'NORD', 3),
    ('F', 9, FALSE,  NULL, 'NORD', 3), ('F', 10, FALSE,  NULL, 'NORD', 3), ('F', 11, FALSE,  NULL, 'NORD', 3), ('F', 12,  FALSE, NULL, 'NORD', 3),

    ('G', 1, FALSE,  NULL, 'NORD', 3), ('G', 2, FALSE,  NULL, 'NORD', 3), ('G', 3, FALSE,  NULL, 'NORD', 3), ('G', 4,  FALSE, NULL, 'NORD', 3),
    ('G', 5, FALSE,  NULL, 'NORD', 3), ('G', 6, FALSE,  NULL, 'NORD', 3), ('G', 7, FALSE,  NULL, 'NORD', 3), ('G', 8,  FALSE, NULL, 'NORD', 3),
    ('G', 9, FALSE,  NULL, 'NORD', 3), ('G', 10, FALSE,  NULL, 'NORD', 3), ('G', 11, FALSE,  NULL, 'NORD', 3), ('G', 12,  FALSE, NULL, 'NORD', 3),

    ('H', 1, FALSE,  NULL, 'NORD', 3), ('H', 2,  FALSE, NULL, 'NORD', 3), ('H', 3,  FALSE, NULL, 'NORD', 3), ('H', 4,  FALSE, NULL, 'NORD', 3),
    ('H', 5, FALSE,  NULL, 'NORD', 3), ('H', 6,  FALSE, NULL, 'NORD', 3), ('H', 7,  FALSE, NULL, 'NORD', 3), ('H', 8,  FALSE, NULL, 'NORD', 3),
    ('H', 9, FALSE,  NULL, 'NORD', 3), ('H', 10,  FALSE, NULL, 'NORD', 3), ('H', 11,  FALSE, NULL, 'NORD', 3), ('H', 12,  FALSE, NULL, 'NORD', 3),

    ('I', 1, FALSE,  NULL, 'NORD', 3), ('I', 2, FALSE,  NULL, 'NORD', 3), ('I', 3, FALSE,  NULL, 'NORD', 3), ('I', 4,  FALSE, NULL, 'NORD', 3),

    ('A', 1,  FALSE, NULL, 'NORD', 4), ('A', 2, FALSE, NULL, 'NORD', 4), ('A', 3,  FALSE, NULL, 'NORD', 4), ('A', 4,  FALSE, NULL, 'NORD', 4),
    ('A', 5,  FALSE, NULL, 'NORD', 4), ('A', 6,  FALSE, NULL, 'NORD', 4), ('A', 7,  FALSE, NULL, 'NORD', 4), ('A', 8,  FALSE, NULL, 'NORD', 4),
    ('A', 9,  FALSE, NULL, 'NORD', 4), ('A', 10,  FALSE, NULL, 'NORD', 4), ('A', 11,  FALSE, NULL, 'NORD', 4), ('A', 12,  FALSE, NULL, 'NORD', 4),

    ('B', 1, FALSE,  NULL, 'NORD', 4), ('B', 2, FALSE,  NULL, 'NORD', 4), ('B', 3,  FALSE, NULL, 'NORD', 4), ('B', 4,  FALSE, NULL, 'NORD', 4),
    ('B', 5, FALSE,  NULL, 'NORD', 4), ('B', 6, FALSE,  NULL, 'NORD', 4), ('B', 7,  FALSE, NULL, 'NORD', 4), ('B', 8,  FALSE, NULL, 'NORD', 4),
    ('B', 9, FALSE,  NULL, 'NORD', 4), ('B', 10, FALSE, NULL, 'NORD', 4), ('B', 11,  FALSE, NULL, 'NORD', 4), ('B', 12,  FALSE, NULL, 'NORD', 4),

    ('C', 1, FALSE,  NULL, 'NORD', 4), ('C', 2, FALSE,  NULL, 'NORD', 4), ('C', 3, FALSE,  NULL, 'NORD', 4), ('C', 4, FALSE,  NULL, 'NORD', 4),
    ('C', 5, FALSE,  NULL, 'NORD', 4), ('C', 6, FALSE, NULL, 'NORD', 4), ('C', 7, FALSE,  NULL, 'NORD', 4), ('C', 8, FALSE,  NULL, 'NORD', 4),
    ('C', 9, FALSE,  NULL, 'NORD', 4), ('C', 10, FALSE,  NULL, 'NORD', 4), ('C', 11, FALSE,  NULL, 'NORD', 4), ('C', 12, FALSE,  NULL, 'NORD', 4),

    ('D', 1, FALSE,  NULL, 'NORD', 4), ('D', 2, FALSE,  NULL, 'NORD', 4), ('D', 3, FALSE,  NULL, 'NORD', 4), ('D', 4, FALSE,  NULL, 'NORD', 4),
    ('D', 5, FALSE, NULL, 'NORD', 4), ('D', 6, FALSE, NULL, 'NORD', 4), ('D', 7, FALSE,  NULL, 'NORD', 4), ('D', 8, FALSE,  NULL, 'NORD', 4),
    ('D', 9, FALSE,  NULL, 'NORD', 4), ('D', 10, FALSE, NULL, 'NORD', 4), ('D', 11, FALSE,  NULL, 'NORD', 4), ('D', 12, FALSE,  NULL, 'NORD', 4),

    ('E', 1,  FALSE, NULL, 'NORD', 4), ('E', 2,  FALSE, NULL, 'NORD', 4), ('E', 3,  FALSE, NULL, 'NORD', 4), ('E', 4,  FALSE, NULL, 'NORD', 4),
    ('E', 5,  FALSE, NULL, 'NORD', 4), ('E', 6,  FALSE, NULL, 'NORD', 4), ('E', 7,  FALSE, NULL, 'NORD', 4), ('E', 8,  FALSE, NULL, 'NORD', 4),
    ('E', 9, FALSE, NULL, 'NORD', 4), ('E', 10,  FALSE, NULL, 'NORD', 4), ('E', 11,  FALSE, NULL, 'NORD', 4), ('E', 12,  FALSE, NULL, 'NORD', 4),

    ('F', 1, FALSE,  NULL, 'NORD', 4), ('F', 2, FALSE,  NULL, 'NORD', 4), ('F', 3, FALSE,  NULL, 'NORD', 4), ('F', 4,  FALSE, NULL, 'NORD', 4),
    ('F', 5, FALSE,  NULL, 'NORD', 4), ('F', 6, FALSE,  NULL, 'NORD', 4), ('F', 7, FALSE,  NULL, 'NORD', 4), ('F', 8,  FALSE, NULL, 'NORD', 4),
    ('F', 9, FALSE,  NULL, 'NORD', 4), ('F', 10, FALSE,  NULL, 'NORD', 4), ('F', 11, FALSE,  NULL, 'NORD', 4), ('F', 12,  FALSE, NULL, 'NORD', 4),

    ('G', 1, FALSE,  NULL, 'NORD', 4), ('G', 2, FALSE,  NULL, 'NORD', 4), ('G', 3,  FALSE, NULL, 'NORD', 4), ('G', 4,  FALSE, NULL, 'NORD', 4),
    ('G', 5, FALSE,  NULL, 'NORD', 4), ('G', 6, FALSE,  NULL, 'NORD', 4), ('G', 7,  FALSE, NULL, 'NORD', 4), ('G', 8,  FALSE, NULL, 'NORD', 4),
    ('G', 9, FALSE,  NULL, 'NORD', 4), ('G', 10, FALSE,  NULL, 'NORD', 4), ('G', 11,  FALSE, NULL, 'NORD', 4), ('G', 12,  FALSE, NULL, 'NORD', 4),

    ('H', 1, FALSE,  NULL, 'NORD', 4), ('H', 2, FALSE,  NULL, 'NORD', 4), ('H', 3, FALSE,  NULL, 'NORD', 4), ('H', 4,  FALSE, NULL, 'NORD', 4),
    ('H', 5, FALSE,  NULL, 'NORD', 4), ('H', 6, FALSE,  NULL, 'NORD', 4), ('H', 7, FALSE,  NULL, 'NORD', 4), ('H', 8,  FALSE, NULL, 'NORD', 4),
    ('H', 9, FALSE,  NULL, 'NORD', 4), ('H', 10, FALSE,  NULL, 'NORD', 4), ('H', 11, FALSE,  NULL, 'NORD', 4), ('H', 12,  FALSE, NULL, 'NORD', 4),

    ('I', 1, FALSE,  NULL, 'NORD', 4), ('I', 2, FALSE,  NULL, 'NORD', 4), ('I', 3, FALSE,  NULL, 'NORD', 4), ('I', 4,  FALSE, NULL, 'NORD', 4),

('A', 1,  FALSE, NULL, 'EST', 5), ('A', 2,  FALSE, NULL, 'EST', 5), ('A', 3,  FALSE, NULL, 'EST', 5), ('A', 4,  FALSE, NULL, 'EST', 5),
('A', 5,  FALSE, NULL, 'EST', 5), ('A', 6,  FALSE, NULL, 'EST', 5), ('A', 7,  FALSE, NULL, 'EST', 5), ('A', 8,  FALSE, NULL, 'EST', 5),
('A', 9,  FALSE, NULL, 'EST', 5), ('A', 10, FALSE, NULL, 'EST', 5), ('A', 11, FALSE, NULL, 'EST', 5), ('A', 12, FALSE, NULL, 'EST', 5),

('B', 1, FALSE, NULL, 'EST', 5), ('B', 2, FALSE, NULL, 'EST', 5), ('B', 3, FALSE, NULL, 'EST', 5), ('B', 4, FALSE, NULL, 'EST', 5),
('B', 5, FALSE, NULL, 'EST', 5), ('B', 6, FALSE, NULL, 'EST', 5), ('B', 7, FALSE, NULL, 'EST', 5), ('B', 8, FALSE, NULL, 'EST', 5),
('B', 9, FALSE, NULL, 'EST', 5), ('B', 10, FALSE, NULL, 'EST', 5), ('B', 11, FALSE, NULL, 'EST', 5), ('B', 12, FALSE, NULL, 'EST', 5),

('C', 1, FALSE, NULL, 'EST', 5), ('C', 2, FALSE, NULL, 'EST', 5), ('C', 3, FALSE, NULL, 'EST', 5), ('C', 4, FALSE, NULL, 'EST', 5),
('C', 5, FALSE, NULL, 'EST', 5), ('C', 6, FALSE, NULL, 'EST', 5), ('C', 7, FALSE, NULL, 'EST', 5), ('C', 8, FALSE, NULL, 'EST', 5),
('C', 9, FALSE, NULL, 'EST', 5), ('C', 10, FALSE, NULL, 'EST', 5), ('C', 11, FALSE, NULL, 'EST', 5), ('C', 12, FALSE, NULL, 'EST', 5),

('D', 1, FALSE, NULL, 'EST', 5), ('D', 2, FALSE, NULL, 'EST', 5), ('D', 3, FALSE, NULL, 'EST', 5), ('D', 4, FALSE, NULL, 'EST', 5),
('D', 5, FALSE, NULL, 'EST', 5), ('D', 6, FALSE, NULL, 'EST', 5), ('D', 7, FALSE, NULL, 'EST', 5), ('D', 8, FALSE, NULL, 'EST', 5),
('D', 9, FALSE, NULL, 'EST', 5), ('D', 10, FALSE, NULL, 'EST', 5), ('D', 11, FALSE, NULL, 'EST', 5), ('D', 12, FALSE, NULL, 'EST', 5),

('E', 1, FALSE, NULL, 'EST', 5), ('E', 2, FALSE, NULL, 'EST', 5), ('E', 3, FALSE, NULL, 'EST', 5), ('E', 4, FALSE, NULL, 'EST', 5),
('E', 5, FALSE, NULL, 'EST', 5), ('E', 6, FALSE, NULL, 'EST', 5), ('E', 7, FALSE, NULL, 'EST', 5), ('E', 8, FALSE, NULL, 'EST', 5),
('E', 9, FALSE, NULL, 'EST', 5), ('E', 10, FALSE, NULL, 'EST', 5), ('E', 11, FALSE, NULL, 'EST', 5), ('E', 12, FALSE, NULL, 'EST', 5),

('F', 1, FALSE, NULL, 'EST', 5), ('F', 2, FALSE, NULL, 'EST', 5), ('F', 3, FALSE, NULL, 'EST', 5), ('F', 4, FALSE, NULL, 'EST', 5),
('F', 5, FALSE, NULL, 'EST', 5), ('F', 6, FALSE, NULL, 'EST', 5), ('F', 7, FALSE, NULL, 'EST', 5), ('F', 8, FALSE, NULL, 'EST', 5),
('F', 9, FALSE, NULL, 'EST', 5), ('F', 10, FALSE, NULL, 'EST', 5), ('F', 11, FALSE, NULL, 'EST', 5), ('F', 12, FALSE, NULL, 'EST', 5),

('G', 1, FALSE, NULL, 'EST', 5), ('G', 2, FALSE, NULL, 'EST', 5), ('G', 3, FALSE, NULL, 'EST', 5), ('G', 4, FALSE, NULL, 'EST', 5),
('G', 5, FALSE, NULL, 'EST', 5), ('G', 6, FALSE, NULL, 'EST', 5), ('G', 7, FALSE, NULL, 'EST', 5), ('G', 8, FALSE, NULL, 'EST', 5),
('G', 9, FALSE, NULL, 'EST', 5), ('G', 10, FALSE, NULL, 'EST', 5), ('G', 11, FALSE, NULL, 'EST', 5), ('G', 12, FALSE, NULL, 'EST', 5),

('H', 1, FALSE, NULL, 'EST', 5), ('H', 2, FALSE, NULL, 'EST', 5), ('H', 3, FALSE, NULL, 'EST', 5), ('H', 4, FALSE, NULL, 'EST', 5),
('H', 5, FALSE, NULL, 'EST', 5), ('H', 6, FALSE, NULL, 'EST', 5), ('H', 7, FALSE, NULL, 'EST', 5), ('H', 8, FALSE, NULL, 'EST', 5),
('H', 9, FALSE, NULL, 'EST', 5), ('H', 10, FALSE, NULL, 'EST', 5), ('H', 11, FALSE, NULL, 'EST', 5), ('H', 12, FALSE, NULL, 'EST', 5),

('I', 1, FALSE, NULL, 'EST', 5), ('I', 2, FALSE, NULL, 'EST', 5), ('I', 3, FALSE, NULL, 'EST', 5), ('I', 4, FALSE, NULL, 'EST', 5),


('A', 1, FALSE, NULL, 'EST', 6), ('A', 2, FALSE, NULL, 'EST', 6), ('A', 3, FALSE, NULL, 'EST', 6), ('A', 4, FALSE, NULL, 'EST', 6),
('A', 5, FALSE, NULL, 'EST', 6), ('A', 6, FALSE, NULL, 'EST', 6), ('A', 7, FALSE, NULL, 'EST', 6), ('A', 8, FALSE, NULL, 'EST', 6),
('A', 9, FALSE, NULL, 'EST', 6), ('A', 10, FALSE, NULL, 'EST', 6), ('A', 11, FALSE, NULL, 'EST', 6), ('A', 12, FALSE, NULL, 'EST', 6),

('B', 1, FALSE, NULL, 'EST', 6), ('B', 2, FALSE, NULL, 'EST', 6), ('B', 3, FALSE, NULL, 'EST', 6), ('B', 4, FALSE, NULL, 'EST', 6),
('B', 5, FALSE, NULL, 'EST', 6), ('B', 6, FALSE, NULL, 'EST', 6), ('B', 7, FALSE, NULL, 'EST', 6), ('B', 8, FALSE, NULL, 'EST', 6),
('B', 9, FALSE, NULL, 'EST', 6), ('B', 10, FALSE, NULL, 'EST', 6), ('B', 11, FALSE, NULL, 'EST', 6), ('B', 12, FALSE, NULL, 'EST', 6),

('C', 1, FALSE, NULL, 'EST', 6), ('C', 2, FALSE, NULL, 'EST', 6), ('C', 3, FALSE, NULL, 'EST', 6), ('C', 4, FALSE, NULL, 'EST', 6),
('C', 5, FALSE, NULL, 'EST', 6), ('C', 6, FALSE, NULL, 'EST', 6), ('C', 7, FALSE, NULL, 'EST', 6), ('C', 8, FALSE, NULL, 'EST', 6),
('C', 9, FALSE, NULL, 'EST', 6), ('C', 10, FALSE, NULL, 'EST', 6), ('C', 11, FALSE, NULL, 'EST', 6), ('C', 12, FALSE, NULL, 'EST', 6),

('D', 1, FALSE, NULL, 'EST', 6), ('D', 2, FALSE, NULL, 'EST', 6), ('D', 3, FALSE, NULL, 'EST', 6), ('D', 4, FALSE, NULL, 'EST', 6),
('D', 5, FALSE, NULL, 'EST', 6), ('D', 6, FALSE, NULL, 'EST', 6), ('D', 7, FALSE, NULL, 'EST', 6), ('D', 8, FALSE, NULL, 'EST', 6),
('D', 9, FALSE, NULL, 'EST', 6), ('D', 10, FALSE, NULL, 'EST', 6), ('D', 11, FALSE, NULL, 'EST', 6), ('D', 12, FALSE, NULL, 'EST', 6),

('E', 1, FALSE, NULL, 'EST', 6), ('E', 2, FALSE, NULL, 'EST', 6), ('E', 3, FALSE, NULL, 'EST', 6), ('E', 4, FALSE, NULL, 'EST', 6),
('E', 5, FALSE, NULL, 'EST', 6), ('E', 6, FALSE, NULL, 'EST', 6), ('E', 7, FALSE, NULL, 'EST', 6), ('E', 8, FALSE, NULL, 'EST', 6),
('E', 9, FALSE, NULL, 'EST', 6), ('E', 10, FALSE, NULL, 'EST', 6), ('E', 11, FALSE, NULL, 'EST', 6), ('E', 12, FALSE, NULL, 'EST', 6),

('F', 1, FALSE, NULL, 'EST', 6), ('F', 2, FALSE, NULL, 'EST', 6), ('F', 3, FALSE, NULL, 'EST', 6), ('F', 4, FALSE, NULL, 'EST', 6),
('F', 5, FALSE, NULL, 'EST', 6), ('F', 6, FALSE, NULL, 'EST', 6), ('F', 7, FALSE, NULL, 'EST', 6), ('F', 8, FALSE, NULL, 'EST', 6),
('F', 9, FALSE, NULL, 'EST', 6), ('F', 10, FALSE, NULL, 'EST', 6), ('F', 11, FALSE, NULL, 'EST', 6), ('F', 12, FALSE, NULL, 'EST', 6),

('G', 1, FALSE, NULL, 'EST', 6), ('G', 2, FALSE, NULL, 'EST', 6), ('G', 3, FALSE, NULL, 'EST', 6), ('G', 4, FALSE, NULL, 'EST', 6),
('G', 5, FALSE, NULL, 'EST', 6), ('G', 6, FALSE, NULL, 'EST', 6), ('G', 7, FALSE, NULL, 'EST', 6), ('G', 8, FALSE, NULL, 'EST', 6),
('G', 9, FALSE, NULL, 'EST', 6), ('G', 10, FALSE, NULL, 'EST', 6), ('G', 11, FALSE, NULL, 'EST', 6), ('G', 12, FALSE, NULL, 'EST', 6),

('H', 1, FALSE, NULL, 'EST', 6), ('H', 2, FALSE, NULL, 'EST', 6), ('H', 3, FALSE, NULL, 'EST', 6), ('H', 4, FALSE, NULL, 'EST', 6),
('H', 5, FALSE, NULL, 'EST', 6), ('H', 6, FALSE, NULL, 'EST', 6), ('H', 7, FALSE, NULL, 'EST', 6), ('H', 8, FALSE, NULL, 'EST', 6),
('H', 9, FALSE, NULL, 'EST', 6), ('H', 10, FALSE, NULL, 'EST', 6), ('H', 11, FALSE, NULL, 'EST', 6), ('H', 12, FALSE, NULL, 'EST', 6),

('I', 1, FALSE, NULL, 'EST', 6), ('I', 2, FALSE, NULL, 'EST', 6), ('I', 3, FALSE, NULL, 'EST', 6), ('I', 4, FALSE, NULL, 'EST', 6),


('A', 1,  FALSE, NULL, 'EST', 7), ('A', 2,  FALSE, NULL, 'EST', 7), ('A', 3,  FALSE, NULL, 'EST', 7), ('A', 4,  FALSE, NULL, 'EST', 7),
('A', 5,  FALSE, NULL, 'EST', 7), ('A', 6,  FALSE, NULL, 'EST', 7), ('A', 7,  FALSE, NULL, 'EST', 7), ('A', 8,  FALSE, NULL, 'EST', 7),
('A', 9,  FALSE, NULL, 'EST', 7), ('A', 10, FALSE, NULL, 'EST', 7), ('A', 11, FALSE, NULL, 'EST', 7), ('A', 12, FALSE, NULL, 'EST', 7),

('B', 1, FALSE, NULL, 'EST', 7), ('B', 2, FALSE, NULL, 'EST', 7), ('B', 3, FALSE, NULL, 'EST', 7), ('B', 4, FALSE, NULL, 'EST', 7),
('B', 5, FALSE, NULL, 'EST', 7), ('B', 6, FALSE, NULL, 'EST', 7), ('B', 7, FALSE, NULL, 'EST', 7), ('B', 8, FALSE, NULL, 'EST', 7),
('B', 9, FALSE, NULL, 'EST', 7), ('B', 10, FALSE, NULL, 'EST', 7), ('B', 11, FALSE, NULL, 'EST', 7), ('B', 12, FALSE, NULL, 'EST', 7),

('C', 1, FALSE, NULL, 'EST', 7), ('C', 2, FALSE, NULL, 'EST', 7), ('C', 3, FALSE, NULL, 'EST', 7), ('C', 4, FALSE, NULL, 'EST', 7),
('C', 5, FALSE, NULL, 'EST', 7), ('C', 6, FALSE, NULL, 'EST', 7), ('C', 7, FALSE, NULL, 'EST', 7), ('C', 8, FALSE, NULL, 'EST', 7),
('C', 9, FALSE, NULL, 'EST', 7), ('C', 10, FALSE, NULL, 'EST', 7), ('C', 11, FALSE, NULL, 'EST', 7), ('C', 12, FALSE, NULL, 'EST', 7),

('D', 1, FALSE, NULL, 'EST', 7), ('D', 2, FALSE, NULL, 'EST', 7), ('D', 3, FALSE, NULL, 'EST', 7), ('D', 4, FALSE, NULL, 'EST', 7),
('D', 5, FALSE, NULL, 'EST', 7), ('D', 6, FALSE, NULL, 'EST', 7), ('D', 7, FALSE, NULL, 'EST', 7), ('D', 8, FALSE, NULL, 'EST', 7),
('D', 9, FALSE, NULL, 'EST', 7), ('D', 10, FALSE, NULL, 'EST', 7), ('D', 11, FALSE, NULL, 'EST', 7), ('D', 12, FALSE, NULL, 'EST', 7),

('E', 1, FALSE, NULL, 'EST', 7), ('E', 2, FALSE, NULL, 'EST', 7), ('E', 3, FALSE, NULL, 'EST', 7), ('E', 4, FALSE, NULL, 'EST', 7),
('E', 5, FALSE, NULL, 'EST', 7), ('E', 6, FALSE, NULL, 'EST', 7), ('E', 7, FALSE, NULL, 'EST', 7), ('E', 8, FALSE, NULL, 'EST', 7),
('E', 9, FALSE, NULL, 'EST', 7), ('E', 10, FALSE, NULL, 'EST', 7), ('E', 11, FALSE, NULL, 'EST', 7), ('E', 12, FALSE, NULL, 'EST', 7),

('F', 1, FALSE, NULL, 'EST', 7), ('F', 2, FALSE, NULL, 'EST', 7), ('F', 3, FALSE, NULL, 'EST', 7), ('F', 4, FALSE, NULL, 'EST', 7),
('F', 5, FALSE, NULL, 'EST', 7), ('F', 6, FALSE, NULL, 'EST', 7), ('F', 7, FALSE, NULL, 'EST', 7), ('F', 8, FALSE, NULL, 'EST', 7),
('F', 9, FALSE, NULL, 'EST', 7), ('F', 10, FALSE, NULL, 'EST', 7), ('F', 11, FALSE, NULL, 'EST', 7), ('F', 12, FALSE, NULL, 'EST', 7),

('G', 1, FALSE, NULL, 'EST', 7), ('G', 2, FALSE, NULL, 'EST', 7), ('G', 3, FALSE, NULL, 'EST', 7), ('G', 4, FALSE, NULL, 'EST', 7),
('G', 5, FALSE, NULL, 'EST', 7), ('G', 6, FALSE, NULL, 'EST', 7), ('G', 7, FALSE, NULL, 'EST', 7), ('G', 8, FALSE, NULL, 'EST', 7),
('G', 9, FALSE, NULL, 'EST', 7), ('G', 10, FALSE, NULL, 'EST', 7), ('G', 11, FALSE, NULL, 'EST', 7), ('G', 12, FALSE, NULL, 'EST', 7),

('H', 1, FALSE, NULL, 'EST', 7), ('H', 2, FALSE, NULL, 'EST', 7), ('H', 3, FALSE, NULL, 'EST', 7), ('H', 4, FALSE, NULL, 'EST', 7),
('H', 5, FALSE, NULL, 'EST', 7), ('H', 6, FALSE, NULL, 'EST', 7), ('H', 7, FALSE, NULL, 'EST', 7), ('H', 8, FALSE, NULL, 'EST', 7),
('H', 9, FALSE, NULL, 'EST', 7), ('H', 10, FALSE, NULL, 'EST', 7), ('H', 11, FALSE, NULL, 'EST', 7), ('H', 12, FALSE, NULL, 'EST', 7),

('I', 1, FALSE, NULL, 'EST', 7), ('I', 2, FALSE, NULL, 'EST', 7), ('I', 3, FALSE, NULL, 'EST', 7), ('I', 4, FALSE, NULL, 'EST', 7),


('A', 1, FALSE, NULL, 'EST', 8), ('A', 2, FALSE, NULL, 'EST', 8), ('A', 3, FALSE, NULL, 'EST', 8), ('A', 4, FALSE, NULL, 'EST', 8),
('A', 5, FALSE, NULL, 'EST', 8), ('A', 6, FALSE, NULL, 'EST', 8), ('A', 7, FALSE, NULL, 'EST', 8), ('A', 8, FALSE, NULL, 'EST', 8),
('A', 9, FALSE, NULL, 'EST', 8), ('A', 10, FALSE, NULL, 'EST', 8), ('A', 11, FALSE, NULL, 'EST', 8), ('A', 12, FALSE, NULL, 'EST', 8),

('B', 1, FALSE, NULL, 'EST', 8), ('B', 2, FALSE, NULL, 'EST', 8), ('B', 3, FALSE, NULL, 'EST', 8), ('B', 4, FALSE, NULL, 'EST', 8),
('B', 5, FALSE, NULL, 'EST', 8), ('B', 6, FALSE, NULL, 'EST', 8), ('B', 7, FALSE, NULL, 'EST', 8), ('B', 8, FALSE, NULL, 'EST', 8),
('B', 9, FALSE, NULL, 'EST', 8), ('B', 10, FALSE, NULL, 'EST', 8), ('B', 11, FALSE, NULL, 'EST', 8), ('B', 12, FALSE, NULL, 'EST', 8),

('C', 1, FALSE, NULL, 'EST', 8), ('C', 2, FALSE, NULL, 'EST', 8), ('C', 3, FALSE, NULL, 'EST', 8), ('C', 4, FALSE, NULL, 'EST', 8),
('C', 5, FALSE, NULL, 'EST', 8), ('C', 6, FALSE, NULL, 'EST', 8), ('C', 7, FALSE, NULL, 'EST', 8), ('C', 8, FALSE, NULL, 'EST', 8),
('C', 9, FALSE, NULL, 'EST', 8), ('C', 10, FALSE, NULL, 'EST', 8), ('C', 11, FALSE, NULL, 'EST', 8), ('C', 12, FALSE, NULL, 'EST', 8),

('D', 1, FALSE, NULL, 'EST', 8), ('D', 2, FALSE, NULL, 'EST', 8), ('D', 3, FALSE, NULL, 'EST', 8), ('D', 4, FALSE, NULL, 'EST', 8),
('D', 5, FALSE, NULL, 'EST', 8), ('D', 6, FALSE, NULL, 'EST', 8), ('D', 7, FALSE, NULL, 'EST', 8), ('D', 8, FALSE, NULL, 'EST', 8),
('D', 9, FALSE, NULL, 'EST', 8), ('D', 10, FALSE, NULL, 'EST', 8), ('D', 11, FALSE, NULL, 'EST', 8), ('D', 12, FALSE, NULL, 'EST', 8),

('E', 1, FALSE, NULL, 'EST', 8), ('E', 2, FALSE, NULL, 'EST', 8), ('E', 3, FALSE, NULL, 'EST', 8), ('E', 4, FALSE, NULL, 'EST', 8),
('E', 5, FALSE, NULL, 'EST', 8), ('E', 6, FALSE, NULL, 'EST', 8), ('E', 7, FALSE, NULL, 'EST', 8), ('E', 8, FALSE, NULL, 'EST', 8),
('E', 9, FALSE, NULL, 'EST', 8), ('E', 10, FALSE, NULL, 'EST', 8), ('E', 11, FALSE, NULL, 'EST', 8), ('E', 12, FALSE, NULL, 'EST', 8),

('F', 1, FALSE, NULL, 'EST', 8), ('F', 2, FALSE, NULL, 'EST', 8), ('F', 3, FALSE, NULL, 'EST', 8), ('F', 4, FALSE, NULL, 'EST', 8),
('F', 5, FALSE, NULL, 'EST', 8), ('F', 6, FALSE, NULL, 'EST', 8), ('F', 7, FALSE, NULL, 'EST', 8), ('F', 8, FALSE, NULL, 'EST', 8),
('F', 9, FALSE, NULL, 'EST', 8), ('F', 10, FALSE, NULL, 'EST', 8), ('F', 11, FALSE, NULL, 'EST', 8), ('F', 12, FALSE, NULL, 'EST', 8),

('G', 1, FALSE, NULL, 'EST', 8), ('G', 2, FALSE, NULL, 'EST', 8), ('G', 3, FALSE, NULL, 'EST', 8), ('G', 4, FALSE, NULL, 'EST', 8),
('G', 5, FALSE, NULL, 'EST', 8), ('G', 6, FALSE, NULL, 'EST', 8), ('G', 7, FALSE, NULL, 'EST', 8), ('G', 8, FALSE, NULL, 'EST', 8),
('G', 9, FALSE, NULL, 'EST', 8), ('G', 10, FALSE, NULL, 'EST', 8), ('G', 11, FALSE, NULL, 'EST', 8), ('G', 12, FALSE, NULL, 'EST', 8),

('H', 1, FALSE, NULL, 'EST', 8), ('H', 2, FALSE, NULL, 'EST', 8), ('H', 3, FALSE, NULL, 'EST', 8), ('H', 4, FALSE, NULL, 'EST', 8),
('H', 5, FALSE, NULL, 'EST', 8), ('H', 6, FALSE, NULL, 'EST', 8), ('H', 7, FALSE, NULL, 'EST', 8), ('H', 8, FALSE, NULL, 'EST', 8),
('H', 9, FALSE, NULL, 'EST', 8), ('H', 10, FALSE, NULL, 'EST', 8), ('H', 11, FALSE, NULL, 'EST', 8), ('H', 12, FALSE, NULL, 'EST', 8),

('I', 1, FALSE, NULL, 'EST', 8), ('I', 2, FALSE, NULL, 'EST', 8), ('I', 3, FALSE, NULL, 'EST', 8), ('I', 4, FALSE, NULL, 'EST', 8),



('A', 1,  FALSE, NULL, 'SUD', 9), ('A', 2,  FALSE, NULL, 'SUD', 9), ('A', 3,  FALSE, NULL, 'SUD', 9), ('A', 4,  FALSE, NULL, 'SUD', 9),
('A', 5,  FALSE, NULL, 'SUD', 9), ('A', 6,  FALSE, NULL, 'SUD', 9), ('A', 7,  FALSE, NULL, 'SUD', 9), ('A', 8,  FALSE, NULL, 'SUD', 9),
('A', 9,  FALSE, NULL, 'SUD', 9), ('A', 10, FALSE, NULL, 'SUD', 9), ('A', 11, FALSE, NULL, 'SUD', 9), ('A', 12, FALSE, NULL, 'SUD', 9),

('B', 1, FALSE, NULL, 'SUD', 9), ('B', 2, FALSE, NULL, 'SUD', 9), ('B', 3, FALSE, NULL, 'SUD', 9), ('B', 4, FALSE, NULL, 'SUD', 9),
('B', 5, FALSE, NULL, 'SUD', 9), ('B', 6, FALSE, NULL, 'SUD', 9), ('B', 7, FALSE, NULL, 'SUD', 9), ('B', 8, FALSE, NULL, 'SUD', 9),
('B', 9, FALSE, NULL, 'SUD', 9), ('B', 10, FALSE, NULL, 'SUD', 9), ('B', 11, FALSE, NULL, 'SUD', 9), ('B', 12, FALSE, NULL, 'SUD', 9),

('C', 1, FALSE, NULL, 'SUD', 9), ('C', 2, FALSE, NULL, 'SUD', 9), ('C', 3, FALSE, NULL, 'SUD', 9), ('C', 4, FALSE, NULL, 'SUD', 9),
('C', 5, FALSE, NULL, 'SUD', 9), ('C', 6, FALSE, NULL, 'SUD', 9), ('C', 7, FALSE, NULL, 'SUD', 9), ('C', 8, FALSE, NULL, 'SUD', 9),
('C', 9, FALSE, NULL, 'SUD', 9), ('C', 10, FALSE, NULL, 'SUD', 9), ('C', 11, FALSE, NULL, 'SUD', 9), ('C', 12, FALSE, NULL, 'SUD', 9),

('D', 1, FALSE, NULL, 'SUD', 9), ('D', 2, FALSE, NULL, 'SUD', 9), ('D', 3, FALSE, NULL, 'SUD', 9), ('D', 4, FALSE, NULL, 'SUD', 9),
('D', 5, FALSE, NULL, 'SUD', 9), ('D', 6, FALSE, NULL, 'SUD', 9), ('D', 7, FALSE, NULL, 'SUD', 9), ('D', 8, FALSE, NULL, 'SUD', 9),
('D', 9, FALSE, NULL, 'SUD', 9), ('D', 10, FALSE, NULL, 'SUD', 9), ('D', 11, FALSE, NULL, 'SUD', 9), ('D', 12, FALSE, NULL, 'SUD', 9),

('E', 1, FALSE, NULL, 'SUD', 9), ('E', 2, FALSE, NULL, 'SUD', 9), ('E', 3, FALSE, NULL, 'SUD', 9), ('E', 4, FALSE, NULL, 'SUD', 9),
('E', 5, FALSE, NULL, 'SUD', 9), ('E', 6, FALSE, NULL, 'SUD', 9), ('E', 7, FALSE, NULL, 'SUD', 9), ('E', 8, FALSE, NULL, 'SUD', 9),
('E', 9, FALSE, NULL, 'SUD', 9), ('E', 10, FALSE, NULL, 'SUD', 9), ('E', 11, FALSE, NULL, 'SUD', 9), ('E', 12, FALSE, NULL, 'SUD', 9),

('F', 1, FALSE, NULL, 'SUD', 9), ('F', 2, FALSE, NULL, 'SUD', 9), ('F', 3, FALSE, NULL, 'SUD', 9), ('F', 4, FALSE, NULL, 'SUD', 9),
('F', 5, FALSE, NULL, 'SUD', 9), ('F', 6, FALSE, NULL, 'SUD', 9), ('F', 7, FALSE, NULL, 'SUD', 9), ('F', 8, FALSE, NULL, 'SUD', 9),
('F', 9, FALSE, NULL, 'SUD', 9), ('F', 10, FALSE, NULL, 'SUD', 9), ('F', 11, FALSE, NULL, 'SUD', 9), ('F', 12, FALSE, NULL, 'SUD', 9),

('G', 1, FALSE, NULL, 'SUD', 9), ('G', 2, FALSE, NULL, 'SUD', 9), ('G', 3, FALSE, NULL, 'SUD', 9), ('G', 4, FALSE, NULL, 'SUD', 9),
('G', 5, FALSE, NULL, 'SUD', 9), ('G', 6, FALSE, NULL, 'SUD', 9), ('G', 7, FALSE, NULL, 'SUD', 9), ('G', 8, FALSE, NULL, 'SUD', 9),
('G', 9, FALSE, NULL, 'SUD', 9), ('G', 10, FALSE, NULL, 'SUD', 9), ('G', 11, FALSE, NULL, 'SUD', 9), ('G', 12, FALSE, NULL, 'SUD', 9),

('H', 1, FALSE, NULL, 'SUD', 9), ('H', 2, FALSE, NULL, 'SUD', 9), ('H', 3, FALSE, NULL, 'SUD', 9), ('H', 4, FALSE, NULL, 'SUD', 9),
('H', 5, FALSE, NULL, 'SUD', 9), ('H', 6, FALSE, NULL, 'SUD', 9), ('H', 7, FALSE, NULL, 'SUD', 9), ('H', 8, FALSE, NULL, 'SUD', 9),
('H', 9, FALSE, NULL, 'SUD', 9), ('H', 10, FALSE, NULL, 'SUD', 9), ('H', 11, FALSE, NULL, 'SUD', 9), ('H', 12, FALSE, NULL, 'SUD', 9),

('I', 1, FALSE, NULL, 'SUD', 9), ('I', 2, FALSE, NULL, 'SUD', 9), ('I', 3, FALSE, NULL, 'SUD', 9), ('I', 4, FALSE, NULL, 'SUD', 9),


('A', 1, FALSE, NULL, 'SUD', 10), ('A', 2, FALSE, NULL, 'SUD', 10), ('A', 3, FALSE, NULL, 'SUD', 10), ('A', 4, FALSE, NULL, 'SUD', 10),
('A', 5, FALSE, NULL, 'SUD', 10), ('A', 6, FALSE, NULL, 'SUD', 10), ('A', 7, FALSE, NULL, 'SUD', 10), ('A', 8, FALSE, NULL, 'SUD', 10),
('A', 9, FALSE, NULL, 'SUD', 10), ('A', 10, FALSE, NULL, 'SUD', 10), ('A', 11, FALSE, NULL, 'SUD', 10), ('A', 12, FALSE, NULL, 'SUD', 10),

('B', 1, FALSE, NULL, 'SUD', 10), ('B', 2, FALSE, NULL, 'SUD', 10), ('B', 3, FALSE, NULL, 'SUD', 10), ('B', 4, FALSE, NULL, 'SUD', 10),
('B', 5, FALSE, NULL, 'SUD', 10), ('B', 6, FALSE, NULL, 'SUD', 10), ('B', 7, FALSE, NULL, 'SUD', 10), ('B', 8, FALSE, NULL, 'SUD', 10),
('B', 9, FALSE, NULL, 'SUD', 10), ('B', 10, FALSE, NULL, 'SUD', 10), ('B', 11, FALSE, NULL, 'SUD', 10), ('B', 12, FALSE, NULL, 'SUD', 10),

('C', 1, FALSE, NULL, 'SUD', 10), ('C', 2, FALSE, NULL, 'SUD', 10), ('C', 3, FALSE, NULL, 'SUD', 10), ('C', 4, FALSE, NULL, 'SUD', 10),
('C', 5, FALSE, NULL, 'SUD', 10), ('C', 6, FALSE, NULL, 'SUD', 10), ('C', 7, FALSE, NULL, 'SUD', 10), ('C', 8, FALSE, NULL, 'SUD', 10),
('C', 9, FALSE, NULL, 'SUD', 10), ('C', 10, FALSE, NULL, 'SUD', 10), ('C', 11, FALSE, NULL, 'SUD', 10), ('C', 12, FALSE, NULL, 'SUD', 10),

('D', 1, FALSE, NULL, 'SUD', 10), ('D', 2, FALSE, NULL, 'SUD', 10), ('D', 3, FALSE, NULL, 'SUD', 10), ('D', 4, FALSE, NULL, 'SUD', 10),
('D', 5, FALSE, NULL, 'SUD', 10), ('D', 6, FALSE, NULL, 'SUD', 10), ('D', 7, FALSE, NULL, 'SUD', 10), ('D', 8, FALSE, NULL, 'SUD', 10),
('D', 9, FALSE, NULL, 'SUD', 10), ('D', 10, FALSE, NULL, 'SUD', 10), ('D', 11, FALSE, NULL, 'SUD', 10), ('D', 12, FALSE, NULL, 'SUD', 10),

('E', 1, FALSE, NULL, 'SUD', 10), ('E', 2, FALSE, NULL, 'SUD', 10), ('E', 3, FALSE, NULL, 'SUD', 10), ('E', 4, FALSE, NULL, 'SUD', 10),
('E', 5, FALSE, NULL, 'SUD', 10), ('E', 6, FALSE, NULL, 'SUD', 10), ('E', 7, FALSE, NULL, 'SUD', 10), ('E', 8, FALSE, NULL, 'SUD', 10),
('E', 9, FALSE, NULL, 'SUD', 10), ('E', 10, FALSE, NULL, 'SUD', 10), ('E', 11, FALSE, NULL, 'SUD', 10), ('E', 12, FALSE, NULL, 'SUD', 10),

('F', 1, FALSE, NULL, 'SUD', 10), ('F', 2, FALSE, NULL, 'SUD', 10), ('F', 3, FALSE, NULL, 'SUD', 10), ('F', 4, FALSE, NULL, 'SUD', 10),
('F', 5, FALSE, NULL, 'SUD', 10), ('F', 6, FALSE, NULL, 'SUD', 10), ('F', 7, FALSE, NULL, 'SUD', 10), ('F', 8, FALSE, NULL, 'SUD', 10),
('F', 9, FALSE, NULL, 'SUD', 10), ('F', 10, FALSE, NULL, 'SUD', 10), ('F', 11, FALSE, NULL, 'SUD', 10), ('F', 12, FALSE, NULL, 'SUD', 10),

('G', 1, FALSE, NULL, 'SUD', 10), ('G', 2, FALSE, NULL, 'SUD', 10), ('G', 3, FALSE, NULL, 'SUD', 10), ('G', 4, FALSE, NULL, 'SUD', 10),
('G', 5, FALSE, NULL, 'SUD', 10), ('G', 6, FALSE, NULL, 'SUD', 10), ('G', 7, FALSE, NULL, 'SUD', 10), ('G', 8, FALSE, NULL, 'SUD', 10),
('G', 9, FALSE, NULL, 'SUD', 10), ('G', 10, FALSE, NULL, 'SUD', 10), ('G', 11, FALSE, NULL, 'SUD', 10), ('G', 12, FALSE, NULL, 'SUD', 10),

('H', 1, FALSE, NULL, 'SUD', 10), ('H', 2, FALSE, NULL, 'SUD', 10), ('H', 3, FALSE, NULL, 'SUD', 10), ('H', 4, FALSE, NULL, 'SUD', 10),
('H', 5, FALSE, NULL, 'SUD', 10), ('H', 6, FALSE, NULL, 'SUD', 10), ('H', 7, FALSE, NULL, 'SUD', 10), ('H', 8, FALSE, NULL, 'SUD', 10),
('H', 9, FALSE, NULL, 'SUD', 10), ('H', 10, FALSE, NULL, 'SUD', 10), ('H', 11, FALSE, NULL, 'SUD', 10), ('H', 12, FALSE, NULL, 'SUD', 10),

('I', 1, FALSE, NULL, 'SUD', 10), ('I', 2, FALSE, NULL, 'SUD', 10), ('I', 3, FALSE, NULL, 'SUD', 10), ('I', 4, FALSE, NULL, 'SUD', 10),

    
    ('A', 1,  FALSE, NULL, 'SUD', 11), ('A', 2,  FALSE, NULL, 'SUD', 11), ('A', 3,  FALSE, NULL, 'SUD', 11), ('A', 4,  FALSE, NULL, 'SUD', 11),
('A', 5,  FALSE, NULL, 'SUD', 11), ('A', 6,  FALSE, NULL, 'SUD', 11), ('A', 7,  FALSE, NULL, 'SUD', 11), ('A', 8,  FALSE, NULL, 'SUD', 11),
('A', 9,  FALSE, NULL, 'SUD', 11), ('A', 10, FALSE, NULL, 'SUD', 11), ('A', 11, FALSE, NULL, 'SUD', 11), ('A', 12, FALSE, NULL, 'SUD', 11),

('B', 1, FALSE, NULL, 'SUD', 11), ('B', 2, FALSE, NULL, 'SUD', 11), ('B', 3, FALSE, NULL, 'SUD', 11), ('B', 4, FALSE, NULL, 'SUD', 11),
('B', 5, FALSE, NULL, 'SUD', 11), ('B', 6, FALSE, NULL, 'SUD', 11), ('B', 7, FALSE, NULL, 'SUD', 11), ('B', 8, FALSE, NULL, 'SUD', 11),
('B', 9, FALSE, NULL, 'SUD', 11), ('B', 10, FALSE, NULL, 'SUD', 11), ('B', 11, FALSE, NULL, 'SUD', 11), ('B', 12, FALSE, NULL, 'SUD', 11),

('C', 1, FALSE, NULL, 'SUD', 11), ('C', 2, FALSE, NULL, 'SUD', 11), ('C', 3, FALSE, NULL, 'SUD', 11), ('C', 4, FALSE, NULL, 'SUD', 11),
('C', 5, FALSE, NULL, 'SUD', 11), ('C', 6, FALSE, NULL, 'SUD', 11), ('C', 7, FALSE, NULL, 'SUD', 11), ('C', 8, FALSE, NULL, 'SUD', 11),
('C', 9, FALSE, NULL, 'SUD', 11), ('C', 10, FALSE, NULL, 'SUD', 11), ('C', 11, FALSE, NULL, 'SUD', 11), ('C', 12, FALSE, NULL, 'SUD', 11),

('D', 1, FALSE, NULL, 'SUD', 11), ('D', 2, FALSE, NULL, 'SUD', 11), ('D', 3, FALSE, NULL, 'SUD', 11), ('D', 4, FALSE, NULL, 'SUD', 11),
('D', 5, FALSE, NULL, 'SUD', 11), ('D', 6, FALSE, NULL, 'SUD', 11), ('D', 7, FALSE, NULL, 'SUD', 11), ('D', 8, FALSE, NULL, 'SUD', 11),
('D', 9, FALSE, NULL, 'SUD', 11), ('D', 10, FALSE, NULL, 'SUD', 11), ('D', 11, FALSE, NULL, 'SUD', 11), ('D', 12, FALSE, NULL, 'SUD', 11),

('E', 1, FALSE, NULL, 'SUD', 11), ('E', 2, FALSE, NULL, 'SUD', 11), ('E', 3, FALSE, NULL, 'SUD', 11), ('E', 4, FALSE, NULL, 'SUD', 11),
('E', 5, FALSE, NULL, 'SUD', 11), ('E', 6, FALSE, NULL, 'SUD', 11), ('E', 7, FALSE, NULL, 'SUD', 11), ('E', 8, FALSE, NULL, 'SUD', 11),
('E', 9, FALSE, NULL, 'SUD', 11), ('E', 10, FALSE, NULL, 'SUD', 11), ('E', 11, FALSE, NULL, 'SUD', 11), ('E', 12, FALSE, NULL, 'SUD', 11),

('F', 1, FALSE, NULL, 'SUD', 11), ('F', 2, FALSE, NULL, 'SUD', 11), ('F', 3, FALSE, NULL, 'SUD', 11), ('F', 4, FALSE, NULL, 'SUD', 11),
('F', 5, FALSE, NULL, 'SUD', 11), ('F', 6, FALSE, NULL, 'SUD', 11), ('F', 7, FALSE, NULL, 'SUD', 11), ('F', 8, FALSE, NULL, 'SUD', 11),
('F', 9, FALSE, NULL, 'SUD', 11), ('F', 10, FALSE, NULL, 'SUD', 11), ('F', 11, FALSE, NULL, 'SUD', 11), ('F', 12, FALSE, NULL, 'SUD', 11),

('G', 1, FALSE, NULL, 'SUD', 11), ('G', 2, FALSE, NULL, 'SUD', 11), ('G', 3, FALSE, NULL, 'SUD', 11), ('G', 4, FALSE, NULL, 'SUD', 11),
('G', 5, FALSE, NULL, 'SUD', 11), ('G', 6, FALSE, NULL, 'SUD', 11), ('G', 7, FALSE, NULL, 'SUD', 11), ('G', 8, FALSE, NULL, 'SUD', 11),
('G', 9, FALSE, NULL, 'SUD', 11), ('G', 10, FALSE, NULL, 'SUD', 11), ('G', 11, FALSE, NULL, 'SUD', 11), ('G', 12, FALSE, NULL, 'SUD', 11),

('H', 1, FALSE, NULL, 'SUD', 11), ('H', 2, FALSE, NULL, 'SUD', 11), ('H', 3, FALSE, NULL, 'SUD', 11), ('H', 4, FALSE, NULL, 'SUD', 11),
('H', 5, FALSE, NULL, 'SUD', 11), ('H', 6, FALSE, NULL, 'SUD', 11), ('H', 7, FALSE, NULL, 'SUD', 11), ('H', 8, FALSE, NULL, 'SUD', 11),
('H', 9, FALSE, NULL, 'SUD', 11), ('H', 10, FALSE, NULL, 'SUD', 11), ('H', 11, FALSE, NULL, 'SUD', 11), ('H', 12, FALSE, NULL, 'SUD', 11),

('I', 1, FALSE, NULL, 'SUD', 11), ('I', 2, FALSE, NULL, 'SUD', 11), ('I', 3, FALSE, NULL, 'SUD', 11), ('I', 4, FALSE, NULL, 'SUD', 11),


('A', 1, FALSE, NULL, 'SUD', 12), ('A', 2, FALSE, NULL, 'SUD', 12), ('A', 3, FALSE, NULL, 'SUD', 12), ('A', 4, FALSE, NULL, 'SUD', 12),
('A', 5, FALSE, NULL, 'SUD', 12), ('A', 6, FALSE, NULL, 'SUD', 12), ('A', 7, FALSE, NULL, 'SUD', 12), ('A', 8, FALSE, NULL, 'SUD', 12),
('A', 9, FALSE, NULL, 'SUD', 12), ('A', 10, FALSE, NULL, 'SUD', 12), ('A', 11, FALSE, NULL, 'SUD', 12), ('A', 12, FALSE, NULL, 'SUD', 12),

('B', 1, FALSE, NULL, 'SUD', 12), ('B', 2, FALSE, NULL, 'SUD', 12), ('B', 3, FALSE, NULL, 'SUD', 12), ('B', 4, FALSE, NULL, 'SUD', 12),
('B', 5, FALSE, NULL, 'SUD', 12), ('B', 6, FALSE, NULL, 'SUD', 12), ('B', 7, FALSE, NULL, 'SUD', 12), ('B', 8, FALSE, NULL, 'SUD', 12),
('B', 9, FALSE, NULL, 'SUD', 12), ('B', 10, FALSE, NULL, 'SUD', 12), ('B', 11, FALSE, NULL, 'SUD', 12), ('B', 12, FALSE, NULL, 'SUD', 12),

('C', 1, FALSE, NULL, 'SUD', 12), ('C', 2, FALSE, NULL, 'SUD', 12), ('C', 3, FALSE, NULL, 'SUD', 12), ('C', 4, FALSE, NULL, 'SUD', 12),
('C', 5, FALSE, NULL, 'SUD', 12), ('C', 6, FALSE, NULL, 'SUD', 12), ('C', 7, FALSE, NULL, 'SUD', 12), ('C', 8, FALSE, NULL, 'SUD', 12),
('C', 9, FALSE, NULL, 'SUD', 12), ('C', 10, FALSE, NULL, 'SUD', 12), ('C', 11, FALSE, NULL, 'SUD', 12), ('C', 12, FALSE, NULL, 'SUD', 12),

('D', 1, FALSE, NULL, 'SUD', 12), ('D', 2, FALSE, NULL, 'SUD', 12), ('D', 3, FALSE, NULL, 'SUD', 12), ('D', 4, FALSE, NULL, 'SUD', 12),
('D', 5, FALSE, NULL, 'SUD', 12), ('D', 6, FALSE, NULL, 'SUD', 12), ('D', 7, FALSE, NULL, 'SUD', 12), ('D', 8, FALSE, NULL, 'SUD', 12),
('D', 9, FALSE, NULL, 'SUD', 12), ('D', 10, FALSE, NULL, 'SUD', 12), ('D', 11, FALSE, NULL, 'SUD', 12), ('D', 12, FALSE, NULL, 'SUD', 12),

('E', 1, FALSE, NULL, 'SUD', 12), ('E', 2, FALSE, NULL, 'SUD', 12), ('E', 3, FALSE, NULL, 'SUD', 12), ('E', 4, FALSE, NULL, 'SUD', 12),
('E', 5, FALSE, NULL, 'SUD', 12), ('E', 6, FALSE, NULL, 'SUD', 12), ('E', 7, FALSE, NULL, 'SUD', 12), ('E', 8, FALSE, NULL, 'SUD', 12),
('E', 9, FALSE, NULL, 'SUD', 12), ('E', 10, FALSE, NULL, 'SUD', 12), ('E', 11, FALSE, NULL, 'SUD', 12), ('E', 12, FALSE, NULL, 'SUD', 12),

('F', 1, FALSE, NULL, 'SUD', 12), ('F', 2, FALSE, NULL, 'SUD', 12), ('F', 3, FALSE, NULL, 'SUD', 12), ('F', 4, FALSE, NULL, 'SUD', 12),
('F', 5, FALSE, NULL, 'SUD', 12), ('F', 6, FALSE, NULL, 'SUD', 12), ('F', 7, FALSE, NULL, 'SUD', 12), ('F', 8, FALSE, NULL, 'SUD', 12),
('F', 9, FALSE, NULL, 'SUD', 12), ('F', 10, FALSE, NULL, 'SUD', 12), ('F', 11, FALSE, NULL, 'SUD', 12), ('F', 12, FALSE, NULL, 'SUD', 12),

('G', 1, FALSE, NULL, 'SUD', 12), ('G', 2, FALSE, NULL, 'SUD', 12), ('G', 3, FALSE, NULL, 'SUD', 12), ('G', 4, FALSE, NULL, 'SUD', 12),
('G', 5, FALSE, NULL, 'SUD', 12), ('G', 6, FALSE, NULL, 'SUD', 12), ('G', 7, FALSE, NULL, 'SUD', 12), ('G', 8, FALSE, NULL, 'SUD', 12),
('G', 9, FALSE, NULL, 'SUD', 12), ('G', 10, FALSE, NULL, 'SUD', 12), ('G', 11, FALSE, NULL, 'SUD', 12), ('G', 12, FALSE, NULL, 'SUD', 12),

('H', 1, FALSE, NULL, 'SUD', 12), ('H', 2, FALSE, NULL, 'SUD', 12), ('H', 3, FALSE, NULL, 'SUD', 12), ('H', 4, FALSE, NULL, 'SUD', 12),
('H', 5, FALSE, NULL, 'SUD', 12), ('H', 6, FALSE, NULL, 'SUD', 12), ('H', 7, FALSE, NULL, 'SUD', 12), ('H', 8, FALSE, NULL, 'SUD', 12),
('H', 9, FALSE, NULL, 'SUD', 12), ('H', 10, FALSE, NULL, 'SUD', 12), ('H', 11, FALSE, NULL, 'SUD', 12), ('H', 12, FALSE, NULL, 'SUD', 12),

('I', 1, FALSE, NULL, 'SUD', 12), ('I', 2, FALSE, NULL, 'SUD', 12), ('I', 3, FALSE, NULL, 'SUD', 12), ('I', 4, FALSE, NULL, 'SUD', 12),


    ('A', 1, FALSE, NULL, 'OUEST', 13), ('A', 2, FALSE, NULL, 'OUEST', 13), ('A', 3, FALSE, NULL, 'OUEST', 13), ('A', 4, FALSE, NULL, 'OUEST', 13),
('A', 5, FALSE, NULL, 'OUEST', 13), ('A', 6, FALSE, NULL, 'OUEST', 13), ('A', 7, FALSE, NULL, 'OUEST', 13), ('A', 8, FALSE, NULL, 'OUEST', 13),
('A', 9, FALSE, NULL, 'OUEST', 13), ('A', 10, FALSE, NULL, 'OUEST', 13), ('A', 11, FALSE, NULL, 'OUEST', 13), ('A', 12, FALSE, NULL, 'OUEST', 13),

('B', 1, FALSE, NULL, 'OUEST', 13), ('B', 2, FALSE, NULL, 'OUEST', 13), ('B', 3, FALSE, NULL, 'OUEST', 13), ('B', 4, FALSE, NULL, 'OUEST', 13),
('B', 5, FALSE, NULL, 'OUEST', 13), ('B', 6, FALSE, NULL, 'OUEST', 13), ('B', 7, FALSE, NULL, 'OUEST', 13), ('B', 8, FALSE, NULL, 'OUEST', 13),
('B', 9, FALSE, NULL, 'OUEST', 13), ('B', 10, FALSE, NULL, 'OUEST', 13), ('B', 11, FALSE, NULL, 'OUEST', 13), ('B', 12, FALSE, NULL, 'OUEST', 13),

('C', 1, FALSE, NULL, 'OUEST', 13), ('C', 2, FALSE, NULL, 'OUEST', 13), ('C', 3, FALSE, NULL, 'OUEST', 13), ('C', 4, FALSE, NULL, 'OUEST', 13),
('C', 5, FALSE, NULL, 'OUEST', 13), ('C', 6, FALSE, NULL, 'OUEST', 13), ('C', 7, FALSE, NULL, 'OUEST', 13), ('C', 8, FALSE, NULL, 'OUEST', 13),
('C', 9, FALSE, NULL, 'OUEST', 13), ('C', 10, FALSE, NULL, 'OUEST', 13), ('C', 11, FALSE, NULL, 'OUEST', 13), ('C', 12, FALSE, NULL, 'OUEST', 13),

('D', 1, FALSE, NULL, 'OUEST', 13), ('D', 2, FALSE, NULL, 'OUEST', 13), ('D', 3, FALSE, NULL, 'OUEST', 13), ('D', 4, FALSE, NULL, 'OUEST', 13),
('D', 5, FALSE, NULL, 'OUEST', 13), ('D', 6, FALSE, NULL, 'OUEST', 13), ('D', 7, FALSE, NULL, 'OUEST', 13), ('D', 8, FALSE, NULL, 'OUEST', 13),
('D', 9, FALSE, NULL, 'OUEST', 13), ('D', 10, FALSE, NULL, 'OUEST', 13), ('D', 11, FALSE, NULL, 'OUEST', 13), ('D', 12, FALSE, NULL, 'OUEST', 13),

('E', 1, FALSE, NULL, 'OUEST', 13), ('E', 2, FALSE, NULL, 'OUEST', 13), ('E', 3, FALSE, NULL, 'OUEST', 13), ('E', 4, FALSE, NULL, 'OUEST', 13),
('E', 5, FALSE, NULL, 'OUEST', 13), ('E', 6, FALSE, NULL, 'OUEST', 13), ('E', 7, FALSE, NULL, 'OUEST', 13), ('E', 8, FALSE, NULL, 'OUEST', 13),
('E', 9, FALSE, NULL, 'OUEST', 13), ('E', 10, FALSE, NULL, 'OUEST', 13), ('E', 11, FALSE, NULL, 'OUEST', 13), ('E', 12, FALSE, NULL, 'OUEST', 13),

('F', 1, FALSE, NULL, 'OUEST', 13), ('F', 2, FALSE, NULL, 'OUEST', 13), ('F', 3, FALSE, NULL, 'OUEST', 13), ('F', 4, FALSE, NULL, 'OUEST', 13),
('F', 5, FALSE, NULL, 'OUEST', 13), ('F', 6, FALSE, NULL, 'OUEST', 13), ('F', 7, FALSE, NULL, 'OUEST', 13), ('F', 8, FALSE, NULL, 'OUEST', 13),
('F', 9, FALSE, NULL, 'OUEST', 13), ('F', 10, FALSE, NULL, 'OUEST', 13), ('F', 11, FALSE, NULL, 'OUEST', 13), ('F', 12, FALSE, NULL, 'OUEST', 13),

('G', 1, FALSE, NULL, 'OUEST', 13), ('G', 2, FALSE, NULL, 'OUEST', 13), ('G', 3, FALSE, NULL, 'OUEST', 13), ('G', 4, FALSE, NULL, 'OUEST', 13),
('G', 5, FALSE, NULL, 'OUEST', 13), ('G', 6, FALSE, NULL, 'OUEST', 13), ('G', 7, FALSE, NULL, 'OUEST', 13), ('G', 8, FALSE, NULL, 'OUEST', 13),
('G', 9, FALSE, NULL, 'OUEST', 13), ('G', 10, FALSE, NULL, 'OUEST', 13), ('G', 11, FALSE, NULL, 'OUEST', 13), ('G', 12, FALSE, NULL, 'OUEST', 13),

('H', 1, FALSE, NULL, 'OUEST', 13), ('H', 2, FALSE, NULL, 'OUEST', 13), ('H', 3, FALSE, NULL, 'OUEST', 13), ('H', 4, FALSE, NULL, 'OUEST', 13),
('H', 5, FALSE, NULL, 'OUEST', 13), ('H', 6, FALSE, NULL, 'OUEST', 13), ('H', 7, FALSE, NULL, 'OUEST', 13), ('H', 8, FALSE, NULL, 'OUEST', 13),
('H', 9, FALSE, NULL, 'OUEST', 13), ('H', 10, FALSE, NULL, 'OUEST', 13), ('H', 11, FALSE, NULL, 'OUEST', 13), ('H', 12, FALSE, NULL, 'OUEST', 13),

('I', 1, FALSE, NULL, 'OUEST', 13), ('I', 2, FALSE, NULL, 'OUEST', 13), ('I', 3, FALSE, NULL, 'OUEST', 13), ('I', 4, FALSE, NULL, 'OUEST', 13),

('A', 1, FALSE, NULL, 'OUEST', 14), ('A', 2, FALSE, NULL, 'OUEST', 14), ('A', 3, FALSE, NULL, 'OUEST', 14), ('A', 4, FALSE, NULL, 'OUEST', 14),
('A', 5, FALSE, NULL, 'OUEST', 14), ('A', 6, FALSE, NULL, 'OUEST', 14), ('A', 7, FALSE, NULL, 'OUEST', 14), ('A', 8, FALSE, NULL, 'OUEST', 14),
('A', 9, FALSE, NULL, 'OUEST', 14), ('A', 10, FALSE, NULL, 'OUEST', 14), ('A', 11, FALSE, NULL, 'OUEST', 14), ('A', 12, FALSE, NULL, 'OUEST', 14),

('B', 1, FALSE, NULL, 'OUEST', 14), ('B', 2, FALSE, NULL, 'OUEST', 14), ('B', 3, FALSE, NULL, 'OUEST', 14), ('B', 4, FALSE, NULL, 'OUEST', 14),
('B', 5, FALSE, NULL, 'OUEST', 14), ('B', 6, FALSE, NULL, 'OUEST', 14), ('B', 7, FALSE, NULL, 'OUEST', 14), ('B', 8, FALSE, NULL, 'OUEST', 14),
('B', 9, FALSE, NULL, 'OUEST', 14), ('B', 10, FALSE, NULL, 'OUEST', 14), ('B', 11, FALSE, NULL, 'OUEST', 14), ('B', 12, FALSE, NULL, 'OUEST', 14),

('C', 1, FALSE, NULL, 'OUEST', 14), ('C', 2, FALSE, NULL, 'OUEST', 14), ('C', 3, FALSE, NULL, 'OUEST', 14), ('C', 4, FALSE, NULL, 'OUEST', 14),
('C', 5, FALSE, NULL, 'OUEST', 14), ('C', 6, FALSE, NULL, 'OUEST', 14), ('C', 7, FALSE, NULL, 'OUEST', 14), ('C', 8, FALSE, NULL, 'OUEST', 14),
('C', 9, FALSE, NULL, 'OUEST', 14), ('C', 10, FALSE, NULL, 'OUEST', 14), ('C', 11, FALSE, NULL, 'OUEST', 14), ('C', 12, FALSE, NULL, 'OUEST', 14),

('D', 1, FALSE, NULL, 'OUEST', 14), ('D', 2, FALSE, NULL, 'OUEST', 14), ('D', 3, FALSE, NULL, 'OUEST', 14), ('D', 4, FALSE, NULL, 'OUEST', 14),
('D', 5, FALSE, NULL, 'OUEST', 14), ('D', 6, FALSE, NULL, 'OUEST', 14), ('D', 7, FALSE, NULL, 'OUEST', 14), ('D', 8, FALSE, NULL, 'OUEST', 14),
('D', 9, FALSE, NULL, 'OUEST', 14), ('D', 10, FALSE, NULL, 'OUEST', 14), ('D', 11, FALSE, NULL, 'OUEST', 14), ('D', 12, FALSE, NULL, 'OUEST', 14),

('E', 1, FALSE, NULL, 'OUEST', 14), ('E', 2, FALSE, NULL, 'OUEST', 14), ('E', 3, FALSE, NULL, 'OUEST', 14), ('E', 4, FALSE, NULL, 'OUEST', 14),
('E', 5, FALSE, NULL, 'OUEST', 14), ('E', 6, FALSE, NULL, 'OUEST', 14), ('E', 7, FALSE, NULL, 'OUEST', 14), ('E', 8, FALSE, NULL, 'OUEST', 14),
('E', 9, FALSE, NULL, 'OUEST', 14), ('E', 10, FALSE, NULL, 'OUEST', 14), ('E', 11, FALSE, NULL, 'OUEST', 14), ('E', 12, FALSE, NULL, 'OUEST', 14),

('F', 1, FALSE, NULL, 'OUEST', 14), ('F', 2, FALSE, NULL, 'OUEST', 14), ('F', 3, FALSE, NULL, 'OUEST', 14), ('F', 4, FALSE, NULL, 'OUEST', 14),
('F', 5, FALSE, NULL, 'OUEST', 14), ('F', 6, FALSE, NULL, 'OUEST', 14), ('F', 7, FALSE, NULL, 'OUEST', 14), ('F', 8, FALSE, NULL, 'OUEST', 14),
('F', 9, FALSE, NULL, 'OUEST', 14), ('F', 10, FALSE, NULL, 'OUEST', 14), ('F', 11, FALSE, NULL, 'OUEST', 14), ('F', 12, FALSE, NULL, 'OUEST', 14),

('G', 1, FALSE, NULL, 'OUEST', 14), ('G', 2, FALSE, NULL, 'OUEST', 14), ('G', 3, FALSE, NULL, 'OUEST', 14), ('G', 4, FALSE, NULL, 'OUEST', 14),
('G', 5, FALSE, NULL, 'OUEST', 14), ('G', 6, FALSE, NULL, 'OUEST', 14), ('G', 7, FALSE, NULL, 'OUEST', 14), ('G', 8, FALSE, NULL, 'OUEST', 14),
('G', 9, FALSE, NULL, 'OUEST', 14), ('G', 10, FALSE, NULL, 'OUEST', 14), ('G', 11, FALSE, NULL, 'OUEST', 14), ('G', 12, FALSE, NULL, 'OUEST', 14),

('H', 1, FALSE, NULL, 'OUEST', 14), ('H', 2, FALSE, NULL, 'OUEST', 14), ('H', 3, FALSE, NULL, 'OUEST', 14), ('H', 4, FALSE, NULL, 'OUEST', 14),
('H', 5, FALSE, NULL, 'OUEST', 14), ('H', 6, FALSE, NULL, 'OUEST', 14), ('H', 7, FALSE, NULL, 'OUEST', 14), ('H', 8, FALSE, NULL, 'OUEST', 14),
('H', 9, FALSE, NULL, 'OUEST', 14), ('H', 10, FALSE, NULL, 'OUEST', 14), ('H', 11, FALSE, NULL, 'OUEST', 14), ('H', 12, FALSE, NULL, 'OUEST', 14),

('I', 1, FALSE, NULL, 'OUEST', 14), ('I', 2, FALSE, NULL, 'OUEST', 14), ('I', 3, FALSE, NULL, 'OUEST', 14), ('I', 4, FALSE, NULL, 'OUEST', 14),


('A', 1, FALSE, NULL, 'OUEST', 15), ('A', 2, FALSE, NULL, 'OUEST', 15), ('A', 3, FALSE, NULL, 'OUEST', 15), ('A', 4, FALSE, NULL, 'OUEST', 15),
('A', 5, FALSE, NULL, 'OUEST', 15), ('A', 6, FALSE, NULL, 'OUEST', 15), ('A', 7, FALSE, NULL, 'OUEST', 15), ('A', 8, FALSE, NULL, 'OUEST', 15),
('A', 9, FALSE, NULL, 'OUEST', 15), ('A', 10, FALSE, NULL, 'OUEST', 15), ('A', 11, FALSE, NULL, 'OUEST', 15), ('A', 12, FALSE, NULL, 'OUEST', 15),

('B', 1, FALSE, NULL, 'OUEST', 15), ('B', 2, FALSE, NULL, 'OUEST', 15), ('B', 3, FALSE, NULL, 'OUEST', 15), ('B', 4, FALSE, NULL, 'OUEST', 15),
('B', 5, FALSE, NULL, 'OUEST', 15), ('B', 6, FALSE, NULL, 'OUEST', 15), ('B', 7, FALSE, NULL, 'OUEST', 15), ('B', 8, FALSE, NULL, 'OUEST', 15),
('B', 9, FALSE, NULL, 'OUEST', 15), ('B', 10, FALSE, NULL, 'OUEST', 15), ('B', 11, FALSE, NULL, 'OUEST', 15), ('B', 12, FALSE, NULL, 'OUEST', 15),

('C', 1, FALSE, NULL, 'OUEST', 15), ('C', 2, FALSE, NULL, 'OUEST', 15), ('C', 3, FALSE, NULL, 'OUEST', 15), ('C', 4, FALSE, NULL, 'OUEST', 15),
('C', 5, FALSE, NULL, 'OUEST', 15), ('C', 6, FALSE, NULL, 'OUEST', 15), ('C', 7, FALSE, NULL, 'OUEST', 15), ('C', 8, FALSE, NULL, 'OUEST', 15),
('C', 9, FALSE, NULL, 'OUEST', 15), ('C', 10, FALSE, NULL, 'OUEST', 15), ('C', 11, FALSE, NULL, 'OUEST', 15), ('C', 12, FALSE, NULL, 'OUEST', 15),

('D', 1, FALSE, NULL, 'OUEST', 15), ('D', 2, FALSE, NULL, 'OUEST', 15), ('D', 3, FALSE, NULL, 'OUEST', 15), ('D', 4, FALSE, NULL, 'OUEST', 15),
('D', 5, FALSE, NULL, 'OUEST', 15), ('D', 6, FALSE, NULL, 'OUEST', 15), ('D', 7, FALSE, NULL, 'OUEST', 15), ('D', 8, FALSE, NULL, 'OUEST', 15),
('D', 9, FALSE, NULL, 'OUEST', 15), ('D', 10, FALSE, NULL, 'OUEST', 15), ('D', 11, FALSE, NULL, 'OUEST', 15), ('D', 12, FALSE, NULL, 'OUEST', 15),

('E', 1, FALSE, NULL, 'OUEST', 15), ('E', 2, FALSE, NULL, 'OUEST', 15), ('E', 3, FALSE, NULL, 'OUEST', 15), ('E', 4, FALSE, NULL, 'OUEST', 15),
('E', 5, FALSE, NULL, 'OUEST', 15), ('E', 6, FALSE, NULL, 'OUEST', 15), ('E', 7, FALSE, NULL, 'OUEST', 15), ('E', 8, FALSE, NULL, 'OUEST', 15),
('E', 9, FALSE, NULL, 'OUEST', 15), ('E', 10, FALSE, NULL, 'OUEST', 15), ('E', 11, FALSE, NULL, 'OUEST', 15), ('E', 12, FALSE, NULL, 'OUEST', 15),

('F', 1, FALSE, NULL, 'OUEST', 15), ('F', 2, FALSE, NULL, 'OUEST', 15), ('F', 3, FALSE, NULL, 'OUEST', 15), ('F', 4, FALSE, NULL, 'OUEST', 15),
('F', 5, FALSE, NULL, 'OUEST', 15), ('F', 6, FALSE, NULL, 'OUEST', 15), ('F', 7, FALSE, NULL, 'OUEST', 15), ('F', 8, FALSE, NULL, 'OUEST', 15),
('F', 9, FALSE, NULL, 'OUEST', 15), ('F', 10, FALSE, NULL, 'OUEST', 15), ('F', 11, FALSE, NULL, 'OUEST', 15), ('F', 12, FALSE, NULL, 'OUEST', 15),

('G', 1, FALSE, NULL, 'OUEST', 15), ('G', 2, FALSE, NULL, 'OUEST', 15), ('G', 3, FALSE, NULL, 'OUEST', 15), ('G', 4, FALSE, NULL, 'OUEST', 15),
('G', 5, FALSE, NULL, 'OUEST', 15), ('G', 6, FALSE, NULL, 'OUEST', 15), ('G', 7, FALSE, NULL, 'OUEST', 15), ('G', 8, FALSE, NULL, 'OUEST', 15),
('G', 9, FALSE, NULL, 'OUEST', 15), ('G', 10, FALSE, NULL, 'OUEST', 15), ('G', 11, FALSE, NULL, 'OUEST', 15), ('G', 12, FALSE, NULL, 'OUEST', 15),

('H', 1, FALSE, NULL, 'OUEST', 15), ('H', 2, FALSE, NULL, 'OUEST', 15), ('H', 3, FALSE, NULL, 'OUEST', 15), ('H', 4, FALSE, NULL, 'OUEST', 15),
('H', 5, FALSE, NULL, 'OUEST', 15), ('H', 6, FALSE, NULL, 'OUEST', 15), ('H', 7, FALSE, NULL, 'OUEST', 15), ('H', 8, FALSE, NULL, 'OUEST', 15),
('H', 9, FALSE, NULL, 'OUEST', 15), ('H', 10, FALSE, NULL, 'OUEST', 15), ('H', 11, FALSE, NULL, 'OUEST', 15), ('H', 12, FALSE, NULL, 'OUEST', 15),

('I', 1, FALSE, NULL, 'OUEST', 15), ('I', 2, FALSE, NULL, 'OUEST', 15), ('I', 3, FALSE, NULL, 'OUEST', 15), ('I', 4, FALSE, NULL, 'OUEST', 15),

    
('A', 1, FALSE, NULL, 'OUEST', 16), ('A', 2, FALSE, NULL, 'OUEST', 16), ('A', 3, FALSE, NULL, 'OUEST', 16), ('A', 4, FALSE, NULL, 'OUEST', 16),
('A', 5, FALSE, NULL, 'OUEST', 16), ('A', 6, FALSE, NULL, 'OUEST', 16), ('A', 7, FALSE, NULL, 'OUEST', 16), ('A', 8, FALSE, NULL, 'OUEST', 16),
('A', 9, FALSE, NULL, 'OUEST', 16), ('A', 10, FALSE, NULL, 'OUEST', 16), ('A', 11, FALSE, NULL, 'OUEST', 16), ('A', 12, FALSE, NULL, 'OUEST', 16),

('B', 1, FALSE, NULL, 'OUEST', 16), ('B', 2, FALSE, NULL, 'OUEST', 16), ('B', 3, FALSE, NULL, 'OUEST', 16), ('B', 4, FALSE, NULL, 'OUEST', 16),
('B', 5, FALSE, NULL, 'OUEST', 16), ('B', 6, FALSE, NULL, 'OUEST', 16), ('B', 7, FALSE, NULL, 'OUEST', 16), ('B', 8, FALSE, NULL, 'OUEST', 16),
('B', 9, FALSE, NULL, 'OUEST', 16), ('B', 10, FALSE, NULL, 'OUEST', 16), ('B', 11, FALSE, NULL, 'OUEST', 16), ('B', 12, FALSE, NULL, 'OUEST', 16),

('C', 1, FALSE, NULL, 'OUEST', 16), ('C', 2, FALSE, NULL, 'OUEST', 16), ('C', 3, FALSE, NULL, 'OUEST', 16), ('C', 4, FALSE, NULL, 'OUEST', 16),
('C', 5, FALSE, NULL, 'OUEST', 16), ('C', 6, FALSE, NULL, 'OUEST', 16), ('C', 7, FALSE, NULL, 'OUEST', 16), ('C', 8, FALSE, NULL, 'OUEST', 16),
('C', 9, FALSE, NULL, 'OUEST', 16), ('C', 10, FALSE, NULL, 'OUEST', 16), ('C', 11, FALSE, NULL, 'OUEST', 16), ('C', 12, FALSE, NULL, 'OUEST', 16),

('D', 1, FALSE, NULL, 'OUEST', 16), ('D', 2, FALSE, NULL, 'OUEST', 16), ('D', 3, FALSE, NULL, 'OUEST', 16), ('D', 4, FALSE, NULL, 'OUEST', 16),
('D', 5, FALSE, NULL, 'OUEST', 16), ('D', 6, FALSE, NULL, 'OUEST', 16), ('D', 7, FALSE, NULL, 'OUEST', 16), ('D', 8, FALSE, NULL, 'OUEST', 16),
('D', 9, FALSE, NULL, 'OUEST', 16), ('D', 10, FALSE, NULL, 'OUEST', 16), ('D', 11, FALSE, NULL, 'OUEST', 16), ('D', 12, FALSE, NULL, 'OUEST', 16),

('E', 1, FALSE, NULL, 'OUEST', 16), ('E', 2, FALSE, NULL, 'OUEST', 16), ('E', 3, FALSE, NULL, 'OUEST', 16), ('E', 4, FALSE, NULL, 'OUEST', 16),
('E', 5, FALSE, NULL, 'OUEST', 16), ('E', 6, FALSE, NULL, 'OUEST', 16), ('E', 7, FALSE, NULL, 'OUEST', 16), ('E', 8, FALSE, NULL, 'OUEST', 16),
('E', 9, FALSE, NULL, 'OUEST', 16), ('E', 10, FALSE, NULL, 'OUEST', 16), ('E', 11, FALSE, NULL, 'OUEST', 16), ('E', 12, FALSE, NULL, 'OUEST', 16),

('F', 1, FALSE, NULL, 'OUEST', 16), ('F', 2, FALSE, NULL, 'OUEST', 16), ('F', 3, FALSE, NULL, 'OUEST', 16), ('F', 4, FALSE, NULL, 'OUEST', 16),
('F', 5, FALSE, NULL, 'OUEST', 16), ('F', 6, FALSE, NULL, 'OUEST', 16), ('F', 7, FALSE, NULL, 'OUEST', 16), ('F', 8, FALSE, NULL, 'OUEST', 16),
('F', 9, FALSE, NULL, 'OUEST', 16), ('F', 10, FALSE, NULL, 'OUEST', 16), ('F', 11, FALSE, NULL, 'OUEST', 16), ('F', 12, FALSE, NULL, 'OUEST', 16),

('G', 1, FALSE, NULL, 'OUEST', 16), ('G', 2, FALSE, NULL, 'OUEST', 16), ('G', 3, FALSE, NULL, 'OUEST', 16), ('G', 4, FALSE, NULL, 'OUEST', 16),
('G', 5, FALSE, NULL, 'OUEST', 16), ('G', 6, FALSE, NULL, 'OUEST', 16), ('G', 7, FALSE, NULL, 'OUEST', 16), ('G', 8, FALSE, NULL, 'OUEST', 16),
('G', 9, FALSE, NULL, 'OUEST', 16), ('G', 10, FALSE, NULL, 'OUEST', 16), ('G', 11, FALSE, NULL, 'OUEST', 16), ('G', 12, FALSE, NULL, 'OUEST', 16),

('H', 1, FALSE, NULL, 'OUEST', 16), ('H', 2, FALSE, NULL, 'OUEST', 16), ('H', 3, FALSE, NULL, 'OUEST', 16), ('H', 4, FALSE, NULL, 'OUEST', 16),
('H', 5, FALSE, NULL, 'OUEST', 16), ('H', 6, FALSE, NULL, 'OUEST', 16), ('H', 7, FALSE, NULL, 'OUEST', 16), ('H', 8, FALSE, NULL, 'OUEST', 16),
('H', 9, FALSE, NULL, 'OUEST', 16), ('H', 10, FALSE, NULL, 'OUEST', 16), ('H', 11, FALSE, NULL, 'OUEST', 16), ('H', 12, FALSE, NULL, 'OUEST', 16),

('I', 1, FALSE, NULL, 'OUEST', 16), ('I', 2, FALSE, NULL, 'OUEST', 16), ('I', 3, FALSE, NULL, 'OUEST', 16), ('I', 4, FALSE, NULL, 'OUEST', 16);

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
