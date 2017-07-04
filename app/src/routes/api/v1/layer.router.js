const Router = require('koa-router');
const logger = require('logger');
const LayerModel = require('models/layer.model');
const LayerSerializer = require('serializers/layer.serializer');
const UserMiddleware = require('middleware/user.middleware');
const LayerService = require('services/layer.service');
const LayerValidator = require('validators/layer.validator');
const TeamService = require('services/team.service');

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
    const userId = ctx.request.body.user.id;
    try {
      const team = await TeamService.getTeamByUserId(userId);
    } catch (e) {
      logger.error(e);
      ctx.throw(500, 'Error while retrieving user team');
    }
    const layers = await LayerModel.find({
        $or: [
          { isPublic: true },
          { 'owner.id': userId },
          { id: { $in: team.layers || [] } }
        ]
    }, { owner: 0 });

    ctx.body = team; // LayerSerializer.serialize(layers);
  }

  static async createUserLayer(ctx) {
    logger.info('Create layer');
    const owner = { type: LayerService.type.USER, id: ctx.request.body.user.id };
    let layer = null;
    try {
      layer = await LayerService.create(ctx.request.body, owner);
    } catch (e) {
      logger.error(e);
      ctx.throw(500, 'Layer creation Failed.');
    }
    ctx.body = LayerSerializer.serialize(layer);
  }

  static async createTeamLayer(ctx) {
    logger.info('Create team layer');
    const owner = { type: LayerService.type.TEAM, id: ctx.params.teamId };
    let team = null;
    try {
      team = await TeamService.getTeam(owner.id);
    } catch (e) {
      logger.error(e);
      ctx.throw(500, 'Team retrieval failed.');
    }
    if (team && team.managers && team.managers.includes(ctx.request.body.user.id)) {
      let layer = null;
      try {
        layer = await LayerService.create(ctx.request.body, owner);
      } catch (e) {
        logger.error(e);
        ctx.throw(500, 'Layer creation Failed.');
      }
      const layers = team.layers || [];
      try {
        await TeamService.patchTeamById(owner.id, { layers: [...layers, layer.id] });
      } catch (e) {
        logger.error(e);
        ctx.throw(500, 'Team patch failed.');
      }
      ctx.body = LayerSerializer.serialize(layer);
    } else {
      ctx.throw(403, 'Only team managers can create team layers.');
    }
  }
}

router.get('/', ...Layer.middleware, Layer.getAll);
router.post('/', ...Layer.middleware, LayerValidator.create,  Layer.createUserLayer);
router.post('/team/:teamId', ...Layer.middleware, LayerValidator.create, Layer.createTeamLayer);

module.exports = router;
