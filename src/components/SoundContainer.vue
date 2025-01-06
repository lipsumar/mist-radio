<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  duration: Number,
});
const durationHuman = computed(() => {
  if (!props.duration) return "0:00";
  const seconds = Math.floor(props.duration);
  const millis = Math.floor((props.duration - seconds) * 100);
  return `${(seconds % 60).toString().padStart(1, "0")}.${millis}s`;
});
</script>
<template>
  <div class="sound-container">
    <div class="sound-container__flex">
      <div class="sound-container__wave">
        <slot></slot>
      </div>
      <div class="sound-container__tools">
        <slot name="tools"></slot>
      </div>
    </div>
    <div v-if="duration" class="sound-container__duration">
      {{ durationHuman }}
    </div>
  </div>
</template>
<style>
.sound-container {
  background-color: #303030;
  border-radius: 3px;
  border: 1px solid #4c4c4c;
  position: relative;
}
.sound-container__flex {
  display: flex;
}

.sound-container__duration {
  position: absolute;
  top: 0;
  left: 0;
  padding: 2px 5px;
  background-color: rgba(48, 48, 48, 0.8);
  color: #fff;
  font-size: 12px;
  border-bottom-right-radius: 3px;
}

.sound-container__wave {
  flex: 1;
}
.sound-container__tools {
  display: flex;
  justify-content: center;
  align-items: center;
}
.sound-container__tools > * {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  border-left: 1px solid #4c4c4c;
}
</style>
