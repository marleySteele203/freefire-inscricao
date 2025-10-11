// ==========================
// Funções de armazenamento
// ==========================
function saveData(key, value){
    localStorage.setItem(key, JSON.stringify(value));
}

function loadData(key){
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

function clearData(){
    localStorage.clear();
}

// ==========================
// Atualizar barra de progresso
// ==========================
function updateProgress(percent){
    const progressBar = document.querySelector('.progress');
    if(progressBar){
        progressBar.style.transition = 'width 0.5s ease-in-out';
        setTimeout(() => {
            progressBar.style.width = percent + '%';
            progressBar.textContent = percent + '% completo';
        }, 50);
    }
}

// ==========================
// Validação de campos e salvamento
// ==========================
function validateAndSaveStep(step){
    if(step === 'step3'){ // Nome e Tag da Squad
        const squadName = document.getElementById('squadName').value.trim();
        const squadTag = document.getElementById('squadTag').value.trim();
        if(!squadName || !squadTag){
            showError('Preencha todos os campos da Squad.');
            return false;
        }
        saveData('squadName', squadName);
        saveData('squadTag', squadTag);
        return true;
    }
    if(step === 'step4'){ // Nicknames
        const container = document.getElementById('nicknameInputs');
        const inputs = container.querySelectorAll('input');
        const nicknames = [];
        inputs.forEach(input => {
            if(input.value.trim()) nicknames.push(input.value.trim());
        });
        if(nicknames.length === 0){
            showError('Insira pelo menos um nickname.');
            return false;
        }
        saveData('nicknames', nicknames);
        return true;
    }
    if(step === 'step5'){ // País e confirmação
        const country = document.getElementById('countrySelect').value;
        const confirmationMsg = document.getElementById('confirmationMsg').value.trim();
        if(!country){
            showError('Selecione o país antes de continuar.');
            return false;
        }
        saveData('country', country);
        saveData('confirmationMsg', confirmationMsg);

        // ==========================
        // REDIRECIONAMENTO PARA WHATSAPP
        // ==========================
        const playerName = loadData('playerName') || "Não informado";
        const playerID = loadData('playerID') || "Não informado";
        const playerTeam = loadData('playerTeam') || "Não informado";

        let whatsappMessage = `Nova inscrição Free Fire:\nNome: ${playerName}\nID: ${playerID}\nTime: ${playerTeam}\nPaís: ${country}\nConfirmação: ${confirmationMsg}`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const waNumber = "258874600005"; // número do criador
        window.location.href = `https://wa.me/${waNumber}?text=${encodedMessage}`;

        return true;
    }
    return true;
}

// ==========================
// Mostrar mensagem de erro inline
// ==========================
function showError(msg){
    let errorBox = document.getElementById('errorMsg');
    if(!errorBox){
        errorBox = document.createElement('span');
        errorBox.id = 'errorMsg';
        errorBox.style.color = 'red';
        errorBox.style.display = 'block';
        errorBox.style.marginTop = '5px';
        document.querySelector('.container').appendChild(errorBox);
    }
    errorBox.textContent = msg;
}

// ==========================
// Dropdown customizado de países
// ==========================
const countrySelect = document.getElementById('countrySelect');
if(countrySelect){
    const selected = countrySelect.querySelector('.selected');
    const options = countrySelect.querySelector('.options');

    if(selected && options){
        selected.addEventListener('click', () => {
            countrySelect.classList.toggle('active');
        });

        options.querySelectorAll('div').forEach(option => {
            option.addEventListener('click', () => {
                selected.textContent = option.textContent;
                saveData('country', option.dataset.value);
                countrySelect.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if(!countrySelect.contains(e.target)){
                countrySelect.classList.remove('active');
            }
        });
    }
}

// ==========================
// Enviar resumo para Discord
// ==========================
function sendToDiscord(messageText){
    const mode = loadData('mode');
    const squadName = loadData('squadName') || '';
    const squadTag = loadData('squadTag') || '';
    const nicknames = loadData('nicknames') || [];
    const country = loadData('country') || '';
    const confirmationMsg = loadData('confirmationMsg') || '';

    let summaryText = `
📌 Nova Inscrição Copa Free Fire
Modalidade: ${mode}
Nome da Squad: ${squadName}
Tag da Squad: ${squadTag}
Nicknames: ${nicknames.join(', ')}
País: ${country}`;

    if(confirmationMsg) summaryText += `\nMensagem: ${confirmationMsg}`;
    if(messageText) summaryText += `\nObservação: ${messageText}`;

    const webhookUrl = "https://discord.com/api/webhooks/1419024179809751161/-6fpwnlG5GfYmVikmqmZT5f18nb8-9I4nSdeTjWrhxL8XVoLnfQsU7Bb1B4yiaLCjEnx";
    fetch(webhookUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({content: summaryText})
    })
    .then(res => {
        if(res.ok) alert("Inscrição enviada para Discord!");
        else alert("Erro ao enviar para Discord.");
    })
    .catch(err => alert("Erro: " + err));
}

// ==========================
// Função para abrir placar
// ==========================
function viewPlacard(){
    window.location.href = 'placar.html';
}

// ==========================
// Função para preencher placar
// ==========================
function loadPlacard() {
    const mode = loadData('mode');
    const squadName = loadData('squadName') || '';
    const squadTag = loadData('squadTag') || '';
    const nicknames = loadData('nicknames') || [];

    let totalSlots = 0;
    if(mode === 'Solo') totalSlots = 48;
    else if(mode === 'Duo') totalSlots = 24;
    else if(mode === 'Squad') totalSlots = 12;

    const tbody = document.querySelector('#scoreTable tbody');
    if(!tbody) return;
    tbody.innerHTML = '';

    for(let i = 0; i < totalSlots; i++){
        let lineName = '-';
        let lineNick = '-';
        let lineTag = '-';

        if(mode === 'Solo'){
            if(nicknames[i]){
                lineName = nicknames[i];
            }
        } else {
            if(i < nicknames.length){
                lineName = squadName;
                lineNick = nicknames[i];
                lineTag = squadTag;
            }
        }

        tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${lineName}</td>
                <td>${lineNick}</td>
                <td>${lineTag}</td>
            </tr>
        `;
    }
}

// ==========================
// Adicionar inscrição no array de linhas
// ==========================
function addLine(){
    const mode = loadData('mode');
    const squadName = loadData('squadName') || '';
    const squadTag = loadData('squadTag') || '';
    const nicknames = loadData('nicknames') || [];

    let lines = loadData('lines') || [];
    const lineObj = {
        mode: mode,
        squadName: squadName,
        squadTag: squadTag,
        nicknames: nicknames
    };
    lines.push(lineObj);
    saveData('lines', lines);
}

// ==========================
// Funções auxiliares para avançar etapas
// ==========================
function nextStep(step, nextPage){
    if(validateAndSaveStep(step)){
        window.location.href = nextPage;
    }
}

// ==========================
// Exemplo de uso nos botões HTML
// <button onclick="nextStep('step3','etapa4.html')">Continuar</button>
// ==========================
