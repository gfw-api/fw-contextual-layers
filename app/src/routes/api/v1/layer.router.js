const Router = require('koa-router');


const router = new Router({
    prefix: '/contextual-layer',
});

class Layer {

    static sayHi(ctx) {
        ctx.body = {
            greeting: 'hi'
        };
    }

}

router.get('/', Layer.sayHi);

module.exports = router;
