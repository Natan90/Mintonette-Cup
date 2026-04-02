DROP TABLE IF EXISTS Mailbox_Message CASCADE;

DROP TABLE IF EXISTS Type_Message CASCADE;

DROP TABLE IF EXISTS Nombre_Connexion CASCADE;

DROP TABLE IF EXISTS Commande CASCADE;

DROP TABLE IF EXISTS Commande_Siege CASCADE;

DROP TABLE IF EXISTS Commande_Service CASCADE;

DROP TABLE IF EXISTS Panier_Siege CASCADE;

DROP TABLE IF EXISTS Siege CASCADE;

DROP TABLE IF EXISTS Match CASCADE;

DROP TABLE IF EXISTS Joueur CASCADE;

DROP TABLE IF EXISTS Equipe CASCADE;

DROP TABLE IF EXISTS Pays CASCADE;

DROP TABLE IF EXISTS Zone CASCADE;

DROP TABLE IF EXISTS Commentaire CASCADE;

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
  is_activity BOOLEAN,
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
  prix_unitaire NUMERIC(10, 2) NOT NULL,
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

CREATE TABLE IF NOT EXISTS Commentaire (
  id_commentaire SERIAL PRIMARY KEY,
  id_utilisateur INTEGER NOT NULL REFERENCES Utilisateur(id_utilisateur),
  nom_commentaire VARCHAR(50),
  prenom_commentaire VARCHAR(50),
  titre_commentaire VARCHAR(500),
  texte_commentaire VARCHAR(500),
  reponse_commentaire TEXT,
  date_reponse_commentaire TIMESTAMP,
  note_commentaire NUMERIC(2,1),
  date_commentaire DATE
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
  PRIMARY KEY (
    id_panier,
    numero_colonne,
    numero_ligne,
    zone,
    match_id
  )
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

CREATE TABLE Commande (
  id_commande SERIAL PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  date_commande TIMESTAMP DEFAULT NOW(),
  statut VARCHAR(20) DEFAULT 'payee'
);

CREATE TABLE Commande_Siege (
  id_commande INT REFERENCES Commande(id_commande) ON DELETE CASCADE,
  match_id INT,
  numero_colonne VARCHAR(5),
  numero_ligne INT,
  zone VARCHAR(10),
  prix NUMERIC(10, 2),
  PRIMARY KEY (
    id_commande,
    match_id,
    numero_colonne,
    numero_ligne,
    zone
  )
);

CREATE TABLE Commande_Service (
  id_commande INT REFERENCES Commande(id_commande) ON DELETE CASCADE,
  service_id INT REFERENCES Services(id_service),
  quantite INT,
  prix_unitaire NUMERIC(10, 2)
);

CREATE TABLE Nombre_Connexion (
  id_nb_connexion SERIAL PRIMARY KEY,
  login_tentative VARCHAR(255) NOT NULL,
  nb_tentative INT NOT NULL DEFAULT 0,
  first_attempt_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_attempt_at TIMESTAMP NOT NULL DEFAULT NOW(),
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