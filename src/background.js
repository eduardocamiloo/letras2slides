// Quando o ícone da extensão for clicada, ele executa todo o código abaixo.
chrome.action.onClicked.addListener((tab) => {
    // API do Chrome para executar o script na guia.
    chrome.scripting.executeScript({
        target: { tabId: tab.id }, func: () => {

            // Colocar em tela cheia.
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Safari
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // Internet Explorer/Edge
                document.documentElement.msRequestFullscreen();
            }

            // Impedir rolagem com mouse (para poder usar somente setas);
            document.body.style.overflow = "hidden";

            // Receber a letra em HTML bruto.
            const div = document.querySelector(".lyric-original");

            // Transformar cada parágrafo (<p>) da letra em um índice do array.
            const paragrafos = Array.from(div.querySelectorAll("p"));

            /*
            A função secundária:
            * Ela recebe o parágrafo (de acordo com o que a função principal precisar);
            * Verifica se dentro do parágrafo (<p>) tem algum span (<span>), que seria um tipo de anotação do próprio site Letras;
            * Se houver span/spans ele percorre por ele/eles para procurar os marks (<mark>).
            * Se houver um mark, ele extrai o texto, apaga a tag mark e substitui pelo próprio texto do mark;
            * Assim, o texto ficará limpo sem qualquer parte marcada de forma diferente;
            * O retorno é o parágrafo limpo, pronto para ser incluído na tela (a inclusão é feita na função principal);
            */
            function processarParagrafo(paragrafo) {
                const spans = paragrafo.querySelectorAll("span");

                if (spans) {
                    spans.forEach(span => {
                        const mark = span.querySelector("mark");

                        if (mark) {
                            const markText = mark.textContent;
                            span.outerHTML = markText;
                        }
                    });
                }

                // Retornar o parágrafo limpo e em maiúsculo.
                return paragrafo.innerHTML.toUpperCase();
            };

            /*
            A função principal:
            * Ela recebe o índice (que começará em 0);
            * Ela cria o estilo do fundo preto (overlay);
            * Cria o estilo do texto em que será inserido;
            * Coloca o texto dentro do background;
            * Manda para a página;
            * Ele monitora se houver cliques em alguma tecla.
            * Se houver algum clique, ele vê qual seta foi clicada.
            * Assim, ele processa o parágrafo requerido e troca o texto;
            */
            function criarOverlay(indice) {
                // Criar a div de fundo.
                const overlay = document.createElement("div");
                overlay.style.position = "fixed";
                overlay.style.top = "0";
                overlay.style.left = "0";
                overlay.style.width = "100vw";
                overlay.style.height = "100vh";
                overlay.style.backgroundColor = "black";
                overlay.style.color = "white";
                overlay.style.display = "flex";
                overlay.style.justifyContent = "center";
                overlay.style.alignItems = "center";
                overlay.style.flexDirection = "column";
                overlay.style.zIndex = "1000";

                // Criar as variáveis de tamanho da fonte.
                let fontSizeLetter = 6;
                let fontSizeLetterIndice = 20;

                // Criar a div do conteúdo.
                const contentDiv = document.createElement("div");
                contentDiv.style.color = "white";
                contentDiv.style.fontSize = fontSizeLetter + "vh";
                contentDiv.style.lineHeight = "1.6";
                contentDiv.style.textAlign = "center";
                contentDiv.style.fontWeight = "bold";
                contentDiv.style.letterSpacing = "1px";
                contentDiv.style.width = "90%";

                // Criar a div do índice.
                const indexDiv = document.createElement("div");
                indexDiv.style.color = "white";
                indexDiv.style.fontSize = fontSizeLetterIndice + "px";
                indexDiv.style.textAlign = "center";
                indexDiv.style.marginTop = "15px";
                indexDiv.innerHTML = `${indice + 1} / ${paragrafos.length}`;

                // Adicionar os conteúdos à tela.
                contentDiv.innerHTML = processarParagrafo(paragrafos[indice]);
                overlay.appendChild(contentDiv);
                overlay.appendChild(indexDiv);
                document.body.appendChild(overlay);

                // Começar com o índice atual 0.
                let currentIndex = indice;

                const verificarTecla = (event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                        if (currentIndex < paragrafos.length - 1) {
                            // Aumentar um índice caso o índice seja menor que o tamanho da letra.
                            currentIndex++;

                            // Atualizar o conteúdo do parágrafo.
                            contentDiv.innerHTML = processarParagrafo(paragrafos[currentIndex]);
                            indexDiv.innerHTML = `${currentIndex + 1} / ${paragrafos.length}`;
                        }
                    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                        if (currentIndex > 0) {
                            // Diminuir um índice caso o índice seja maior que 0.
                            currentIndex--;

                            // Atualizar o conteúdo do parágrafo.
                            contentDiv.innerHTML = processarParagrafo(paragrafos[currentIndex]);
                            indexDiv.innerHTML = `${currentIndex + 1} / ${paragrafos.length}`;
                        }
                    } else if (event.key === "+") {
                        // Mudar as variáveis de tamanho de fonte para mais.
                        fontSizeLetter++;
                        fontSizeLetterIndice += 3;

                        // Atualizar o tamanho da fonte no elemento.
                        contentDiv.style.fontSize = fontSizeLetter + "vh";
                        indexDiv.style.fontSize = fontSizeLetterIndice + "px";
                    } else if (event.key === "-") {
                        // Mudar as variáveis de tamanho de fonte para menos.
                        fontSizeLetter--;
                        fontSizeLetterIndice -= 3;

                        // Atualizar o tamanho da fonte no elemento.
                        contentDiv.style.fontSize = fontSizeLetter + "vh";
                        indexDiv.style.fontSize = fontSizeLetterIndice + "px";
                    } else if (event.key === "e") {
                        // Remover o fundo + letras + índice.
                        overlay.remove();

                        // Retornar o scroll para o normal.
                        document.body.style.overflow = "";

                        // Sair da tela cheia.
                        document.exitFullscreen();
                    }
                };

                // Adicionar o evento de teclado.
                document.addEventListener("keydown", verificarTecla);
            };

            // Aqui onde se começa pelo índice 0, depois disso a função principal cuida de tudo;
            criarOverlay(0);
        }
    });
});