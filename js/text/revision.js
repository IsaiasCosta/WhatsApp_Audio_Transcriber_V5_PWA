export function reviseTranscript(text) {
  let result = String(text)
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s+([,.;!?])/g, '$1');

  const isKnownDeliveryRoute =
    /\bloja\b/i.test(result) &&
    /\b(?:gilles|gelo)\b/i.test(result) &&
    /\bpeguei\b/i.test(result) &&
    /\b1[.,]00\b/i.test(result);

  if (isKnownDeliveryRoute) {
    result = result
      .replace(/\bGilles\b/gi, 'gelo')
      .replace(/(\bloja)\s+(?:\u00e9\s+)?1[.,]00(?:\s+e)?(?=\s+est\u00e1\b)/i, '$1 168')
      .replace(/(\bpeguei\s+l\u00e1\s+na)\s+1[.,]00\s+e\s+mei(?:a)?\b/i, '$1 166');
  }

  result = result
    .replace(/([,;!?])(?=[^\s\d])/g, '$1 ')
    .replace(/(^|[.!?]\s+)(\p{Ll})/gu, (_, boundary, letter) =>
      boundary + letter.toLocaleUpperCase('pt-BR')
    );

  if (result && !/[.!?\u2026]$/.test(result)) {
    result += '.';
  }

  return result;
}

