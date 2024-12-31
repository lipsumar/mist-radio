<script setup lang="ts">
import BottomBar from "@/components/BottomBar.vue";
import EmptyState from "@/components/EmptyState.vue";
import MainSection from "@/components/MainSection.vue";
import SamplesList from "@/components/SamplesList.vue";
import SequencerList from "@/components/SequencerList.vue";
import { useSamplesStore } from "@/stores/samples";
import {
  useSequencerStore,
  type Layer,
  type LayerStep,
  type RegionStep,
  type SampleStep,
} from "@/stores/sequencer";

const samples = useSamplesStore();
const sequencer = useSequencerStore();

function getRandomStep(): LayerStep {
  const available = samples.samples
    .map((sample) => {
      if (sample.regions.length > 0) {
        return sample.regions.map((region) => ({
          sample,
          region,
          type: "region" as const,
        }));
      } else {
        return { sample, type: "sample" as const };
      }
    })
    .flat(); // for some reason TS doesn't like flatMap
  return available[Math.floor(Math.random() * available.length)];
}

function createLayer() {
  let steps = [];
  const step = getRandomStep();
  let stepCount = 0;
  while (stepCount === 0 || stepCount > 6) {
    steps = [];
    stepCount = 0;
    for (let i = 0; i < sequencer.stepLength; i++) {
      if (Math.random() > 0.8) {
        steps.push(step);
        stepCount++;
      } else {
        steps.push(null);
      }
    }
  }

  sequencer.addLayer(steps);
}
// function createLayer() {
//   const steps = [];
//   const step = getRandomStep();

//   // Different probabilities for different beat positions
//   const beatProbabilities = [
//     0.8, // Beat 1: high probability (downbeat)
//     0.3, // Beat 2
//     0.5, // Beat 3
//     0.3, // Beat 4
//     0.6, // Beat 5
//     0.3, // Beat 6
//     0.4, // Beat 7
//     0.3, // Beat 8
//   ];

//   for (let i = 0; i < sequencer.stepLength; i++) {
//     if (Math.random() < beatProbabilities[i]) {
//       steps.push(step);
//     } else {
//       steps.push(null);
//     }
//   }

//   sequencer.addLayer(steps);
// }
</script>

<template>
  <MainSection>
    <EmptyState
      v-if="samples.length === 0"
      message="Create samples then press +"
    />
    <SequencerList v-else />
  </MainSection>
  <BottomBar>
    <button
      class="round-button"
      :class="{
        'round-button--play': !sequencer.playing,
        'round-button--pause': sequencer.playing,
      }"
      @click="() => sequencer.togglePlay()"
    ></button>
    <button
      class="round-button round-button--plus"
      @click="() => createLayer()"
    ></button>
  </BottomBar>
</template>

<style>
.round-button--play::after {
  content: "";
  position: absolute;

  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 10px 0 10px 20px;
  border-color: transparent transparent transparent currentColor;
  transform: rotate(0deg);
}

.round-button--pause::before {
  content: "";
  position: absolute;

  width: 6px;
  height: 20px;
  background-color: currentColor;
  transform: translateX(-4px);
}
.round-button--pause::after {
  content: "";
  position: absolute;

  width: 6px;
  height: 20px;
  background-color: currentColor;
  transform: translateX(5px);
}

.round-button--plus {
  position: relative;
}
.round-button--plus::before,
.round-button--plus::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: currentColor;
}

.round-button--plus::after {
  width: 24px;
  height: 2px;
  margin-left: -12px;
  margin-top: -1px;
}

.round-button--plus::before {
  width: 2px;
  height: 24px;
  margin-top: -12px;
  margin-left: -1px;
}
</style>
