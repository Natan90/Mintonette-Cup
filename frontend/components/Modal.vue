<template>
    <div v-if="modelValue" class="modal-backdrop">
        <div class="modal-content" :class="{ bigger: bigger, medium: medium }">
            <span class="modal-close" @click="close">&times;</span>

            <slot name="content"></slot>
        </div>
    </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  bigger: {
    type: Boolean,
    default: false
  },
  medium: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}
</script>
