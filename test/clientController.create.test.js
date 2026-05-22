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
        
        const requestBody = {
            nome: 'Fulano de tal',
            email: 'fulano@email.com',
            senha: '123456',
            telefone: '11973896382'
        };
        const mockCliente = {
            id: '1',
            nome: requestBody.nome,
            email: requestBody.email,
            telefone: requestBody.telefone,
            ativo: true
        };
        clientModel.create.mockResolvedValue(mockCliente);
        const req = { body: requestBody };
        await clientController.criarCliente(req, responseMock);

        expect(clientModel.create).toHaveBeenCalledWith(expect.objectContaining({
            nome: requestBody.nome,
            email: requestBody.email,
            telefone: requestBody.telefone,
            senha: expect.any(String)
        }));
        expect(responseMock.status).toHaveBeenCalledWith(201);
        expect(responseMock.status).not.toHaveBeenCalledWith(500);
        expect(responseMock.json).toHaveBeenCalledWith(mockCliente);
    });



    test('Tentativa de cria cliente com numero vazio', async () => {

        const mockCliente = { nome: 'Fulano de tal', email: 'fulano@email.com', senha: '123456', telefone: ' ' };
        clientModel.create.mockRejectedValue(new Error('Falha de validação'));
        const req = { body: mockCliente };
        await clientController.criarCliente(req, responseMock);

        expect(clientModel.create).toHaveBeenCalled();
        expect(responseMock.status).toHaveBeenCalledWith(500);
        expect(responseMock.status).not.toHaveBeenCalledWith(201);
        expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining ({msg: 'Erro ao cadastrar cliente'}))

    });


    test('Tentativa de cria cliente com nome vazio', async () => {

        const mockCliente = {nome: ' ' , email: 'fulano@email.com', senha: '123456', telefone: '11973896382'}
        clientModel.create.mockRejectedValue(new Error('Falha de validação'));
        const req = {body: mockCliente};
        await clientController.criarCliente(req, responseMock);

        expect(clientModel.create).toHaveBeenCalled();
        expect(responseMock.status).not.toHaveBeenCalledWith(400);
        expect(responseMock.status).not.toHaveBeenCalledWith(201);
        expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining ({msg: 'Erro ao cadastrar cliente'}))

    })

    test('Tentativa de criar cliente com erro no banco de dados', async () => {

        const mockCliente = { nome: 'Fulano de tal', email: 'fulano@email.com', senha: '123456', telefone: '11973896382' };
        clientModel.create.mockRejectedValue (new Error('Falha no banco'))
        const req = {body: mockCliente};
        await clientController.criarCliente(req, responseMock);

        expect(clientModel.create).toHaveBeenCalled();
        expect(responseMock.status).toHaveBeenCalledWith(500);
        expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining({ msg: 'Erro ao cadastrar cliente', erro: 'Falha no banco' }))
    })
});
