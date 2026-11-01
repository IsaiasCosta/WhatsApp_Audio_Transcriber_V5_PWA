# WhatsApp Audio Transcriber V5

Aplicativo web instalável (PWA) para transcrever áudios do WhatsApp localmente no navegador, em português brasileiro. O áudio não é enviado para um servidor.

## Publicar no GitHub Pages

O workflow em `.github/workflows/pages.yml` publica o site automaticamente após cada envio para a branch `main`.

1. Envie os arquivos deste projeto para um repositório GitHub.
2. No repositório, abra **Settings → Pages** e selecione **GitHub Actions** como fonte de publicação.
3. Aguarde a conclusão do workflow **Publicar no GitHub Pages** na aba **Actions**.
4. Acesse o endereço exibido no ambiente `github-pages` do workflow. Normalmente, ele segue o formato `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

O repositório deve estar público para usar o GitHub Pages no plano gratuito. Como o site usa caminhos relativos, ele também funciona em um endereço de projeto com subcaminho.

## Uso

Abra o site, selecione um áudio compatível, escolha o modelo Whisper e clique em **Transcrever áudio**. Na primeira utilização, o navegador precisa de internet para baixar a biblioteca e os arquivos do modelo. Os modelos Large exigem mais espaço e memória; se o navegador falhar, tente o Whisper Small, Base ou Tiny.

## Desenvolvimento local

Sirva a pasta por HTTP ou HTTPS, por exemplo com a extensão Live Server do VS Code. Abrir `index.html` diretamente como `file://` pode bloquear módulos, cache e instalação da PWA.
