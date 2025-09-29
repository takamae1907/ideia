document.addEventListener('DOMContentLoaded', () => {
    // DADOS GERAIS (em uma aplicação real, viria de uma API compartilhada)
    let tasks = [
        { title: 'Atualizar relatório de vendas trimestral', responsible: 'Ana Silva', dueDate: '2025-10-05', status: 'in-progress' },
        { title: 'Reunião de alinhamento com marketing', responsible: 'Carlos Souza', dueDate: '2025-09-30', status: 'pending' },
        { title: 'Revisar layout do novo website', responsible: 'Juliana Pereira', dueDate: '2025-09-28', status: 'completed' },
        { title: 'Contatar fornecedor de software', responsible: 'Marcos Lima', dueDate: '2025-10-02', status: 'in-progress' }
    ];
    const employees = [
        { id: 1, name: 'Ana Silva', role: 'Desenvolvedora Frontend', avatar: 'https://i.pravatar.cc/150?img=1', email: 'ana.silva@sitelbra.com.br', phone: '(11) 98765-4321', tasksPending: 3, tasksCompleted: 12, recentTasks: ['Implementar nova tela de login', 'Corrigir bug no formulário de contato'] },
        { id: 2, name: 'Carlos Souza', role: 'Desenvolvedor Backend', avatar: 'https://i.pravatar.cc/150?img=3', email: 'carlos.souza@sitelbra.com.br', phone: '(21) 91234-5678', tasksPending: 5, tasksCompleted: 8, recentTasks: ['Desenvolver API de pagamentos', 'Configurar novo banco de dados'] },
        { id: 3, name: 'Juliana Pereira', role: 'UI/UX Designer', avatar: 'https://i.pravatar.cc/150?img=5', email: 'juliana.pereira@sitelbra.com.br', phone: '(31) 95555-1212', tasksPending: 1, tasksCompleted: 15, recentTasks: ['Criar protótipo do app mobile', 'Definir guia de estilos'] },
        { id: 4, name: 'Marcos Lima', role: 'Gerente de Projetos', avatar: null, email: 'marcos.lima@sitelbra.com.br', phone: '(41) 98888-7777', tasksPending: 2, tasksCompleted: 10, recentTasks: ['Planejamento do Sprint 5', 'Alinhamento com stakeholders'] }
    ];

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    function populateTasksTable() {
        const statusMap = { 'in-progress': 'Em Andamento', 'pending': 'Pendente', 'completed': 'Concluída' };
        const tableBody = document.querySelector('.task-list tbody');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        tasks.slice(0, 5).forEach(task => { // Mostra apenas as 5 tarefas mais recentes
            const row = document.createElement('tr');
            const formattedDate = new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR');
            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.responsible}</td>
                <td>${formattedDate}</td>
                <td><span class="status ${task.status}">${statusMap[task.status]}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // ===== FUNÇÃO RESTAURADA =====
    function populateEmployeeCards() {
        const employeeGridContainer = document.getElementById('employee-grid-container');
        if (!employeeGridContainer) return;

        employeeGridContainer.innerHTML = '';
        employees.forEach(employee => {
            const card = document.createElement('div');
            card.className = 'employee-card';
            
            const avatarContent = employee.avatar 
                ? `<img src="${employee.avatar}" alt="${employee.name}" class="employee-avatar">`
                : `<div class="employee-avatar">${employee.name.split(' ').map(n => n[0]).join('')}</div>`;

            card.innerHTML = `
                ${avatarContent}
                <h3 class="employee-name">${employee.name}</h3>
                <p class="employee-role">${employee.role}</p>
                <div class="employee-stats">
                    <div class="stat">
                        <p class="stat-value">${employee.tasksPending}</p>
                        <p class="stat-label">Pendentes</p>
                    </div>
                    <div class="stat">
                        <p class="stat-value">${employee.tasksCompleted}</p>
                        <p class="stat-label">Concluídas</p>
                    </div>
                </div>
                <a href="#" class="view-details-btn" data-employee-id="${employee.id}">Ver Detalhes</a>
            `;
            employeeGridContainer.appendChild(card);
        });
    }

    function updateSummaryCards() {
        document.getElementById('total-tasks').textContent = tasks.length;
        document.getElementById('pending-tasks').textContent = tasks.filter(t => t.status === 'pending').length;
        document.getElementById('inprogress-tasks').textContent = tasks.filter(t => t.status === 'in-progress').length;
        document.getElementById('completed-tasks').textContent = tasks.filter(t => t.status === 'completed').length;
    }
    
    // --- LÓGICA DO MODAL DE NOVA TAREFA ---
    const addTaskModal = document.getElementById('add-task-modal');
    const addTaskBtn = document.querySelector('.add-task-btn');
    const addTaskForm = document.getElementById('add-task-form');
    const taskResponsibleSelect = document.getElementById('task-responsible');

    if (taskResponsibleSelect) {
        employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.name;
            option.textContent = emp.name;
            taskResponsibleSelect.appendChild(option);
        });
    }

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => addTaskModal.classList.add('active'));
    }

    if (addTaskForm) {
        addTaskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newTask = {
                title: document.getElementById('task-title').value,
                responsible: document.getElementById('task-responsible').value,
                dueDate: document.getElementById('task-due-date').value,
                status: 'pending'
            };
            tasks.unshift(newTask);
            addTaskModal.classList.remove('active');
            addTaskForm.reset();
            populateTasksTable();
            updateSummaryCards();
        });
    }
    
    // --- LÓGICA DO MODAL DE DETALHES DO FUNCIONÁRIO (RESTAURADA) ---
    const employeeModal = document.getElementById('employee-modal');
    const modalBody = document.getElementById('modal-body');
    const employeeGridContainer = document.getElementById('employee-grid-container');

    function populateDetailsModal(employee) {
        const avatarContent = employee.avatar ?
            `<img src="${employee.avatar}" alt="${employee.name}" class="employee-avatar">` :
            `<div class="employee-avatar">${employee.name.split(' ').map(n => n[0]).join('')}</div>`;
        const tasksList = employee.recentTasks.map(task => `<li>${task}</li>`).join('');

        modalBody.innerHTML = `
            <div class="modal-header">
                ${avatarContent}
                <div class="modal-employee-info">
                    <h2>${employee.name}</h2>
                    <p>${employee.role}</p>
                </div>
            </div>
            <ul class="modal-contact-details">
                <li><strong>Email:</strong> ${employee.email}</li>
                <li><strong>Telefone:</strong> ${employee.phone}</li>
            </ul>
            <div class="modal-tasks">
                <h3>Tarefas Recentes</h3>
                <ul class="modal-tasks-list">${tasksList}</ul>
            </div>
        `;
    }

    if (employeeGridContainer) {
        employeeGridContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.view-details-btn');
            if (target) {
                e.preventDefault();
                const employeeId = target.dataset.employeeId;
                const employee = employees.find(emp => emp.id == employeeId);
                if (employee) {
                    populateDetailsModal(employee);
                    employeeModal.classList.add('active');
                }
            }
        });
    }

    // --- LÓGICA PARA FECHAR TODOS OS MODAIS ---
    document.querySelectorAll('[data-close-modal], .modal-close').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('active'));
        });
    });
    // Fecha modal ao clicar fora
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });


    // --- INICIALIZAÇÃO ---
    // Funções que rodam quando a página é carregada
    populateTasksTable();
    updateSummaryCards();
    populateEmployeeCards(); // <-- LINHA CORRIGIDA E ATIVADA
});