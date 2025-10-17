<template>
  <!-- Balise vide pour insérer la map -->
  <div class="map" id="map"></div>
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

onMounted(() => {
  //MinX, minY, maxX, maxY
  const tailleMap = [0, 0, 1000, 800];
  //Création d'une nouvelle projection
  const projection = new Projection({
    code: "MintonetteMap",
    units: "pixels",
    extent: tailleMap,
  });
  addProjection(projection);

  //Création d'une "couche" en gros ce qu'on l'on va afficher (une image fixe) sur la projection qu'on vient de créer avec les bonnes dimensions
  const mapLayer = new ImageLayer({
    source: new ImageStatic({
      url: "/ImageManif.png",
      projection: projection,
      imageExtent: tailleMap,
    }),
  });

  const map = new Map({
    //Envoie la map que l'on créer sur l'id 'map' qu'on a mit dans le template
    target: "map",
    layers: [mapLayer],
    view: new View({
      projection,
      center: [200, 150],
      zoom: 1,
      maxZoom: 5,
      minZoom: 0.5,
    }),
  });

  //On met les coordonnées des zones que l'on souhaite créer dans ce tableau lieu
  const lieu = [
    {
      name: "terrain 1",
      coord: [
        [700, 200],
        [780, 200],
        [780, 280],
        [700, 280],
        [700, 200],
      ],
    },
    {
      name: "terrain 2",
      coord: [
        [800, 200],
        [880, 200],
        [880, 280],
        [800, 280],
        [800, 200],
      ],
    },
    {
      name: "terrain 3",
      coord: [
        [700, 300],
        [780, 300],
        [780, 380],
        [700, 380],
        [700, 300],
      ],
    },
    {
      name: "terrain 4",
      coord: [
        [800, 300],
        [880, 300],
        [880, 380],
        [800, 380],
        [800, 300],
      ],
    },
  ];

  const featuresList = lieu.map((lieu) => {
    return new Feature({
      geometry: new Polygon([lieu.coord]),
      name: lieu.name,
    });
  });

  //Tu récupère la source qui contient les features (ici features)
  const sourceVecteur = new VectorSource({ features: featuresList });
  //Pour afficher la source sur la carte
  const coucheVecteur = new VectorLayer({ source: sourceVecteur });
  //Pour ajouter la couche à la map
  map.addLayer(coucheVecteur);
});
</script>

<style>
body::-webkit-scrollbar {
  display: none;
}
.map {
  height: 800px;
  width: 900px;
  margin-left: 150px;
}
</style>
