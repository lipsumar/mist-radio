<script setup lang="ts">
import BottomBar from "@/components/BottomBar.vue";
import EmptyState from "@/components/EmptyState.vue";
import MainSection from "@/components/MainSection.vue";
import SamplesList from "@/components/SamplesList.vue";
import AudioRecorder from "@/lib/AudioRecorder";
import { useSamplesStore } from "@/stores/samples";
import { ref } from "vue";

const samples = useSamplesStore();
const recorder = new AudioRecorder();
const recording = ref(false);

function recordButtonClicked() {
  if (!recorder.recording) {
    recorder.start();
    recording.value = true;
  } else {
    recorder.stop();
    recording.value = false;
    const blob = recorder.getBlob();
    samples.addSample(blob);
  }
}
</script>

<template>
  <MainSection>
    <EmptyState
      v-if="samples.length === 0"
      message="Press record to create samples"
    />
    <SamplesList v-else />
  </MainSection>
  <BottomBar>
    <button
      class="round-button round-button--record"
      :class="{ active: recording }"
      @click="() => recordButtonClicked()"
    ></button>
  </BottomBar>
</template>
