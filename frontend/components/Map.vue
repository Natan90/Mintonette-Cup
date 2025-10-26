<template>
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

  //Style quand on hover
  const hoverStyle = new Style({
    stroke: new Stroke({ color: "#ffffff", width: 2 }),
    fill: new Fill({ color: "rgba(0,22,122,0.3)" }),
  });
  //Couleur par defaut
  const defaultStyle = new Style({
    stroke: new Stroke({ color: "#00167a", width: 2 }),
    fill: new Fill({ color: "rgba(0,22,122,0.5)" }),
  });
  featuresList.forEach((f) => f.setStyle(defaultStyle));

  //Tu récupère la source qui contient les features (ici features)
  const sourceVecteur = new VectorSource({ features: featuresList });
  //Pour afficher la source sur la carte
  const coucheVecteur = new VectorLayer({ source: sourceVecteur });
  //Pour ajouter la couche à la map
  map.addLayer(coucheVecteur);

  //Pour le nom avec le hover
  let lastFeature = null;
  const label = document.getElementById("hoverName");
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
      searchFeature.setStyle(defaultStyle);
    }
    lastFeature = searchFeature;
  });
});
</script>

<style>
body::-webkit-scrollbar {
  display: none;
}
/* Taille de la map sur la page */
.map {
  height: 800px;
  width: 900px;
  margin-left: 150px;
  border: 2px solid #00167a;
  border-radius: 8px;
}

.hoverName {
  z-index: 9999;
  position: absolute;
  background-color: #00167a; /* couleur principale */
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>
