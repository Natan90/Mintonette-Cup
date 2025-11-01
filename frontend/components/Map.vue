<template>
  <div class="button">
    <!-- Bouton pour changer la map  -->
    <button @click="changeMap('prestataires')">Prestataires</button>
    <button @click="changeMap('terrains')">Terrains</button>
    Attendre le code de Mathis pour avoir les bonnes coord et chnager la
    deuxieme image qui est pas folle
  </div>
  <!-- Balise vide pour insérer la map -->
  <div class="map" id="map"></div>
  <!-- Ce qui permet de faire apparaitre le nom du lieu en hover -->
  <div class="hoverName" id="hoverName"></div>
</template>

<script setup>
import { onMounted } from "vue";
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import ImageLayer from "ol/layer/Image.js";
import ImageStatic from "ol/source/ImageStatic.js";
import Feature from "ol/Feature.js";
import Polygon from "ol/geom/Polygon.js";
import { Style, Fill, Stroke } from "ol/style.js";
import { addProjection } from "ol/proj.js";
import Projection from "ol/proj/Projection.js";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";
import DragPan from "ol/interaction/DragPan.js";
import router from "@/router";

let map;
let coucheVecteur = null;
let hoverStyle = null;
let defaultStyle = null;
let standStyle;
let standHoverStyle;
let lastFeature = null;
let label = null;
const tailleMap = [0, 0, 1000, 800];
const projection = new Projection({
  code: "MintonetteMap",
  units: "pixels",
  extent: tailleMap,
});

// Définitions des zones ( possibilité de faire un planning avec les différentes équipes qui jouent dans la journée)
const landLocations = [
  {
    type: "court",
    name: "Terrain 1",
    coord: [
      [222, 375],
      [480, 375],
      [480, 517],
      [228, 517],
      [222, 375],
    ],
  },
  {
    type: "court",
    name: "Terrain 2",
    coord: [
      [525, 375],
      [775, 375],
      [771, 517],
      [525, 517],
      [525, 375],
    ],
  },
  {
    type: "court",
    name: "Terrain 3",
    coord: [
      [210, 180],
      [478, 180],
      [478, 340],
      [220, 340],
      [210, 180],
    ],
  },
  {
    type: "court",
    name: "Terrain 4",
    coord: [
      [525, 180],
      [783, 180],
      [775, 339],
      [525, 340],
      [525, 180],
    ],
  },
  // changer les coords des gradins et voir si c'est possible de changer la couleur (jaune)
  {
    type: "stand",
    name: "Gradin 1 (VIP)",
    coord: [
      [700, 700],
      [0, 0],
      [11, 11],
      [1, 1],
      [1, 1],
    ],
  },
  {
    type: "stand",
    name: "Gradin 2",
    coord: [
      [0, 0],
      [100, 0],
      [200, 200],
      [0, 0],
      [0, 0],
    ],
  },
  {
    type: "stand",
    name: "Gradin 3",
    coord: [
      [400, 0],
      [600, 0],
      [600, 200],
      [400, 200],
      [400, 0],
    ],
  },
  {
    type: "stand",
    name: "Gradin 4",
    coord: [
      [600, 0],
      [800, 0],
      [800, 400],
      [600, 400],
      [600, 0],
    ],
  },
];

const serviceLocation = [
  {
    name: "Stand de Burger",
    coord: [
      [400, 100],
      [600, 100],
      [600, 300],
      [400, 300],
      [400, 100],
    ],
    url: "../PrestatairePublic",
  },
];

//Pour créer les zones sur les maps
function features(location) {
  return location.map((location) => {
    const feature = new Feature({
      geometry: new Polygon([location.coord]),
      name: location.name,
      type: location.type,
      url: location.url,
    });
    return feature;
  });
}

onMounted(() => {
  //Création d'une nouvelle projection
  addProjection(projection);

  //Création d'une "couche" en gros ce qu'on l'on va afficher (une image fixe) sur la projection qu'on vient de créer avec les bonnes dimensions
  const mapLayer = new ImageLayer({
    source: new ImageStatic({
      url: "/mapTerrain.png",
      projection: projection,
      imageExtent: tailleMap,
    }),
  });

  map = new Map({
    //Envoie la map que l'on créer sur l'id 'map' qu'on a mit dans le template
    target: "map",
    layers: [mapLayer],
    view: new View({
      projection,
      center: [500, 400],
      zoom: 1,
      maxZoom: 1,
      minZoom: 1,
    }),
  });

  //On ajoute les tableaux des coordonnées qu'on a créés avant
  const featuresList = features(landLocations);

  //Style quand on hover
  hoverStyle = new Style({
    stroke: new Stroke({ color: "#ffffff", width: 2 }),
    fill: new Fill({ color: "rgba(0,22,122,0.3)" }),
  });
  //style par defaut
  defaultStyle = new Style({
    stroke: new Stroke({ color: "#00167a", width: 2 }),
    fill: new Fill({ color: "rgba(0,22,122,0.5)" }),
  });
  //Style de base pour les gradins
  standStyle = new Style({
    stroke: new Stroke({ color: "#ffff00", width: 2 }),
    fill: new Fill({ color: "rgba(255,255,0,0.5)" }),
  });
  //Style pour les gradins en hover
  standHoverStyle = new Style({
    stroke: new Stroke({ color: "#ffff00", width: 2 }),
    fill: new Fill({ color: "rgba(255,255,0,0.3)" }),
  });
  featuresList.forEach((f) => {
    if (f.get("type") === "stand") f.setStyle(standStyle);
    else f.setStyle(defaultStyle);
  });

  //Tu récupère la source qui contient les features (ici features)
  const sourceVecteur = new VectorSource({ features: featuresList });
  //Pour afficher la source sur la carte
  coucheVecteur = new VectorLayer({ source: sourceVecteur });
  //Pour ajouter la couche à la map
  map.addLayer(coucheVecteur);

  //Pour le nom avec le hover
  lastFeature = null;
  label = document.getElementById("hoverName");
  //Dès que la souris bouge on check
  map.on("pointermove", (event) => {
    //Directement dans OpenLayer: parcours les features trouvé sous le pixel de la souris et les renvoie (featureTrouvee)
    const searchFeature = map.forEachFeatureAtPixel(
      event.pixel,
      (featureFound) => featureFound
    );
    const mapElement = document.getElementById("map");

    //Si la feature survolée change
    if (searchFeature !== lastFeature) {
      //Si on quitte un ancien terrain → on remet son style normal
      if (lastFeature) {
        if (lastFeature.get("type") === "stand")
          lastFeature.setStyle(standStyle);
        else lastFeature.setStyle(defaultStyle);
      }
    }
    //Si featureCherchee est trouvée, on applique tous le style ici car ca dépend si c'est gradins ou terrains
    if (searchFeature) {
      //Récupération du nom et du type
      const type = searchFeature.get("type");
      const name = searchFeature.get("name");
      const pixel = event.originalEvent;
      label.style.display = "block";
      label.style.left = pixel.pageX + 10 + "px";
      label.style.top = pixel.pageY - 25 + "px";
      label.innerText = name;
      mapElement.style.cursor = "pointer";
      label.style.fontSize = "14px";
      if (searchFeature.get("type") === "stand") {
        searchFeature.setStyle(standHoverStyle);
        label.style.backgroundColor = "#ffff00";
        label.style.color = "black";
      } else {
        searchFeature.setStyle(hoverStyle);
        label.style.backgroundColor = "#00167a";
        label.style.color = "white";
      }
    } else {
      mapElement.style.cursor = "default";
      label.style.display = "none";
    }
    lastFeature = searchFeature;
  });
  //On capture tous les clicks et tu regarde si tu est dans un feature ( zone ) 
  map.on("click", (event) => {
  const clickedFeature = map.forEachFeatureAtPixel(
    event.pixel,
    (featureFound) => featureFound
  );
  //Si tu y ai tu redirige sur l'URL de la page
  if (clickedFeature) {
    const url = clickedFeature.get("url");
    if (url) router.push(url);
  }
});
});


function changeMap(type) {
  //Si pas map ca sert à rien
  if (!map) return;
  //Permet de supprimer la couche de "zones"
  if (coucheVecteur) {
    map.removeLayer(coucheVecteur);
    coucheVecteur = null;
  }

  //Supprime la couche d'image ( à l'index 0 donc la première )
  const oldImageLayer = map.getLayers().item(0);
  if (oldImageLayer) map.removeLayer(oldImageLayer);

  // Changer l’image selon le bouton
  let imageUrl = "/mapTerrain.png";
  if (type === "prestataires") {
    imageUrl = "/MapPresta.png";
  }

  const newImageLayer = new ImageLayer({
    source: new ImageStatic({
      url: imageUrl,
      projection: projection,
      imageExtent: tailleMap,
    }),
  });
  //Comme la map est faite de plusieurs couche, ici on change la couche '0' soit la première qui correspond à l'image
  map.getLayers().insertAt(0, newImageLayer);

  // Recrée et réaffiche les zones selon le type sélectionné
  let zone = landLocations;
  if (type === "prestataires") {
    zone = serviceLocation;
  }

  const featuresList = features(zone);
  featuresList.forEach((f) => {
    if (f.get("type") === "stand") f.setStyle(standStyle);
    else f.setStyle(defaultStyle);
  });

  const sourceVecteur = new VectorSource({ features: featuresList });
  coucheVecteur = new VectorLayer({ source: sourceVecteur });
  map.addLayer(coucheVecteur);
}
</script>

<style>
body::-webkit-scrollbar {
  display: none;
}
/* Taille de la map sur la page */
.map {
  height: 420px;
  width: 520px;
  margin: 0 auto;
  border: 2px solid #00167a;
  border-radius: 8px;
}

.hoverName {
  /* Important pour que ca s'affiche bien */
  z-index: 9999;
  position: absolute;
  padding: 4px;
  border-radius: 6px;
}
</style>
