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
// Função para atualizar barra de progresso
// ==========================
function updateProgress(percent){
    const progressBar = document.querySelector('.progress');
    if(progressBar) progressBar.style.width = percent + '%';
}

// ==========================
// Função para pré-visualizar imagem (não usada agora, mas pode manter)
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
