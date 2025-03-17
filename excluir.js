import { db, collection, getDocs, deleteDoc, doc } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
    const selectMateria = document.getElementById("materia");
    const tabelaCorpo = document.getElementById("tabela-corpo");

    // Função para carregar as aulas da matéria selecionada
    async function carregarAulas() {
        const materia = selectMateria.value; // Obtém a matéria selecionada
        tabelaCorpo.innerHTML = ""; // Limpa a tabela

        if (!materia) return; // Se não tiver matéria selecionada, sai da função

        try {
            const querySnapshot = await getDocs(collection(db, materia)); // Busca na coleção correta
            querySnapshot.forEach((docSnapshot) => {
                const aula = docSnapshot.data();
                console.log("Dados do Firestore:", aula); // Debug para verificar os dados recebidos

                const docId = docSnapshot.id;

                // Garantir que os campos sejam acessados corretamente
                const dataAula = aula.dataAula ? aula.dataAula.trim() : "Sem data";
                const conteudo = aula.conteudo || "Sem conteúdo";
                const nomeArquivo = aula.nomeArquivo || "Sem arquivo";
                const linkArquivo = aula.linkArquivo
                    ? `<a href="${aula.linkArquivo}" target="_blank">📄 Abrir</a>`
                    : "Sem link";
                const nomeGravacao = aula.nomeGravacao || "Sem gravação";
                const linkGravacao = aula.linkGravacao
                    ? `<a href="${aula.linkGravacao}" target="_blank">🎥 Ver</a>`
                    : "Sem link";

                // Criar a linha da tabela com todas as informações
                const linha = `
                    <tr>
                        <td>${conteudo}</td>
                        <td>${dataAula}</td>
                        <td>${nomeArquivo}</td>
                        <td>${linkArquivo}</td>
                        <td>${nomeGravacao}</td>
                        <td>${linkGravacao}</td>
                        <td><button class="btn btn-danger btn-sm" onclick="excluirAula('${materia}', '${docId}')">Excluir</button></td>
                    </tr>`;

                tabelaCorpo.innerHTML += linha;
            });
        } catch (error) {
            console.error(`Erro ao carregar aulas de ${materia}:`, error);
        }
    }

    // Função para excluir uma aula
    window.excluirAula = async function (materia, id) {
        if (confirm("Tem certeza que deseja excluir esta aula?")) {
            try {
                await deleteDoc(doc(db, materia, id)); // Deleta da coleção correta
                alert("Aula excluída com sucesso!");
                carregarAulas(); // Recarrega a tabela após a exclusão
            } catch (error) {
                console.error(`Erro ao excluir aula de ${materia}:`, error);
            }
        }
    };

    // Atualiza as aulas sempre que a matéria for trocada no select
    selectMateria.addEventListener("change", carregarAulas);

    // Carrega a primeira matéria ao abrir a página
    carregarAulas();
});
