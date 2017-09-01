const logger = require('./logger');
const tilelive = require('@mapbox/tilelive');
const HansenProtocol = require('./lossLayer.protocol');

HansenProtocol.registerProtocols(tilelive);
const url = 'https://storage.googleapis.com/wri-public/Hansen15/tiles/hansen_world/v1/tc30/{z}/{x}/{y}.png';


class LossLayerProvider {

  constructor() {
    tilelive.load(`hansen://${url}`, (err, protocol) => {
      if (err) {
        logger.error(err);
      }
      this.protocol = protocol;
    });
  }

  getTile(z, x, y) {
    return this.protocol.getImageTile({z, x, y})
  }
}

module.exports = new LossLayerProvider();



