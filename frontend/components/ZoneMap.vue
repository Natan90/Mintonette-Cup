<template>
  <div class="zone-map-container">
    <div class="map-header">
      <h3>Plan des zones prestataires</h3>
      <div class="legend">
        <span class="legend-item">
          <span class="legend-color available"></span>
          Disponible ({{ zones.filter((z) => !z.occupied).length }})
        </span>
        <span class="legend-item">
          <span class="legend-color occupied"></span>
          Occupée ({{ zones.filter((z) => z.occupied).length }})
        </span>
        <span class="legend-item" style="color: #6b7280">
          Prestataires sans zone: {{ availablePrestataires.length }}
        </span>
      </div>
    </div>

    <div v-if="zones.length === 0" class="loading-message">
      <p>Chargement des zones...</p>
      <p style="font-size: 12px; color: #9ca3af">
        Si ce message persiste, vérifiez la console pour les erreurs
      </p>
    </div>

    <div v-else class="zone-map">
      <div class="side-zone left-zone">
        <div class="zone-label">Zone Prestataire Gauche</div>
        <div class="zones-grid">
          <div
            v-for="zone in leftZones"
            :key="zone.id_zone"
            :class="['zone-box', { occupied: zone.occupied }]"
            @click="selectZone(zone)">
            <span class="zone-number">{{ zone.id_zone }}</span>
            <span v-if="zone.occupied" class="zone-presta">
              {{ zone.prestataire.nom_prestataire }}
            </span>
          </div>
        </div>
      </div>

      <div class="center-zone">
        <div class="gymnase">
          <div class="zone-label">Gymnase</div>
          <div class="terrains">
            <div class="terrain">T1</div>
            <div class="terrain">T2</div>
            <div class="terrain">T3</div>
            <div class="terrain">T4</div>
          </div>
        </div>
      </div>

      <div class="side-zone right-zone">
        <div class="zone-label">Zone Prestataire Droite</div>
        <div class="zones-grid">
          <div
            v-for="zone in rightZones"
            :key="zone.id_zone"
            :class="['zone-box', { occupied: zone.occupied }]"
            @click="selectZone(zone)">
            <span class="zone-number">{{ zone.id_zone }}</span>
            <span v-if="zone.occupied" class="zone-presta">
              {{ zone.prestataire.nom_prestataire }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Zone {{ selectedZone?.id_zone }}</h3>
          <span class="modal-close" @click="closeModal">&times;</span>
        </div>

        <div class="modal-body">
          <div v-if="selectedZone?.occupied" class="current-assignment">
            <p>
              <strong>Actuellement occupée par :</strong><br />
              {{ selectedZone.prestataire.nom_prestataire }}
            </p>
            <button @click="unassignZone" class="btn btn-warning">
              Libérer cette zone
            </button>
          </div>

          <div v-else class="assign-section">
            <label for="prestaSelect">Attribuer à un prestataire :</label>
            <p
              v-if="availablePrestataires.length === 0"
              style="
                color: #f59e0b;
                padding: 10px;
                background: #fef3c7;
                border-radius: 6px;
              ">
              ⚠️ Aucun prestataire disponible (tous ont déjà une zone attribuée)
            </p>
            <select v-else id="prestaSelect" v-model="selectedPrestataire">
              <option :value="null">-- Choisir un prestataire --</option>
              <option
                v-for="presta in availablePrestataires"
                :key="presta.id_prestataire"
                :value="presta.id_prestataire">
                {{ presta.nom_prestataire }} - {{ presta.prenom_utilisateur }}
                {{ presta.nom_utilisateur }}
              </option>
            </select>
            <button
              v-if="availablePrestataires.length > 0"
              @click="assignZone"
              class="btn btn-primary"
              :disabled="!selectedPrestataire">
              Attribuer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import prestatairesData from "../../backend/database/jsonData/Prestataire.json";
import zoneData from "../../backend/database/jsonData/Zone.json";
// import axios from "axios";

const zones = ref([]);
const prestataires = ref([]);
const showModal = ref(false);
const selectedZone = ref(null);
const selectedPrestataire = ref(null);

const leftZones = computed(() => {
  const filtered = zones.value.filter((z) => z.id_zone >= 1 && z.id_zone <= 16);
  const sorted = filtered.sort((a, b) => a.id_zone - b.id_zone);

  const rows = [];
  for (let i = 0; i < sorted.length; i += 4) {
    rows.push(sorted.slice(i, i + 4));
  }

  return rows.reverse().flat();
});

const rightZones = computed(() => {
  const filtered = zones.value.filter(
    (z) => z.id_zone >= 17 && z.id_zone <= 32
  );
  const sorted = filtered.sort((a, b) => a.id_zone - b.id_zone);

  const rows = [];
  for (let i = 0; i < sorted.length; i += 4) {
    rows.push(sorted.slice(i, i + 4));
  }

  return rows.reverse().flat();
});

const availablePrestataires = computed(() => {
  const available = prestataires.value.filter((p) => {
    const hasZone = p.id_zone !== null && p.id_zone !== undefined;
    const isWaiting = p.waitingforadmin === true;
    return !hasZone && !isWaiting;
  });

  return available;
});

onMounted(() => {
  loadZones();
  loadPrestataires();
});

function loadZones() {
  zones.value = zoneData.map((zone) => {
    const presta = prestatairesData.find(
      (p) => p.id_zone === zone.id_zone && !p.waitingforadmin
    );
    return {
      ...zone,
      occupied: !!presta,
      prestataire: presta || null,
    };
  });
}

function loadPrestataires() {
  prestataires.value = prestatairesData;
}

// async function loadZones() {
//   try {
//     const res = await axios.get(
//       "http://localhost:3000/admin/prestataire/zones"
//     );
//     zones.value = res.data.zones;
//   } catch (err) {
//     console.error("Détails:", err.response?.data || err.message);
//   }
// }

// async function loadPrestataires() {
//   try {
//     const res = await axios.get("http://localhost:3000/prestataire/show");
//     prestataires.value = res.data;
//   } catch (err) {
//     console.error("Détails:", err.response?.data || err.message);
//   }
// }
watch(loadPrestataires);
function selectZone(zone) {
  selectedZone.value = zone;
  selectedPrestataire.value = null;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedZone.value = null;
  selectedPrestataire.value = null;
}

function assignZone() {
  if (!selectedPrestataire.value || !selectedZone.value) return;

  loadPrestataires();
  loadZones();

  closeModal();
}

function unassignZone() {
  if (!selectedZone.value?.prestataire) return;

  loadPrestataires();
  loadZones();

  closeModal();
}

// async function assignZone() {
//   if (!selectedPrestataire.value || !selectedZone.value) return;

//   try {
//     const response = await axios.patch(
//       "http://localhost:3000/admin/prestataire/assignzone",
//       {
//         id_prestataire: selectedPrestataire.value,
//         id_zone: selectedZone.value.id_zone,
//       }
//     );

//     prestataires.value = [];
//     zones.value = [];

//     await loadPrestataires();
//     await loadZones();

//     closeModal();
//   } catch (err) {
//     console.error("Erreur attribution:", err);
//     if (err.response?.status === 409) {
//       alert("Cette zone est déjà occupée");
//     } else {
//       alert("Erreur lors de l'attribution");
//     }
//   }
// }

// async function unassignZone() {
//   if (!selectedZone.value?.prestataire) return;

//   try {
//     const response = await axios.patch(
//       `http://localhost:3000/admin/prestataire/unassignzone/${selectedZone.value.prestataire.id_prestataire}`
//     );

//     prestataires.value = [];
//     zones.value = [];

//     await loadPrestataires();
//     await loadZones();

//     closeModal();
//   } catch (err) {
//     console.error("Erreur libération zone:", err);
//     alert("Erreur lors de la libération de la zone");
//   }
// }
</script>

<style scoped>
.zone-map-container {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e5e7eb;
}

.map-header h3 {
  margin: 0;
  color: #111827;
  font-size: 1.5rem;
}

.legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid #d1d5db;
}

.legend-color.available {
  background: #d1fae5;
}

.legend-color.occupied {
  background: #fee2e2;
}

.zone-map {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  min-height: 500px;
  align-items: start;
}

.side-zone {
  background: #f9fafb;
  border-radius: 8px;
  padding: 15px;
  border: 2px solid #e5e7eb;
  height: fit-content;
}

.zone-label {
  text-align: center;
  font-weight: 600;
  color: #374151;
  margin-bottom: 15px;
  padding: 8px;
  background: #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
}

.zones-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.zone-box {
  aspect-ratio: 1;
  background: #d1fae5;
  border: 2px solid #10b981;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 4px;
  position: relative;
  min-height: 45px;
  max-height: 70px;
}

.zone-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.zone-box.occupied {
  background: #fee2e2;
  border-color: #ef4444;
}

.zone-number {
  font-weight: 700;
  font-size: 14px;
  color: #111827;
}

.zone-presta {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  margin-top: 4px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.center-zone {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20px;
}

.gymnase {
  width: 100%;
  max-width: 280px;
  background: #dbeafe;
  border: 3px solid #3b82f6;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.gymnase .zone-label {
  background: #3b82f6;
  color: white;
  font-size: 14px;
  margin-bottom: 10px;
}

.terrains {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.terrain {
  background: white;
  border: 2px solid #60a5fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: #1e40af;
  padding: 20px;
  min-height: 60px;
}

.loading-message {
  text-align: center;
  padding: 60px 20px;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px dashed #d1d5db;
}

.loading-message p {
  margin: 10px 0;
  color: #6b7280;
  font-size: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  color: #1e40af;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #111827;
  font-size: 1.5rem;
}

.modal-close {
  font-size: 28px;
  color: #9ca3af;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #ef4444;
}

.modal-body {
  padding: 20px;
}

.current-assignment {
  text-align: center;
}

.current-assignment p {
  margin-bottom: 20px;
  padding: 15px;
  background: #fef3c7;
  border-radius: 8px;
  color: #92400e;
}

.assign-section label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #374151;
}

.assign-section select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 15px;
  background: white;
  cursor: pointer;
}

.assign-section select:focus {
  outline: none;
  border-color: #3b82f6;
}

.btn {
  width: 100%;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

@media (max-width: 1024px) {
  .zone-map {
    grid-template-columns: 1fr;
  }

  .zones-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
