import { AtivoController } from '../../../modules/ativo/ativo.controller.js';
import { AtivoService } from '../../../modules/ativo/ativo.service.js';
import { FastifyRequest, FastifyReply } from 'fastify';
import { makeMockAtivo } from '../../../utils/makeMockAtivo.js';
import { CreateAtivoDTO } from '../../../modules/ativo/dto/create-ativo-dto.js';
import { jest } from '@jest/globals'; // ou apenas jest se já estiver disponível



jest.mock('../../../modules/ativo/ativo.service.js');



describe('AtivoController - Unit', () => {
    let controller: AtivoController;
    let serviceMock: jest.Mocked<AtivoService>;
    let mockReply: FastifyReply;

    beforeEach(() => {
        serviceMock = {
            createAtivo: jest.fn(),
            getAtivos: jest.fn(),
            getAtivoById: jest.fn(),
            updateAtivo: jest.fn(),
            deleteAtivo: jest.fn(),
        } as unknown as jest.Mocked<AtivoService>;;



        controller = new AtivoController(serviceMock);

        mockReply = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as FastifyReply;
    });

    // ----------------------------
    describe('create()', () => {
        it('deve criar um ativo e retornar status 201', async () => {
            const requestBody: CreateAtivoDTO = {
                nome: 'Ativo A',
                valor: 1000,
                data: new Date().toISOString() as unknown as Date, // Simulando entrada como string
                tipo: 'Financeiro',
                simulacaoId: 123,
                financiamento: false,
                parcelas: 10,
                taxaDeJuros: undefined,
                valorDeEntrada: undefined,
            };

            const mockRequest = {
                body: requestBody,
            } as unknown as FastifyRequest;

            const mockAtivo = makeMockAtivo({ nome: 'Ativo A' });


            serviceMock.createAtivo.mockResolvedValue(mockAtivo);

            await controller.create(mockRequest, mockReply);

            expect(serviceMock.createAtivo).toHaveBeenCalledWith(expect.objectContaining({
                nome: 'Ativo A',
                valor: 1000,
                tipo: 'Financeiro',
                simulacaoId: 123,
            }));
            expect(mockReply.status).toHaveBeenCalledWith(201);
            expect(mockReply.send).toHaveBeenCalledWith(mockAtivo);
        });

        it('deve retornar 400 se payload for inválido', async () => {
            const mockRequest = { body: {} } as FastifyRequest;

            await controller.create(mockRequest, mockReply);

            expect(mockReply.status).toHaveBeenCalledWith(400);
            expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.any(String),
            }));
        });
    });

      // ----------------------------
      describe('readAll()', () => {
        it('deve retornar todos os ativos', async () => {
          const mockAtivos = [makeMockAtivo()];
          serviceMock.getAtivos.mockResolvedValue(mockAtivos);

          await controller.readAll({} as FastifyRequest, mockReply);

          expect(mockReply.send).toHaveBeenCalledWith(mockAtivos);
        });

        it('deve retornar 404 se não houver ativos', async () => {
          serviceMock.getAtivos.mockResolvedValue([]);

          await controller.readAll({} as FastifyRequest, mockReply);

          expect(mockReply.status).toHaveBeenCalledWith(404);
          expect(mockReply.send).toHaveBeenCalledWith({ message: 'Não existe nenhum ativo!' });
        });
      });

      // ----------------------------
      describe('readOne()', () => {
        it('deve retornar o ativo pelo ID', async () => {
          const mockAtivo = makeMockAtivo({ id: 2 });
          serviceMock.getAtivoById.mockResolvedValue(mockAtivo);

          const mockRequest = {
            params: { id: '1' },
          } as unknown as FastifyRequest;

          await controller.readOne(mockRequest, mockReply);

          expect(serviceMock.getAtivoById).toHaveBeenCalledWith(1);
          expect(mockReply.send).toHaveBeenCalledWith(mockAtivo);
        });

        it('deve retornar 400 se ID for inválido', async () => {
          const mockRequest = {
            params: { id: 1 },
          } as unknown as FastifyRequest;

          await controller.readOne(mockRequest, mockReply);

          expect(mockReply.status).toHaveBeenCalledWith(400);
          expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String),
          }));
        });
      });

      // ----------------------------
      describe('update()', () => {
        it('deve atualizar um ativo e retornar resultado', async () => {
          const mockRequest = {
            params: { id: '1' },
            body: { nome: 'Atualizado' },
          } as unknown as FastifyRequest;

          const mockAtivo = makeMockAtivo({ id: 1, nome: 'Atualizado' });
          serviceMock.updateAtivo.mockResolvedValue(mockAtivo);

          await controller.update(mockRequest, mockReply);

          expect(serviceMock.updateAtivo).toHaveBeenCalledWith(1, { nome: 'Atualizado' });
          expect(mockReply.send).toHaveBeenCalledWith(mockAtivo);
        });

        it('deve retornar 400 se dados forem inválidos', async () => {
          const mockRequest = {
            params: { id: '1' },
            body: {}, // corpo inválido (violando schema)
          } as unknown as FastifyRequest;

          await controller.update(mockRequest, mockReply);

          expect(mockReply.status).toHaveBeenCalledWith(400);
          expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String),
          }));
        });
      });

      // ----------------------------
      describe('delete()', () => {
        it('deve deletar um ativo e retornar 204', async () => {
          const mockRequest = {
            params: { id: '1' },
          } as unknown as FastifyRequest;

          serviceMock.deleteAtivo.mockResolvedValue(makeMockAtivo());

          await controller.delete(mockRequest, mockReply);

          expect(serviceMock.deleteAtivo).toHaveBeenCalledWith(1);
          expect(mockReply.status).toHaveBeenCalledWith(204);
          expect(mockReply.send).toHaveBeenCalled();
        });

        it('deve retornar 400 se ID for inválido', async () => {
          const mockRequest = {
            params: { id: 1 },
          } as unknown as FastifyRequest;

          await controller.delete(mockRequest, mockReply);

          expect(mockReply.status).toHaveBeenCalledWith(400);
          expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String),
          }));
        });
      });
});
