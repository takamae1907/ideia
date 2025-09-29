document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS INICIAIS ---
    // Em uma aplicação real, estes dados viriam de uma API
    const employees = [
        { id: 1, name: 'Ana Silva' }, { id: 2, name: 'Carlos Souza' },
        { id: 3, name: 'Juliana Pereira' }, { id: 4, name: 'Marcos Lima' },
        { id: 5, name: 'Fernanda Costa' }, { id: 6, name: 'Ricardo Alves' }
    ];

    let tasks = [
        { id: 1, title: 'Atualizar relatório de vendas trimestral', responsible: 'Ana Silva', dueDate: '2025-10-05', status: 'in-progress', priority: 'medium' },
        { id: 2, title: 'Reunião de alinhamento com marketing', responsible: 'Carlos Souza', dueDate: '2025-09-30', status: 'pending', priority: 'high' },
        { id: 3, title: 'Revisar layout do novo website', responsible: 'Juliana Pereira', dueDate: '2025-09-28', status: 'completed', priority: 'medium' },
        { id: 4, title: 'Contatar fornecedor de software', responsible: 'Marcos Lima', dueDate: '2025-10-02', status: 'in-progress', priority: 'low' },
        { id: 5, title: 'Testar novo fluxo de login', responsible: 'Fernanda Costa', dueDate: '2025-10-10', status: 'pending', priority: 'high' }
    ];

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const columns = document.querySelectorAll('.tasks-container');
    const employeeFilter = document.getElementById('employee-filter');
    const taskSearch = document.getElementById('task-search');

    // --- FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO ---
    function renderBoard() {
        // Limpa todas as colunas
        columns.forEach(column => column.innerHTML = '');
        
        // Filtra as tarefas com base nos controles
        const searchTerm = taskSearch.value.toLowerCase();
        const selectedEmployee = employeeFilter.value;

        const filteredTasks = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm);
            const matchesEmployee = selectedEmployee === 'todos' || task.responsible === selectedEmployee;
            return matchesSearch && matchesEmployee;
        });

        // Cria e distribui os cards de tarefa
        filteredTasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.setAttribute('draggable', true);
            taskCard.dataset.id = task.id;
            taskCard.dataset.priority = task.priority;

            const formattedDate = new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR');

            taskCard.innerHTML = `
                <h4>${task.title}</h4>
                <div class="task-details">
                    <p><strong>Responsável:</strong> ${task.responsible}</p>
                    <p><strong>Prazo:</strong> ${formattedDate}</p>
                </div>
            `;

            // Adiciona o card à coluna correta
            document.getElementById(`tasks-${task.status}`).appendChild(taskCard);
            
            // Adiciona evento para edição
            taskCard.addEventListener('click', () => openTaskModal(task.id));
        });

        addDragAndDropListeners();
    }

    // --- LÓGICA DE DRAG AND DROP ---
    function addDragAndDropListeners() {
        const taskCards = document.querySelectorAll('.task-card');
        
        taskCards.forEach(card => {
            card.addEventListener('dragstart', () => {
                card.classList.add('dragging');
                // Salva o ID do card que está sendo arrastado
                event.dataTransfer.setData('text/plain', card.dataset.id);
            });
            card.addEventListener('dragend', () => card.classList.remove('dragging'));
        });

        columns.forEach(column => {
            column.addEventListener('dragover', event => {
                event.preventDefault(); // Necessário para permitir o drop
                column.classList.add('drag-over');
            });
            column.addEventListener('dragleave', () => column.classList.remove('drag-over'));
            column.addEventListener('drop', event => {
                event.preventDefault();
                column.classList.remove('drag-over');
                
                const taskId = event.dataTransfer.getData('text/plain');
                const newStatus = column.dataset.status;

                // Atualiza o status da tarefa no array de dados
                const task = tasks.find(t => t.id == taskId);
                if (task) {
                    task.status = newStatus;
                    renderBoard(); // Re-renderiza o quadro com o novo estado
                }
            });
        });
    }

    // --- LÓGICA DO MODAL DE TAREFA (ADICIONAR/EDITAR) ---
    const taskModal = document.getElementById('task-modal');
    const taskForm = document.getElementById('task-form');
    const taskModalTitle = document.getElementById('task-modal-title');
    const taskIdInput = document.getElementById('task-id');
    const responsibleSelect = document.getElementById('task-responsible');

    function openTaskModal(taskId = null) {
        taskForm.reset();
        if (taskId) { // Editando
            const task = tasks.find(t => t.id === taskId);
            taskModalTitle.textContent = 'Editar Tarefa';
            taskIdInput.value = task.id;
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-responsible').value = task.responsible;
            document.getElementById('task-due-date').value = task.dueDate;
            document.getElementById('task-priority').value = task.priority;
        } else { // Adicionando
            taskModalTitle.textContent = 'Nova Tarefa';
            taskIdInput.value = '';
        }
        taskModal.classList.add('active');
    }
    
    taskForm.addEventListener('submit', event => {
        event.preventDefault();
        const id = taskIdInput.value;
        const taskData = {
            title: document.getElementById('task-title').value,
            responsible: document.getElementById('task-responsible').value,
            dueDate: document.getElementById('task-due-date').value,
            priority: document.getElementById('task-priority').value
        };

        if (id) { // Atualiza tarefa existente
            const index = tasks.findIndex(t => t.id == id);
            tasks[index] = { ...tasks[index], ...taskData };
        } else { // Cria nova tarefa
            taskData.id = Date.now();
            taskData.status = 'pending'; // Novas tarefas sempre começam como pendentes
            tasks.push(taskData);
        }
        taskModal.classList.remove('active');
        renderBoard();
    });

    document.getElementById('add-task-btn').addEventListener('click', () => openTaskModal());
    document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', () => taskModal.classList.remove('active')));

    // --- INICIALIZAÇÃO ---
    function initialize() {
        // Popula o filtro de funcionários
        employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.name;
            option.textContent = emp.name;
            employeeFilter.appendChild(option);
            // Também popula o select do modal
            responsibleSelect.appendChild(option.cloneNode(true));
        });
        
        // Adiciona listeners para os filtros
        employeeFilter.addEventListener('change', renderBoard);
        taskSearch.addEventListener('input', renderBoard);

        renderBoard();
    }

    initialize();
});