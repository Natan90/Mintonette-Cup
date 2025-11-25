<template>
    <div class="bounceCardsContainer" :style="{ width: containerWidth + 'px', height: containerHeight + 'px' }">
        <div v-for="(src, idx) in images" :key="idx" :class="['card', `card-${idx}`]"
            :style="{ zIndex: images.length - idx }" @mouseenter="hoverCard(idx)" @mouseleave="resetCards">
            <img class="image" :src="src" :alt="`card-${idx}`" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
    images: { type: Array, default: () => [] },
    containerWidth: { type: Number, default: 400 },
    containerHeight: { type: Number, default: 400 },
    transformStyles: {
        type: Array,
    },
    enableHover: { type: Boolean, default: true }
});

const cardStates = reactive([]);

// Animation d'apparition
onMounted(() => {
    props.images.forEach((_, i) => {
        const baseTransform = props.transformStyles[i] || 'none';
        gsap.set(`.card-${i}`, parseTransform(baseTransform));
    });

    gsap.from('.card', { scale: 0, stagger: 0.06, ease: 'elastic.out(1,0.8)', delay: 0.5 });
});

function parseTransform(str) {
    const rotate = (str.match(/rotate\(([-0-9.]+)deg\)/) || [0, 0])[1];
    const translateX = (str.match(/translate\(([-0-9.]+)px\)/) || [0, 0])[1];
    return { rotate: parseFloat(rotate), x: parseFloat(translateX), scale: 1 };
}


// Hover : carte survolée à rotate 0, les autres sont repoussées
const hoverCard = (hoveredIdx) => {
    const hoverX = cardStates[hoveredIdx].x;

    props.images.forEach((_, i) => {
        gsap.killTweensOf(`.card-${i}`);
        if (i === hoveredIdx) {
            gsap.to(`.card-${i}`, { scale: 1.1, rotate: 0, duration: 0.4, ease: 'back.out(1.4)' });
        } else {
            const direction = i < hoveredIdx ? -1 : 1;
            const distance = Math.abs(i - hoveredIdx) * 160;
            gsap.to(`.card-${i}`, { x: hoverX + direction * distance, duration: 0.4, ease: 'back.out(1.4)' });
        }
    });
};

const resetCards = () => {
    props.images.forEach((_, i) => {
        gsap.killTweensOf(`.card-${i}`);
        const baseTransform = parseTransform(props.transformStyles[i] || 'none');
        gsap.to(`.card-${i}`, { ...baseTransform, scale: 1, duration: 0.4, ease: 'back.out(1.4)' });
    });
};


// Extraire rotation depuis la string transform
const getRotate = (transformStr) => {
    const match = transformStr.match(/rotate\(([-0-9.]+)deg\)/);
    return match ? parseFloat(match[1]) : 0;
};
</script>

<style scoped>
.bounceCardsContainer {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
    position: absolute;
    width: 200px;
    aspect-ratio: 1;
    border: 5px solid #fff;
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

.card .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
