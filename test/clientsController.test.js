// Testes unitários de clientController - Clientes 

const { json } = require('express');
const clientController = require('../src/controllers/clientController');
const clientModel = require('../src/models/clientModel');

jest.mock('../src/models/clientModel');

describe("criar cliente controller", () => {


    afterEach(() => {
        jest.clearAllMocks();
    })


    test("criar cliente com sucesso", async () => {
        
        const mockCliente = { nome: 'Fulano de tal', telefone: '11 97389-6382' };
        clientModel.create.mockResolvedValue(mockCliente);

        const req = {
            body: mockCliente
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await clientController.criarCliente(req, res);
        
        expect(clientModel.create).toHaveBeenCalledWith(mockCliente);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status).not.toHaveBeenCalledWith(500);
        expect(res.json.mock.calls[0][0]).toEqual(mockCliente)
    });



        test('Tentativa de cria cliente com numero vazio', async () => {

            const mockCliente = { nome: 'Fulano de tal', telefone: ' ' };

            const req = {
                body: mockCliente
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

        await clientController.criarCliente(req, res);

        
        
        expect(clientModel.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status).not.toHaveBeenCalledWith(201);
        expect(res.json.mock.calls[0][0]).toEqual({ msg: 'Nome e telefone são obrigatórios.'});

        });


        test('Tentativa de cria cliente com nome vazio', async () => {

            const mockCliente = {nome: ' ' , telefone: '11 97389-6382'}

            const req = {
                body: mockCliente
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await clientController.criarCliente(req, res);

            expect(clientModel.create).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.status).not.toHaveBeenCalledWith(201);
            expect(res.json.mock.calls[0][0]).toEqual({msg: 'Nome e telefone são obrigatórios.'})

        })

        test('Tentativa de criar cliente dando erro no banco de dados', async () => {

            const mockCliente = { nome: 'Fulano de tal', telefone: '11 97389-6382' };
            clientModel.create.mockRejectedValue (new Error('Falha no banco'))

            const req = {body: mockCliente};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()

            }

            await clientController.criarCliente(req, res);

            expect(clientModel.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                msg: 'Erro ao cadastrar cliente',
                erro: 'Falha no banco'
            }))

        })



    });
