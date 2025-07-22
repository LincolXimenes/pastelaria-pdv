
function gerarMensagemWhatsApp(pedido) {
    const cliente = pedido.cliente.nome;
    const telefone = pedido.cliente.telefone || 'Sem telefone';

    let texto = 'Pedido de ${cliente} ($2B55${telefone}):\n\n';

    pedido.produtos.forEach(item => {
        texto += '${item.quantidade}x ${item.produto.nome} - R$${item.produto.preco.toFixed(2)}\n';
    });

    texto += '\n Total: R$${pedido.total}.toFixed(2)}\n';
    texto += 'Entrega: ${pedido.metodoEntrega.toUpperCase()}';

    return 'https://wa.me/55${telefone}?text=${encodeURIComponent(texto)}';
}

module.exports = gerarMensagemWhatsApp;

