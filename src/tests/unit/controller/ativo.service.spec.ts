import { FastifyRequest, FastifyReply } from "fastify";
import { CreateAtivoDTO } from "../../../modules/ativo/dto/create-ativo-dto.js";
import { UpdateAtivoDTO } from "../../../modules/ativo/dto/update-ativo-dto.js";
import { AtivoParamsDTO } from "../../../modules/ativo/dto/read-ativo-dto.js";
import { AtivoService } from "../../../modules/ativo/ativo.service.js";
import { AtivoRepository } from "../../../modules/ativo/ativo.repository.js";
import { makeMockAtivo } from "../../../utils/makeMockAtivo.js";
import { jest } from '@jest/globals';




describe('AtivoService - Unit', () => {
    let ativoService: AtivoService;
    let ativoRepositoryMock: jest.Mocked<AtivoRepository>;

    beforeEach(() => {
        ativoRepositoryMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<AtivoRepository>


        ativoService = new AtivoService(ativoRepositoryMock);
    })


    describe('createAtivo()', () => {
        it('deve criar um ativo e chamar o repository para persistencia de dados', async () => {
            const createAtivo: CreateAtivoDTO = {
                nome: 'Novo Ativo',
                valor: 5000,
                data: new Date(),
                tipo: 'Financeiro',
                simulacaoId: 1,
                financiamento: false,
                parcelas: 12,
                taxaDeJuros: 0.05,
                valorDeEntrada: 1000,
            };

            const mockAtivoCriado = makeMockAtivo({ nome: 'Novo ativo' })

            ativoRepositoryMock.create.mockResolvedValue(mockAtivoCriado);

            const result = await ativoService.createAtivo(createAtivo);

            expect(ativoRepositoryMock.create).toHaveBeenCalledWith(createAtivo);
            expect(result).toEqual(mockAtivoCriado);
        })
    });


    describe('getAtivos()', () => {
        it('Função que retornar todos os ativos', async () => {

            const mockAtivos = [makeMockAtivo({ nome: 'Ativo 1' }), makeMockAtivo({ nome: 'Ativo 2' })];

            ativoRepositoryMock.findAll.mockResolvedValue(mockAtivos);

            const result = await ativoService.getAtivos();

            expect(ativoRepositoryMock.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockAtivos);

        })
    });

    describe('getAtivoById', () => {
        it('Teste que retorna os ativos com base no ID passado por parametro', async () => {
            const mockAtivos = makeMockAtivo({ nome: 'Ativo 1' });
            const id = 1;

            ativoRepositoryMock.findById.mockResolvedValue(mockAtivos);

            const result = await ativoService.getAtivoById(id);

            expect(ativoRepositoryMock.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockAtivos);
        });

        it('Deve lançar um erro', async () => {
            const id = 999;

            ativoRepositoryMock.findById.mockResolvedValue(null);

            await expect(ativoService.getAtivoById(id)).rejects.toThrow('Ativo não encontrado.');
            
            expect(ativoRepositoryMock.findById).toHaveBeenCalledWith(id);
        })
    });

    describe('updateAtivo()', () => {
        it('Teste para atualizar um ativo', async () => {
            const id = 1;
            const data: UpdateAtivoDTO = {
                nome: 'Novo ativo 2'
            };

            const mockAtivo = makeMockAtivo({
                nome: data.nome,
                valor: 5000,
                data: new Date(),
                tipo: 'Financeiro',
                simulacaoId: 1,
                financiamento: false,
                parcelas: 12,
                taxaDeJuros: 0.05,
                valorDeEntrada: 1000,
            });

            ativoRepositoryMock.update.mockResolvedValue(mockAtivo);

            const result = await ativoService.updateAtivo(id, data);

            expect(ativoRepositoryMock.update).toHaveBeenCalledWith(id, data);
            expect(result).toEqual(mockAtivo);
        })
    });


    describe('deleteAtivo()', () => {
        it('Teste para deletar um ativo', async () => {
            const id = 1;

            const mockAtivo = makeMockAtivo({
                nome: 'Ativo 2',
                valor: 5000,
                data: new Date(),
                tipo: 'Financeiro',
                simulacaoId: 1,
                financiamento: false,
                parcelas: 12,
                taxaDeJuros: 0.05,
                valorDeEntrada: 1000,
            });

            ativoRepositoryMock.delete.mockResolvedValue(mockAtivo);

            const result = await ativoService.deleteAtivo(id);

            expect(ativoRepositoryMock.delete).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockAtivo);
        })

    })
})