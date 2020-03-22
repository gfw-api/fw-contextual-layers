const ErrorSerializer = require('serializers/error.serializer');

class LayerValidator {

    static checkForErrors(ctx) {
        if (ctx.errors) {
            ctx.body = ErrorSerializer.serializeValidationBodyErrors(ctx.errors);
            ctx.status = 400;
        }
    }

    static async getAll(ctx, next) {
        ctx.checkQuery('enabled').optional().toBoolean();

        LayerValidator.checkForErrors(ctx);
        await next();
    }

    static async create(ctx, next) {
        ctx.checkBody('name').notEmpty().len(1, 200);
        ctx.checkBody('url').notEmpty().isUrl();
        ctx.checkBody('description').optional().notEmpty();
        ctx.checkBody('isPublic').optional().notEmpty();
        ctx.checkBody('enabled').optional().notEmpty();

        LayerValidator.checkForErrors(ctx);
        await next();
    }

    static async patch(ctx, next) {
        ctx.checkBody('name').optional().notEmpty().len(1, 200);
        ctx.checkBody('url').optional().notEmpty().isUrl();
        ctx.checkBody('description').optional().notEmpty();
        ctx.checkBody('isPublic').optional().notEmpty();
        ctx.checkBody('enabled').optional().notEmpty();

        LayerValidator.checkForErrors(ctx);
        await next();
    }

    static async tile(ctx, next) {
        ctx.checkParams('x').isNumeric();
        ctx.checkParams('y').isNumeric();
        ctx.checkParams('z').isNumeric();
        ctx.checkParams('startYear').isInt().toInt();
        ctx.checkParams('endYear').isInt().toInt();
        LayerValidator.checkForErrors(ctx);
        await next();
    }

}

module.exports = LayerValidator;
