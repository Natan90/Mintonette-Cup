<template>
  <div class="button">
    <!-- Bouton pour changer la map  -->
    <button @click="changeMap('prestataires')">Prestataires</button>
    <button @click="changeMap('terrains')">Terrains</button>
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
  {
    type: "stand",
    name: "Tribune Nord (VIP)",
    image: "/GradinNord.png",
    coord: [
      [132.5845215002734, 732.9238507783072],
      [167.24812135453584, 672.6067166865045],
      [179.72698704759483, 673.9933020882194],
      [228.94927324070667, 564.4518043944902],
      [483.380103152795, 564.4518043944902],
      [764.5558460235761, 563.9711973921046],
      [816.2140429569015, 669.4902245104562],
      [823.5414561539803, 670.9557650590579],
      [860.1784452718397, 733.9740816761296],
      [809.9857279032286, 738.3707033219347],
      [730.0671784422435, 742.4009513611995],
      [646.9011324337919, 744.5992621841021],
      [569.5970046841975, 746.431191713391],
      [471.94756142796746, 747.3352991104914],
      [382.91958178715123, 748.0680693847922],
      [312.9428595478822, 746.2361475425768],
      [241.1662147920025, 744.7287980731859],
      [144.81083732761462, 739.5994061530796],
      [129.7896602591622, 738.8666205046319],
      [132.5845215002734, 732.9238507783072],
    ],
  },
  {
    type: "stand",
    name: "Tribune Est",
    image: "/GradinEst.png",
    coord: [
      [1000.0183533690831, 563.7368703178712],
      [845.7201416903512, 532.6818601683672],
      [862.2173784196098, 318.2079825300115],
      [856.3947859543684, 279.3891791205899],
      [834.0749160390214, 250.275086744159],
      [837.1471498206777, 241.25638461367993],
      [872.489882445946, 215.19971214382684],
      [876.3595349761905, 223.45528553792428],
      [876.8755030803716, 233.51678996949448],
      [886.1626258525132, 230.16295515897104],
      [907.8326367214371, 229.64698723462084],
      [929.4106132604873, 233.85331305400473],
      [950.8303377945967, 243.43623136537997],
      [966.88808979894, 226.74655932233838],
      [989.3909252088789, 214.33064815373294],
      [1000.2454382866972, 212.21209524462427],
      [1000.0183533690831, 563.7368703178712],
    ],
  },
  {
    type: "stand",
    name: "Tribune Sud",
    image: "/GradinSud.png",
    coord: [
      [1.3940538722077065, 127.19543376205678],
      [119.24098613019876, 210.46032043704224],
      [174.82432977976896, 164.74090649206778],
      [220.1600915998898, 143.36741533023297],
      [299.17384480905645, 132.3568602697443],
      [371.06343366345766, 133.0045335844166],
      [682.7334074856001, 129.93795904710475],
      [773.4473907994039, 139.43165991944085],
      [840.1733009552373, 180.1980001001819],
      [849.1209198626013, 167.54741410411157],
      [851.8977697883565, 150.8856471157903],
      [850.0465106109718, 135.76664304351266],
      [842.0245342390739, 121.264746727115],
      [856.21727959258, 114.7851865005942],
      [868.5588175557959, 106.45429005912106],
      [882.1345196727532, 91.33528598684336],
      [888.3052886543613, 78.06759223489308],
      [891.3906601983917, 66.03411399470272],
      [912.9883127936989, 67.26830361183767],
      [932.4262104868945, 63.87425627009168],
      [946.3104212753524, 57.39468956991466],
      [965.4397844034997, 45.669752260351785],
      [981.4837630408431, 59.55454729452575],
      [1000.3045916039422, 67.2683165591502],
      [999.6875224738455, 0.6213133424275838],
      [60.111095940223734, -0.304315923111119],
      [43.450035226010115, 10.494972699944356],
      [28.02312571876338, 23.454106100298418],
      [12.287681646468357, 37.64745501241235],
      [-0.36237793502256466, 52.76645261103374],
      [1.3940538722077065, 127.19543376205678],
    ],
  },
  {
    type: "stand",
    name: "Tribune Ouest",
    image: "/GradinOuest.png",
    coord: [
      [1.2260519895663151, 571.3909687696703],
      [144.1661909878266, 531.0974317682259],
      [127.85760721908105, 320.03603693150797],
      [126.54472976011627, 303.82182779624173],
      [129.74842779109676, 291.0065360120683],
      [136.68975485375213, 279.79314869894927],
      [143.89807542345827, 270.18167706003226],
      [152.17425799455307, 258.9683009500609],
      [150.03846677568694, 252.5606550579741],
      [103.58496855596555, 221.32338343464153],
      [91.83810564952088, 212.24587621836014],
      [-0.010475320549097944, 154.83459317185364],
      [1.2260519895663151, 571.3909687696703],
    ],
  },
];

//Prestataires
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
      image: location.image,
    });
    return feature;
  });
}

onMounted(() => {
  //Création d'une nouvelle projection
  addProjection(projection);

  //Création d'une "couche" en gros ce qu'on l'on va afficher (une image fixe)
  const mapLayer = new ImageLayer({
    source: new ImageStatic({
      url: "/mapTerrain.png",
      projection: projection,
      imageExtent: tailleMap,
    }),
  });

  map = new Map({
    target: "map",
    layers: [mapLayer],
    view: new View({
      projection,
      center: [500, 400],
      minZoom: 1,
      maxZoom: 2,
      zoom: 1,
    }),
  });

  //On ajoute les tableaux des coordonnées
  const featuresList = features(landLocations);

  //Style hover et normal
  hoverStyle = new Style({
    stroke: new Stroke({ color: "#ffffff", width: 2 }),
    fill: new Fill({ color: "rgba(0,22,122,0.3)" }),
  });
  defaultStyle = new Style({
    stroke: new Stroke({ color: "#00167a", width: 2 }),
    fill: new Fill({ color: "rgba(0,22,122,0.5)" }),
  });
  standStyle = new Style({
    stroke: new Stroke({ color: "#ffff00", width: 2 }),
    fill: new Fill({ color: "rgba(255,255,0,0.5)" }),
  });
  standHoverStyle = new Style({
    stroke: new Stroke({ color: "#ffff00", width: 2 }),
    fill: new Fill({ color: "rgba(255,255,0,0.3)" }),
  });

  featuresList.forEach((f) => {
    if (f.get("type") === "stand") f.setStyle(standStyle);
    else f.setStyle(defaultStyle);
  });

  const sourceVecteur = new VectorSource({ features: featuresList });
  coucheVecteur = new VectorLayer({ source: sourceVecteur });
  map.addLayer(coucheVecteur);

  // Hover name
  lastFeature = null;
  label = document.getElementById("hoverName");
  map.on("pointermove", (event) => {
    const searchFeature = map.forEachFeatureAtPixel(
      event.pixel,
      (featureFound) => featureFound
    );
    const mapElement = document.getElementById("map");

    if (searchFeature !== lastFeature) {
      if (lastFeature) {
        if (lastFeature.get("type") === "stand")
          lastFeature.setStyle(standStyle);
        else lastFeature.setStyle(defaultStyle);
      }
    }

    if (searchFeature) {
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

  // Gestion du clic
  map.on("click", (event) => {
    const clickedFeature = map.forEachFeatureAtPixel(
      event.pixel,
      (featureFound) => featureFound
    );
    if (!clickedFeature) return;

    const type = clickedFeature.get("type");

    if (type === "stand") {
      // Récupère l'image du gradin
      const image = clickedFeature.get("image");
      const geometry = clickedFeature.getGeometry();
      // Appelle changeMap avec cette image
      changeMap("stand", image);
    } else {
      //Si c’est un terrain ou prestataire → redirection
      const url = clickedFeature.get("url");
      if (url) router.push(url);
    }
  });
});
function changeMap(type, image = null) {
  if (!map) return;

  // Supprime la couche de zones
  if (coucheVecteur) {
    map.removeLayer(coucheVecteur);
    coucheVecteur = null;
  }

  // Supprime la couche d'image actuelle
  const oldImageLayer = map.getLayers().item(0);
  if (oldImageLayer) map.removeLayer(oldImageLayer);

  // Définit l'image à afficher
  let imageUrl = "/mapTerrain.png";
  if (type === "prestataires") imageUrl = "/MapPresta.png";
  if (type === "stand" && image) imageUrl = image; // image spécifique au gradin

  // Ajoute la nouvelle image
  const newImageLayer = new ImageLayer({
    source: new ImageStatic({
      url: imageUrl,
      projection: projection,
      imageExtent: tailleMap,
    }),
  });
  map.getLayers().insertAt(0, newImageLayer);

  if (type === "terrains" || type === "prestataires") {
    // Détermine quelle liste de zones utiliser
    let zone = landLocations;
    if (type === "prestataires") zone = serviceLocation;
    // if (type === "")  ICI IL FAUT QUE SI CEST LA ZONE GRADIN NORD JAFFICHE LES BONS POLYGONES 
    // Crée les polygones pour chaque zone
    const featuresList = features(zone);
    featuresList.forEach((f) => {
      if (f.get("type") === "stand") f.setStyle(standStyle);
      else f.setStyle(defaultStyle);
    });

    // Crée la couche vectorielle contenant les polygones
    const sourceVecteur = new VectorSource({ features: featuresList });
    coucheVecteur = new VectorLayer({ source: sourceVecteur });
    map.addLayer(coucheVecteur);
  }

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
  z-index: 9999;
  position: absolute;
  padding: 4px;
  border-radius: 6px;
}
</style>
