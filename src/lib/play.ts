export async function playSample(
  blob: Blob,
  start: number = 0,
  end: number | null = null
): Promise<void> {
  // Create audio context
  const AudioContext =
    window.AudioContext || (window as any).webkitAudioContext;
  const audioContext = new AudioContext();
  console.log("audioContext", audioContext);
  try {
    console.log("audiocontext state", audioContext.state);
    // Resume audio context - needed for iOS
    if (audioContext.state === "suspended") {
      console.log("resuming audio context");
      await audioContext.resume();
    }

    // Convert blob to array buffer
    const arrayBuffer = await blob.arrayBuffer();
    console.log("arrayBuffer", arrayBuffer);

    // Decode the audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log("audioBuffer", audioBuffer);

    // Create buffer source
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    console.log("source", source);

    // Start playback
    if (end !== null) {
      source.start(0, start, end);
    } else {
      source.start(0);
    }

    console.log("source started");

    // Clean up when done
    source.onended = () => {
      console.log("source ended");
      source.disconnect();
      audioContext.close();
    };
  } catch (error) {
    console.error("Error playing audio:", error);
    throw error;
  }
}

export function playRegion(blob: Blob, start: number, end: number) {
  playSample(blob, start, end);
}
