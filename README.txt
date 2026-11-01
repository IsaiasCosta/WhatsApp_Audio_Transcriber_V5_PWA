WHATSAPP AUDIO TRANSCRIBER V5 — PWA

1. Publique TODOS os arquivos desta pasta juntos em um serviço de hospedagem HTTPS estática (por exemplo, Netlify Drop ou GitHub Pages).
2. Abra o endereço HTTPS no Chrome ou Edge. No menu do navegador, selecione Instalar aplicativo (se disponível).
3. Escolha o áudio do WhatsApp, modelo Whisper e clique em Transcrever.
4. Na primeira utilização, aguarde o download da biblioteca e do modelo. Não há API paga.
5. O reconhecimento ocorre localmente, sem upload do áudio para o servidor.

ARQUITETURA
- index.html, manifest.webmanifest e sw.js ficam na raiz para preservar o escopo e a instalação da PWA.
- assets/css/styles.css contém os estilos; assets/icons/icon.svg contém o ícone.
- js/main.js coordena a interface; js/audio/decode.js prepara o áudio; js/transcription/whisper.js carrega o modelo e transcreve; js/text/revision.js aplica revisão conservadora e correções contextuais ao resultado.
- A aplicação usa módulos nativos do navegador, sem etapa de build ou dependências locais. Publique a estrutura completa de pastas junto com os arquivos da raiz.

ATENÇÃO
- Abrir index.html por duplo clique (file://) não instala o PWA e pode bloquear os módulos de IA.
- O aplicativo oferece Whisper Small, Base, Tiny, Large V3 Turbo e Large V3. Os modelos Large podem exigir muito espaço para download e memória; se houver falha, escolha um modelo menor ou um áudio curto.
- A revisão automática ajusta espaços, maiúsculas e pontuação; nomes, números e palavras devem ser conferidos no áudio.
- O suporte a OGG/OPUS depende dos codecs disponíveis no navegador. Se falhar, tente Firefox ou converta o arquivo para WAV/MP3.
- O modo offline não é garantido: o service worker armazena apenas a interface; biblioteca e pesos dependem do cache do navegador.
- Chrome/Edge podem exigir ícones PNG para instalação em algumas plataformas; assets/icons/icon.svg está incluído.
- Não execute arquivos baixados de fontes não confiáveis.
