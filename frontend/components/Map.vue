<template>
  <div class="button">
    <!-- Bouton pour changer la map  -->
    <button @click="changeMap('prestataires')">prestataires</button>
    <button @click="changeMap('terrains')">terrains</button>
  </div>
  <!-- Balise vide pour insérer la map -->
  <div class="map" id="map"></div>
  <!-- Ce qui permet de faire apparaitre le nom du lieu en hover -->
  <div class="hoverName" id="hoverName"></div>
</template>

<script setup>
// Tous les imports pour OpenLayers et pour faire les carrés des hovers
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

let map;
let coucheVecteur = null;
let hoverStyle = null;
let defaultStyle = null;
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
    name: "terrain 1",
    coord: [
      [222, 375],
      [480, 375],
      [480, 517],
      [228, 517],
      [222, 375],
    ],
  },
  {
    name: "terrain 2",
    coord: [
      [525, 375],
      [775, 375],
      [771, 517],
      [525, 517],
      [525, 375],
    ],
  },
  {
    name: "terrain 3",
    coord: [
      [210, 180],
      [478, 180],
      [478, 340],
      [220, 340],
      [210, 180],
    ],
  },
  {
    name: "terrain 4",
    coord: [
      [525, 180],
      [783, 180],
      [775, 339],
      [525, 340],
      [525, 180],
    ],
  },
  //changer les coords des gradins et voir si c'est possible de changer la couleur (jaune)
  {
    name: "gradin 1 (VIP)",
    coord: [
      [0, 0],
      [1, 1],
      [11, 11],
      [1, 1],
      [1, 1],
    ],
  },
  {
    name: "gradin 2",
    coord: [
      [525, 180],
      [783, 180],
      [775, 339],
      [525, 340],
      [525, 180],
    ],
  },
  {
    name: "gradin 3",
    coord: [
      [525, 180],
      [783, 180],
      [775, 339],
      [525, 340],
      [525, 180],
    ],
  },
  {
    name: "gradin 4",
    coord: [
      [525, 180],
      [783, 180],
      [775, 339],
      [525, 340],
      [525, 180],
    ],
  },
];

const serviceLocation = [
  {
    name: "Espace Prestataire",
    coord: [
      [400, 100],
      [600, 100],
      [600, 300],
      [400, 300],
      [400, 100],
    ],
  },
];

//Pour créer les zones sur les maps
function features(location) {
  return location.map((location) => {
    const feature = new Feature({
      geometry: new Polygon([location.coord]),
      name: location.name,
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
      maxZoom: 4,
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
  featuresList.forEach((f) => f.setStyle(defaultStyle));

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
        lastFeature.setStyle(defaultStyle);
      }
    }
    //Si featureCherchee est trouvée, pointeur avec le nom en hover sinon rien
    if (searchFeature) {
      //Récupération du nom
      const name = searchFeature.get("name");
      const pixel = event.originalEvent;
      label.style.display = "block";
      label.style.left = pixel.pageX + 10 + "px";
      label.style.top = pixel.pageY - 25 + "px";
      label.innerText = name;
      mapElement.style.cursor = "pointer";
      searchFeature.setStyle(hoverStyle);
    } else {
      mapElement.style.cursor = "default";
      label.style.display = "none";
    }
    lastFeature = searchFeature;
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
    imageUrl = "/crepe.jpg";
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
  featuresList.forEach((f) => f.setStyle(defaultStyle));

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
  background-color: #00167a;
  color: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>
