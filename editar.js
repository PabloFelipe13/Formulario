import { db, collection, getDocs, doc, getDoc, updateDoc } from "./firebase.js";

document.getElementById("materia").addEventListener("change", async (e) => {
    const materia = e.target.value;
    const tabelaCorpo = document.getElementById("tabela-corpo");
    tabelaCorpo.innerHTML = "";

    if (!materia) return;

    const querySnapshot = await getDocs(collection(db, materia));
    querySnapshot.forEach((docSnap) => {
        const { dataAula, conteudo, nomeArquivo, linkArquivo, nomeGravacao, linkGravacao } = docSnap.data();
        const docId = docSnap.id;
        
        const linha = `
            <tr>
                <td>${dataAula}</td>
                <td>${conteudo}</td>
                <td>${nomeArquivo || "Sem arquivo"}</td>
                <td>${linkArquivo ? `<a href="${linkArquivo}" target="_blank">📄 Abrir</a>` : "Sem link"}</td>
                <td>${nomeGravacao || "Sem gravação"}</td>
                <td>${linkGravacao ? `<a href="${linkGravacao}" target="_blank">🎥 Ver</a>` : "Sem link"}</td>
                <td><button class="btn btn-warning btn-sm" onclick="editarAula('${docId}', '${materia}')">Editar</button></td>
            </tr>`;
        
        tabelaCorpo.innerHTML += linha;
    });
});

window.editarAula = async (id, materia) => {
    const aulaRef = doc(db, materia, id);
    const aulaSnap = await getDoc(aulaRef);

    if (!aulaSnap.exists()) {
        alert("Aula não encontrada.");
        return;
    }

    const aula = aulaSnap.data();
    document.getElementById("data-aula").value = aula.dataAula;
    document.getElementById("conteudo").value = aula.conteudo;
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
};
