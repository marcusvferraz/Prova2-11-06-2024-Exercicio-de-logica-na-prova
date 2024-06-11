// Simula um banco de dados em memória
var clientes = [];

// Guarda o objeto que está sendo alterado
var clienteAlterado = null;

function adicionar() {
    // Libera para digitar o CPF
    document.getElementById("cpf").disabled = false;
    clienteAlterado = null;
    mostrarModal();
    limparForm();
}

function buscarClientes() {
    var searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
    var clientesFiltrados = clientes.filter(function(cliente) {
        return cliente.nome.toLowerCase().includes(searchTerm);
    });
    // Ordena os clientes filtrados pelo nome em ordem alfabética
    clientesFiltrados.sort(function(a, b) {
        return a.nome.localeCompare(b.nome);
    });

    exibirClientes(clientesFiltrados);
}
    

function alterar(cpf) {
    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i];
        if (cliente.cpf == cpf) {
            document.getElementById("nome").value = cliente.nome;
            document.getElementById("cpf").value = cliente.cpf;
            document.getElementById("telefone").value = cliente.telefone;
            document.getElementById("nomegato").value = cliente.nomegato;
            document.getElementById("whatsapp").value = cliente.whatsapp;
            clienteAlterado = cliente;
        }
    }
    document.getElementById("cpf").disabled = true;
    mostrarModal();
}

function excluir(cpf) {
    if (confirm("Você deseja realmente excluir?")) {
        fetch("http://localhost:3000/excluir/" + cpf, {
            headers: {
                "Content-type": "application/json"
            },
            method: "DELETE"
        }).then((response) => {
            recarregarClientes();
            alert("Cliente excluído com sucesso");
        }).catch((error) => {
            console.log(error);
            alert("Não foi possível excluir o cliente");
        });
    }
}

function mostrarModal() {
    let containerModal = document.getElementById("container-modal");
    containerModal.style.display = "flex";
}

function ocultarModal() {
    let containerModal = document.getElementById("container-modal");
    containerModal.style.display = "none";
}

function cancelar() {
    ocultarModal();
    limparForm();
}

function salvar() {
    let nome = document.getElementById("nome").value;
    let cpf = document.getElementById("cpf").value;
    let telefone = document.getElementById("telefone").value;
    let nomegato = document.getElementById("nomegato").value;
    let whatsapp = document.getElementById("whatsapp").value;

    if (clienteAlterado == null) {
        let cliente = {
            "nome": nome,
            "cpf": cpf,
            "telefone": telefone,
            "nomegato": nomegato,
            "whatsapp": whatsapp
        };

        fetch("http://localhost:3000/cadastrar", {
            headers: {
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(cliente)
        }).then(() => {
            clienteAlterado = null;
            limparForm();
            ocultarModal();
            recarregarClientes();
            alert("Cliente cadastrado com sucesso!");
        }).catch(() => {
            alert("Ops... algo deu errado!");
        });
    } else {
        clienteAlterado.nome = nome;
        clienteAlterado.cpf = cpf;
        clienteAlterado.telefone = telefone;
        clienteAlterado.nomegato = nomegato;
        clienteAlterado.whatsapp = whatsapp;

        fetch("http://localhost:3000/alterar/", {
            headers: {
                "Content-type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(clienteAlterado)
        }).then((response) => {
            clienteAlterado = null;
            limparForm();
            ocultarModal();
            recarregarClientes();
            alert("Cliente Alterado com sucesso!");
        }).catch((error) => {
            alert("Não foi possível alterar o cliente");
        });
    }
}

function exibirClientes(clientes) {
    let tbody = document.querySelector("#table-customers tbody");
    tbody.innerHTML = "";

    clientes.forEach(function(cliente) {
        let linha = `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.nomegato}</td>
                <td>${cliente.whatsapp}</td>
                <td>
                    <button onclick="alterar('${cliente.cpf}')">Alterar</button>
                    <button onclick="excluir('${cliente.cpf}')" class="botao-excluir">Excluir</button>
                </td>
            </tr>`;
        let tr = document.createElement("tr");
        tr.innerHTML = linha;
        tbody.appendChild(tr);
    });
}

function limparForm() {
    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("nomegato").value = "";
    document.getElementById("whatsapp").value = "";
}

function recarregarClientes() {
    fetch("http://localhost:3000/listar", {
        headers: {
            "Content-type": "application/json"
        },
        method: "GET"
    }).then((response) => response.json())
        .then((response) => {
            clientes = response;
            exibirClientes(clientes);
        }).catch((error) => {
            alert("Erro ao listar os clientes");
        });
}