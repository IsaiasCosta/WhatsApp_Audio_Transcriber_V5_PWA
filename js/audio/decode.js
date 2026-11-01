export async function decodeAudio(file) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContextClass({ sampleRate: 16000 });

  try {
    const bytes = await file.arrayBuffer();
    let audio;

    try {
      audio = await context.decodeAudioData(bytes);
    } catch (error) {
      throw new Error(
        'O navegador não conseguiu decodificar este áudio. Para OGG/OPUS, experimente Firefox ou converta para WAV/MP3. Detalhes: ' +
          error.message
      );
    }

    const length = Math.ceil(audio.duration * 16000);
    if (!Number.isFinite(length) || length < 1) {
      throw new Error('Áudio vazio ou inválido.');
    }

    const offline = new OfflineAudioContext(1, length, 16000);
    const source = offline.createBufferSource();
    source.buffer = audio;

    if (audio.numberOfChannels === 1) {
      source.connect(offline.destination);
    } else {
      const splitter = offline.createChannelSplitter(audio.numberOfChannels);
      source.connect(splitter);

      for (let channel = 0; channel < audio.numberOfChannels; channel += 1) {
        const gain = offline.createGain();
        gain.gain.value = 1 / audio.numberOfChannels;
        splitter.connect(gain, channel);
        gain.connect(offline.destination);
      }
    }

    source.start(0);
    const mono = await offline.startRendering();
    return new Float32Array(mono.getChannelData(0));
  } finally {
    await context.close();
  }
}
