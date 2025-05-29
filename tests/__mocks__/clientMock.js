/**
 * Mock do objeto `client` usado nos fluxos.
 * Inclui sendMessage e sendText — ambos apontam
 * para o mesmo jest.fn() reutilizável.
 */
module.exports = () => {
  const fn = jest.fn().mockResolvedValue(true);

  return {
    sendMessage: fn,
    sendText: fn,
    // adicione outros métodos caso o fluxo use (ex.: sendImage: fn)
  };
};
