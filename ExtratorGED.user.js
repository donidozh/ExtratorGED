// ==UserScript==
// @name          Extrator Contatos Sigeduca
// @version       2.5.3
// @description   Consulta e salva dados de contato dos alunos do sigeduca, com filtro de dados.
// @author        Roberson Arruda
// @homepage      https://github.com/donidozh/ExtratorGED/blob/main/ExtratorGED.user.js
// @match         https://*.seduc.mt.gov.br/ged/hwmconaluno.aspx*
// @match         http://*.seduc.mt.gov.br/ged/hwmconaluno.aspx*
// @copyright     2019, Roberson Arruda
// @grant         none
// ==/UserScript==
/*
...Não existe só um caminho. Dê a volta e encontre outro!
*/


// Função para simular o Slide do Jquery, dispensando uso dessa biblioteca
const alturasOriginais = {}; // Armazena as alturas atribuídas diretamente
function slideToggle(elementId, duracao = 300) {
    let element = document.getElementById(elementId);
    if (!element) return; // Se o elemento não existir, sai da função.

    // Verifica se a altura já foi armazenada. Se não, armazena a altura atribuída diretamente.
    if (!alturasOriginais[elementId]) {
        // Se a altura não estiver definida diretamente no estilo, vamos calcular
        if (element.style.height === "") {
            // Caso não tenha altura definida, usamos o scrollHeight como fallback
            alturasOriginais[elementId] = element.scrollHeight;
        } else {
            // Caso tenha uma altura definida, usamos essa altura
            alturasOriginais[elementId] = parseInt(element.style.height, 10);
        }
    }

    if (window.getComputedStyle(element).display === "none") {
        // Exibir com efeito de slide
        element.style.display = "block";
        element.style.overflow = "hidden"; // Evita transbordamento
        element.style.height = "0px"; // Inicia com altura 0px

        setTimeout(() => {
            element.style.transition = `height ${duracao/1000}s ease-out`;
            element.style.height = alturasOriginais[elementId] + "px"; // Usa a altura armazenada
        }, 10);
    } else {
        // Ocultar com efeito de slide
        element.style.height = "0px";
        element.style.transition = `height ${duracao/1000}s ease-in`;
        element.style.overflow = "hidden";

        setTimeout(() => {
            element.style.display = "none";
            element.style.height = ""; // Reseta altura para evitar bugs
        }, duracao);
    }
}



var styleSCT = document.createElement('style');
styleSCT.type = 'text/css';
styleSCT.innerHTML = `
.botaoSCT {
  -moz-box-shadow: inset 1px 1px 0px 0px #b2ced4;
  -webkit-box-shadow: inset 1px 1px 0px 0px #b2ced4;
  box-shadow: inset 1px 1px 0px 0px #b2ced4;
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #4e88ed), color-stop(1, #3255c7));
  background: -moz-linear-gradient(center top, #4e88ed 5%, #3255c7 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#4e88ed", endColorstr="#3255c7");
  background-color: #4e88ed;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  border: 1px solid #102b4d;
  display: inline-block;
  color: #ffffff;
  font-family: Trebuchet MS;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 0px;
  width: 152px;
  text-decoration: none;
  text-shadow: 1px 1px 0px #100d29;
  margin: 2px;
}
.botaoSCT:hover {
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #3255c7), color-stop(1, #4e88ed));
  background: -moz-linear-gradient(center top, #3255c7 5%, #4e88ed 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#3255c7", endColorstr="#4e88ed");
  background-color: #3255c7;
}
.botaoSCT:active {
  position: relative;
  top: 1px;
}
.menuSCT {
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  border: 1px solid #102b4d;
}

/* Novo CSS para o painel de seleção */
.config-panel {
  position: fixed;
  right: 420px;
  bottom: 24px;
  width: 300px;
  background: #f0f0f0;
  border: 1px solid #102b4d;
  border-radius: 4px;
  padding: 10px;
  z-index: 2001;
  display: none;
  height: 400px;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}

.config-panel h3 {
  margin-top: 0;
  text-align: center;
  color: #3255c7;
}

.config-toggle {
  position: fixed;
  right: 410px;
  bottom: 30px;
  z-index: 2003;
  background: #4e88ed;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.switch-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  padding: 5px;
  background: #e0e0e0;
  border-radius: 4px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4e88ed;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.switch-label {
  font-size: 13px;
  color: #333;
}
`;
document.getElementsByTagName('head')[0].appendChild(styleSCT);


//Dados de metadados do script
const scriptName = GM_info.script.name; // Obtém o valor de @name
const scriptVersion = GM_info.script.version; // Obtém o valor de @version

//Variáveis
var vetAluno = [0];
var n = 0;
var a = "";
var cabecalho="";
var nomealuno="";
var grupoSocial = "";

// Configuração de campos (todos inicialmente ativos)
var camposConfig = {
  codAluno: true,
  inep: true,
  nome: true,
  cpf: true,
  raca: true,
  grupoSocial: true,
  rg: true,
  orgaoExpedidor: true,
  sexo: true,
  dataNascimento: true,
  naturalidade: true,
  ufNaturalidade: true,
  filiacao1: true,
  filiacao2: true,
  responsavel1: true,
  cpfResponsavel1: true,
  telResResp1: true,
  telCelResp1: true,
  telComResp1: true,
  telContatoResp1: true,
  emailResp1: true,
  responsavel2: true,
  cpfResponsavel2: true,
  telResResp2: true,
  telCelResp2: true,
  telComResp2: true,
  telContatoResp2: true,
  emailResp2: true,
  telResidencial: true,
  telCelular: true,
  telComercial: true,
  telContato: true,
  endereco: true,
  numero: true,
  complemento: true,
  bairro: true,
  cidade: true,
  uf: true,
  cep: true,
  uc: true,
  numUC: true
};

function toggleConfigPanel() {
  const panel = document.getElementById('configPanel');
  if (panel.style.display === 'block') {
    panel.style.display = 'none';
  } else {
    panel.style.display = 'block';
  }
}

//FUNÇÃO SALVAR CONTEÚDO EM CSV
function saveTextAsFile() {
    var conteudo = document.getElementById("txtDados").value; //P Retirar acentos utilize =>> .normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    var a = document.createElement('a');
    a.href = 'data:text/csv;base64,' + btoa(conteudo);
    a.download = 'dadosGED.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

//INICIAR
function coletar(opcao)
{
    ifrIframe1.removeEventListener("load", coletaDados1);
    ifrIframe1.removeEventListener("load", coletaDados2);
    ifrIframe1.removeEventListener("load", coletaDados3);
    n=0;
    vetAluno = [0];
    vetAluno = txtareaAluno.value.match(/[0-9]+/g).filter(Boolean);
    a = "";
    txtareaDados.value ="";

    if(opcao==1){
        ifrIframe1.src= "http://sigeduca.seduc.mt.gov.br/ged/hwtmgedaluno.aspx?"+vetAluno[n]+",,HWMConAluno,DSP,1,0";
        ifrIframe1.addEventListener("load", coletaDados1);
    }
    if(opcao==2){
        ifrIframe1.src= "http://sigeduca.seduc.mt.gov.br/ged/hwtmgedaluno1.aspx?"+vetAluno[n]+",,HWMConAluno,DSP,0,1,0,1";
        ifrIframe1.addEventListener("load", coletaDados2);
    }
    if(opcao==3){
        ifrIframe1.src= "http://sigeduca.seduc.mt.gov.br/ged/hwmgedmanutencaomatricula.aspx";
        ifrIframe1.addEventListener("load", coletaDados3);
    }
}

//Extrai dados da ABA "PESSOAL"
function coletaDados1() {
    if(n < vetAluno.length){
        //VERIFICAR GRUPO SOCIAL ASSINALADO E GUARDAR NA VARIÁVEL grupoSocial
        let radios = parent.frames[0].document.querySelectorAll('input[name="CTLGERPESGRPSOC"]');
        radios.forEach(function(radio) {
            if (radio.checked) {
                switch (radio.value) {
                    case "N": grupoSocial = "Não declarado"; break;
                    case "I": grupoSocial = "Circense"; break;
                    case "T": grupoSocial = "Trabalhador Itinerante"; break;
                    case "C": grupoSocial = "Acampados"; break;
                    case "A": grupoSocial = "Artista"; break;
                    case "P": grupoSocial = "Povos Indígenas"; break;
                    case "Q": grupoSocial = "Povos Quilombolas"; break;
                    default: grupoSocial = "";
                }
            }
        });

        // Resetar cabeçalho e dados
        a = "";
        cabecalho = "";
        
        // Dados gerais do Aluno - agora verificando configurações
        if (camposConfig.codAluno) { a += vetAluno[n] + ";"; cabecalho += "Cod Aluno;"; }
        if (camposConfig.inep) { a += parent.frames[0].document.getElementById('span_CTLGEDALUIDINEP').innerHTML + ";"; cabecalho += "Nº INEP;"; }
        if (camposConfig.nome) { a += parent.frames[0].document.getElementById('span_CTLGERPESNOM').innerHTML + ";"; cabecalho += "Aluno;"; }
        if (camposConfig.cpf) { a += parent.frames[0].document.getElementById('span_CTLGERPESCPF').innerHTML.replace(/^([\d]{3})([\d]{3})([\d]{3})([\d]{2})$/, "$1.$2.$3-$4") + ";"; cabecalho += "CPF do Aluno;"; }
        if (camposConfig.raca) { a += parent.frames[0].document.getElementById('span_CTLGERPESRACA').innerHTML + ";"; cabecalho += "Cor ou Raça;"; }
        if (camposConfig.grupoSocial) { a += grupoSocial + ";"; cabecalho += "Grupo Social;"; }
        if (camposConfig.rg) { a += parent.frames[0].document.getElementById('span_CTLGERPESRG').innerHTML + ";"; cabecalho += "RG do aluno;"; }
        if (camposConfig.orgaoExpedidor) { a += parent.frames[0].document.getElementById('span_CTLGERORGEMICOD').innerHTML + ";"; cabecalho += "Órgão Expedidor;"; }
        if (camposConfig.sexo) { a += parent.frames[0].document.getElementById('span_CTLGERPESSEXO').innerHTML + ";"; cabecalho += "Sexo do Aluno;"; }
        if (camposConfig.dataNascimento) { a += parent.frames[0].document.getElementById('span_CTLGERPESDTANASC').innerHTML + ";"; cabecalho += "Data de Nascimento;"; }
        if (camposConfig.naturalidade) { a += parent.frames[0].document.getElementById('span_CTLGERPESNATDSC').innerHTML + ";"; cabecalho += "Naturalidade;"; }
        if (camposConfig.ufNaturalidade) { a += parent.frames[0].document.getElementById('span_CTLGERPESNATUF').innerHTML + ";"; cabecalho += "UF;"; }
        if (camposConfig.filiacao1) { a += parent.frames[0].document.getElementById('span_CTLGERPESNOMMAE').innerHTML + ";"; cabecalho += "Filiação 1;"; }
        if (camposConfig.filiacao2) { a += parent.frames[0].document.getElementById('span_CTLGERPESNOMPAI').innerHTML + ";"; cabecalho += "filiação 2;"; }

        // Contatos responsável 1
        if (camposConfig.responsavel1) { a += parent.frames[0].document.getElementById('span_CTLGERPESNOMRESP').innerHTML + ";"; cabecalho += "Nome do responsável 1;"; }
        if (camposConfig.cpfResponsavel1) { a += parent.frames[0].document.getElementById('span_CTLGERPESRESPCPF').innerHTML.replace(/^([\d]{3})([\d]{3})([\d]{3})([\d]{2})$/, "$1.$2.$3-$4") + ";"; cabecalho += "CPF do responsável 1;"; }
        if (camposConfig.telResResp1) { a += "(" + parent.frames[0].document.getElementById('span_CTLGERPESTELRESDDDRESP').innerHTML + ")" + parent.frames[0].document.getElementById('span_CTLGERPESTELRESRESP').innerHTML + ";"; cabecalho += "Tel Res Resp 1;"; }
        if (camposConfig.telCelResp1) { a += "(" + parent.frames[0].document.getElementById('span_CTLGERPESTELCELDDDRESP').innerHTML + ")" + parent.frames[0].document.getElementById('span_CTLGERPESTELCELRESP').innerHTML + ";"; cabecalho += "Tel Celular Resp 1;"; }
        if (camposConfig.telComResp1) { a += "(" + parent.frames[0].document.getElementById('span_CTLGERPESTELCOMDDDRESP').innerHTML + ")" + parent.frames[0].document.getElementById('span_CTLGERPESTELCOMRESP').innerHTML + ";"; cabecalho += "Tel Comercial Resp 1;"; }
        if (camposConfig.telContatoResp1) { a += "(" + parent.frames[0].document.getElementById('span_CTLGERPESTELCONDDDRESP').innerHTML + ")" + parent.frames[0].document.getElementById('span_CTLGERPESTELCONRESP').innerHTML + ";"; cabecalho += "Tel Contato Resp 1;"; }
        if (camposConfig.emailResp1) { a += parent.frames[0].document.getElementById('span_CTLGERPESEMAILRESP').innerHTML + ";"; cabecalho += "E-mail Resp 1;"; }

        // Contatos responsável 2
        if (camposConfig.responsavel2) { a += parent.frames[0].document.getElementById('span_CTLGERPESNOMRESP2').innerHTML + ";"; cabecalho += "Nome do responsável 2;"; }
        if (camposConfig.cpfResponsavel2) { a += parent.frames[0].document.getElementById('span_CTLGERPESRESPCPF2').innerHTML.replace(/^([\d]{3})([\d]{3})([\d]{3})([\d]{2})$/, "$1.$2.$3-$4") + ";"; cabecalho += "CPF do responsável 2;"; }
        if (camposConfig.telResResp2) { a += "(" + parent.frames[0].document.getElementById('CTLGERPESTELRESDDDRESP2').innerHTML + ")" + parent.frames[0].document.getElementById('CTLGERPESTELRESRESP2').innerHTML + ";"; cabecalho += "Tel Res Resp 2;"; }
        if (camposConfig.telCelResp2) { a += "(" + parent.frames[0].document.getElementById('CTLGERPESTELCELDDDRESP2').innerHTML + ")" + parent.frames[0].document.getElementById('CTLGERPESTELCELRESP2').innerHTML + ";"; cabecalho += "Tel Celular Resp 2;"; }
        if (camposConfig.telComResp2) { a += "(" + parent.frames[0].document.getElementById('CTLGERPESTELCOMDDDRESP2').innerHTML + ")" + parent.frames[0].document.getElementById('CTLGERPESTELCOMRESP2').innerHTML + ";"; cabecalho += "Tel Comercial Resp 2;"; }
        if (camposConfig.telContatoResp2) { a += "(" + parent.frames[0].document.getElementById('CTLGERPESTELCONDDDRESP2').innerHTML + ")" + parent.frames[0].document.getElementById('CTLGERPESTELCONRESP2').innerHTML + ";"; cabecalho += "Tel Contato Resp 2;"; }
        if (camposConfig.emailResp2) { a += parent.frames[0].document.getElementById('CTLGERPESEMAILRESP2').innerHTML + ";"; cabecalho += "E-mail Resp 2;"; }

        // Contato da seção final da página (ENDEREÇO)
        if (camposConfig.telResidencial) { a += "(" + parent.frames[0].document.getElementById('span_CTLGERPESTELRESDDD').innerHTML + ")" + parent.frames[0].document.getElementById('span_CTLGERPESTELRES').innerHTML + ";"; cabecalho += "Tel Residencial;"; }
        if (camposConfig.telCelular) { a += "(" + parent.frames[0].document.getElementById('span_CTLGERPESTELCELDDD').innerHTML + ")" + parent.frames[0].document.getElementById('span_CTLGERPESTELCEL').innerHTML + ";"; cabecalho += "Tel Celular;"; }
        if (camposConfig.telComercial) { a += "(" + parent.frames[0].document.getElementById('span_CTLGERPESTELCOMDDD').innerHTML + ")" + parent.frames[0].document.getElementById('span_CTLGERPESTELCOM').innerHTML + ";"; cabecalho += "Tel Comercial;"; }
        if (camposConfig.telContato) { a += "(" + parent.frames[0].document.getElementById('span_CTLGERPESTELCONDDD').innerHTML + ")" + parent.frames[0].document.getElementById('span_CTLGERPESTELCON').innerHTML + ";"; cabecalho += "Tel Contato;"; }

        // Endereço
        if (camposConfig.endereco) { a += parent.frames[0].document.getElementById('span_CTLGERPESEND').innerHTML + ";"; cabecalho += "Endereço Rua;"; }
        if (camposConfig.numero) { a += parent.frames[0].document.getElementById('span_CTLGERPESNMRLOG').innerHTML + ";"; cabecalho += "Número;"; }
        if (camposConfig.complemento) { a += parent.frames[0].document.getElementById('span_CTLGERPESCMPLOG').innerHTML + ";"; cabecalho += "Complemento;"; }
        if (camposConfig.bairro) { a += parent.frames[0].document.getElementById('span_CTLGERPESBAIRRO').innerHTML + ";"; cabecalho += "Bairro;"; }
        if (camposConfig.cidade) { a += parent.frames[0].document.getElementById('span_CTLGERPESENDCIDDSC').innerHTML + ";"; cabecalho += "Cidade;"; }
        if (camposConfig.uf) { a += parent.frames[0].document.getElementById('span_CTLGERPESENDUF').innerHTML + ";"; cabecalho += "UF;"; }
        if (camposConfig.cep) { a += parent.frames[0].document.getElementById('span_CTLGERPESCEP').innerHTML + ";"; cabecalho += "CEP;"; }
        if (camposConfig.uc) { a += parent.frames[0].document.getElementById('span_CTLGERPESDISTCOD').innerHTML + ";"; cabecalho += "UC (Distribuidora);"; }
        if (camposConfig.numUC) { a += parent.frames[0].document.getElementById('span_CTLGERPESUC').innerHTML + ";"; cabecalho += "Nº UC;"; }
        
        a += "\n";

        txtareaDados.value = cabecalho + "\n" + a;
        n = n + 1;
        if(n < vetAluno.length){
            ifrIframe1.src = "http://sigeduca.seduc.mt.gov.br/ged/hwtmgedaluno.aspx?"+vetAluno[n]+",,HWMConAluno,DSP,1,0";
        }
    }
    if(n >= vetAluno.length){
        txtareaDados.select();
        document.execCommand("copy");
        alert('finalizado');
    }
}

//Extrai dados da ABA "SOCIAL"
function coletaDados2() {
    if(n < vetAluno.length){
        //Localiza o nome do aluno numa cadeia de caracteres
        let str = parent.frames[0].document.getElementsByName('GXState')[0].value;
        let regex = /"GedAluNom":"([^"]+)"/;
        let match = str.match(regex);
        nomealuno = match[1];

        a = a + vetAluno[n] +";"; cabecalho = "Cod Aluno;"; //Cod Aluno
        a = a + nomealuno +";"; cabecalho = cabecalho+"Nome do Aluno;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNUMCARTAOSUS').innerHTML +";"; cabecalho = cabecalho+"Nro SUS;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNIS').innerHTML +";"; cabecalho = cabecalho+"Nro NIS;";
        a = a + parent.frames[0].document.getElementById('span_CTLGEDALUTIPOSANGUINEO').innerHTML.replace('SELECIONE', 'não consta')+";"; cabecalho = cabecalho+"Tipo sanguíneo;";
        a = a + parent.frames[0].document.getElementById('span_CTLGEDALURECATEEDUESP').innerHTML +";"; cabecalho = cabecalho+"Recebe Atendimento Especializado;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESBENPCAS').innerHTML +";"; cabecalho = cabecalho+"Recebe BPC;";
        a = a + parent.frames[0].document.getElementById('span_CTLGEDALUPASSELIVRE').innerHTML +";"; cabecalho = cabecalho+"Utiliza Passe Livre;";
        a = a + "\n";

        txtareaDados.value = cabecalho+"\n"+a;
        n=n+1;
        if(n < vetAluno.length){
            ifrIframe1.src = "http://sigeduca.seduc.mt.gov.br/ged/hwtmgedaluno1.aspx?"+vetAluno[n]+",,HWMConAluno,DSP,0,1,0,1";
        }
    }
    if(n >= vetAluno.length){
        txtareaDados.select();
        document.execCommand("copy");
        alert('finalizado');
    }
}

//Extrair dados da Matrícula
const coletaDados3 = function() {
    setTimeout(function() {
        iniColetaDados3(vetAluno);
    }, 500); // 500ms de atraso
}
let abortController = null; // Controlador para cancelar execução anterior
async function iniColetaDados3(vetAluno) {
    // Se já houver uma execução em andamento, cancelá-la
    if (abortController) {
        abortController.abort();
    }

    // Criar um novo controlador de abortamento
    abortController = new AbortController();
    let abortSignal = abortController.signal;

    let matCodAntigo = "0"; // Inicializa com "0"
    let nomeAntigo = "0";
    txtareaDados.value = [
        "Código",
        "Nome do Aluno",
        "Matriz",
        "Turma",
        "Turno",
        "Rede de Origem",
        "Utiliza Transporte",
        "Matrícula Mescla",
        "Matrícula Extraordinária",
        "Matrícula de Progressão Parcial",
        "Data da Matrícula",
        "Nº da Matrícula",
        "Observação"
    ].join("; ") + "\n";

    function esperarCarregarElemento(idElemento, valorAntigo, tentativas = 80, intervalo = 50) {
        return new Promise((resolve, reject) => {
            let contador = 0;
            let verificar = setInterval(() => {
                if (abortSignal.aborted) { // Verifica se a função foi abortada
                    clearInterval(verificar);
                    reject("Processo abortado");
                    return;
                }

                let elemento = parent.frames[0].document.getElementById(idElemento);
                if (elemento && elemento.innerText.trim() !== "" && elemento.innerText.trim() !== valorAntigo) {
                    clearInterval(verificar);
                    resolve(elemento.innerText.trim());
                    return;
                }
                contador++;
                if (contador >= tentativas) {
                    clearInterval(verificar);
                    reject("Erro ao consultar aluno");
                }
            }, intervalo);
        });
    }

    for (let i = 0; i < vetAluno.length; i++) {
        if (abortSignal.aborted) return; // Se foi abortado, interrompe o loop

        let codigo = vetAluno[i];
        parent.frames[0].document.getElementById('vGEDALUCOD').value = codigo;
        parent.frames[0].document.getElementById('vGEDALUCOD').onblur();
        // Adiciona um tempo de 10ms antes de executar o clique
        setTimeout(function() {
            parent.frames[0].document.getElementsByName('BCONSULTAR')[0].click();
        }, 50);

        try {
            let matCodAtual = await esperarCarregarElemento("span_vGEDMATCOD_0001", matCodAntigo);
            let nomeAtual = await esperarCarregarElemento("span_vGEDALUNOM", nomeAntigo);
            let nomeAluno = parent.frames[0].document.getElementById("span_vGEDALUNOM")?.innerText || "N/A";
            let matrizTurma = parent.frames[0].document.getElementById("span_vGRIDGEDMATDISCGERMATMSC_0001")?.innerText || "N/A";
            let turmaAluno = parent.frames[0].document.getElementById("span_vGERTURSAL_0001")?.innerText || "N/A";
            let turnoAluno = parent.frames[0].document.getElementById("span_vGERTRNDSC_0001")?.innerText || "N/A";

            let selectElem = parent.frames[0].document.getElementById("vGEDMATTIPOORIGEMMAT_0001");
            let redeOrigemMat = selectElem ? selectElem.options[selectElem.selectedIndex]?.text || "N/A" : "N/A";

            let selectElemTransporte = parent.frames[0].document.getElementById("vMATTRANSPESCOLAR_0001");
            let utilizaTransporte = selectElemTransporte.options[selectElemTransporte.selectedIndex]?.text;

            let matriculaMescla = verCheckbox("vMATMESCLA_0001");
            let matriculaExtraord = verCheckbox("vMATEXTRAORDINARIA_0001");
            let matriculaProgressao = verCheckbox("vMATPROGRESSAOPARCIAL_0001");
            let dataMatricula = parent.frames[0].document.getElementById('span_vGEDMATDTA_0001')?.innerText || "N/A";
            let numMatricula = parent.frames[0].document.getElementById('span_vGEDMATCOD_0001')?.innerText || "N/A";

            txtareaDados.value += [
                codigo.trim(),
                nomeAluno.trim(),
                matrizTurma.trim(),
                turmaAluno.trim(),
                turnoAluno.trim(),
                redeOrigemMat.trim(),
                utilizaTransporte.trim(),
                matriculaMescla.trim(),
                matriculaExtraord.trim(),
                matriculaProgressao.trim(),
                dataMatricula.trim(),
                numMatricula.trim()
            ].join("; ") + "\n";


            matCodAntigo = matCodAtual; // Atualiza o código para próxima verificação
        } catch (error) {
            console.error(error);
            if (error === "Processo abortado") return; // Se abortado, sai da função

            let nomeAluno = parent.frames[0].document.getElementById("span_vGEDALUNOM")?.innerText || "N/A";

            let erroElemento = parent.frames[0].document.querySelector("#gxErrorViewer .erro");
            let erroAlunoNaoMatriculado = erroElemento ? erroElemento.textContent.trim() : "";

            txtareaDados.value += `${codigo.trim()}; ${nomeAluno.trim()}; ${erroAlunoNaoMatriculado ? erroAlunoNaoMatriculado : "O extrator não teve retorno da consulta. Verifique o código deste aluno."}\n`;
        }
    }

    if (!abortSignal.aborted) {
        alert("Consulta finalizada!"); // Exibe alerta ao concluir, se não tiver sido abortado
    }
}
//Função verificarCheckbox
function verCheckbox(id) {
    let checkbox = parent.frames[0].document.getElementsByName(id)[0];
    if (checkbox) {
        return checkbox.value === "1" ? "Sim" : "Não";
    } else {
        console.error("Elemento não encontrado.");
        return null;
    }
}


//BOTÃO EXIBIR ou MINIMIZAR
function exibir(){
    slideToggle('credito1');
    if(this.value=="MINIMIZAR"){
        this.value="ABRIR"
    }
    else{
        this.value="MINIMIZAR"
    };
};
var btnExibir = document.createElement('input');
    btnExibir.setAttribute('type','button');
    btnExibir.setAttribute('id','exibir1');
    btnExibir.setAttribute('value','MINIMIZAR');
    btnExibir.setAttribute('class','menuSCT');
    btnExibir.setAttribute('style','background:#FF3300; width: 187px; border: 1px solid rgb(0, 0, 0); position: fixed; z-index: 2002; bottom: 0px; right: 30px;');
    btnExibir.setAttribute('onmouseover', 'this.style.backgroundColor = "#FF7A00"');
    btnExibir.setAttribute('onmouseout', 'this.style.backgroundColor = "#FF3300"');
    btnExibir.setAttribute('onmousedown', 'this.style.backgroundColor = "#EB8038"');
    btnExibir.setAttribute('onmouseup', 'this.style.backgroundColor = "#FF7A00"');
    btnExibir.onclick = exibir;
document.getElementsByTagName('body')[0].appendChild(btnExibir);

//DIV principal (corpo)
var divCredit = document.createElement('div');
    divCredit.setAttribute('id','credito1');
    divCredit.setAttribute('name','credito2');
    divCredit.setAttribute('class','menuSCT');
    divCredit.setAttribute('style','background: #DBDBDB; color: #000; width: 380px; text-align: center;font-weight: bold;position: fixed;z-index: 2002;padding: 5px 0px 0px 5px;bottom: 24px;right: 30px;height: 400px;');
document.getElementsByTagName('body')[0].appendChild(divCredit);

// Botão para abrir/fechar o painel de configuração
var configToggleBtn = document.createElement('button');
configToggleBtn.textContent = '⚙️ Configurar Filtros';
configToggleBtn.className = 'config-toggle';
configToggleBtn.onclick = toggleConfigPanel;
document.body.appendChild(configToggleBtn);

// Painel de configuração
var configPanel = document.createElement('div');
configPanel.id = 'configPanel';
configPanel.className = 'config-panel';
configPanel.innerHTML = '<h3>Selecionar Campos para Extração</h3>';

// Função para criar um switch
function createSwitch(id, label, initialState) {
    const container = document.createElement('div');
    container.className = 'switch-container';
    
    const labelElement = document.createElement('span');
    labelElement.className = 'switch-label';
    labelElement.textContent = label;
    
    const switchElement = document.createElement('label');
    switchElement.className = 'switch';
    switchElement.innerHTML = `
        <input type="checkbox" id="${id}" ${initialState ? 'checked' : ''}>
        <span class="slider"></span>
    `;
    
    // Adiciona evento para atualizar a configuração
    switchElement.querySelector('input').addEventListener('change', function() {
        camposConfig[id] = this.checked;
    });
    
    container.appendChild(labelElement);
    container.appendChild(switchElement);
    return container;
}

// Adiciona switches para cada campo
configPanel.appendChild(createSwitch('codAluno', 'Código do Aluno', true));
configPanel.appendChild(createSwitch('inep', 'Número INEP', true));
configPanel.appendChild(createSwitch('nome', 'Nome do Aluno', true));
configPanel.appendChild(createSwitch('cpf', 'CPF do Aluno', true));
configPanel.appendChild(createSwitch('raca', 'Cor/Raça', true));
configPanel.appendChild(createSwitch('grupoSocial', 'Grupo Social', true));
configPanel.appendChild(createSwitch('rg', 'RG do Aluno', true));
configPanel.appendChild(createSwitch('orgaoExpedidor', 'Órgão Expedidor', true));
configPanel.appendChild(createSwitch('sexo', 'Sexo do Aluno', true));
configPanel.appendChild(createSwitch('dataNascimento', 'Data de Nascimento', true));
configPanel.appendChild(createSwitch('naturalidade', 'Naturalidade', true));
configPanel.appendChild(createSwitch('ufNaturalidade', 'UF Naturalidade', true));
configPanel.appendChild(createSwitch('filiacao1', 'Filiação 1 (Mãe)', true));
configPanel.appendChild(createSwitch('filiacao2', 'Filiação 2 (Pai)', true));

configPanel.appendChild(document.createElement('hr'));

configPanel.appendChild(createSwitch('responsavel1', 'Responsável 1 - Nome', true));
configPanel.appendChild(createSwitch('cpfResponsavel1', 'Responsável 1 - CPF', true));
configPanel.appendChild(createSwitch('telResResp1', 'Responsável 1 - Tel Residencial', true));
configPanel.appendChild(createSwitch('telCelResp1', 'Responsável 1 - Tel Celular', true));
configPanel.appendChild(createSwitch('telComResp1', 'Responsável 1 - Tel Comercial', true));
configPanel.appendChild(createSwitch('telContatoResp1', 'Responsável 1 - Tel Contato', true));
configPanel.appendChild(createSwitch('emailResp1', 'Responsável 1 - E-mail', true));

configPanel.appendChild(document.createElement('hr'));

configPanel.appendChild(createSwitch('responsavel2', 'Responsável 2 - Nome', true));
configPanel.appendChild(createSwitch('cpfResponsavel2', 'Responsável 2 - CPF', true));
configPanel.appendChild(createSwitch('telResResp2', 'Responsável 2 - Tel Residencial', true));
configPanel.appendChild(createSwitch('telCelResp2', 'Responsável 2 - Tel Celular', true));
configPanel.appendChild(createSwitch('telComResp2', 'Responsável 2 - Tel Comercial', true));
configPanel.appendChild(createSwitch('telContatoResp2', 'Responsável 2 - Tel Contato', true));
configPanel.appendChild(createSwitch('emailResp2', 'Responsável 2 - E-mail', true));

configPanel.appendChild(document.createElement('hr'));

configPanel.appendChild(createSwitch('telResidencial', 'Tel Residencial', true));
configPanel.appendChild(createSwitch('telCelular', 'Tel Celular', true));
configPanel.appendChild(createSwitch('telComercial', 'Tel Comercial', true));
configPanel.appendChild(createSwitch('telContato', 'Tel Contato', true));

configPanel.appendChild(document.createElement('hr'));

configPanel.appendChild(createSwitch('endereco', 'Endereço', true));
configPanel.appendChild(createSwitch('numero', 'Número', true));
configPanel.appendChild(createSwitch('complemento', 'Complemento', true));
configPanel.appendChild(createSwitch('bairro', 'Bairro', true));
configPanel.appendChild(createSwitch('cidade', 'Cidade', true));
configPanel.appendChild(createSwitch('uf', 'UF', true));
configPanel.appendChild(createSwitch('cep', 'CEP', true));
configPanel.appendChild(createSwitch('uc', 'UC (Distribuidora)', true));
configPanel.appendChild(createSwitch('numUC', 'Nº UC', true));

document.body.appendChild(configPanel);

// Adiciona switch "Ativar/Desativar Tudo" no topo do painel
var toggleAllContainer = document.createElement('div');
toggleAllContainer.className = 'switch-container';
toggleAllContainer.style.marginBottom = '15px';
toggleAllContainer.style.borderBottom = '1px solid #ccc';
toggleAllContainer.style.paddingBottom = '10px';

var toggleAllLabel = document.createElement('span');
toggleAllLabel.className = 'switch-label';
toggleAllLabel.textContent = 'Ativar/Desativar Tudo';
toggleAllLabel.style.fontWeight = 'bold';

var toggleAllSwitch = document.createElement('label');
toggleAllSwitch.className = 'switch';
toggleAllSwitch.innerHTML = `
    <input type="checkbox" id="toggleAll" checked>
    <span class="slider"></span>
`;

// Insere no início do painel
configPanel.insertBefore(toggleAllContainer, configPanel.firstChild.nextSibling);
toggleAllContainer.appendChild(toggleAllLabel);
toggleAllContainer.appendChild(toggleAllSwitch);

// Adiciona funcionalidade ao switch "Ativar/Desativar Tudo"
document.getElementById('toggleAll').addEventListener('change', function() {
    const isChecked = this.checked;
    const switches = configPanel.querySelectorAll('input[type="checkbox"]:not(#toggleAll)');
    switches.forEach(switchElement => {
        switchElement.checked = isChecked;
        const id = switchElement.id;
        camposConfig[id] = isChecked;
    });
});

// Adiciona estilo CSS para o switch "Ativar/Desativar Tudo"
var toggleAllStyle = document.createElement('style');
toggleAllStyle.innerHTML = `
#toggleAll + .slider {
    background-color: #2196F3;
}
#toggleAll:checked + .slider {
    background-color: #2196F3;
}
`;
document.head.appendChild(toggleAllStyle);

//Iframe
var ifrIframe1 = document.createElement("iframe");
ifrIframe1.setAttribute("id","iframe1");
ifrIframe1.setAttribute("src","about:blank");
ifrIframe1.setAttribute("style","height: 100px; width: 355px; display:none");
divCredit.appendChild(ifrIframe1);

//TEXTO CÓDIGO ALUNO
var textCodAluno = document.createTextNode("INFORME OS CÓDIGOS DOS ALUNOS");
divCredit.appendChild(textCodAluno);

//textarea alunos a serem pesquisados
var txtareaAluno = document.createElement('TEXTAREA');
txtareaAluno.setAttribute('name','txtAluno');
txtareaAluno.setAttribute('id','txtAluno');
txtareaAluno.setAttribute('value','');
txtareaAluno.setAttribute('style','border:1px solid #000000;width: 355px;height: 82px; resize: none');
txtareaAluno.setAttribute('onclick','this.select()');
divCredit.appendChild(txtareaAluno);

//DIV NIS1
var divNIS = document.createElement('div');
divNIS.setAttribute('id','divNIS1');
divNIS.setAttribute('name','divNIS2');
divCredit.appendChild(divNIS);

//BOTÃO COLETAR DADOS PESSOAIS
var btnColetar1 = document.createElement('input');
btnColetar1.setAttribute('type','button');
btnColetar1.setAttribute('name','btnColetar1');
btnColetar1.setAttribute('value','Extrair de aba \"Pessoal\"');
btnColetar1.setAttribute('class','botaoSCT');
divCredit.appendChild(btnColetar1);
btnColetar1.onclick = function(){coletar(1)};

//BOTÃO COLETAR DADOS SOCIAIS
var btnColetar2 = document.createElement('input');
btnColetar2.setAttribute('type','button');
btnColetar2.setAttribute('name','btnColetar2');
btnColetar2.setAttribute('value','Extrair de aba \"Social\"');
btnColetar2.setAttribute('class','botaoSCT');
divCredit.appendChild(btnColetar2);
btnColetar2.onclick = function(){coletar(2)};

//BOTÃO COLETAR DADOS MATRICULAS
var btnColetar3 = document.createElement('input');
btnColetar3.setAttribute('type','button');
btnColetar3.setAttribute('name','btnColetar3');
btnColetar3.setAttribute('value','Extrair Dados da Matrícula');
btnColetar3.setAttribute('class','botaoSCT');
divCredit.appendChild(btnColetar3);
btnColetar3.onclick = function(){coletar(3)};

//QUEBRA LINHA
var quebraLinha1 = document.createElement("br");
divCredit.appendChild(quebraLinha1);
quebraLinha1 = document.createElement("br");
divCredit.appendChild(quebraLinha1);

//TEXTO INFORMAÇÕES EXTRAÍDAS
var textColetados = document.createTextNode("INFORMAÇÕES DAS FICHAS EXTRAÍDAS");
divCredit.appendChild(textColetados);

//textarea pra dados coletados
var txtareaDados = document.createElement('TEXTAREA');
txtareaDados.setAttribute('name','txtDados');
txtareaDados.setAttribute('id','txtDados');
txtareaDados.setAttribute('value','');
txtareaDados.setAttribute('style','border:1px solid #000000;width: 355px;height: 150px; resize: none');
txtareaDados.setAttribute('onclick','this.select()');
txtareaDados.readOnly = true;
divCredit.appendChild(txtareaDados);

//BOTAO SALVAR EM TXT
var btnSalvarTxt = document.createElement('input');
btnSalvarTxt.setAttribute('type','button');
btnSalvarTxt.setAttribute('name','btnSalvarTxt');
btnSalvarTxt.setAttribute('value','Salvar em CSV(Excel)');
btnSalvarTxt.setAttribute('class','botaoSCT');
divCredit.appendChild(btnSalvarTxt);
btnSalvarTxt.onclick = saveTextAsFile;

//DIV CREDITO
var divCredito = document.createElement('div');
divCredit.appendChild(divCredito);

var br1 = document.createElement('br');
divCredito.appendChild(br1);

var span1 = document.createElement('span');
span1.innerHTML = '>>Roberson Arruda<<';
divCredito.appendChild(span1);

br1 = document.createElement('br');
span1.appendChild(br1);

span1 = document.createElement('span');
span1.innerHTML = '(robersonarruda@outlook.com)';
divCredito.appendChild(span1);

br1 = document.createElement('br');
span1.appendChild(br1);

span1 = document.createElement('span');
span1.textContent = `${scriptName} v${scriptVersion}`
divCredito.appendChild(span1);
