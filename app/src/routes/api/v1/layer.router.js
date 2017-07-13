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
    const enabled = typeof ctx.request.query.enabled !== 'undefined' ?
      { enabled: ctx.request.query.enabled }
      : null;
    let team = null;
    try {
      team = await TeamService.getTeamByUserId(userId);
    } catch (e) {
      logger.error(e);
      ctx.throw(500, 'Error while retrieving user team');
    }
    const teamLayers = team && Array.isArray(team.layers) ? team.layers : [];
    const query = {
      $and: [
        {
          $or: [
            { isPublic: true },
            { 'owner.id': userId },
            { id: { $in: teamLayers } }
          ]
        }
      ]
    };
    if (enabled) query.$and.push(enabled);
    const layers = await LayerModel.find(query, { 'owner.id': 0 });

    ctx.body = LayerSerializer.serialize(layers);
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

  static async patchLayer(ctx) {
    logger.info('Patch layer by id');
    const layerId = ctx.params.layerId;
    const body = ctx.request.body;
    let layer = null;
    try {
      layer = await LayerModel.findOne({ _id: layerId });
      if (!layer) ctx.throw(404, 'Layer not found');
    } catch (e) {
      logger.error(e);
      ctx.throw(500, 'Layer retrieval failed.');
    }
    let team = null;
    if (layer.owner.type === LayerService.type.TEAM) {
      try {
        team = await TeamService.getTeam(layer.owner.id);
      } catch (e) {
        logger.error(e);
        ctx.throw(500, 'Team retrieval failed.');
      }
    }
    const enabled = LayerService.getEnabled(layer, body, team);
    const isPublic = LayerService.updateIsPublic(layer, body);
    layer = Object.assign(layer, body, { isPublic, enabled });
    try {
      await layer.save();
    } catch (e) {
      logger.error(e);
      ctx.throw(500, 'Layer update failed.');
    }

    ctx.body = LayerSerializer.serialize(layer);
  }
}

router.get('/', ...Layer.middleware, LayerValidator.getAll, Layer.getAll);
router.post('/', ...Layer.middleware, LayerValidator.create,  Layer.createUserLayer);
router.patch('/:layerId', ...Layer.middleware, LayerValidator.patch, Layer.patchLayer);
router.post('/team/:teamId', ...Layer.middleware, LayerValidator.create, Layer.createTeamLayer);

module.exports = router;
