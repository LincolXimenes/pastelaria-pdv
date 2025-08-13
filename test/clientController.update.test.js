const clientController = require('../src/controllers/clientController');
const clientModel = require('../src/models/clientModel');

jest.mock('../src/models/clientModel');


describe('atualização de cliente na camada controller cliente', () => {

    const req = {params: {id: '123'} , body: {nome:'testeAtualizado', telefone: '11 98374-9384'}}

    const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }

    afterEach(() => {
        jest.clearAllMocks();
    })


    test.only ('atualiza cliente com sucesso', async () => {

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
});
