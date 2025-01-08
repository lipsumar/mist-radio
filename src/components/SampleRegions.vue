<script setup lang="ts">
import { useSamplesStore, type Sample } from "@/stores/samples";
import AudioWaveform from "./AudioWaveform.vue";
import SoundContainer from "./SoundContainer.vue";

const samples = useSamplesStore();

const props = defineProps<{
  sample: Sample;
}>();
</script>
<template>
  <div
    class="sample-regions"
    v-if="sample.regions && sample.regions.length > 0"
  >
    <div
      class="sample-regions__region"
      v-for="region in sample.regions"
      :key="`${region.start}-${region.end}`"
    >
      <SoundContainer :duration="region.end - region.start">
        <AudioWaveform
          :sample="sample"
          :height="50"
          :start-time="region.start"
          :stop-time="region.end"
          @click="() => samples.play(sample.id, region)"
        />
      </SoundContainer>
    </div>
  </div>
</template>

<style>
.sample-regions {
  padding-left: 10%;
  padding-bottom: 20px;
}
.sample-regions__region {
  margin-bottom: 10px;
}
</style>
