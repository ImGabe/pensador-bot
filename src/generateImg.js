const jimp = require('jimp');

module.exports = async (phrase, author, avatar) => {
  const background = await jimp.read('img/background.png');
  const thinker = await jimp.read(avatar);
  const font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);

  const { width: bgWidth, height: bgHeight } = background.bitmap;

  thinker
    .resize(300, jimp.AUTO)
    .grayscale()
    .opacity(0.6);

  const { width: tWidth, height: tHeight } = thinker.bitmap;

  background
    .blit(thinker, (bgWidth - tWidth), (bgHeight - tHeight))
    .print(font, 0, 130, {
      text: `"${phrase}"`,
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
    }, bgWidth, bgHeight)
    .print(font, 20, bgHeight - 52, `- ${author}`)
    .writeAsync('img/final.png');
};
