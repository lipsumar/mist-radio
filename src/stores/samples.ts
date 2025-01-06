import { computed, ref } from "vue";
import { defineStore } from "pinia";

export type Sample = {
  id: string;
  blob: Blob;
  regions: SampleRegion[];
  duration: number;
};
export type SampleRegion = {
  start: number;
  end: number;
};

export const useSamplesStore = defineStore("samples", () => {
  const samples = ref<Sample[]>([]);
  const length = computed(() => samples.value.length);
  async function addSample(sample: Blob) {
    if (sample.size === 0) {
      throw new Error("Sample is empty");
    }

    // calculate duration
    const audioContext = new AudioContext();
    const arrayBuffer = await sample.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const duration = audioBuffer.duration;
    audioContext.close();

    samples.value.push({
      blob: sample,
      id: new Date().toISOString(),
      regions: [],
      duration,
    });
  }
  function setSampleRegions(sampleId: string, regions: SampleRegion[]) {
    const sample = samples.value.find((s) => s.id === sampleId);
    if (!sample) {
      throw new Error("Sample not found");
    }
    sample.regions = regions;
  }

  return { addSample, length, samples, setSampleRegions };
});
