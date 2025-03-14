import { db, collection, getDocs, deleteDoc, doc } from "./firebase.js";

async function carregarAulas() {
    const tabelaCorpo = document.getElementById("tabela-corpo");
    
    try {
        const querySnapshot = await getDocs(collection(db, "aulas"));
        tabelaCorpo.innerHTML = ""; // Limpa a tabela antes de preencher

        querySnapshot.forEach((docSnapshot) => {
            const { dia, conteudo, link } = docSnapshot.data();
            const docId = docSnapshot.id;
            
            const linha = `
                <tr>
                    <td>${dia}</td>
                    <td>${conteudo}</td>
                    <td><a href="${link}" target="_blank">Ver Arquivos</a></td>
                    <td><button class="btn btn-danger btn-sm" onclick="excluirAula('${docId}')">Excluir</button></td>
                </tr>`;
            
            tabelaCorpo.innerHTML += linha;
        });
    } catch (error) {
        console.error("Erro ao carregar aulas:", error);
    }
}

async function excluirAula(id) {
    if (!id) {
        alert("ID inválido para exclusão!");
        return;
    }
    if (confirm("Tem certeza que deseja excluir esta aula?")) {
        try {
            await deleteDoc(doc(db, "aulas", id));
            alert("Aula excluída com sucesso!");
            carregarAulas(); // Atualiza a tabela após a exclusão
        } catch (error) {
            console.error("Erro ao excluir aula:", error);
            alert("Erro ao excluir aula. Verifique o console para mais detalhes.");
        }
    }
}

window.addEventListener("load", carregarAulas);
