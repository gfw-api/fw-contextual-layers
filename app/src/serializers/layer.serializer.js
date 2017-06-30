const logger = require('logger');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const layerSerializer = new JSONAPISerializer('layer', {
  attributes: [
    'public', 'name', 'url', 'user', 'createdAt'
  ],
  resource: {
    attributes: ['type', 'content']
  },
  keyForAttribute: 'camelCase'
});

class TeamSerializer {
  static serialize(data) {
    return serializeLayer.serialize(data);
  }
}

module.exports = TeamSerializer;