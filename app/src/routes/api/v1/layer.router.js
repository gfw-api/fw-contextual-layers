const Router = require('koa-router');
const logger = require('logger');
const LayerModel = require('models/layer.model');
const LayerSerializer = require('serializers/layer.serializer');
const UserMiddleware = require('middleware/user.middleware');

const router = new Router({
    prefix: '/contextual-layer',
});

class Layer {
  // Props
  static get type() {
    return {
      USER: 'USER',
      TEAM: 'TEAM'
    };
  }
  static get middleware() {
    return [
      UserMiddleware.mapAuthToUser
    ];
  }

  // Methods
  static async create(data, owner) {
    const isPublic = (data.user.role === 'ADMIN') && (owner.type === 'USER') ? data.isPublic : false;
    const body = Object.assign({}, data, { isPublic, owner });
    return await new LayerModel(body).save();
  }
  static async getAll(ctx) {
    logger.info('Get all layers');
    const layers = await LayerModel.find({
        $or: [
          { isPublic: true },
          { 'owner.id': ctx.request.body.user.id },
          { id: { $in: [] } }
        ]
    }, { owner: 0 });

    ctx.body = LayerSerializer.serialize(layers);
  }

  static async createUserLayer(ctx) {
    logger.info('Create layer');
    const owner = { type: Layer.type.USER, id: ctx.request.body.user.id };
    const layer = await Layer.create(ctx.request.body, owner);
    ctx.body = LayerSerializer.serialize(layer);
  }

  static async createTeamLayer(ctx) {
    logger.info('Create team layer');
    const owner = { type: Layer.type.TEAM, id: ctx.params.teamId };
    const layer = await Layer.create(ctx.request.body, owner);
    ctx.body = LayerSerializer.serialize(layer);
  }
}

router.get('/', ...Layer.middleware, Layer.getAll);
router.post('/', ...Layer.middleware,  Layer.createUserLayer);
router.post('/team/:teamId', ...Layer.middleware, Layer.createTeamLayer);

module.exports = router;
