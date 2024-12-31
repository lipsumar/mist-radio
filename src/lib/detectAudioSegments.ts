interface AudioSegment {
  start: number;
  end: number;
}

export async function detectAudioSegments(
  audioBlob: Blob
): Promise<AudioSegment[]> {
  // Convert Blob to AudioBuffer
  const audioContext = new AudioContext();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Get audio data from first channel
  const audioData = audioBuffer.getChannelData(0);

  // Configuration parameters
  const windowSize = Math.floor(audioBuffer.sampleRate * 0.02); // 20ms windows
  const minSegmentDuration = 0.03; // Minimum segment duration in seconds
  const minGapDuration = 0.1; // Minimum gap between segments in seconds

  // Calculate energy levels for each window and gather statistics
  const energyLevels: number[] = [];
  for (let i = 0; i < audioData.length; i += windowSize) {
    let energy = 0;
    const limit = Math.min(i + windowSize, audioData.length);
    for (let j = i; j < limit; j++) {
      energy += audioData[j] * audioData[j];
    }
    energyLevels.push(energy / windowSize);
  }

  // Calculate dynamic threshold using statistics
  const sortedEnergies = [...energyLevels].sort((a, b) => a - b);

  // Calculate some statistical measures
  const mean =
    sortedEnergies.reduce((a, b) => a + b, 0) / sortedEnergies.length;
  const median = sortedEnergies[Math.floor(sortedEnergies.length / 2)];

  // Get the noise floor (estimated from the lowest 10% of energies)
  const noiseFloorIndex = Math.floor(sortedEnergies.length * 0.1);
  const noiseFloor =
    sortedEnergies.slice(0, noiseFloorIndex).reduce((a, b) => a + b, 0) /
    noiseFloorIndex;

  // Calculate standard deviation
  const variance =
    sortedEnergies.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    sortedEnergies.length;
  const stdDev = Math.sqrt(variance);

  // Set threshold dynamically based on statistics
  // We use a combination of noise floor and standard deviation
  const energyThreshold = noiseFloor + stdDev * 1;

  console.log("Dynamic threshold stats:", {
    mean,
    median,
    noiseFloor,
    stdDev,
    energyThreshold,
  });

  // Find segments based on energy threshold
  const segments: AudioSegment[] = [];
  let isInSegment = false;
  let segmentStart = 0;

  // for (let i = 0; i < energyLevels.length; i++) {
  //   console.log(
  //     i,
  //     "#".repeat(Math.floor(energyLevels[i] * 100)),
  //     energyLevels[i]
  //   );
  // }

  for (let i = 0; i < energyLevels.length; i++) {
    const timeInSeconds = (i * windowSize) / audioBuffer.sampleRate;

    if (energyLevels[i] > energyThreshold && !isInSegment) {
      // Start of new segment
      segmentStart = timeInSeconds;
      isInSegment = true;
    } else if (energyLevels[i] <= energyThreshold && isInSegment) {
      // End of current segment
      const segmentDuration = timeInSeconds - segmentStart;
      if (segmentDuration >= minSegmentDuration) {
        // Only add if segment is long enough
        segments.push({
          start: segmentStart,
          end: timeInSeconds,
        });
      } else {
        console.log("Segment too short", segmentDuration);
      }
      isInSegment = false;
    }
  }

  // If we're still in a segment at the end of the file
  if (isInSegment) {
    const endTime = audioBuffer.duration;
    if (endTime - segmentStart >= minSegmentDuration) {
      segments.push({
        start: segmentStart,
        end: endTime,
      });
    }
  }

  // Merge segments that are too close together
  const mergedSegments: AudioSegment[] = [];
  let currentSegment = segments[0];

  for (let i = 1; i < segments.length; i++) {
    const gap = segments[i].start - currentSegment.end;
    if (gap < minGapDuration) {
      // Merge segments
      currentSegment.end = segments[i].end;
    } else {
      mergedSegments.push(currentSegment);
      currentSegment = segments[i];
    }
  }

  if (currentSegment) {
    mergedSegments.push(currentSegment);
  }

  // add padding to segments
  const paddingBefore = 0.02;
  const paddingAfter = 0.1;
  mergedSegments.forEach((segment) => {
    segment.start = Math.max(0, segment.start - paddingBefore);
    segment.end = Math.min(audioBuffer.duration, segment.end + paddingAfter);
  });

  return mergedSegments;
}
