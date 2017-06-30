const Router = require('koa-router');
const logger = require('logger');
const LayerModel = require('models/layer.model');
const LayerSerializer = require('serializers/layer.serializer');

const router = new Router({
    prefix: '/contextual-layer',
});

class Layer {

    static async getAll(ctx) {
      logger.info('Get all layers');
      const layers = await LayerModel.find({});
      ctx.body = LayerSerializer.serialize(layers);
    }

    static async create(ctx) {
      logger.info('Create layer');
      const layer = ctx.request.body;
      ctx.body = layer;
    }

}

router.get('/', Layer.getAll);
router.post('/', Layer.create);

module.exports = router;
