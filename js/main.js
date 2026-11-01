import { decodeAudio } from './audio/decode.js';
import { reviseTranscript } from './text/revision.js';
import { transcribeAudio } from './transcription/whisper.js';

const $ = (id) => document.getElementById(id);
let fileUrl = null;
let deferredInstall = null;

const status = (message) => {
  $('status').textContent = message;
};

const progress = (value) => {
  $('progress').classList.remove('is-indeterminate');
  const percent = Math.max(0, Math.min(100, Number(value) || 0));
  $('progress').setAttribute('aria-valuenow', String(percent));
  $('progress').removeAttribute('aria-valuetext');
  $('progress-fill').style.width = `${percent}%`;
};

const indeterminateProgress = () => {
  $('progress').classList.add('is-indeterminate');
  $('progress').removeAttribute('aria-valuenow');
  $('progress').setAttribute('aria-valuetext', 'Transcrição em andamento');
};

const updateTranscriptionCount = () => {
  const text = $('original').value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  $('transcription-count').textContent = `${words} ${words === 1 ? 'palavra' : 'palavras'} · ${text.length} ${text.length === 1 ? 'caractere' : 'caracteres'}`;
};

const sleepFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

$('file').addEventListener('change', () => {
  if (fileUrl) {
    URL.revokeObjectURL(fileUrl);
  }

  const file = $('file').files[0];
  fileUrl = file ? URL.createObjectURL(file) : null;
  $('player').src = fileUrl || '';
  status(
    file
      ? `Selecionado: ${file.name} (${(file.size / 1048576).toFixed(1)} MB)`
      : 'Selecione um áudio.'
  );
});

$('transcribe').addEventListener('click', async () => {
  const file = $('file').files[0];
  if (!file) {
    status('Selecione um áudio primeiro.');
    return;
  }

  const button = $('transcribe');
  button.disabled = true;
  progress(0);

  try {
    status('Preparando o áudio...');
    await sleepFrame();
    const audio = await decodeAudio(file);
    progress(0);

    const model = $('model').value;
    const text = await transcribeAudio(audio, model, (update) => {
      if (update.progress !== undefined) {
        progress(update.progress);
      }
      if (update.indeterminate) {
        indeterminateProgress();
      }
      if (update.message) {
        status(update.message);
      }
    });

    $('original').value = reviseTranscript(text);
    updateTranscriptionCount();
    progress(100);
    status('Transcrição concluída com revisão automática. Confira nomes, números e palavras no áudio original.');
  } catch (error) {
    console.error(error);
    progress(0);
    const message = error?.message || String(error);
    status(
      message.includes('OrtRun')
        ? 'A transcrição falhou no mecanismo de IA. O navegador pode estar sem memória disponível. Tente o modelo Whisper Base ou um áudio mais curto.'
        : 'Erro: ' + message
    );
  } finally {
    button.disabled = false;
  }
});

document.querySelectorAll('[data-copy]').forEach((button) =>
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($(button.dataset.copy).value);
      status('Texto copiado.');
    } catch {
      const element = $(button.dataset.copy);
      element.select();
      status('Use Ctrl+C para copiar o texto selecionado.');
    }
  })
);

document.querySelectorAll('[data-clear]').forEach((button) =>
  button.addEventListener('click', () => {
    $(button.dataset.clear).value = '';
    if (button.dataset.clear === 'original') {
      updateTranscriptionCount();
    }
    status('Texto limpo.');
  })
);

$('original').addEventListener('input', updateTranscriptionCount);

document.querySelectorAll('[data-save]').forEach((button) =>
  button.addEventListener('click', () => {
    const blob = new Blob([$(button.dataset.save).value], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transcricao-${button.dataset.save}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  })
);

if (
  'serviceWorker' in navigator &&
  (location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1')
) {
  navigator.serviceWorker
    .register('./sw.js', { updateViaCache: 'none' })
    .then((registration) => registration.update())
    .catch(console.warn);
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstall = event;
  $('install').hidden = false;
});

$('install').addEventListener('click', async () => {
  if (!deferredInstall) {
    return;
  }

  deferredInstall.prompt();
  await deferredInstall.userChoice;
  deferredInstall = null;
  $('install').hidden = true;
});
