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
    containerWidth: Number,
    containerHeight: Number,
    transformStyles: Array
});

const cardStates = reactive([]);

onMounted(() => {
    props.images.forEach((_, i) => {
        const base = parseTransform(props.transformStyles[i] || 'none');
        cardStates[i] = { 
            x: base.x,
            rotate: base.rotate
        };
        gsap.set(`.card-${i}`, base);
    });

    gsap.from('.card', { 
        scale: 0,
        stagger: 0.06,
        ease: 'elastic.out(1,0.8)',
        delay: 0.5 
    });
});

function parseTransform(str) {
    const rotate = parseFloat((str.match(/rotate\(([-0-9.]+)deg\)/) || [0, 0])[1]);
    const x = parseFloat((str.match(/translate\(([-0-9.]+)px\)/) || [0, 0])[1]);
    return { rotate, x, scale: 1 };
}


const hoverCard = (hoveredIdx) => {
    const originX = cardStates[hoveredIdx].x;

    props.images.forEach((_, i) => {
        const base = cardStates[i];

        // Si la carte est déjà à la bonne position et la bonne scale, ne rien faire
        const currentX = gsap.getProperty(`.card-${i}`, "x");
        const currentScale = gsap.getProperty(`.card-${i}`, "scale");
        if (i === hoveredIdx && currentX === originX && currentScale === 1.1) return;

        gsap.killTweensOf(`.card-${i}`);

        if (i === hoveredIdx) {
            gsap.to(`.card-${i}`, { x: originX, rotate: 0, scale: 1.1, duration: 0.3, ease: "circ.out" });
            return;
        }
        if (i === hoveredIdx - 1) {
            gsap.to(`.card-${i}`, { x: originX - 300, rotate: base.rotate, scale: 1, duration: 0.3, ease: "circ.out" });
            return;
        }
        if (i === hoveredIdx + 1) {
            gsap.to(`.card-${i}`, { x: originX + 300, rotate: base.rotate, scale: 1, duration: 0.3, ease: "circ.out" });
            return;
        }

        const GAP = 50;
        if (i < hoveredIdx - 1) {
            const steps = (hoveredIdx - 1) - i;
            gsap.to(`.card-${i}`, { x: originX - 300 - steps * GAP, rotate: base.rotate, scale: 1, duration: 0.3, ease: "circ.out" });
        }
        if (i > hoveredIdx + 1) {
            const steps = i - (hoveredIdx + 1);
            gsap.to(`.card-${i}`, { x: originX + 300 + steps * GAP, rotate: base.rotate, scale: 1, duration: 0.3, ease: "circ.out" });
        }
    });
};


const resetCards = () => {
    props.images.forEach((_, i) => {
        const base = cardStates[i];
        gsap.killTweensOf(`.card-${i}`);
        gsap.to(`.card-${i}`, {
            x: base.x,
            rotate: base.rotate,
            scale: 1,
            duration: 0.3,
            ease: "circ.out"
        });
    });
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
    pointer-events: none;
}
</style>
