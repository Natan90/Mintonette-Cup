#!/bin/bash

echo "Configuration d'une clé SSH pour GitHub"

read -p "Entrez votre prénom : " prenom
read -p "Entrez votre nom : " nom

email="${prenom}.${nom}@edu.univ-fcomte.fr"

git config --global user.email "$email"
git config --global user.name "$prenom $nom"

echo "Ton email : $email"

if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "Aucune clé SSH trouvée, génération d'une nouvelle clé..."
    ssh-keygen -t ed25519 -C "$email" -f ~/.ssh/id_ed25519
else
    echo "Une clé SSH existe déjà, on l'utilise."
fi

echo "Démarrage de l'agent SSH..."
eval "$(ssh-agent -s)"

ssh-add ~/.ssh/id_ed25519
clear

echo -e "\033[31mVoici la clé ssh générée, copie-colle tout le contenu entre les tirets\033[0m"
echo "--------------------------------------------"
cat ~/.ssh/id_ed25519.pub
echo "--------------------------------------------"

echo ""
echo "Maintenant, connecte-toi sur GitHub et va ici :"
echo -e "\033[31mhttps://github.com/settings/keys\033[0m"
echo "Clique sur 'New SSH key', colle la clé, et sauvegarde."
echo ""
echo "Pour tester si tout est bien setup, utilise la commande suivante :"
echo -e "\033[31mssh -T git@github.com\033[0m"
echo ""
echo "Ensuite, à la racine de ton dépôt, exécute cette commande :"
echo -e "\033[31mgit remote set-url origin git@github.com:TON_USER/TON_REPO.git\033[0m"
echo "(Remplace TON_USER et TON_REPO par ton pseudo et nom de repo)"
echo ""
echo -e "\033[32mUne fois que c'est fait, tu peux push et pull sans mdp ni token sur le repo GitHub\033[0m"

echo ""
echo "Tu veux aussi initialiser le repo git ?"
echo "1) Oui"
echo "2) Quitter"

read -p "" choix

if [ "$choix" == "1" ]; then
    echo ""
    echo "On va configurer ton dépôt Git pour utiliser SSH avec GitHub."

    read -p "Entrez votre nom d'utilisateur GitHub : " github_user
    repo_name="Quixo"
    ssh_url="git@github.com:$github_user/$repo_name.git"

    git remote set-url origin "$ssh_url"

    git clone https://github.com/Natan90/Quixo.git

    cd ./Quixo

    idea .

    echo ""
    echo -e "\033[32mRemote 'origin' mis à jour avec l'URL SSH suivante :\033[0m"
    echo -e "\033[36m$ssh_url\033[0m"
    echo ""
    echo -e "Tu peux maintenant tester avec : \033[33mgit push\033[0m (si tu as les droits d'écriture sur le repo)"

elif [ "$choix" == "2" ]; then
    echo -e "\033[33mPas de souci, le script s'arrête ici. Tu peux le relancer plus tard.\033[0m"
else
    echo -e "\033[31mOption invalide. Veuillez choisir 1 ou 2.\033[0m"
fi
