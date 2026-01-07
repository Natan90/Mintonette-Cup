/**
 * Gestionnaire de données local avec localStorage
 * Permet de charger des données JSON de base et d'ajouter des données localement
 */

// Import des données JSON de base
import UtilisateurData from "../../backend/database/jsonData/Utilisateur.json";
import PrestataireData from "../../backend/database/jsonData/Prestataire.json";
import ServicesData from "../../backend/database/jsonData/Services.json";
import EvenementData from "../../backend/database/jsonData/Evenement.json";
import ZoneData from "../../backend/database/jsonData/Zone.json";
import Type_animationData from "../../backend/database/jsonData/Type_animation.json";
import Type_restaurationData from "../../backend/database/jsonData/Type_restauration.json";
import Type_boutiqueData from "../../backend/database/jsonData/Type_boutique.json";
import Type_prestataireData from "../../backend/database/jsonData/Type_prestataire.json";

class LocalDataManager {
  constructor() {
    this.storagePrefix = "mintonette_";
    this.initializeData();
  }

  
  initializeData() {
    if (!localStorage.getItem(this.storagePrefix + "utilisateurs")) {
      localStorage.setItem(
        this.storagePrefix + "utilisateurs",
        JSON.stringify(UtilisateurData)
      );
    }
    if (!localStorage.getItem(this.storagePrefix + "prestataires")) {
      localStorage.setItem(
        this.storagePrefix + "prestataires",
        JSON.stringify(PrestataireData)
      );
    }
    if (!localStorage.getItem(this.storagePrefix + "services")) {
      localStorage.setItem(
        this.storagePrefix + "services",
        JSON.stringify(ServicesData)
      );
    }
    if (!localStorage.getItem(this.storagePrefix + "evenements")) {
      localStorage.setItem(
        this.storagePrefix + "evenements",
        JSON.stringify(EvenementData)
      );
    }
    if (!localStorage.getItem(this.storagePrefix + "zones")) {
      localStorage.setItem(
        this.storagePrefix + "zones",
        JSON.stringify(ZoneData)
      );
    }
    if (!localStorage.getItem(this.storagePrefix + "type_animation")) {
      localStorage.setItem(
        this.storagePrefix + "type_animation",
        JSON.stringify(Type_animationData)
      );
    }
    if (!localStorage.getItem(this.storagePrefix + "type_restauration")) {
      localStorage.setItem(
        this.storagePrefix + "type_restauration",
        JSON.stringify(Type_restaurationData)
      );
    }
    if (!localStorage.getItem(this.storagePrefix + "type_boutique")) {
      localStorage.setItem(
        this.storagePrefix + "type_boutique",
        JSON.stringify(Type_boutiqueData)
      );
    }
    if (!localStorage.getItem(this.storagePrefix + "type_prestataire")) {
      localStorage.setItem(
        this.storagePrefix + "type_prestataire",
        JSON.stringify(Type_prestataireData)
      );
    }
  }


  getAll(collection) {
    const data = localStorage.getItem(this.storagePrefix + collection);
    return data ? JSON.parse(data) : [];
  }

  
  getById(collection, id, idField = "id") {
    const items = this.getAll(collection);
    return items.find((item) => item[idField] === id);
  }

 
  add(collection, newItem) {
    const items = this.getAll(collection);

    if (!newItem.id && !newItem[`id_${collection.slice(0, -1)}`]) {
      const maxId = items.reduce((max, item) => {
        const itemId = item.id || item[`id_${collection.slice(0, -1)}`] || 0;
        return Math.max(max, itemId);
      }, 0);

      const idField = `id_${collection.slice(0, -1)}`;
      newItem[idField] = maxId + 1;
    }

    items.push(newItem);
    localStorage.setItem(
      this.storagePrefix + collection,
      JSON.stringify(items)
    );
    return newItem;
  }


  update(collection, id, updates, idField = "id") {
    const items = this.getAll(collection);
    const index = items.findIndex((item) => item[idField] === id);

    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(
        this.storagePrefix + collection,
        JSON.stringify(items)
      );
      return items[index];
    }
    return null;
  }


  delete(collection, id, idField = "id") {
    const items = this.getAll(collection);
    const filtered = items.filter((item) => item[idField] !== id);

    if (filtered.length !== items.length) {
      localStorage.setItem(
        this.storagePrefix + collection,
        JSON.stringify(filtered)
      );
      return true;
    }
    return false;
  }


  filter(collection, predicate) {
    const items = this.getAll(collection);
    return items.filter(predicate);
  }


  reset(collection) {
    localStorage.removeItem(this.storagePrefix + collection);
    this.initializeData();
  }


  resetAll() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.storagePrefix))
      .forEach((key) => localStorage.removeItem(key));
    this.initializeData();
  }


  exportData() {
    const data = {};
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.storagePrefix))
      .forEach((key) => {
        const collectionName = key.replace(this.storagePrefix, "");
        data[collectionName] = JSON.parse(localStorage.getItem(key));
      });
    return data;
  }


  importData(data) {
    Object.keys(data).forEach((collection) => {
      localStorage.setItem(
        this.storagePrefix + collection,
        JSON.stringify(data[collection])
      );
    });
  }
}

export default new LocalDataManager();
