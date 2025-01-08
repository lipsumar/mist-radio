import { computed, ref } from "vue";
import { defineStore } from "pinia";

export type Sample = {
  id: string;
  blob: Blob;
  audioBuffer: AudioBuffer;
  regions: SampleRegion[];
  duration: number;
};
export type SampleRegion = {
  start: number;
  end: number;
};

export const useSamplesStore = defineStore("samples", () => {
  const samples = ref<Sample[]>([]);
  const samplesById = computed(() =>
    samples.value.reduce((acc, sample) => {
      acc[sample.id] = sample;
      return acc;
    }, {} as Record<string, Sample>)
  );
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
      audioBuffer,
    });
  }
  function setSampleRegions(sampleId: string, regions: SampleRegion[]) {
    const sample = samplesById.value[sampleId];
    if (!sample) {
      throw new Error("Sample not found");
    }
    sample.regions = regions;
  }
  function play(sampleId: string, region?: SampleRegion) {
    const sample = samplesById.value[sampleId];
    if (!sample) {
      throw new Error("Sample not found");
    }
    const start = region ? region.start : 0;
    const end = region ? region.end : sample.duration;

    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();

    const source = audioContext.createBufferSource();
    source.buffer = sample.audioBuffer;
    source.connect(audioContext.destination);

    source.start(0, start, end - start);

    source.onended = () => {
      source.disconnect();
      audioContext.close();
    };
  }

  return { addSample, length, samples, setSampleRegions, play };
});
