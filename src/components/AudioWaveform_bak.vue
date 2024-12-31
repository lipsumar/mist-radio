<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";

interface Sample {
  blob: Blob;
  id: string;
}

interface AudioVisualizerOptions {
  width: number;
  height: number;
  backgroundColor?: string;
  waveformColor?: string;
  lineWidth?: number;
  dpr: number;
}

interface Props {
  sample: Sample;
  height?: number;
  backgroundColor?: string;
  waveformColor?: string;
  lineWidth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  height: 200,
  backgroundColor: "#f0f0f0",
  waveformColor: "#2563eb",
  lineWidth: 2,
});

const waveformContainer = ref<HTMLDivElement | null>(null);
const observer = ref<ResizeObserver | null>(null);

async function renderAudio(
  targetEl: HTMLElement,
  blob: Blob,
  options: AudioVisualizerOptions
): Promise<HTMLCanvasElement> {
  // Create canvas element
  const canvas = document.createElement("canvas");

  // Scale canvas for high DPI displays
  canvas.width = options.width * options.dpr;
  canvas.height = options.height * options.dpr;

  // Set display size (css pixels)
  canvas.style.width = `${options.width}px`;
  canvas.style.height = `${options.height}px`;

  targetEl.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Scale all canvas operations
  ctx.scale(options.dpr, options.dpr);

  // Set up audio context
  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();

  // Convert blob to array buffer
  const arrayBuffer = await blob.arrayBuffer();

  // Decode audio data
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Get the actual audio data
  const rawData = audioBuffer.getChannelData(0);

  // Number of samples we want to display
  const numOfSamples = options.width;

  // Clear the canvas
  // ctx.fillStyle = options.backgroundColor || "#f0f0f0";
  // ctx.fillRect(0, 0, options.width, options.height);

  // Calculate step size
  const step = Math.ceil(rawData.length / numOfSamples);

  // Draw the waveform
  ctx.beginPath();
  ctx.strokeStyle = options.waveformColor || "#2563eb";
  ctx.lineWidth = options.lineWidth || 2;

  for (let i = 0; i < numOfSamples; i++) {
    const dataIndex = Math.floor(i * step);

    // Get the max amplitude for this segment
    let max = 0;
    for (let j = 0; j < step && dataIndex + j < rawData.length; j++) {
      const amplitude = Math.abs(rawData[dataIndex + j]);
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
      lineWidth: props.lineWidth * dpr, // Scale line width with DPR
      dpr,
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

// Watch for changes in the sample or visualization options
watch(
  () => [
    props.sample,
    props.height,
    props.backgroundColor,
    props.waveformColor,
    props.lineWidth,
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

// Cleanup
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
