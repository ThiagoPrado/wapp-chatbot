/**
 * Gera um “message” fake parecido com o que chega do WhatsApp Web.js.
 * Você pode sobrescrever qualquer campo passando um objeto no parâmetro.
 *
 * @example
 *   const msg = messageFactory({ body: 'oi' });
 */
module.exports = function messageFactory(overrides = {}) {
  return {
    body: 'teste',
    from: '5511999999999',
    timestamp: Date.now(),
    ...overrides,
  };
};
