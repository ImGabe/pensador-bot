const fs = require('fs');

module.exports = () => {
  const filename = 'frases.txt';
  const phrases = fs.readFileSync(filename).toString().split('\n');
  const number = Math.floor(Math.random() * phrases.length);
  const phrase = phrases[number];

  const newPhrases = phrases.join('\n').replace(phrase, '').replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '').trim();

  fs.writeFileSync(filename, newPhrases);

  return phrase;
};
