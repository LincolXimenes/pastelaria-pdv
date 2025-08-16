const clientController = require('../src/controllers/clientController');
const clientModel = require('../src/models/clientModel');

jest.mock('../src/models/clientModel');

describe('Listar Cliente na camada controller', () => {

   const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }

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
      },

      {
        nome: 'teste new 2',
        email: 'teste321@gmail.com',
        senha: 'teste321',
        isAdmin: true
      }

    ];

        clientModel.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(mockClientes) });
        const req = {}
        await clientController.listarClientes(req, responseMock)

        expect(clientModel.find).toHaveBeenCalled();
        expect(responseMock.json).toHaveBeenCalledWith(mockClientes)

    })




    test('Lista clientes com falha', async () => {

        clientModel.find = jest.fn().mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error ('Falha no banco')) })
        const req = {}
        await clientController.listarClientes(req, responseMock);

        expect(clientModel.find).toHaveBeenCalled();
        expect(responseMock.status).toHaveBeenCalledWith(500);
        expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining({ msg: 'Erro ao buscar clientes', erro: 'Falha no banco' }))
    })

});
