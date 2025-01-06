<script setup lang="ts">
import BottomBar from "@/components/BottomBar.vue";
import EmptyState from "@/components/EmptyState.vue";
import MainSection from "@/components/MainSection.vue";
import SamplesList from "@/components/SamplesList.vue";
import AudioRecorder from "@/lib/AudioRecorder";
import { playSample } from "@/lib/play";
import { useSamplesStore } from "@/stores/samples";
import { ref } from "vue";
import IconUpload from "@/components/icons/IconUpload.vue";

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
function onChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    playFile(file);
  }
}
function playFile(file: File) {
  const blob = new Blob([file], { type: file.type });
  samples.addSample(blob);
}
</script>

<template>
  <MainSection>
    <EmptyState
      v-if="samples.length === 0"
      message="Press record or upload samples"
    />
    <SamplesList v-else />
  </MainSection>
  <BottomBar>
    <button
      class="round-button round-button--record"
      :class="{ active: recording }"
      @click="() => recordButtonClicked()"
    ></button>
    <div class="round-button round-button--upload">
      <div class="inner">
        <IconUpload width="35" />
      </div>
      <input type="file" class="" @change="(e) => onChange(e)" />
    </div>
  </BottomBar>
</template>

<style>
.round-button--record::before {
  content: "";
  display: block;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #ff3b30;
  line-height: 0;
}

/* Add the pulsing animation when recording is active */
.round-button--record.active {
  animation: pulse 1.5s infinite;
  background-color: #ff3b30;
}
.round-button--record.active::before {
  background-color: #fff;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(255, 59, 48, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0);
  }
}

.round-button--upload {
  position: relative;
}
.round-button--upload .inner {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.round-button--upload .inner svg {
  margin-top: 3px;
  margin-left: 3px;
}

.round-button--upload input {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
