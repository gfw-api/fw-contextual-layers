const logger = require('logger');
const ErrorSerializer = require('serializers/error.serializer');

class LayerValidator {
  static async create(ctx, next) {
    logger.debug('Validating body for create team');
    ctx.checkBody('name').notEmpty().len(1, 200);
    ctx.checkBody('url').notEmpty().isUrl();
    ctx.checkBody('style').optional().notEmpty();
    ctx.checkBody('isPublic').optional();
    ctx.checkBody('disabled').optional().isBoolean();

    if (ctx.errors) {
      ctx.body = ErrorSerializer.serializeValidationBodyErrors(ctx.errors);
      ctx.status = 400;
      return;
    }
    await next();
  }
}

module.exports = LayerValidator;
