import { db, collection, getDocs, doc, getDoc, updateDoc } from "./firebase.js";

document.getElementById("materia").addEventListener("change", async (e) => {
    const materia = e.target.value;
    const tabelaCorpo = document.getElementById("tabela-corpo");
    tabelaCorpo.innerHTML = "";

    if (!materia) return;

    try {
        const querySnapshot = await getDocs(collection(db, materia)); // Busca na coleção da matéria
        if (querySnapshot.empty) {
            tabelaCorpo.innerHTML = "<tr><td colspan='7' class='text-center'>Nenhuma aula encontrada.</td></tr>";
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const aula = docSnap.data();
            const docId = docSnap.id;
            const linha = `
                <tr>
                    <td>${aula.dataAula || "Sem data"}</td>
                    <td>${aula.conteudo || "Sem conteúdo"}</td>
                    <td>${aula.nomeArquivo || "Sem arquivo"}</td>
                    <td>${aula.linkArquivo ? `<a href="${aula.linkArquivo}" target="_blank">📄 Abrir</a>` : "Sem link"}</td>
                    <td>${aula.nomeGravacao || "Sem gravação"}</td>
                    <td>${aula.linkGravacao ? `<a href="${aula.linkGravacao}" target="_blank">🎥 Ver</a>` : "Sem link"}</td>
                    <td><button class="btn btn-warning btn-sm" onclick="editarAula('${docId}', '${materia}')">Editar</button></td>
                </tr>`;
            tabelaCorpo.innerHTML += linha;
        });
    } catch (error) {
        console.error("Erro ao carregar aulas: ", error);
        tabelaCorpo.innerHTML = "<tr><td colspan='7' class='text-center text-danger'>Erro ao carregar aulas.</td></tr>";
    }
});

window.editarAula = async (id, materia) => {
    const aulaRef = doc(db, materia, id);
    try {
        const aulaSnap = await getDoc(aulaRef);
        if (!aulaSnap.exists()) {
            alert("Aula não encontrada.");
            return;
        }

        const aula = aulaSnap.data();
        document.getElementById("form-container").style.display = "block";
        document.getElementById("data-aula").value = aula.dataAula || "";
        document.getElementById("conteudo").value = aula.conteudo || "";
        document.getElementById("nome-arquivo").value = aula.nomeArquivo || "";
        document.getElementById("link-arquivo").value = aula.linkArquivo || "";
        document.getElementById("nome-gravacao").value = aula.nomeGravacao || "";
        document.getElementById("link-gravacao").value = aula.linkGravacao || "";

        document.getElementById("form-editar").onsubmit = async (e) => {
            e.preventDefault();
            try {
                await updateDoc(aulaRef, {
                    dataAula: document.getElementById("data-aula").value,
                    conteudo: document.getElementById("conteudo").value,
                    nomeArquivo: document.getElementById("nome-arquivo").value,
                    linkArquivo: document.getElementById("link-arquivo").value,
                    nomeGravacao: document.getElementById("nome-gravacao").value,
                    linkGravacao: document.getElementById("link-gravacao").value
                });
                alert("Aula atualizada com sucesso!");
                window.location.reload();
            } catch (error) {
                console.error("Erro ao atualizar aula: ", error);
                alert("Erro ao atualizar aula. Tente novamente.");
            }
        };
    } catch (error) {
        console.error("Erro ao buscar aula para edição: ", error);
        alert("Erro ao buscar aula. Tente novamente.");
    }
};
