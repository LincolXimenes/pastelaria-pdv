// Testes unitários de clientController - Clientes 

const clientController = require('../src/controllers/clientController');
const clientModel = require('../src/models/clientModel');

jest.mock('../src/models/clientModel');



describe("criar cliente na camada controller", () => {

   const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }

    afterEach(() => {
        jest.clearAllMocks();
    })


    test("criar cliente com sucesso", async () => {
        
        const mockCliente = { nome: 'Fulano de tal', telefone: '11 97389-6382' };
        clientModel.create.mockResolvedValue(mockCliente);
        const req = { body: mockCliente };
        await clientController.criarCliente(req, responseMock);

        expect(clientModel.create).toHaveBeenCalledWith(mockCliente);
        expect(responseMock.status).toHaveBeenCalledWith(201);
        expect(responseMock.status).not.toHaveBeenCalledWith(500);
        expect(responseMock.json).toHaveBeenCalledWith(mockCliente);
    });



    test('Tentativa de cria cliente com numero vazio', async () => {

        const mockCliente = { nome: 'Fulano de tal', telefone: ' ' };
        const req = { body: mockCliente };
        await clientController.criarCliente(req, responseMock);

        expect(clientModel.create).not.toHaveBeenCalled();
        expect(responseMock.status).toHaveBeenCalledWith(400);
        expect(responseMock.status).not.toHaveBeenCalledWith(201);
        expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining ({msg: 'Nome e telefone são obrigatórios.'}))

    });


    test('Tentativa de cria cliente com nome vazio', async () => {

        const mockCliente = {nome: ' ' , telefone: '11 97389-6382'}
        const req = {body: mockCliente};
        await clientController.criarCliente(req, responseMock);

        expect(clientModel.create).not.toHaveBeenCalled();
        expect(responseMock.status).toHaveBeenCalledWith(400);
        expect(responseMock.status).not.toHaveBeenCalledWith(201);
        expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining ({msg: 'Nome e telefone são obrigatórios.'}))

    })

    test('Tentativa de criar cliente com erro no banco de dados', async () => {

        const mockCliente = { nome: 'Fulano de tal', telefone: '11 97389-6382' };
        clientModel.create.mockRejectedValue (new Error('Falha no banco'))
        const req = {body: mockCliente};
        await clientController.criarCliente(req, responseMock);

        expect(clientModel.create).toHaveBeenCalled();
        expect(responseMock.status).toHaveBeenCalledWith(500);
        expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining({
            msg: 'Erro ao cadastrar cliente',
            erro: 'Falha no banco'
        }))
    })
});
