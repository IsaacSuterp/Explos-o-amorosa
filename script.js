// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o botão e o contêiner principal do HTML
    const botaoAmor = document.getElementById('botaoAmor');
    const containerPrincipal = document.getElementById('container-principal');

    // --- Configurações da Animação ---
    // Você pode ajustar esses valores para mudar o comportamento da explosão
    const numeroDeMensagens = 60;     // Quantidade de mensagens "Eu te amo" a serem criadas
    const duracaoAnimacaoBaseMs = 2500; // Duração base da animação em milissegundos (ex: 2.5 segundos)
    const variacaoDuracaoMs = 1500;   // Variação na duração (ex: +/- 0.75s, resultando entre 1.75s e 3.25s)
    const distanciaExplosaoPx = 350;  // Distância máxima (raio) que as mensagens podem viajar do centro
    const escalaFinalMax = 1.8;       // Escala máxima que a mensagem pode atingir no final da animação
    const escalaFinalMin = 0.6;       // Escala mínima que a mensagem pode atingir no final
    const atrasoMaximoEntreParticulasMs = 700; // Atraso máximo para o início da animação de cada partícula (para um efeito escalonado)

    // Adiciona um "ouvinte de evento" ao botão. A função dentro dele será executada quando o botão for clicado.
    botaoAmor.addEventListener('click', () => {
        // Esconde o botão temporariamente para evitar múltiplos cliques rápidos que podem sobrecarregar a animação.
        // Poderia também ser desabilitado: botaoAmor.disabled = true;
        botaoAmor.style.display = 'none'; 
        
        // Cria o número desejado de mensagens de amor
        for (let i = 0; i < numeroDeMensagens; i++) {
            criarMensagemAmor();
        }

        // Define um temporizador para mostrar o botão novamente após a animação ter tido tempo de terminar.
        // Considera a duração base + a variação máxima + o atraso máximo.
        setTimeout(() => {
            botaoAmor.style.display = 'inline-block'; // Ou 'block', dependendo do layout original
            // Se tivesse sido desabilitado: botaoAmor.disabled = false;
        }, duracaoAnimacaoBaseMs + variacaoDuracaoMs / 2 + atrasoMaximoEntreParticulasMs + 100); // 100ms de margem
    });

    /**
     * Função para criar uma única mensagem "Eu te amo", definir suas propriedades
     * de animação aleatórias e adicioná-la à página.
     */
    function criarMensagemAmor() {
        // Cria um novo elemento <span> no documento. Poderia ser <div> também.
        const mensagemEl = document.createElement('span');
        
        // Adiciona a classe CSS 'mensagem-amor' ao elemento, aplicando os estilos definidos no style.css.
        mensagemEl.classList.add('mensagem-amor');
        
        // Define o texto do elemento.
        mensagemEl.textContent = 'Eu te amo ❤️'; // Adicionado um emoji!

        // --- Cálculo de Propriedades Aleatórias para a Animação ---

        // Ângulo aleatório (em graus) para a direção da "explosão".
        const angulo = Math.random() * 360; 
        
        // Distância aleatória que a mensagem viajará do centro.
        // Adiciona um mínimo (ex: 50px) para que não fiquem todas muito perto do centro.
        const distancia = Math.random() * distanciaExplosaoPx + 50; 
        
        // Converte o ângulo (graus) e a distância (pixels) para coordenadas X e Y.
        // Math.cos e Math.sin esperam ângulos em radianos, por isso a conversão (graus * Math.PI / 180).
        const finalX = Math.cos(angulo * Math.PI / 180) * distancia;
        const finalY = Math.sin(angulo * Math.PI / 180) * distancia;
        
        // Rotação final aleatória (em graus). Por exemplo, entre -360 e +360 graus.
        const rotacaoFinal = Math.random() * 720 - 360; 
        
        // Escala final aleatória (fator de multiplicação do tamanho).
        const escalaFinal = Math.random() * (escalaFinalMax - escalaFinalMin) + escalaFinalMin;

        // Duração total da animação para esta partícula específica (em milissegundos).
        // É a duração base + uma variação aleatória.
        const duracaoAnimacao = duracaoAnimacaoBaseMs + (Math.random() * variacaoDuracaoMs) - (variacaoDuracaoMs / 2);
        
        // Atraso aleatório antes do início da animação desta partícula (em milissegundos).
        // Isso faz com que as mensagens apareçam de forma mais escalonada e natural.
        const atrasoAnimacao = Math.random() * atrasoMaximoEntreParticulasMs; 

        // --- Aplicação dos Estilos e Animação ---

        // Define as variáveis CSS customizadas que serão usadas pelo @keyframes 'animacaoExplosao' no style.css.
        // Essas variáveis controlam o estado final (100%) da animação para esta partícula específica.
        mensagemEl.style.setProperty('--final-x', `${finalX}px`);
        mensagemEl.style.setProperty('--final-y', `${finalY}px`);
        mensagemEl.style.setProperty('--final-rotacao', `${rotacaoFinal}deg`);
        mensagemEl.style.setProperty('--final-escala', escalaFinal);
        
        // Aplica as propriedades da animação diretamente ao elemento.
        mensagemEl.style.animationName = 'animacaoExplosao';
        mensagemEl.style.animationDuration = `${duracaoAnimacao}ms`;
        mensagemEl.style.animationDelay = `${atrasoAnimacao}ms`;
        // Função de temporização (easing) para um efeito mais suave e "profissional".
        // Você pode experimentar outras em sites como cubic-bezier.com
        mensagemEl.style.animationTimingFunction = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'; 
        // 'forwards' garante que o elemento permaneça no estado final da animação (opacity: 0)
        // antes de ser removido do DOM.
        mensagemEl.style.animationFillMode = 'forwards'; 
        
        // Adiciona a mensagem recém-criada e configurada como filha do 'containerPrincipal'.
        // Isso a torna visível na página e inicia a animação (após o delay).
        containerPrincipal.appendChild(mensagemEl);

        // Define um temporizador para remover o elemento da árvore DOM após a sua animação terminar.
        // Isso é crucial para a performance, evitando que a página fique cheia de elementos invisíveis.
        // A duração total é a 'duracaoAnimacao' + 'atrasoAnimacao'. Adicionamos uma pequena margem (50ms).
        setTimeout(() => {
            // Verifica se o elemento ainda é filho do container (boa prática, embora neste caso seja provável)
            if (mensagemEl.parentNode) { 
                mensagemEl.remove();
            }
        }, duracaoAnimacao + atrasoAnimacao + 50); 
    }
});
