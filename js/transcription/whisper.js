let transcriber = null;
let activeModel = null;

export async function transcribeAudio(audio, model, onProgress) {
  if (!transcriber || activeModel !== model) {
    onProgress({ message: 'Carregando biblioteca de IA... (a primeira vez exige internet)' });
    const { pipeline, env } = await import(
      'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1'
    );
    env.allowLocalModels = false;

    onProgress({ message: 'Carregando modelo Whisper. Isso pode levar alguns minutos...' });
    const isOnnxCommunityModel = model.startsWith('onnx-community/');
    transcriber = await pipeline('automatic-speech-recognition', model, {
      ...(isOnnxCommunityModel ? { dtype: 'q8' } : { quantized: true }),
      progress_callback(progress) {
        if (progress.status === 'initiate' || progress.status === 'download') {
          onProgress({ progress: 0, message: 'Iniciando download de arquivo do modelo...' });
        } else if (progress.status === 'progress' && Number.isFinite(progress.progress)) {
          onProgress({
            progress: progress.progress,
            message: `Baixando arquivo do modelo: ${Math.round(progress.progress)}%`,
          });
        } else if (progress.status === 'done') {
          onProgress({ progress: 100, message: 'Arquivo do modelo baixado.' });
        } else if (progress.status === 'ready') {
          onProgress({ message: 'Modelo pronto.' });
        }
      },
    });
    activeModel = model;
  }

  onProgress({ indeterminate: true, message: 'Modelo pronto. Transcrevendo áudio...' });
  const output = await transcriber(audio, {
    language: 'portuguese',
    task: 'transcribe',
    num_beams: 3,
    chunk_length_s: 20,
    stride_length_s: 5,
    return_timestamps: false,
  });

  return Array.isArray(output)
    ? output.map((chunk) => chunk.text || '').join(' ')
    : output.text || '';
}
