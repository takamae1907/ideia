
// Aguarda o carregamento completo do HTML
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona o formulário pelo ID
    const loginForm = document.getElementById('login-form');

    // Adiciona um "escutador" para o evento de envio do formulário
    loginForm.addEventListener('submit', (event) => {
        
        // Impede o comportamento padrão do formulário (que é recarregar a página)
        event.preventDefault();

        // Verifica qual botão de perfil está selecionado
        const selectedProfile = document.querySelector('input[name="profile"]:checked').value;

        // Lógica de redirecionamento:
        // Em um aplicativo real, aqui você faria uma validação de email e senha.
        // Para nosso projeto, vamos apenas redirecionar.
        if (selectedProfile === 'gestor') {
            console.log('Redirecionando para a área do gestor...');
            // Altere 'index.html' para o nome do arquivo da sua área de gestor
            window.location.href = 'area-gestor.html'; 
        } else if (selectedProfile === 'funcionario') {
            console.log('Redirecionando para a área do funcionário...');
            // Vamos criar esta página no próximo passo
            window.location.href = 'area-funcionario.html';
        }
    });
});