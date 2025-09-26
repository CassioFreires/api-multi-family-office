export function makeMockAtivo(overrides = {}) {
  return {
    id: 1,
    nome: 'Ativo A',
    tipo: 'Financeiro',
    valor: 1000,
    data: new Date(),
    simulacaoId: 123,
    financiamento: null,
    parcelas: null,
    taxaDeJuros: null,
    valorDeEntrada: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}
