// ==UserScript==
// @name          Extrator Contatos Sigeduca
// @version       2.5.3
// @description   Consulta e salva dados de contato dos alunos do sigeduca.
// @author        Roberson Arruda
// @homepage      https://github.com/donidozh/ExtratorGED/blob/main/ExtratorGED.user.js
// @downloadURL   https://raw.githubusercontent.com/donidozh/ExtratorGED/main/ExtratorGED.user.js
// @updateURL     https://raw.githubusercontent.com/donidozh/ExtratorGED/main/ExtratorGED.user.js
// @match	      https://*.seduc.mt.gov.br/ged/hwmconaluno.aspx*
// @match	      http://*.seduc.mt.gov.br/ged/hwmconaluno.aspx*
// @copyright     2019, Roberson Arruda (robersonarruda@outlook.com)
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
}`;
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
        // Percorre todos os elementos de input com o name="CTLGERPESGRPSOC" (Grupo Social)
        let radios = parent.frames[0].document.querySelectorAll('input[name="CTLGERPESGRPSOC"]');
        // Para cada input radio
        radios.forEach(function(radio) {
            // Verifica se o radio está selecionado (checked)
            if (radio.checked) {
                // Verifica o value e atribui o valor adequado à variável grupoSocial
                switch (radio.value) {
                    case "N":
                        grupoSocial = "Não declarado";
                        break;
                    case "I":
                        grupoSocial = "Circense";
                        break;
                    case "T":
                        grupoSocial = "Trabalhador Itinerante";
                        break;
                    case "C":
                        grupoSocial = "Acampados";
                        break;
                    case "A":
                        grupoSocial = "Artista";
                        break;
                    case "P":
                        grupoSocial = "Povos Indígenas";
                        break;
                    case "Q":
                        grupoSocial = "Povos Quilombolas";
                        break;
                    default:
                        grupoSocial = ""; // Caso o value não seja nenhum dos listados
                }
            }
        });

        //Dados gerais do Aluno
        a = a + vetAluno[n] +";"; cabecalho = "Cod Aluno;"; //Cod Aluno
        a = a + parent.frames[0].document.getElementById('span_CTLGEDALUIDINEP').innerHTML +";"; cabecalho = cabecalho+"Nº INEP;"; //Matrícula INEP
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNOM').innerHTML +";"; cabecalho = cabecalho+"Aluno;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESCPF').innerHTML.replace(/^([\d]{3})([\d]{3})([\d]{3})([\d]{2})$/, "$1.$2.$3-$4") +";"; cabecalho = cabecalho+"CPF do Aluno;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESRACA').innerHTML +";"; cabecalho = cabecalho+"Cor ou Raça;";
        a = a + grupoSocial+";"; cabecalho = cabecalho+"Grupo Social;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESRG').innerHTML +";"; cabecalho = cabecalho+"RG do aluno;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERORGEMICOD').innerHTML +";"; cabecalho = cabecalho+"Órgão Expedidor;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESSEXO').innerHTML +";"; cabecalho = cabecalho+"Sexo do Aluno;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESDTANASC').innerHTML +";"; cabecalho = cabecalho+"Data de Nascimento;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNATDSC').innerHTML +";"; cabecalho = cabecalho+"Naturalidade;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNATUF').innerHTML +";"; cabecalho = cabecalho+"UF;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNOMMAE').innerHTML +";"; cabecalho = cabecalho+"Filiação 1;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNOMPAI').innerHTML +";"; cabecalho = cabecalho+"filiação 2;";

        //Contatos responsável 1
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNOMRESP').innerHTML+";"; cabecalho = cabecalho+"Nome do responsável 1;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESRESPCPF').innerHTML.replace(/^([\d]{3})([\d]{3})([\d]{3})([\d]{2})$/, "$1.$2.$3-$4")+";"; cabecalho = cabecalho+"CPF do responsável 1;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELRESDDDRESP').innerHTML+")"; //DDD Residencial
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELRESRESP').innerHTML+";"; cabecalho = cabecalho+"Tel Res Resp 1;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELCELDDDRESP').innerHTML+")"; //DDD Celular
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELCELRESP').innerHTML+";"; cabecalho = cabecalho+"Tel Celular Resp 1;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELCOMDDDRESP').innerHTML+")"; //DDD Comercial
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELCOMRESP').innerHTML+";"; cabecalho = cabecalho+"Tel Comercial Resp 1;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELCONDDDRESP').innerHTML+")"; //DDD Contato
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELCONRESP').innerHTML+";"; cabecalho = cabecalho+"Tel Contato Resp 1;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESEMAILRESP').innerHTML+";"; cabecalho = cabecalho+"E-mail Resp 1;";

        //Contatos responsável 2
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNOMRESP2').innerHTML+";"; cabecalho = cabecalho+"Nome do responsável 2;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESRESPCPF2').innerHTML.replace(/^([\d]{3})([\d]{3})([\d]{3})([\d]{2})$/, "$1.$2.$3-$4")+";"; cabecalho = cabecalho+"CPF do responsável 2;";
        a = a + "("+parent.frames[0].document.getElementById('CTLGERPESTELRESDDDRESP2').innerHTML+")"; //DDD Residencial
        a = a + parent.frames[0].document.getElementById('CTLGERPESTELRESRESP2').innerHTML+";"; cabecalho = cabecalho+"Tel Res Resp 2;";
        a = a + "("+parent.frames[0].document.getElementById('CTLGERPESTELCELDDDRESP2').innerHTML+")"; //DDD Celular
        a = a + parent.frames[0].document.getElementById('CTLGERPESTELCELRESP2').innerHTML+";"; cabecalho = cabecalho+"Tel Celular Resp 2;";
        a = a + "("+parent.frames[0].document.getElementById('CTLGERPESTELCOMDDDRESP2').innerHTML+")"; //DDD Comercial
        a = a + parent.frames[0].document.getElementById('CTLGERPESTELCOMRESP2').innerHTML+";"; cabecalho = cabecalho+"Tel Comercial Resp 2;";
        a = a + "("+parent.frames[0].document.getElementById('CTLGERPESTELCONDDDRESP2').innerHTML+")"; //DDD Contato
        a = a + parent.frames[0].document.getElementById('CTLGERPESTELCONRESP2').innerHTML+";"; cabecalho = cabecalho+"Tel Contato Resp 2;";
        a = a + parent.frames[0].document.getElementById('CTLGERPESEMAILRESP2').innerHTML+";"; cabecalho = cabecalho+"E-mail Resp 2;";

        //Contato da seção final da página (ENDEREÇO)
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELRESDDD').innerHTML+")"; //DDD Residencial 2
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELRES').innerHTML+";"; cabecalho = cabecalho+"Tel Residencial;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELCELDDD').innerHTML+")"; //DDD Celular 2
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELCEL').innerHTML+";"; cabecalho = cabecalho+"Tel Celular;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELCOMDDD').innerHTML+")"; //DDD Comercial 2
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELCOM').innerHTML+";"; cabecalho = cabecalho+"Tel Comercial;";
        a = a + "("+parent.frames[0].document.getElementById('span_CTLGERPESTELCONDDD').innerHTML+")"; //DDD Contato 2
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESTELCON').innerHTML+";"; cabecalho = cabecalho+"Tel Contato;";

        //Endereço
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESEND').innerHTML+";"; cabecalho = cabecalho+"Endereço Rua;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESNMRLOG').innerHTML+";"; cabecalho = cabecalho+"Número;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESCMPLOG').innerHTML+";"; cabecalho = cabecalho+"Complemento;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESBAIRRO').innerHTML+";"; cabecalho = cabecalho+"Bairro;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESENDCIDDSC').innerHTML+";"; cabecalho = cabecalho+"Cidade;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESENDUF').innerHTML+";"; cabecalho = cabecalho+"UF;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESCEP').innerHTML+";"; cabecalho = cabecalho+"CEP;";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESDISTCOD').innerHTML+";"; cabecalho = cabecalho+"UC (Distribuidora);";
        a = a + parent.frames[0].document.getElementById('span_CTLGERPESUC').innerHTML+";"; cabecalho = cabecalho+"Nº UC;";
        a = a + "\n";

        txtareaDados.value = cabecalho+"\n"+a;
        n=n+1;
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
