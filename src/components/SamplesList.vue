<script setup lang="ts">
import { useSamplesStore, type Sample } from "@/stores/samples";
import AudioWaveform from "./AudioWaveform.vue";
import IconSplit from "./icons/IconSplit.vue";
import { detectAudioSegments } from "@/lib/detectAudioSegments";
import SampleRegions from "./SampleRegions.vue";
import { playSample } from "@/lib/play";
import SoundContainer from "./SoundContainer.vue";

const samples = useSamplesStore();

async function splitSample(sample: Sample) {
  const segments = await detectAudioSegments(sample.blob);
  samples.setSampleRegions(sample.id, segments);
}
</script>
<template>
  <div class="samples-list">
    <div v-for="sample in samples.samples" :key="sample.id">
      <div class="samples-list__sample">
        <!-- <AudioWaveform
          :sample="sample"
          :height="50"
          @click="() => playSample(sample.blob)"
        />
        <div class="tools">
          <div class="tools__tool" @click="() => splitSample(sample)">
            <IconSplit width="30" />
          </div>
        </div> -->
        <SoundContainer :duration="sample.duration">
          <AudioWaveform
            :sample="sample"
            :height="50"
            @click="() => playSample(sample.blob)"
          />

          <template #tools>
            <div class="tools__tool" @click="() => splitSample(sample)">
              <IconSplit width="30" />
            </div>
          </template>
        </SoundContainer>
      </div>
      <SampleRegions :sample="sample" />
    </div>
  </div>
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
