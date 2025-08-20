// Função para exibir mensagens
function mostrarMensagem(texto, tipo) {
    const mensagem = document.getElementById('mensagem');
    mensagem.textContent = texto;
    mensagem.className = `p-4 rounded-md ${tipo === 'erro' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
    mensagem.classList.remove('hidden');
    setTimeout(() => mensagem.classList.add('hidden'), 3000);
}

// Função para listar tarefas
async function listarTarefas() {
    const filtro = document.getElementById('filtro-status').value;
    const ordenarPor = document.getElementById('ordenar-por').value;
    document.getElementById('tarefas-container').innerHTML = '<p class="text-gray-500">Carregando...</p>';

    try {
        const response = await fetch('http://localhost:5000/tarefas');
        let tarefas = await response.json();

        // Filtrar tarefas
        if (filtro === 'concluidas') tarefas = tarefas.filter(t => t.concluida);
        if (filtro === 'pendentes') tarefas = tarefas.filter(t => !t.concluida);

        // Ordenar tarefas
        tarefas.sort((a, b) => {
            if (ordenarPor === 'titulo') return a.titulo.localeCompare(b.titulo);
            return a.id - b.id;
        });

        const container = document.getElementById('tarefas-container');
        container.innerHTML = '';
        if (tarefas.length === 0) {
            container.innerHTML = '<p class="text-gray-500">Nenhuma tarefa encontrada.</p>';
            return;
        }

        tarefas.forEach(tarefa => {
            const card = document.createElement('div');
            card.className = 'task-card border-2 border-blue-900 bg-blue-50 hover:bg-blue-500 p-4 rounded-lg shadow-md';
            card.innerHTML = `
                <h3 class="text-lg font-semibold text-gray-800">${tarefa.titulo}</h3>
                <p class="text-lg-600">${tarefa.descricao || 'Sem descrição'}</p>
                <p class="text-sm text-lg-500 mt-2">Status: ${tarefa.concluida ? 'Concluída' : 'Pendente'}</p>
                <p class="text-sm text-lg-500">ID: ${tarefa.id}</p>
                <div class="mt-4 flex space-x-2">
                    <button onclick="editarTarefa(${tarefa.id})" class="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">Editar</button>
                    <button onclick="deletarTarefa(${tarefa.id})" class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Deletar</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        mostrarMensagem('Erro ao carregar tarefas', 'erro');
    }
}

// Função para criar/editar tarefa
document.getElementById('tarefa-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('tarefa-id').value;
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const concluida = document.getElementById('concluida').checked;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:5000/tarefas/${id}` : 'http://localhost:5000/tarefas';
    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descricao, concluida })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao salvar tarefa');
        }
        document.getElementById('tarefa-form').reset();
        document.getElementById('tarefa-id').value = '';
        document.getElementById('form-title').textContent = 'Nova Tarefa';
        document.getElementById('tarefa-form-container').classList.add('hidden');
        mostrarMensagem(`Tarefa ${id ? 'atualizada' : 'criada'} com sucesso!`, 'sucesso');
        listarTarefas();
    } catch (error) {
        mostrarMensagem(error.message, 'erro');
    }
});

// Função para editar tarefa
async function editarTarefa(id) {
    try {
        const response = await fetch(`http://localhost:5000/tarefas/${id}`);
        const tarefa = await response.json();
        document.getElementById('tarefa-id').value = tarefa.id;
        document.getElementById('titulo').value = tarefa.titulo;
        document.getElementById('descricao').value = tarefa.descricao || '';
        document.getElementById('concluida').checked = tarefa.concluida;
        document.getElementById('form-title').textContent = 'Editar Tarefa';
        document.getElementById('tarefa-form-container').classList.remove('hidden');
    } catch (error) {
        mostrarMensagem('Erro ao carregar tarefa', 'erro');
    }
}

// Função para deletar tarefa
async function deletarTarefa(id) {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
        try {
            await fetch(`http://localhost:5000/tarefas/${id}`, { method: 'DELETE' });
            mostrarMensagem('Tarefa deletada com sucesso!', 'sucesso');
            listarTarefas();
        } catch (error) {
            mostrarMensagem('Erro ao deletar tarefa', 'erro');
        }
    }
}

// Função para cancelar formulário
document.getElementById('cancelar-form').addEventListener('click', () => {
    document.getElementById('tarefa-form').reset();
    document.getElementById('tarefa-id').value = '';
    document.getElementById('form-title').textContent = 'Nova Tarefa';
    document.getElementById('tarefa-form-container').classList.add('hidden');
});

// Botão para abrir formulário
document.getElementById('nova-tarefa-btn').addEventListener('click', () => {
    document.getElementById('tarefa-form').reset();
    document.getElementById('tarefa-id').value = '';
    document.getElementById('form-title').textContent = 'Nova Tarefa';
    document.getElementById('tarefa-form-container').classList.remove('hidden');
});

// Atualizar tarefas ao mudar filtro ou ordenação
document.getElementById('filtro-status').addEventListener('change', listarTarefas);
document.getElementById('ordenar-por').addEventListener('change', listarTarefas);

// Carregar tarefas ao iniciar
listarTarefas();