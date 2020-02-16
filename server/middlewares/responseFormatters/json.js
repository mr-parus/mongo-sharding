import HTTPErrors from 'http-custom-errors';

const formatJSONResponse = async (ctx, next) => {
  try {
    ctx.type = 'application/json';
    await next();

    const { code = 200, data = null } = ctx.state.result || {};

    ctx.status = code;
    ctx.body = { data, status: data ? 'OK' : 'No Content' };
  } catch (err) {
    if (err instanceof HTTPErrors.HTTPError) {
      const { message = '', status = 'Error' } = err;

      ctx.status = err.code;
      ctx.body = { data: null, status, msg: message };
    } else {
      ctx.throw(500, err);
    }
  }
};

export default formatJSONResponse;
