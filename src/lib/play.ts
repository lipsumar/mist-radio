export function playSample(blob: Blob) {
  const audioURL = URL.createObjectURL(blob);
  const audio = new Audio(audioURL);
  audio.play();
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
