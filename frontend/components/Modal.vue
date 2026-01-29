<template>
    <div v-if="modelValue" class="modal-backdrop">
        <div class="modal-content" :class="{ bigger: bigger }">
            <span class="modal-close" @click="close">&times;</span>

            <slot name="contentDelete"></slot>
        </div>
    </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  bigger: Boolean
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}
</script>
