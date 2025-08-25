function gerarMensagemWhatsApp(pedido) {
    const cliente = pedido.cliente?.nome || 'Cliente';
    let telefone = pedido.cliente?.telefone || '';
    // Remove caracteres não numéricos do telefone
    telefone = telefone.replace(/\D/g, '');

    let texto = `Pedido de ${cliente} (📞 ${telefone || 'Sem telefone'}):\n\n`;

    pedido.produtos.forEach(item => {
        const nomeProduto = item.produto?.nome || 'Produto';
        const precoProduto = item.produto?.preco ? item.produto.preco.toFixed(2) : '0.00';
        texto += `${item.quantidade}x ${nomeProduto} - R$${precoProduto}\n`;
    });

    texto += `\nTotal: R$${pedido.total?.toFixed(2) || '0.00'}\n`;
    texto += `Entrega: ${pedido.metodoEntrega ? pedido.metodoEntrega.toUpperCase() : 'N/A'}`;

    // Adiciona endereço se existir
    if (pedido.cliente?.endereco) {
        const end = pedido.cliente.endereco;
        texto += `\nEndereço: ${end.rua || ''} ${end.numero || ''} ${end.bairro || ''} ${end.complemento ? ' - ' + end.complemento : ''}, ${end.cidade}`.trim();
    }
    // Se não houver telefone, retorna apenas o texto
    if (!telefone || telefone.lenght < 10) return texto;

    return `https://wa.me/55${telefone}?text=${encodeURIComponent(texto)}`;
}

module.exports = gerarMensagemWhatsApp;