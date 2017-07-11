const logger = require('logger');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const layerSerializer = new JSONAPISerializer('contextual-layer', {
  attributes: ['isPublic', 'name', 'url', 'style', 'enabled', 'owner', 'createdAt'],
  resource: {
    attributes: ['type', 'content']
  },
  keyForAttribute: 'camelCase'
});

class LayerSerializer {
  static serialize(data) {
    return layerSerializer.serialize(data);
  }
}

module.exports = LayerSerializer;
