document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS INICIAIS ---
    // Em uma aplicação real, estes dados viriam da mesma fonte que as outras páginas (API)
    const employees = [
        { id: 1, name: 'Ana Silva' }, { id: 2, name: 'Carlos Souza' },
        { id: 3, name: 'Juliana Pereira' }, { id: 4, name: 'Marcos Lima' },
        { id: 5, name: 'Fernanda Costa' }, { id: 6, name: 'Ricardo Alves' }
    ];
    const tasks = [
        { id: 1, title: 'Atualizar relatório de vendas trimestral', responsible: 'Ana Silva', dueDate: '2025-10-05', status: 'in-progress', priority: 'medium' },
        { id: 2, title: 'Reunião de alinhamento com marketing', responsible: 'Carlos Souza', dueDate: '2025-09-30', status: 'pending', priority: 'high' },
        { id: 3, title: 'Revisar layout do novo website', responsible: 'Juliana Pereira', dueDate: '2025-09-28', status: 'completed', priority: 'medium' },
        { id: 4, title: 'Contatar fornecedor de software', responsible: 'Marcos Lima', dueDate: '2025-10-02', status: 'in-progress', priority: 'low' },
        { id: 5, title: 'Testar novo fluxo de login', responsible: 'Fernanda Costa', dueDate: '2025-10-10', status: 'pending', priority: 'high' },
        { id: 6, title: 'Deploy da nova feature', responsible: 'Ricardo Alves', dueDate: '2025-09-29', status: 'completed', priority: 'high' },
        { id: 7, title: 'Configurar CI/CD', responsible: 'Ricardo Alves', dueDate: '2025-10-15', status: 'in-progress', priority: 'high' },
        { id: 8, title: 'Entrevista com novo candidato', responsible: 'Marcos Lima', dueDate: '2025-10-01', status: 'completed', priority: 'low' }
    ];

    /**
     * GRÁFICO 1: TAREFAS POR STATUS (GRÁFICO DE ROSCA)
     */
    function createTasksStatusChart() {
        const ctx = document.getElementById('tasksStatusChart')?.getContext('2d');
        if (!ctx) return;

        const statusCounts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pendente', 'Em Andamento', 'Concluída'],
                datasets: [{
                    label: 'Status das Tarefas',
                    data: [
                        statusCounts.pending || 0,
                        statusCounts['in-progress'] || 0,
                        statusCounts.completed || 0
                    ],
                    backgroundColor: ['#c62828', '#F57F17', '#2e7d32'],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' } }
            }
        });
    }

    /**
     * GRÁFICO 2: CARGA DE TRABALHO POR FUNCIONÁRIO (GRÁFICO DE BARRAS)
     */
    function createWorkloadChart() {
        const ctx = document.getElementById('workloadChart')?.getContext('2d');
        if (!ctx) return;

        const workload = employees.map(employee => {
            const taskCount = tasks.filter(task => task.responsible === employee.name).length;
            return { name: employee.name, count: taskCount };
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: workload.map(w => w.name),
                datasets: [{
                    label: 'Nº de Tarefas Atribuídas',
                    data: workload.map(w => w.count),
                    backgroundColor: 'rgba(0, 77, 64, 0.8)', // Variação da cor principal
                    borderColor: 'rgba(0, 77, 64, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y', // Deixa as barras na horizontal para melhor leitura
                plugins: { legend: { display: false } }
            }
        });
    }
    
    /**
     * GRÁFICO 3: TAREFAS POR PRIORIDADE (GRÁFICO DE PIZZA)
     */
    function createPriorityChart() {
        const ctx = document.getElementById('priorityChart')?.getContext('2d');
        if (!ctx) return;

        const priorityCounts = tasks.reduce((acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
        }, {});
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Alta', 'Média', 'Baixa'],
                datasets: [{
                    label: 'Prioridade das Tarefas',
                    data: [
                        priorityCounts.high || 0,
                        priorityCounts.medium || 0,
                        priorityCounts.low || 0
                    ],
                    backgroundColor: ['#f44336', '#ffc107', '#4caf50'],
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' } }
            }
        });
    }

    /**
     * GRÁFICO 4: TAREFAS CONCLUÍDAS AO LONGO DO TEMPO (GRÁFICO DE LINHA)
     */
    function createTasksOverTimeChart() {
        const ctx = document.getElementById('tasksOverTimeChart')?.getContext('2d');
        if (!ctx) return;

        const completedTasks = tasks.filter(t => t.status === 'completed');
        const tasksByMonth = completedTasks.reduce((acc, task) => {
            // Formata a data para "Mês/Ano", ex: "Set/2025"
            const monthYear = new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            acc[monthYear] = (acc[monthYear] || 0) + 1;
            return acc;
        }, {});
        
        const sortedLabels = Object.keys(tasksByMonth).sort((a, b) => new Date(a) - new Date(b));
        const sortedData = sortedLabels.map(label => tasksByMonth[label]);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedLabels,
                datasets: [{
                    label: 'Tarefas Concluídas',
                    data: sortedData,
                    borderColor: 'rgba(0, 77, 64, 1)',
                    backgroundColor: 'rgba(0, 77, 64, 0.1)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }


    // --- INICIALIZAÇÃO ---
    // Chama todas as funções para criar os gráficos quando a página carregar
    createTasksStatusChart();
    createWorkloadChart();
    createPriorityChart();
    createTasksOverTimeChart();
});