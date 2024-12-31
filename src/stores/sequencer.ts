import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Sample, SampleRegion } from "./samples";
import { playRegion, playSample } from "@/lib/play";

export type Layer = {
  id: string;
  steps: LayerStep[];
};
export type LayerStep = SampleStep | RegionStep | null;

export type SampleStep = { type: "sample"; sample: Sample };
export type RegionStep = {
  type: "region";
  sample: Sample;
  region: SampleRegion;
};

export const useSequencerStore = defineStore("sequencer", () => {
  const playing = ref(false);
  const layers = ref<Layer[]>([]);
  const currentStep = ref(0);
  function addLayer(steps: Layer["steps"]) {
    layers.value.push({
      id: new Date().toISOString(),
      steps,
    });
  }
  function removeLayer(layerId: string) {
    layers.value = layers.value.filter((layer) => layer.id !== layerId);
  }
  let playInterval = 0;
  function play() {
    playing.value = true;
    currentStep.value = -1;
    playInterval = setInterval(step, 400);
  }
  function pause() {
    playing.value = false;
    clearInterval(playInterval);
  }
  function togglePlay() {
    if (playing.value) {
      pause();
    } else {
      play();
    }
  }
  function step() {
    currentStep.value = (currentStep.value + 1) % 8;
    const steps = layers.value
      .map((layer) => layer.steps[currentStep.value])
      .filter((step): step is Exclude<typeof step, null> => step !== null);
    steps.forEach((step) => {
      if (step.type === "sample") {
        playSample(step.sample.blob);
      } else {
        playRegion(step.sample.blob, step.region.start, step.region.end);
      }
    });
  }

  return {
    playing,
    addLayer,
    play,
    pause,
    stepLength: 8,
    layers,
    currentStep,
    togglePlay,
    removeLayer,
  };
});
