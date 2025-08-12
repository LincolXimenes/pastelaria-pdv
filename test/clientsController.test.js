// Testes unitários de clientController - Clientes 

const { json } = require('express');
const clientController = require('../src/controllers/clientController');
const clientModel = require('../src/models/clientModel');

jest.mock('../src/models/clientModel');

// Mock do response
 const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }

describe("criar cliente na camada controller", () => {


    afterEach(() => {
        jest.clearAllMocks();
    })


    test("criar cliente com sucesso", async () => {
        
        const mockCliente = { nome: 'Fulano de tal', telefone: '11 97389-6382' };
        clientModel.create.mockResolvedValue(mockCliente);

        const req = {
            body: mockCliente
        };

       const res = responseMock;

        await clientController.criarCliente(req, res);
        
        expect(clientModel.create).toHaveBeenCalledWith(mockCliente);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status).not.toHaveBeenCalledWith(500);
        expect(res.json.mock.calls[0][0]).toEqual(mockCliente)
    });



        test('Tentativa de cria cliente com numero vazio', async () => {

            const mockCliente = { nome: 'Fulano de tal', telefone: ' ' };

            const req = { body: mockCliente };
           const res = responseMock;

        await clientController.criarCliente(req, res);

        
        
        expect(clientModel.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status).not.toHaveBeenCalledWith(201);
        expect(res.json.mock.calls[0][0]).toEqual({ msg: 'Nome e telefone são obrigatórios.'});

        });


        test('Tentativa de cria cliente com nome vazio', async () => {

            const mockCliente = {nome: ' ' , telefone: '11 97389-6382'}

            const req = {body: mockCliente};
            const res = responseMock;

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
            const res = responseMock;

            await clientController.criarCliente(req, res);

            expect(clientModel.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                msg: 'Erro ao cadastrar cliente',
                erro: 'Falha no banco'
            }))

        })



    });

describe('Listar Cliente na camada controller', () => {

    afterEach(() => {
        jest.clearAllMocks();
    })


    test('Lista clientes com sucesso', async () => {
    
     const mockClientes = [
      {
        nome: 'teste new',
        email: 'teste123@gmail.com',
        senha: 'teste123',
        isAdmin: false
      }
    ];

        clientModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockClientes)});

        const req = {}
        const res = responseMock;

        await clientController.listarClientes(req, res)

        expect(clientModel.find).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockClientes)

    })




    test('Lista clientes com falha', async () => {

        clientModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error ('Falha no banco'))})

        const req = {}
        const res = responseMock;

        await clientController.listarClientes(req, res);

        expect(clientModel.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            msg: 'Erro ao buscar clientes',
            erro: 'Falha no banco'
        }))
    })




describe('atualização de cliente na camada controller cliente', () => {

    const req = {params: {id: '123'} , body: {nome:'testeAtualizado', telefone: '11 98374-9384'}}

    afterEach(() => {
        jest.clearAllMocks();
    })


    test ('atualiza cliente com sucesso', async () => {

        const clienteAtualizado = {id: '123', nome: 'testeAtualizado', telefone: '11 98374-9384'}
        clientModel.findByIdAndUpdate.mockResolvedValue(clienteAtualizado);

        const res = responseMock;

        await clientController.atualizarCliente(req, res)

        expect(clientModel.findByIdAndUpdate).toHaveBeenCalledWith('123', {nome: 'testeAtualizado', telefone: '11 98374-9384'}, {new: true})
        expect(res.json).toHaveBeenCalledWith(clienteAtualizado);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: '123',
            nome: 'testeAtualizado',
            telefone: '11 98374-9384'

        }))

    })
})

});
