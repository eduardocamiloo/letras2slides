// Quando o ícone da extensão for clicada, ele executa todo o código abaixo.
chrome.action.onClicked.addListener((tab) => {
    // API do Chrome para executar o script na guia.
    chrome.scripting.executeScript({target: { tabId: tab.id }, func: () => {

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

            if(spans) {
                spans.forEach(span => {
                    const mark = span.querySelector("mark");
    
                    if (mark) {
                        const markText = mark.textContent;
                        span.outerHTML = markText;
                    }
                });
            }

            return paragrafo.innerHTML;
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
            overlay.style.fontSize = "24px";
            overlay.style.zIndex = "1000";

            const contentDiv = document.createElement("div");
            contentDiv.style.color = "white";
            contentDiv.style.fontSize = "6vh";
            contentDiv.style.lineHeight = "1.6";
            contentDiv.style.textAlign = "center";
            contentDiv.style.fontWeight = "bold";
            contentDiv.style.width = "90%";


            contentDiv.innerHTML = processarParagrafo(paragrafos[indice]);
            overlay.appendChild(contentDiv);
            document.body.appendChild(overlay);


            let currentIndex = indice;

            const verificarTecla = (event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                    if (currentIndex < paragrafos.length - 1) {
                        currentIndex++;
                        contentDiv.innerHTML = processarParagrafo(paragrafos[currentIndex]);
                    }
                } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                    if (currentIndex > 0) {
                        currentIndex--;
                        contentDiv.innerHTML = processarParagrafo(paragrafos[currentIndex]);
                    }
                }
            };


            document.addEventListener("keydown", verificarTecla);
        };

        // Aqui onde se começa pelo índice 0, depois disso a função principal cuida de tudo;
        criarOverlay(0);
    }});
});
