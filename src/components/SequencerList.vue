<script setup lang="ts">
import { useSequencerStore } from "@/stores/sequencer";

const sequencer = useSequencerStore();
</script>

<template>
  <div class="sequencer-list">
    <div class="sequencer-list__layers">
      <div
        v-for="(layer, index) in sequencer.layers"
        :key="index"
        class="sequencer-list__layer"
      >
        <div
          v-for="(step, stepIndex) in layer.steps"
          :key="stepIndex"
          class="sequencer-list__step"
          :class="{
            filled: step !== null,
            active: sequencer.currentStep === stepIndex,
          }"
        ></div>
        <div
          class="sequencer-list__step sequencer-list__step--delete"
          @click="sequencer.removeLayer(layer.id)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style>
.sequencer-list {
  width: 80vw;
  max-width: 800px;
  margin: 2rem auto;
}
.sequencer-list__layer {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  margin-bottom: 10px;
  gap: 10px;
}
.sequencer-list__step {
  width: 100%;
  aspect-ratio: 1 / 1; /* Ensures the element is a square */
  background-color: rgba(255, 255, 255, 0.1);
}
.sequencer-list__step.filled {
  background-color: rgba(255, 255, 255, 0.7);
}
.sequencer-list__step.active {
  background-color: rgba(118, 92, 236, 0.2);
}
.sequencer-list__step.filled.active {
  background-color: rgba(118, 92, 236, 0.8);
}

/* Delete button, with a big cross */
.sequencer-list__step--delete {
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  background-color: rgba(255, 255, 255, 0);
}
.sequencer-list__step--delete::before,
.sequencer-list__step--delete::after {
  content: "";
  position: absolute;
  left: calc(50% - 1px);
  width: 2px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
}
.sequencer-list__step--delete::before {
  transform: rotate(45deg);
}
.sequencer-list__step--delete::after {
  transform: rotate(-45deg);
}
</style>
