const logger = require('logger');
const LayerModel = require('models/layer.model');

class LayerService {
  static get type() {
    return {
      USER: 'USER',
      TEAM: 'TEAM'
    };
  }

  static async create(data, owner) {
    const isPublic = (data.user.role === 'ADMIN') && (owner.type === 'USER') ? data.isPublic : false;
    const body = Object.assign({}, data, { isPublic, owner });
    return await new LayerModel(body).save();
  }
}
module.exports = LayerService;