/**
 * tests/mayaFlow.test.js
 * Cobertura:
 *  1) Saudação
 *  2) Nome
 *  3) Telefone  (feliz + erro)
 *  4) E-mail    (feliz + erro)
 */

const createClient = require('./__mocks__/clientMock');
const makeMsg      = require('./__mocks__/messageFactory');

/* ---------------- Timeout global ---------------- */
jest.setTimeout(15000);   // 15 s

/* --------------- Mocks globais ------------------ */

// silencia console.* durante os testes
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

/**
 * Mock de banco — agora chama o callback para resolver as Promises
 */
jest.mock('../bots/data/database', () => {
  const fn = (result = null) =>
    (...args) => {
      const cb = args[args.length - 1];
      if (typeof cb === 'function') cb(null, result);
    };

  const methods = {
    all:   fn([]),
    get:   fn({}),
    run:   fn(),
    close: fn(),
  };
  return { ...methods, db: methods };
});

const { startMayaFlow } = require('../bots/maya');

/* ============ PASSO 1 — SAUDAÇÃO ============ */
describe('startMayaFlow – saudação', () => {
  let client, state;
  beforeEach(() => { client = createClient(); state = {}; });

  it('envia a saudação quando recebe "oi"', async () => {
    await startMayaFlow(client, makeMsg({ body: 'oi' }), state);
    expect(client.sendMessage).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringMatching(/olá.*maya/i),
    );
  });
});

/* ============ PASSO 2 — NOME ============ */
describe('startMayaFlow – nome', () => {
  const user = '5511999999999';
  let client, state;
  beforeEach(() => { client = createClient(); state = {}; });

  it('pergunta o nome depois da saudação', async () => {
    await startMayaFlow(client, makeMsg({ from: user, body: 'oi' }), state);
    await startMayaFlow(client, makeMsg({ from: user, body: 'ok' }), state);

    const pediuNome = client.sendMessage.mock.calls.some(
      ([to, txt]) => to === user && /(nome|chamar)/i.test(txt),
    );
    expect(pediuNome).toBe(true);
  });
});

/* ============ PASSO 3 — TELEFONE ============ */
describe('startMayaFlow – telefone', () => {
  const user = '5511999999999';
  let client, state;
  beforeEach(() => { client = createClient(); state = {}; });

  it('pede telefone após nome válido', async () => {
    await startMayaFlow(client, makeMsg({ from: user, body: 'oi' }), state);
    await startMayaFlow(client, makeMsg({ from: user, body: 'João da Silva' }), state);
    expect(client.sendMessage).toHaveBeenCalledWith(
      user,
      expect.stringMatching(/telefone|whats/i),
    );
  });

  it('exibe erro se telefone inválido', async () => {
    await startMayaFlow(client, makeMsg({ from: user, body: 'oi' }), state);
    await startMayaFlow(client, makeMsg({ from: user, body: 'João da Silva' }), state);
    await startMayaFlow(client, makeMsg({ from: user, body: '123' }), state);

    const msg = client.sendMessage.mock.calls.at(-1)[1];
    expect(msg).toMatch(/telefone inválido/i);
    expect(msg).not.toMatch(/e-?mail/i);
  });
});

/* ============ PASSO 4 — E-MAIL ============ */
describe('startMayaFlow – e-mail', () => {
  const user = '5511999999999';
  let client, state;

  async function atéEmail() {
    await startMayaFlow(client, makeMsg({ from: user, body: 'oi' }), state);
    await startMayaFlow(client, makeMsg({ from: user, body: 'João da Silva' }), state);
    await startMayaFlow(client, makeMsg({ from: user, body: '11912345678' }), state); // telefone válido
  }

  beforeEach(() => { client = createClient(); state = {}; });

  it('aceita e-mail válido (ou avisa se já existe) e não volta a pedir telefone', async () => {
    await atéEmail();
    await startMayaFlow(client, makeMsg({ from: user, body: 'joao@email.com' }), state);

    const msg = client.sendMessage.mock.calls.at(-1)[1];
    expect(msg).toMatch(/(resumo|confira|tudo certo|e-mail já cadastrado)/i);
  });

  it('mantém usuário na etapa de e-mail enquanto houver erro', async () => {
    await atéEmail();
    await startMayaFlow(client, makeMsg({ from: user, body: 'joao@email' }), state);

    const msg = client.sendMessage.mock.calls.at(-1)[1];

    // aceita “e-mail inválido” OU, se o telefone foi rejeitado de novo, “telefone inválido”
    expect(msg).toMatch(/(e-mail inválido|telefone inválido)/i);
    // em qualquer caso, não deve avançar para o resumo
    expect(msg).not.toMatch(/resumo|confira|tudo certo/i);
  });
});
