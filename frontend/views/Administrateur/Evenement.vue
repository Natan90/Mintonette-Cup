<template>
    <NavView></NavView>
    <MenuAdmin></MenuAdmin>
    <div class="main_content">
        <div class="editor_container">
            <div class="preview_container" v-if="imagePreview">
                <div class="image_preview_with_text">
                    <img v-if="imagePreview" :src="imagePreview" alt="Aperçu de l'image" />
                    <div class="texte_sur_image">
                        <h2 :style="{ color: colorTitle, fontFamily: selectedFont }">{{ title_evenement }}</h2>
                    </div>
                </div>
            </div>

            <div class="form_group">
                <label for="title">{{ $t('adminPage.evenement.nom') }}</label>
                <input type="text" id="title" v-model="title_evenement" placeholder="Ex: Mintonette Cup" />
            </div>
            <div class="form_group">
                <label for="color">{{ $t('adminPage.evenement.couleur') }}</label>
                <input type="color" id="color" v-model="colorTitle" />
            </div>
            <div class="form_group">
                <label for="police">{{ $t('adminPage.evenement.police') }}</label>
                <select id="police" v-model="selectedFont">
                    <option v-for="(font, index) in fonts" :key="index" :value="font" :style="{ fontFamily: font }">
                        {{ font }}
                    </option>
                </select>
            </div>

            <div class="form_group">
                <div class="chooseFile">
                    <label for="image">{{ $t('adminPage.evenement.imageCouverture') }}</label>
                    <span class="label_hint">{{ $t('adminPage.evenement.typeImage') }}</span>
                    <input type="file" ref="fileInput" id="fileInput" @change="onFileChange"
                        accept=".jpg,.jpeg,.png,.webp" hidden />
                    <button type="button" class="btn_chooseFile" @click="triggerFileSelect">
                        {{ !imagePreview ? $t('adminPage.evenement.choisirFichier') :
                            $t('adminPage.evenement.choisirAutreFichier') }}
                    </button>
                </div>

                <!-- <div class="container_button">
                    <button v-if="imagePreview && !showPreview" type="button" class="btn_show_preview pointer"
                        @click="showImagePreview">
                        {{ $t('adminPage.evenement.button.voir') }}
                    </button>
                    <button v-if="imagePreview && showPreview" type="button" class="btn_hide_preview pointer"
                        @click="hideImagePreview">
                        {{ $t('adminPage.evenement.button.cacher') }}
                    </button>
                    <button v-if="imagePreview" type="button" class="btn_remove_image pointer" @click="removeImage">
                        {{ $t('adminPage.evenement.button.supprimer') }}
                    </button>
                </div> -->
                <br>
            </div>

            <div class="form_group">
                <label>Description de l'évènement</label>
                <Editor v-model="descri_evenement" api-key="sd8q04ss2q9ej9zg4jvcgu10p2mxdckx4rgnbbhdrojqrgpo" :init="{
                    height: 450,
                    menubar: false,
                    plugins: 'lists link image table media code preview anchor',
                    toolbar: 'undo redo | bold italic underline | bullist numlist | link | table hr | preview code',
                    branding: false
                }" />
            </div>

            <div class="button_container">
                <button @click="updateEvent">
                    {{ $t('prestataireInfo.formulaire.btnModifier') }}
                </button>
            </div>
        </div>
    </div>
    <Footer></Footer>

</template>


<script setup>
import MenuAdmin from '@/components/MenuAdmin.vue';
import NavView from '@/components/NavView.vue';
import Editor from "@tinymce/tinymce-vue";

import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useI18n } from "vue-i18n";
import { color } from 'motion';
import Footer from '@/components/Footer.vue';

const { locale } = useI18n();

const evenementData = ref(null);
const title_evenement = ref('');
const colorTitle = ref('');
const imageFile = ref(null);
const descri_evenement = ref('');
const imagePreview = ref(null);

const fileInput = ref(null);
const fileName = ref("");

const fonts = [
    'Arial',
    'Georgia',
    'Verdana',
    'Times New Roman',
    'Courier New',
    'Meie Script'
];
const selectedFont = ref(null);

watch(() => locale.value,
    (newLang) => {
        updateDescription();
    })

function triggerFileSelect() {
    fileInput.value.click();
}

function onFileChange(event) {
    const file = event.target.files[0];
    if (!file) {
        fileName.value = "";
        imageFile.value = null;
        imagePreview.value = null;
        return;
    }

    fileName.value = file.name;
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
}


onMounted(async () => {
    try {
        await getValuesEvenement();
    } catch (err) {
        console.error(err);
    }
});


//=========================
//= Async functions event =
//=========================
async function getValuesEvenement() {
    try {
        const res = await axios.get("http://localhost:3000/admin/evenement/show");
        evenementData.value = res.data;
        title_evenement.value = res.data.nom_evenement;
        colorTitle.value = res.data.color_title;
        selectedFont.value = res.data.text_font;
        imagePreview.value = res.data.image_evenement;
        imageFile.value = null;

        updateDescription();
    } catch (err) {
        console.error(err);
    }
}

async function updateEvent() {
    try {
        const res = await axios.put("http://localhost:3000/admin/event/update", {
            title: title_evenement.value,
            descri: descri_evenement.value,
            color: colorTitle.value,
            font: selectedFont.value,
            image: imagePreview.value
        });
        message.value = res.data.message;
        messageType.value = "success";
    } catch (err) {
        if (err.response && err.response.data) {
            message.value = err.response.data.error;
        } else {
            message.value = "Erreur inconnue";
        }
        messageType.value = 'error';
    }
}

function updateDescription() {
    if (evenementData.value?.descri_evenement?.[locale.value]) {
        descri_evenement.value = evenementData.value.descri_evenement[locale.value].texte;
    } else {
        descri_evenement.value = '';
    }
}


</script>


<style scoped>
.main_content {
    margin-left: 250px;
}

.preview_container {
    margin-bottom: 20px;
}

.image_preview_with_text {
    position: relative;
    max-width: 600px;
    margin: auto;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.image_preview_with_text img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
}

.texte_sur_image {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: white;
    text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.7);
    padding: 10px;
}

.texte_sur_image h2 {
    font-size: 2em;
    margin: 0 0 10px 0;
}

.texte_sur_image p {
    font-size: 1em;
}

.chooseFile {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.container_button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.form_group button {
    margin-top: 8px;
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    font-size: 0.95em;
    font-weight: 600;
    transition: transform 0.2s ease;
}

.btn_chooseFile {
    color: white;
    background-color: #1e40af;
}

.btn_chooseFile:hover {
    background-color: #1e3a8a;
}
</style>