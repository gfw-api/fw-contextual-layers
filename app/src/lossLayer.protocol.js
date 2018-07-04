const logger = require('./logger');
const config = require('config');
const request = require('request-promise');
const d3 = require('d3');
const Canvas = require('canvas');
const TileNotFound = require('TileNotFoundError');

const Image = Canvas.Image;

const PROTOCOL = 'hansen:';

class LossLayerProtocol {
  constructor(options, cb) {
    this.url =  `http:${decodeURIComponent(options.path)}`;
    cb(null, this);
  }

  static registerProtocols(tilelive) {
    tilelive.protocols[PROTOCOL] = LossLayerProtocol;
  }

  static async getTile(z, x, y) {
    const TILE_URL = config.get('hansenUrl').replace('{z}', z).replace('{x}', x).replace('{y}', y);
    try {
      return await request({
        uri: TILE_URL,
        method: 'GET',
        encoding: null
      });
    } catch (e) {
      logger.error('Tile not found', e);
      if (e.statusCode === 404) {
        throw new TileNotFound(e.message);
      }
    }
  }

  static filterImgData(data, { w, h, z, startYear, endYear }) {
    const components = 4;
    const exp = z < 11 ? 0.3 + ((z - 3) / 20) : 1;
    const imgData = data;

    const myscale = d3.scale.pow()
      .exponent(exp)
      .domain([0, 256])
      .range([0, 256]);

    for (let i = 0; i < w; ++i) {
      for (let j = 0; j < h; ++j) {
        const pixelPos = ((j * w) + i) * components;
        const intensity = imgData[pixelPos];
        const yearLoss = 2000 + (imgData[pixelPos + 2]);

        if (yearLoss >= startYear && yearLoss < endYear) {
          imgData[pixelPos] = 220;
          imgData[pixelPos + 1] = (72 - z) + 102 - (3 * myscale(intensity) / z);
          imgData[pixelPos + 2] = (33 - z) + 153 - ((intensity) / z);
          imgData[pixelPos + 3] = z < 13 ? myscale(intensity) : intensity;
        } else {
          imgData[pixelPos + 3] = 0;
        }
      }
    }
    return imgData;
  }

  async getCanvasTile({ z, x, y, startYear, endYear }) {
    "use asm";
    const canvas = new Canvas(256, 256);
    const ctx = canvas.getContext('2d');
    const zsteps = z - 12;
    const tile = await LossLayerProtocol.getTile(z, x, y);

    const image = new Image();
    image.src = tile;
    // this will allow us to sum up the dots when the timeline is running
    ctx.clearRect(0, 0, 256, 256);

    if (zsteps < 0) {
      ctx.drawImage(image, 0, 0);
    } else {
      // over the maxzoom, we'll need to scale up each tile
      ctx.imageSmoothingEnabled = false;
      // disable pic enhancement
      ctx.mozImageSmoothingEnabled = false;

      // tile scaling
      const srcX = (256 / Math.pow(2, zsteps) * (x % Math.pow(2, zsteps))) | 0;
      const srcY = (256 / Math.pow(2, zsteps) * (y % Math.pow(2, zsteps))) | 0;
      const srcW = (256 / Math.pow(2, zsteps)) | 0;
      const srcH = (256 / Math.pow(2, zsteps)) | 0;

      ctx.drawImage(image, srcX, srcY, srcW, srcH, 0, 0, 256, 256);
    }

    const I = ctx.getImageData(0, 0, canvas.width, canvas.height);
    LossLayerProtocol.filterImgData(I.data, {
      startYear,
      endYear,
      z,
      w: canvas.width,
      h: canvas.height
    });
    ctx.putImageData(I, 0, 0);
    return canvas;
  }

  async getImageTile({ z, x, y, startYear, endYear }, format = 'image/png') {
    let canvasTile, imageString;
    canvasTile = await this.getCanvasTile({ z, x, y, startYear, endYear });
    imageString = canvasTile.toDataURL(format);
    return new Buffer(imageString.split(',')[1], 'base64');
  }
}


module.exports = LossLayerProtocol;
