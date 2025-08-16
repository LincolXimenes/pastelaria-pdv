const clientController = require('../src/controllers/clientController');
const clientModel = require('../src/models/clientModel');

jest.mock('../src/models/clientModel');

const req = {params: {id:'355'}, body: {nome: "Cliente teste", telefone: '11 98633-4724'}}
const userClienteCorreto = {id: '355', nome: 'Cliente teste', telefone: '11 98633-4724'}

 const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }

    afterEach(() => {
        jest.clearAllMocks();
    })

describe('Listar Cliente na camada controller', () => {
    
    test('Deletar cliente com sucesso', async () => {
        clientModel.findByIdAndDelete.mockResolvedValue(userClienteCorreto);
        await clientController.deletarCliente(req, responseMock);

        expect(responseMock.status).not.toHaveBeenCalledWith(404);
        expect(responseMock.status).not.toHaveBeenCalledWith(500);
        expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining({ msg:'Cliente deletado com sucesso'}))
    })

    test('Tentativa de deletar cliente inxistente', async () => {
        clientModel.findByIdAndDelete.mockResolvedValue(null);
        await clientController.deletarCliente(req, responseMock);

        expect(responseMock.status).toHaveBeenCalledWith(404);
        expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining({ msg:'Cliente não encontrado'}))
    })

     test('Tentativa de deletar com falha no banco de dados', async () => {
        clientModel.findByIdAndDelete.mockRejectedValue(new Error('Falha no banco'));
        await clientController.deletarCliente(req, responseMock);

        expect(responseMock.status).toHaveBeenCalledWith(500);
        expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining({ erro: 'Falha no banco' ,msg:'Erro ao deletar cliente'}))
    })
});