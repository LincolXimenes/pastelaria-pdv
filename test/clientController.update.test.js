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


    test ('atualiza cliente com sucesso', async () => {

        const cliente = {id: '123' , nome: 'testeAtualizado', telefone: '11 98374-9384'}
        clientModel.findByIdAndUpdate.mockResolvedValue(cliente);

        const res = responseMock;

        await clientController.atualizarCliente(req, res)

        expect(clientModel.findByIdAndUpdate).toHaveBeenCalled();
        expect(clientModel.findByIdAndUpdate).toHaveBeenCalledWith('123',{nome: 'testeAtualizado', telefone: '11 98374-9384'}, {new : true})
        expect(res.json).toHaveBeenCalledWith(cliente);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: '123',
            nome: 'testeAtualizado',
            telefone: '11 98374-9384'

        }))

    })

    test('tentativa de atualização de cliente inexistente', async () => {

        clientModel.findByIdAndUpdate.mockResolvedValue(null);
        const res = responseMock;
        await clientController.atualizarCliente(req , res);

        expect(clientModel.findByIdAndUpdate).toHaveBeenCalled();
        expect(clientModel.findByIdAndUpdate).toHaveBeenCalledWith('123', {nome: 'testeAtualizado', telefone: '11 98374-9384'}, {new : true});
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            msg: 'Cliente não encontrado'
        }));

    })

    test('tentativa de atualização de cliente com nome vazio', async () => {
        const cliente = {id: '123' , nome: 'testeAtualizado', telefone: '11 98374-9384'}
        clientModel.findByIdAndUpdate.mockResolvedValue(cliente);

        const res = responseMock;
        const request = {params: {id: '123'} , body: {nome:'', telefone: '11 98374-9384'}}
        await clientController.atualizarCliente(request, res)
        
        expect(clientModel.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            msg: 'Nome e telefone são obrigatórios.'
        }));
    })

    test('tentativa de atualização de cliente com telefone vazio', async () => {
        const cliente = {id: '123' , nome: 'testeAtualizado', telefone: '11 98374-9384'}
        clientModel.findByIdAndUpdate.mockResolvedValue(cliente);

        const res = responseMock;
        const request = {params: {id: '123'} , body: {nome:'testeAtualizado', telefone: ''}}
        await clientController.atualizarCliente(request, res)
        
        expect(clientModel.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            msg: 'Nome e telefone são obrigatórios.'
        }));
    })

    test('Tentativa de atualizar cliente dando erro no banco de dados', async () => {
        clientModel.findByIdAndUpdate.mockRejectValue(new Error('Falha no banco'))

        const res = responseMock;
        await clientController.atualizarCliente(req, res);

        expect(clientModel.findByIdAndUpdate).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            msg: 'Erro ao atualizar cliente',
            erro: 'Falha no banco'
        }))
    })
});
