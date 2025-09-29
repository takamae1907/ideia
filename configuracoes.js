document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO SELETOR DE TEMA (MODO CLARO/ESCURO) ---

    const themeSwitch = document.getElementById('theme-switch');
    const currentTheme = localStorage.getItem('theme');

    // Verifica o tema salvo no localStorage ao carregar a página
    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            themeSwitch.checked = true;
        }
    }

    // Adiciona o listener para o clique no seletor
    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            // Ativa o modo escuro
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            // Desativa o modo escuro
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });


    // --- LÓGICA PARA OS BOTÕES (PLACEHOLDERS) ---
    // Em uma aplicação real, aqui estariam as funções complexas.
    
    const saveButton = document.querySelector('.form-actions .btn-primary');
    if(saveButton) {
        saveButton.addEventListener('click', () => {
            alert('Configurações salvas com sucesso! (Simulação)');
        });
    }

    const exportTasksBtn = document.querySelector('.settings-card button:nth-of-type(1)');
    if (exportTasksBtn && exportTasksBtn.textContent.includes('Tarefas')) {
        exportTasksBtn.addEventListener('click', () => {
            alert('Exportando tarefas... (Simulação)');
        });
    }

    const exportEmployeesBtn = document.querySelector('.settings-card button:nth-of-type(2)');
    if (exportEmployeesBtn && exportEmployeesBtn.textContent.includes('Funcionários')) {
        exportEmployeesBtn.addEventListener('click', () => {
            alert('Exportando funcionários... (Simulação)');
        });
    }

    const clearTasksBtn = document.querySelector('.danger-zone button');
    if (clearTasksBtn) {
        clearTasksBtn.addEventListener('click', () => {
            if(confirm('ATENÇÃO: Esta ação é irreversível. Deseja realmente limpar todas as tarefas concluídas?')) {
                alert('Tarefas concluídas foram limpas. (Simulação)');
            }
        });
    }
});