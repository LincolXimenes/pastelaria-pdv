const { json } = require('express');
const clientController = require('../src/controllers/clientController');
const clientModel = require('../src/models/clientModel');

jest.mock('../src/models/clientModel');

describe('Buscar cliente por id na camada controller', () => {

    const req = {params: {id:'355'}, body: {nome: "Cliente teste", telefone: '11 98633-4724'}}
    const userClienteCorreto = {id: '355', nome: 'Cliente teste', telefone: '11 98633-4724'}
    const userClienteIncorreto = {id: '535', nome: 'Cliente teste', telefone: '11 98633-4724'}

    const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }

    test('Buscar cliente por id com sucesso', async () => {
        clientModel.findById.mockResolvedValue(userClienteCorreto);

        await clientController.buscarCliente(req, responseMock);

        expect(responseMock.status).not.toHaveBeenCalledWith(404);
        expect(responseMock.status).not.toHaveBeenCalledWith(500);
        expect(responseMock.json).toHaveBeenCalledWith(userClienteCorreto);

    })

    test('Buscar cliente com por id com inexistente', async () => {
        clientModel.findById.mockResolvedValue(null);
        await clientController.buscarCliente(req, responseMock)

        expect(responseMock.status).toHaveBeenCalledWith(404);
        expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining({
            msg: 'Cliente não encontrado'
        }))
    })

    test('Tentativa de buscar cliente com falha no banco', async () => {
        clientModel.findById.mockRejectedValue(new Error('Falha no banco'))
        await clientController.buscarCliente(req, responseMock)

        expect(responseMock.status).toHaveBeenCalledWith(500);
        expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining({
            erro: 'Falha no banco',
            msg: 'Erro ao buscar cliente'
        }))
    })
})