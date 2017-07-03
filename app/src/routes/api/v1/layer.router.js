const Router = require('koa-router');
const logger = require('logger');
const LayerModel = require('models/layer.model');
const LayerSerializer = require('serializers/layer.serializer');
const UserMiddleware = require('middleware/user.middleware');

const router = new Router({
    prefix: '/contextual-layer',
});

class Layer {

  static get middleware() {
    return [
      UserMiddleware.mapAuthToUser
    ];
  }

  static async getAll(ctx) {
    logger.info('Get all layers');
    const layers = await LayerModel.find({ $or: [{ isPublic: true }, { user: ctx.request.body.user }] }, { user: 0 });
    ctx.body = LayerSerializer.serialize(layers);
  }

  static async create(ctx) {
    logger.info('Create layer');
    const isPublic = (ctx.request.body.role === 'ADMIN') ? ctx.request.body.isPublic : false;
    const body = Object.assign({}, ctx.request.body, { isPublic });
    const layer = await new LayerModel(body).save();
    ctx.body = LayerSerializer.serialize(layer);
  }
}

router.get('/', ...Layer.middleware, Layer.getAll);
router.post('/', ...Layer.middleware,  Layer.create);

module.exports = router;
