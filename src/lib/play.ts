export async function playSample(blob: Blob): Promise<void> {
  // Create audio context
  const AudioContext =
    window.AudioContext || (window as any).webkitAudioContext;
  const audioContext = new AudioContext();

  try {
    // Resume audio context - needed for iOS
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    // Convert blob to array buffer
    const arrayBuffer = await blob.arrayBuffer();

    // Decode the audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Create buffer source
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    // Start playback
    source.start(0);

    // Clean up when done
    source.onended = () => {
      source.disconnect();
      audioContext.close();
    };
  } catch (error) {
    console.error("Error playing audio:", error);
    throw error;
  }
}

export function playRegion(blob: Blob, start: number, end: number) {
  const audioURL = URL.createObjectURL(blob);
  const audio = new Audio(audioURL);
  audio.currentTime = start;
  audio.play();
  setTimeout(() => {
    audio.pause();
  }, (end - start) * 1000);
}
