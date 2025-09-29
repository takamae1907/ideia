document.addEventListener('DOMContentLoaded', () => {
    // A lista de funcionários agora é 'let' para permitir modificações
    let employees = [
        { id: 1, name: 'Ana Silva', role: 'Desenvolvedora Frontend', avatar: 'https://i.pravatar.cc/150?img=1', email: 'ana.silva@sitelbra.com.br', phone: '(11) 98765-4321', status: 'ativo' },
        { id: 2, name: 'Carlos Souza', role: 'Desenvolvedor Backend', avatar: 'https://i.pravatar.cc/150?img=3', email: 'carlos.souza@sitelbra.com.br', phone: '(21) 91234-5678', status: 'ativo' },
        { id: 3, name: 'Juliana Pereira', role: 'UI/UX Designer', avatar: 'https://i.pravatar.cc/150?img=5', email: 'juliana.pereira@sitelbra.com.br', phone: '(31) 95555-1212', status: 'inativo' },
        { id: 4, name: 'Marcos Lima', role: 'Gerente de Projetos', avatar: null, email: 'marcos.lima@sitelbra.com.br', phone: '(41) 98888-7777', status: 'ativo' },
        { id: 5, name: 'Fernanda Costa', role: 'Analista de QA', avatar: 'https://i.pravatar.cc/150?img=8', email: 'fernanda.costa@sitelbra.com.br', phone: '(51) 97777-6666', status: 'ativo' },
        { id: 6, name: 'Ricardo Alves', role: 'DevOps', avatar: 'https://i.pravatar.cc/150?img=11', email: 'ricardo.alves@sitelbra.com.br', phone: '(61) 96666-5555', status: 'inativo' }
    ];

    // Seleção dos elementos do DOM
    const tableBody = document.getElementById('employee-table-body');
    const searchBar = document.getElementById('search-bar');
    const statusFilter = document.getElementById('status-filter');
    
    // Elementos do Modal de Adicionar/Editar
    const addEditModal = document.getElementById('add-edit-modal');
    const modalTitle = document.getElementById('modal-title');
    const addEditForm = document.getElementById('add-edit-form');
    const employeeIdInput = document.getElementById('employee-id');

    // Elementos do Modal de Exclusão
    const deleteModal = document.getElementById('delete-confirm-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    let idParaExcluir = null;

    function renderTable(employeeList) {
        tableBody.innerHTML = '';
        if (employeeList.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum funcionário encontrado.</td></tr>`;
            return;
        }
        employeeList.forEach(employee => {
            const row = document.createElement('tr');
            const avatarUrl = employee.avatar ? employee.avatar : `https://ui-avatars.com/api/?name=${employee.name.replace(' ', '+')}&background=004d40&color=fff`;
            row.innerHTML = `
                <td><div class="employee-info-cell"><img src="${avatarUrl}" alt="Avatar de ${employee.name}"><span>${employee.name}</span></div></td>
                <td>${employee.role}</td>
                <td>${employee.email}<br>${employee.phone}</td>
                <td><span class="status-badge ${employee.status === 'ativo' ? 'active' : 'inactive'}">${employee.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></td>
                <td class="action-buttons">
                    <button class="action-btn-edit" data-id="${employee.id}" title="Editar">✏️</button>
                    <button class="action-btn-delete" data-id="${employee.id}" title="Excluir">🗑️</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function filterAndRender() {
        const searchTerm = searchBar.value.toLowerCase();
        const status = statusFilter.value;
        const filteredEmployees = employees.filter(emp => 
            (emp.name.toLowerCase().includes(searchTerm) || emp.role.toLowerCase().includes(searchTerm) || emp.email.toLowerCase().includes(searchTerm)) &&
            (status === 'todos' || emp.status === status)
        );
        renderTable(filteredEmployees);
    }

    // --- LÓGICA DOS MODAIS ---
    function openModal(modal) { modal.classList.add('active'); }
    function closeModal(modal) { modal.classList.remove('active'); }

    // Abrir Modal para ADICIONAR
    document.getElementById('add-employee-btn').addEventListener('click', () => {
        modalTitle.textContent = 'Adicionar Novo Funcionário';
        addEditForm.reset();
        employeeIdInput.value = '';
        openModal(addEditModal);
    });

    // Abrir Modal para EDITAR e EXCLUIR (usando delegação de eventos)
    tableBody.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;
        
        const employeeId = target.dataset.id;

        if (target.classList.contains('action-btn-edit')) {
            const employee = employees.find(emp => emp.id == employeeId);
            modalTitle.textContent = 'Editar Funcionário';
            employeeIdInput.value = employee.id;
            document.getElementById('name').value = employee.name;
            document.getElementById('role').value = employee.role;
            document.getElementById('email').value = employee.email;
            document.getElementById('phone').value = employee.phone;
            document.getElementById('status').value = employee.status;
            openModal(addEditModal);
        }

        if (target.classList.contains('action-btn-delete')) {
            idParaExcluir = employeeId;
            openModal(deleteModal);
        }
    });

    // Salvar (Adicionar ou Editar)
    addEditForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = employeeIdInput.value;
        const newEmployeeData = {
            name: document.getElementById('name').value,
            role: document.getElementById('role').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            status: document.getElementById('status').value,
            avatar: null // Avatar pode ser adicionado/editado em outra funcionalidade
        };

        if (id) { // Editando
            const index = employees.findIndex(emp => emp.id == id);
            employees[index] = { ...employees[index], ...newEmployeeData };
        } else { // Adicionando
            newEmployeeData.id = Date.now(); // ID único simples
            employees.push(newEmployeeData);
        }
        closeModal(addEditModal);
        filterAndRender();
    });

    // Confirmar Exclusão
    confirmDeleteBtn.addEventListener('click', () => {
        employees = employees.filter(emp => emp.id != idParaExcluir);
        closeModal(deleteModal);
        filterAndRender();
    });

    // Fechar modais
    document.querySelectorAll('[data-close-modal]').forEach(el => {
        el.addEventListener('click', () => {
            closeModal(addEditModal);
            closeModal(deleteModal);
        });
    });

    // --- INICIALIZAÇÃO ---
    searchBar.addEventListener('input', filterAndRender);
    statusFilter.addEventListener('change', filterAndRender);
    renderTable(employees);
});