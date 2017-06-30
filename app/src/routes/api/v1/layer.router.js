const Router = require('koa-router');


const router = new Router({
    prefix: '/service',
});

class Layer {

    static sayHi(ctx) {
        ctx.body = {
            greeting: 'hi'
        };
    }

}

router.get('/hi', Layer.sayHi);

module.exports = router;
