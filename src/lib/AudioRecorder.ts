export default class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];

  constructor() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          console.log("got stream", stream);
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.ondataavailable = (e) => {
            this.chunks.push(e.data);
          };
        })
        .catch((err) => {
          console.error(`The following getUserMedia error occurred: ${err}`);
        });
    }
  }

  get recording() {
    return this.mediaRecorder?.state === "recording";
  }

  public start() {
    if (this.mediaRecorder) {
      this.chunks = [];
      this.mediaRecorder.start(100);
      console.log("recording started");
    }
  }

  public stop() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  public getBlob() {
    return new Blob(this.chunks, { type: "audio/wav" });
  }
}
