<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";

interface Sample {
  blob: Blob;
}

interface AudioVisualizerOptions {
  width: number;
  height: number;
  backgroundColor?: string;
  waveformColor?: string;
  lineWidth?: number;
  dpr: number;
  startTime?: number;
  stopTime?: number;
}

interface Props {
  sample: Sample;
  height?: number;
  backgroundColor?: string;
  waveformColor?: string;
  lineWidth?: number;
  startTime?: number; // New prop for start time in seconds
  stopTime?: number; // New prop for stop time in seconds
}

const props = withDefaults(defineProps<Props>(), {
  height: 200,
  backgroundColor: "#f0f0f0",
  waveformColor: "#2563eb",
  lineWidth: 2,
  startTime: undefined,
  stopTime: undefined,
});

const waveformContainer = ref<HTMLDivElement | null>(null);
const observer = ref<ResizeObserver | null>(null);

async function renderAudio(
  targetEl: HTMLElement,
  blob: Blob,
  options: AudioVisualizerOptions
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = options.width * options.dpr;
  canvas.height = options.height * options.dpr;
  canvas.style.width = `${options.width}px`;
  canvas.style.height = `${options.height}px`;

  targetEl.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  ctx.scale(options.dpr, options.dpr);

  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();

  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const rawData = audioBuffer.getChannelData(0);

  // Calculate start and end samples based on time
  const sampleRate = audioBuffer.sampleRate;
  const startSample = options.startTime
    ? Math.floor(options.startTime * sampleRate)
    : 0;
  const endSample = options.stopTime
    ? Math.min(Math.floor(options.stopTime * sampleRate), rawData.length)
    : rawData.length;

  // Slice the data to only include the specified time range
  const slicedData = rawData.slice(startSample, endSample);

  const numOfSamples = options.width;
  const step = Math.ceil(slicedData.length / numOfSamples);

  // Draw the waveform
  ctx.beginPath();
  ctx.strokeStyle = options.waveformColor || "#2563eb";
  ctx.lineWidth = options.lineWidth || 2;

  for (let i = 0; i < numOfSamples; i++) {
    const dataIndex = Math.floor(i * step);

    // Get the max amplitude for this segment
    let max = 0;
    for (let j = 0; j < step && dataIndex + j < slicedData.length; j++) {
      const amplitude = Math.abs(slicedData[dataIndex + j]);
      if (amplitude > max) max = amplitude;
    }

    // Calculate y position
    const y = (options.height / 2) * (1 - max);
    const y2 = (options.height / 2) * (1 + max);

    // Draw vertical line for amplitude
    ctx.moveTo(i, y);
    ctx.lineTo(i, y2);
  }

  ctx.stroke();

  return canvas;
}

async function drawWaveform() {
  if (!waveformContainer.value) return;

  // Clear previous content
  waveformContainer.value.innerHTML = "";

  // Get device pixel ratio
  const dpr = window.devicePixelRatio || 1;

  try {
    await renderAudio(waveformContainer.value, props.sample.blob, {
      width: waveformContainer.value.clientWidth,
      height: props.height,
      backgroundColor: props.backgroundColor,
      waveformColor: props.waveformColor,
      lineWidth: props.lineWidth * dpr,
      dpr,
      startTime: props.startTime,
      stopTime: props.stopTime,
    });
  } catch (error) {
    console.error("Error rendering waveform:", error);
  }
}

// Setup resize observer
function setupResizeObserver() {
  if (!waveformContainer.value) return;

  observer.value = new ResizeObserver(drawWaveform);
  observer.value.observe(waveformContainer.value);
}

// Watch for changes in all props including start and stop times
watch(
  () => [
    props.sample,
    props.height,
    props.backgroundColor,
    props.waveformColor,
    props.lineWidth,
    props.startTime,
    props.stopTime,
  ],
  () => {
    drawWaveform();
  },
  { deep: true }
);

onMounted(() => {
  setupResizeObserver();
  drawWaveform();
});

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<template>
  <div ref="waveformContainer" class="audio-waveform"></div>
</template>

<style scoped>
.audio-waveform {
  width: 100%;
  height: v-bind(height + "px");
}
</style>
