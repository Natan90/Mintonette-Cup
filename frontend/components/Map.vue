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
import { defaults as defaultInteractions } from "ol/interaction.js";

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

// Gradin du nord (VIP)
const NorthStand = [
  {
    type: "stand",
    name: "PrixCher",
    url: "../PrixCher",
    coord: [
      [197.24300002303798, 116.1750271862619],
      [865.2774427711763, 106.96035246067026],
      [931.3129821821058, 424.865857169274],
      [619.5636099348471, 435.6162895345668],
      [390.74260149499014, 440.2235946755164],
      [131.20733173008654, 437.15201495242155],
      [197.24300002303798, 116.1750271862619],
    ],
  },
  {
    type: "stand",
    name: "PrixPasCher",
    url: "../PrixPasCher",
    coord: [
      [71.3409777832273, 633.9786521287269],
      [125.84305712384845, 433.4803333811623],
      [931.6960061781832, 427.6405206158932],
      [982.3052023694979, 626.1922759493611],
      [723.4200192068453, 665.1239934822174],
      [608.5763316051754, 670.9637245655003],
      [540.4485486525774, 672.9103696615832],
      [448.9628133754436, 678.7501415858593],
      [384.7281586079139, 678.7501415858593],
      [277.6704006620311, 678.7501415858593],
      [149.2011728055591, 665.1239934822174],
      [69.21194389795662, 650.8896410092548],
      [71.3409777832273, 633.9786521287269],
    ],
  },
];

const EstStand = [
  {
    type: "stand",
    name: "PrixCher",
    url: "../PrixCher",
    coord: [
      [176.2836981541086, 519.054598490954],
      [649.6104307988468, 581.7034056617854],
      [734.8788253861468, 576.4826595602901],
      [766.2019985249719, 557.3399725371781],
      [807.9660833357045, 531.2363150532578],
      [835.8088065428594, 508.61310628796366],
      [845.4884817662023, 497.89978584667733],
      [848.9688281811249, 462.2247232047992],
      [849.8389421675968, 438.2963230777052],
      [847.6636937117387, 416.97828225616297],
      [846.4152385574275, 390.86777720478256],
      [844.0825819424379, 357.4316519258961],
      [807.5377153137485, 266.4545355451752],
      [767.1051094116137, 318.55255979132727],
      [745.3336911747847, 344.2128013859724],
      [728.2275861679349, 353.5437671839371],
      [708.0112505895615, 359.7644545541319],
      [691.6827195392457, 358.2092908687491],
      [667.5787099420388, 358.2092908687491],
      [663.3005712437969, 328.3010299429247],
      [217.3392274778982, 283.07923971076605],
      [176.2836981541086, 519.054598490954],
    ],
  },
  {
    type: "stand",
    name: "PrixPasCher",
    url: "../PrixPasCher",
    coord: [
      [129.90687999905307, 803.8515706700118],
      [169.68670075878504, 528.2237127953586],
      [649.8841346100088, 585.0541971112393],
      [689.6638361396125, 576.5296632152614],
      [715.3252597226889, 569.3370448904197],
      [738.7668567779774, 555.1294387158358],
      [765.0498270196294, 542.3425484455515],
      [789.2017971790409, 524.5830183707424],
      [814.0640808275111, 489.77436088643225],
      [831.8228718950082, 469.88368243324226],
      [843.188483870591, 447.8618854104441],
      [852.4230957639331, 432.943906379324],
      [851.002349555687, 497.58855173464656],
      [845.3195435678958, 530.2660906493484],
      [838.2160509869225, 569.3370448904197],
      [822.5883196167302, 606.9872385140328],
      [814.7744539316341, 626.1675292063005],
      [848.3872822325179, 660.4166984713595],
      [860.9840817964853, 695.0593057795965],
      [876.7301803608036, 726.5526482229377],
      [889.326979924771, 783.2407207852596],
      [892.4626851440032, 801.2505423310827],
      [129.90687999905307, 803.8515706700118],
    ],
  },
];

const SouthStand = [
  {
    type: "stand",
    name: "PrixPasCher",
    url: "../PrixPasCher",
    coord: [
      [104.82777916200078, 677.7304861903494],
      [175.94737474596255, 499.9244375117187],
      [206.65790264532072, 459.51399348445597],
      [248.68323536959306, 415.87064746393986],
      [314.9534932361298, 398.0900425960768],
      [279.39376326895126, -1.165332954076007],
      [53.10458490050641, -2.7817330799840647],
      [24.010322040817016, 69.95708651737618],
      [1.3813906390120678, 147.5451743200856],
      [-5.084076468477065, 435.26772028533577],
      [104.82777916200078, 677.7304861903494],
    ],
  },
  {
    type: "stand",
    name: "PrixCher",
    url: "../PrixCher",
    coord: [
      [318.6920824648939, 421.088332880612],
      [677.9478983264328, 417.27979907337374],
      [721.5780027057792, 1.3023276266873154],
      [279.9184339521871, 2.8686752154718533],
      [318.6920824648939, 421.088332880612],
    ],
  },
  {
    type: "stand",
    name: "PrixPasCher",
    url: "../PrixPasCher",
    coord: [
      [688.29094927702, 393.4628795562422],
      [737.1463528644142, 403.82652175911016],
      [774.1580335438689, 431.9566118647797],
      [799.3259913153839, 467.48929023133127],
      [815.6111258445154, 503.0219375351612],
      [840.7789593703143, 557.8015131187032],
      [847.2560128076475, 580.934776161769],
      [853.9181302394352, 526.8954873607648],
      [851.6974244288392, 479.51856216354827],
      [850.2169745960614, 443.2456436085414],
      [839.8537015208997, 408.45322096180587],
      [854.6583862172533, 381.0634487013957],
      [865.7322139998934, 352.797961098832],
      [876.9994412939236, 315.6150743869625],
      [884.8862545514512, 278.4321640348503],
      [889.393126557656, 248.0098193725882],
      [887.1397378330716, 218.71421595843213],
      [910.8006503908342, 218.71421595843213],
      [931.0812434691302, 204.06643789159682],
      [946.8551536552932, 188.29182401568454],
      [960.3756751168719, 154.48920832861876],
      [963.7558054822666, 135.3343707083883],
      [973.8961965784506, 172.51730470074318],
      [980.6563627522039, 193.92557753670036],
      [994.1768842137825, 213.08046243741632],
      [1000.9371449445719, 2.377437736822685],
      [719.2603394322928, 0.12390796012527971],
      [688.29094927702, 393.4628795562422],
    ],
  },
];

const WestStand = [
  {
    type: "stand",
    name: "PrixCher",
    url: "../PrixCher",
    coord: [
      [839.6821741164738, 482.92883322719194],
      [801.1279840049184, 242.69693902852543],
      [399.2753409262989, 316.8426115054865],
      [347.3754552631474, 318.3255075318841],
      [314.75272687869, 297.56471426029464],
      [296.9585905890613, 257.5260859690187],
      [270.26719948586924, 221.93614575693573],
      [202.0561985221546, 402.8515144191345],
      [231.71313382014657, 474.0313948433005],
      [270.26719948586924, 525.9333469095216],
      [332.5469876141514, 571.9036526446466],
      [379.9983080934376, 585.2498724459895],
      [408.17234684819687, 585.2498724459895],
      [405.2066782075642, 560.0403288697013],
      [839.6821741164738, 482.92883322719194],
    ],
  },
  {
    type: "stand",
    name: "PrixPasCher",
    url: "../PrixPasCher",
    coord: [
      [72.98403140543218, 785.9660750072215],
      [179.78904173433452, 447.4003020663923],
      [224.12317781939123, 509.8737759485066],
      [264.42681489940077, 564.2861700658598],
      [320.8521097569834, 600.5610712893711],
      [363.1711654608242, 618.698437336954],
      [397.4292231545708, 622.7290195014209],
      [397.08909551511084, 588.0103691005053],
      [414.3005327357872, 586.6863188336126],
      [414.3005327357872, 570.7982434287158],
      [838.9589837791252, 494.2538930170706],
      [882.6494910831271, 785.5360902859293],
      [72.98403140543218, 785.9660750072215],
    ],
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
      maxZoom: 1,
      zoom: 1,
    }),
    interactions: defaultInteractions({
      //Enleve tous 
      dragPan: false, //Déplacement
      mouseWheelZoom: false, // Zoom molette
      doubleClickZoom: false, // Désactive le zoom double clic
      pinchZoom: false, // Désactive le zoom tactile
      keyboard: false,
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
    stroke: new Stroke({ color: "#000000", width: 2 }),
    fill: new Fill({ color: "rgba(0,0,0,0.3)" }),
  });
  standHoverStyle = new Style({
    stroke: new Stroke({ color: "#000000", width: 2 }),
    fill: new Fill({ color: "rgba(0,0,0,0.5)" }),
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
        label.style.backgroundColor = "#000000";
        label.style.color = "white";
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

  // Détermine quelle liste de zones afficher
  let zone = [];
  if (type === "terrains") zone = landLocations;
  else if (type === "prestataires") zone = serviceLocation;
  else if (type === "stand" && image === "/GradinNord.png") zone = NorthStand;
  else if (type === "stand" && image === "/GradinEst.png") zone = EstStand;
  else if (type === "stand" && image === "/GradinSud.png") zone = SouthStand;
  else if (type === "stand" && image === "/GradinOuest.png") zone = WestStand;

  // Si aucune zone à afficher, on s'arrête ici
  if (zone.length === 0) return;

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
