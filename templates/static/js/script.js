fetch('/tarefas') // Em vez de fetch('http://localhost:5000/tarefas')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

function renderTarefas(tarefas) {
    const container = document.getElementById('tarefas-container');
    container.innerHTML = '';
    tarefas.forEach(tarefa => {
        const tarefaDiv = document.createElement('div');
        tarefaDiv.className = 'task-card border-2 border-blue-500 bg-white hover:bg-gray-200 p-4 rounded-lg shadow-md';
        tarefaDiv.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-800">${tarefa.titulo}</h3>
            <p class="text-lg-600">${tarefa.descricao || ''}</p>
            <p class="text-sm text-lg-500 mt-2">Status: ${tarefa.concluida ? 'Concluída' : 'Pendente'}</p>
            <p class="text-sm text-lg-500">ID: ${tarefa.id}</p>
            <div class="mt-4 flex space-x-2">
                <button onclick="editarTarefa(${tarefa.id})" class="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">Editar</button>
                <button onclick="deletarTarefa(${tarefa.id})" class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Deletar</button>
            </div>
        `;
        container.appendChild(tarefaDiv);
    });
}