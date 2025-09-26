

// Aguarda o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', function() {

    // Dados de exemplo (no futuro, isso viria de um banco de dados)
    const dadosFuncionarios = [
        {
            nome: 'Ana Silva',
            concluidas: 25,
            pendentes: 5
        },
        {
            nome: 'Carlos Souza',
            concluidas: 18,
            pendentes: 8
        },
        {
            nome: 'Beatriz Lima',
            concluidas: 32,
            pendentes: 2
        },
        {
            nome: 'Daniel Costa',
            concluidas: 15,
            pendentes: 12
        }
    ];

    const statsGrid = document.getElementById('stats-grid');

    // Função para criar e exibir os cards de estatísticas
    function carregarEstatisticas() {
        // Limpa a área antes de adicionar novos cards
        statsGrid.innerHTML = '';

        dadosFuncionarios.forEach(funcionario => {
            // Cria o elemento do card
            const card = document.createElement('div');
            card.className = 'stat-card';

            // Adiciona o conteúdo HTML ao card
            card.innerHTML = `
                <h3>${funcionario.nome}</h3>
                <div class="stat-item">
                    <span>Concluídas</span>
                    <span>${funcionario.concluidas}</span>
                </div>
                <div class="stat-item">
                    <span>Pendentes</span>
                    <span>${funcionario.pendentes}</span>
                </div>
            `;

            // Adiciona o card criado à grade na página
            statsGrid.appendChild(card);
        });
    }

    // Chama a função para carregar os dados quando a página abrir
    carregarEstatisticas();
});