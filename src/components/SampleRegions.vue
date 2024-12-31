<script setup lang="ts">
import type { Sample } from "@/stores/samples";
import AudioWaveform from "./AudioWaveform.vue";
import { playRegion } from "@/lib/play";

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
      {{ region.start }} - {{ region.end }}
      <AudioWaveform
        :sample="sample"
        :height="50"
        :start-time="region.start"
        :stop-time="region.end"
        @click="() => playRegion(sample.blob, region.start, region.end)"
      />
    </div>
  </div>
</template>

<style>
.sample-regions {
  padding-left: 20%;
  padding-bottom: 20px;
}
</style>
