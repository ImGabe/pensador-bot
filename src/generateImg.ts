import {createCanvas, loadImage} from 'canvas';
import canvasTxt from 'canvas-txt';

/**
 *
 * @param {string} phrase A phrase
 * @param {string} author The author from phrase
 * @param {string} avatarUrl Url avatar from author
 * @return {Promise<string>}
 */

export default async (phrase: string, author: string, avatarUrl: string)
: Promise<string> => {
  const [width, height] = [1024, 512];
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const avatar = await loadImage(avatarUrl);

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(avatar, 512, 0, 512, 512);

  ctx.fillStyle = 'white';

  canvasTxt.font = 'Verdana';
  canvasTxt.fontSize = 40;
  canvasTxt.align = 'center';
  canvasTxt.lineHeight = 40;
  canvasTxt.justify = false;

  canvasTxt.drawText(ctx, `”${phrase}”`, 0, 0, 512, 512);

  canvasTxt.align = 'left';
  canvasTxt.fontSize = 40;
  canvasTxt.lineHeight = 20;

  canvasTxt.drawText(ctx, author, 40, 462, 492, 40);

  const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const {data} = id;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    data[i] = y;
    data[i + 1] = y;
    data[i + 2] = y;
  }

  ctx.putImageData(id, 0, 0);

  return canvas.toBuffer().toString('base64');
};
