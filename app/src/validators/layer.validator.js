const logger = require('logger');
const ErrorSerializer = require('serializers/error.serializer');

class LayerValidator {

  static async getAll(ctx, next) {
    ctx.checkQuery('enabled').optional().toBoolean();

    if (ctx.errors) {
      ctx.body = ErrorSerializer.serializeValidationBodyErrors(ctx.errors);
      ctx.status = 400;
      return;
    }
    await next();
  }

  static async create(ctx, next) {
    ctx.checkBody('name').notEmpty().len(1, 200);
    ctx.checkBody('url').notEmpty().isUrl();
    ctx.checkBody('description').optional().notEmpty();
    ctx.checkBody('isPublic').optional().notEmpty();
    ctx.checkBody('enabled').optional().notEmpty();

    if (ctx.errors) {
      ctx.body = ErrorSerializer.serializeValidationBodyErrors(ctx.errors);
      ctx.status = 400;
      return;
    }
    await next();
  }

  static async patch(ctx, next) {
    ctx.checkBody('name').optional().notEmpty().len(1, 200);
    ctx.checkBody('url').optional().notEmpty().isUrl();
    ctx.checkBody('description').optional().notEmpty();
    ctx.checkBody('isPublic').optional().notEmpty();
    ctx.checkBody('enabled').optional().notEmpty();

    if (ctx.errors) {
      ctx.body = ErrorSerializer.serializeValidationBodyErrors(ctx.errors);
      ctx.status = 400;
      return;
    }
    await next();
  }
}

module.exports = LayerValidator;
