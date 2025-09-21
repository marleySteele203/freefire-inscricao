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
    if(progressBar) progressBar.style.width = percent + '%';
}

// ==========================
// Pré-visualizar imagem (não usada atualmente)
// ==========================
function previewImage(inputId, imgId){
    const input = document.getElementById(inputId);
    const img = document.getElementById(imgId);
    if(input.files && input.files[0]){
        const reader = new FileReader();
        reader.onload = e => {
            img.src = e.target.result;
            img.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ==========================
// Enviar resumo para Discord
// ==========================
function sendToDiscord(summaryText){
    const webhookUrl = "https://discord.com/api/webhooks/1419024179809751161/-6fpwnlG5GfYmVikmqmZT5f18nb8-9I4nSdeTjWrhxL8XVoLnfQsU7Bb1B4yiaLCjEnx";
    fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: summaryText })
    }).then(res => {
        if(res.ok) alert("Inscrição enviada para Discord!");
        else alert("Erro ao enviar para Discord.");
    }).catch(err => alert("Erro: " + err));
}

// ==========================
// Montar resumo para envio
// ==========================
function buildSummary(){
    const mode = loadData('mode');
    const players = loadData('players');
    const squadName = loadData('squadName');
    const squadTag = loadData('squadTag');
    const country = loadData('country');
    const paymentMessage = loadData('paymentMessage');

    let summaryText = `Modalidade: ${mode}\n`;
    if(players) players.forEach((p,i) => { summaryText += `Jogador ${i+1}: ${p}\n`; });
    summaryText += `Nome Squad: ${squadName}\nTag: ${squadTag}\n`;
    summaryText += `País: ${country || 'Não informado'}\nMensagem de Confirmação: ${paymentMessage || 'Não informado'}`;

    return summaryText;
}

// ==========================
// Função final de envio
// ==========================
function sendRegistration(){
    const summaryText = buildSummary();

    // Envia para e-mail
    const subject = encodeURIComponent("Inscrição Copa Free Fire");
    const body = encodeURIComponent(summaryText);
    window.location.href = `mailto:malazicronel@gmail.com?subject=${subject}&body=${body}`;

    // Envia para Discord
    sendToDiscord(summaryText);

    clearData(); // limpa os dados
}

// ==========================
// Funções de navegação e validação
// ==========================
function start(mode){
    saveData('mode', mode);
    window.location.href = 'etapa2.html';
}

function goToNextStep(idInputs, nextPage, minTagCount = 3){
    const values = [];
    let tagCount = 0;
    const squadTag = loadData('squadTag');

    for(const id of idInputs){
        const val = document.getElementById(id).value.trim();
        if(!val){ alert('Preencha todos os campos'); return; }
        if(squadTag && val.includes(squadTag)) tagCount++;
        values.push(val);
    }

    if(minTagCount && tagCount < minTagCount){
        alert(`Pelo menos ${minTagCount} jogadores devem ter a tag da squad`);
        return;
    }

    // Salvar dados
    if(nextPage === 'etapa3.html') saveData('squadName', values[0]) || saveData('squadTag', values[1]);
    else if(nextPage === 'etapa4.html') saveData('players', values);

    window.location.href = nextPage;
}
