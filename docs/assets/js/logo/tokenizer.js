/**
 * Turtle Logo — Tokenizer
 * Splits a line into a flat list of tokens, with [...] as block strings.
 * Port of logo.py:445-471
 */

/**
 * @param {string} text
 * @returns {Array<[string, string]>} Array of [kind, value] tuples
 *   kind 'W' = word/number, kind '[' = block (value is inner text)
 */
export function tokenize(text) {
  const tokens = [];
  let i = 0;
  text = text.trim();
  while (i < text.length) {
    const ch = text[i];
    if (ch === ' ' || ch === '\t') {
      i++;
    } else if (ch === '[') {
      let depth = 1;
      let j = i + 1;
      while (j < text.length && depth > 0) {
        if (text[j] === '[') depth++;
        else if (text[j] === ']') depth--;
        j++;
      }
      tokens.push(['[', text.slice(i + 1, j - 1).trim()]);
      i = j;
    } else if (ch === ']') {
      i++;
    } else if (ch === ';') {
      break;
    } else {
      let j = i;
      while (j < text.length && !' \t[];'.includes(text[j])) {
        j++;
      }
      tokens.push(['W', text.slice(i, j)]);
      i = j;
    }
  }
  return tokens;
}
