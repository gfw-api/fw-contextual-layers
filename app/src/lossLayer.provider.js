const tilelive = require('@mapbox/tilelive');
const config = require('config');
const logger = require('./logger');
const HansenProtocol = require('./lossLayer.protocol');

HansenProtocol.registerProtocols(tilelive);
const url = config.get('hansenUrl');

class LossLayerProvider {

    constructor() {
        tilelive.load(`hansen://${url}`, (err, protocol) => {
            if (err) {
                logger.error(err);
            }
            this.protocol = protocol;
        });
    }

    getTile(options) {
        return this.protocol.getImageTile(options);
    }

}

module.exports = new LossLayerProvider();
