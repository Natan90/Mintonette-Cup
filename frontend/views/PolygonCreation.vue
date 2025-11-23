<template>
  <div id="app">
    <div class="toolbar">
      <button @click="startDrawing('Polygon')" :disabled="drawing">Dessiner un polygone</button>
      <button @click="stopDrawing" :disabled="!drawing">Terminer le dessin</button>
      <button @click="getPolygonCoords" :disabled="!lastPolygon">Récupérer les coordonnées</button>
    </div>

    <div ref="mapContainer" class="map"></div>

    <div class="coords" v-if="polygonCoords">
      <h3>Coordonnées :</h3>
      <pre>{{ polygonCoords }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";
import { Draw } from "ol/interaction.js";
import ImageLayer from "ol/layer/Image.js";
import ImageStatic from "ol/source/ImageStatic.js";
import { getCenter } from "ol/extent.js";
import { Projection, addProjection } from "ol/proj.js";

const mapContainer = ref(null);
const polygonCoords = ref(null);
const drawing = ref(false);
const lastPolygon = ref(null);

let map, vectorSource, drawInteraction;

onMounted(() => {
  const tailleMap = [0, 0, 2000, 1600];

  const projection = new Projection({
    code: "ImagePixels",
    units: "pixels",
    extent: tailleMap,
  });

  addProjection(projection);

  const imageLayer = new ImageLayer({
    source: new ImageStatic({
      url: "/MapTout.png", // ton image
      projection: projection,
      imageExtent: tailleMap,
    }),
  });

  vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  map = new Map({
    target: mapContainer.value,
    layers: [imageLayer, vectorLayer],
    view: new View({
      projection: projection,
      center: [1000, 800],
      minZoom: 1,
      maxZoom: 4,
      zoom: 2,
    }),
  });
});

function startDrawing(type) {
  stopDrawing();
  drawing.value = true;
  drawInteraction = new Draw({
    source: vectorSource,
    type,
  });
  map.addInteraction(drawInteraction);

  drawInteraction.on("drawend", (event) => {
    lastPolygon.value = event.feature;
    drawing.value = false;
  });
}

function stopDrawing() {
  if (drawInteraction) {
    map.removeInteraction(drawInteraction);
    drawInteraction = null;
    drawing.value = false;
  }
}

function getPolygonCoords() {
  if (!lastPolygon.value) return;
  const geom = lastPolygon.value.getGeometry();
  const coords = geom.getCoordinates()[0];
  polygonCoords.value = JSON.stringify(coords, null, 2);
}
</script>

<style>
# {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
}

.toolbar {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.toolbar button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: #0078ff;
  color: white;
  cursor: pointer;
}

.toolbar button:disabled {
  background: #aaa;
  cursor: not-allowed;
}


.map{
  width: 100%;
  height: 90vh;
}
.coords {
  background: #f9f9f9;
  padding: 10px;
  border-top: 1px solid #ccc;
  font-family: monospace;
  height: 200px;
  overflow: auto;
}
</style>
