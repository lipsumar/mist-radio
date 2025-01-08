<script setup lang="ts">
import { useSamplesStore, type Sample } from "@/stores/samples";
import AudioWaveform from "./AudioWaveform.vue";
import IconSplit from "./icons/IconSplit.vue";
import { detectAudioSegments } from "@/lib/detectAudioSegments";
import SampleRegions from "./SampleRegions.vue";
import SoundContainer from "./SoundContainer.vue";
import { ref } from "vue";
import ModalDialog from "./ModalDialog.vue";

const samples = useSamplesStore();
const splitModalOpen = ref(false);
const currentSample = ref<Sample | null>(null);

async function splitSample(sample: Sample) {
  const segments = await detectAudioSegments(sample.blob);
  samples.setSampleRegions(sample.id, segments);
}
async function splitSampleRandom(sample: Sample) {
  const minDuration = 0.5;
  const maxDuration = 1.5;
  const segments = [];
  const segmentsCount = Math.random() * 5 + 1;
  for (let i = 0; i < segmentsCount; i++) {
    const start = Math.random() * (sample.duration - maxDuration);
    const end =
      start + minDuration + Math.random() * (maxDuration - minDuration);

    segments.push({
      start,
      end,
    });
  }

  samples.setSampleRegions(sample.id, segments);
}
</script>
<template>
  <div class="samples-list">
    <div v-for="sample in samples.samples" :key="sample.id">
      <div class="samples-list__sample">
        <SoundContainer :duration="sample.duration">
          <AudioWaveform
            :sample="sample"
            :height="50"
            @click="() => samples.play(sample.id)"
          />

          <template #tools>
            <div
              class="tools__tool"
              @click="
                () => {
                  splitModalOpen = true;
                  currentSample = sample;
                }
              "
            >
              <IconSplit width="30" />
            </div>
          </template>
        </SoundContainer>
      </div>
      <SampleRegions :sample="sample" />
    </div>
  </div>
  <ModalDialog :isOpen="splitModalOpen" @close="splitModalOpen = false">
    <p>Split mehod</p>
    <button
      class="block-btn mb-10"
      @click="() => {
      splitSampleRandom(currentSample!);
      splitModalOpen = false;
    }"
    >
      Random
    </button>
    <button
      class="block-btn"
      @click="() => {
        splitSample(currentSample!);
        splitModalOpen = false;
      }"
    >
      Auto detect
    </button>
  </ModalDialog>
</template>

<style>
.samples-list {
  max-width: 500px;
  margin: 1em auto;
  padding: 0 1em;
}

.samples-list__sample {
  margin-bottom: 10px;
}
</style>
