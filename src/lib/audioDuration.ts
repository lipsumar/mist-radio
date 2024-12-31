export async function getAudioDuration(audioBlob: Blob) {
  const audioContext = new AudioContext();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer.duration * 1000; // Convert seconds to milliseconds
}
