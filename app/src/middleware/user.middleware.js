
exports.mapAuthToUser = async function mapAuthToUser(ctx, next) {
  if (ctx.query && ctx.query.loggedUser){
    ctx.request.body.user = JSON.parse(ctx.query.loggedUser).id;
    ctx.request.body.role = JSON.parse(ctx.query.loggedUser).role;
    delete ctx.query.loggedUser;
  } else if (ctx.request.body && ctx.request.body.loggedUser) {
    ctx.request.body.user = Object.assign({}, ctx.request.body.loggedUser).id;
    ctx.request.body.role = Object.assign({}, ctx.request.body.loggedUser).role;
    delete ctx.request.body.loggedUser;
  }
  await next();
};