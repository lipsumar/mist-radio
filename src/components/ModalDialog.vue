<script setup lang="ts">
defineProps({
  isOpen: Boolean,
});

defineEmits(["close"]);
</script>

<template>
  <div class="modal-backdrop" v-if="isOpen" @click="$emit('close')"></div>
  <div class="modal-dialog" v-if="isOpen">
    <div class="modal-dialog__content">
      <slot></slot>
    </div>
  </div>
</template>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(47, 47, 47, 0.9);
  padding: 1em;
  z-index: 1001;
  border-radius: 3px;
}

.modal-dialog__content {
  min-width: 300px;
  max-width: 500px;
  margin: 0 auto;
}
</style>
