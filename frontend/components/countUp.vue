<template>
  <span :class="props.class" ref="el"></span>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { animate } from "motion";

const props = defineProps({
  from: { type: Number, default: 0 },
  to: { type: Number, required: true },
  duration: { type: Number, default: 2 },
  separator: { type: String, default: "" },
  class: { type: String, default: "" },
});

const el = ref(null);


function formatValue(number, separator) {
  const formatted = Intl.NumberFormat("en-US").format(number);
  return separator ? formatted.replace(/,/g, separator) : formatted;
}

onMounted(() => {
  if (!el.value) return;

  animate(0, 1, {
    duration: props.duration,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    onUpdate(progress) {
      const easedValue = props.from + (props.to - props.from) * progress;
      el.value.textContent = formatValue(
        Math.round(easedValue),
        props.separator
      );
    },
  });
});
</script>
