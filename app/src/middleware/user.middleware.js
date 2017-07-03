
exports.mapAuthToUser = async function mapAuthToUser(ctx, next) {
  if (ctx.query && ctx.query.loggedUser){
    const loggedUser = JSON.parse(ctx.query.loggedUser);
    ctx.request.body.user = { id: loggedUser.id, role: loggedUser.role };
    delete ctx.query.loggedUser;
  } else if (ctx.request.body && ctx.request.body.loggedUser) {
    const loggedUser = ctx.request.body.loggedUser;
    ctx.request.body.user = { id: loggedUser.id, role: loggedUser.role };
    delete ctx.request.body.loggedUser;
  }
  await next();
};