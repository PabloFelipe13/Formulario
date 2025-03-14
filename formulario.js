import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDw3mcOdT3iBvl2a0jPTlqaj7LqtRrHHyg",
  authDomain: "novapagina-b357d.firebaseapp.com",
  projectId: "novapagina-b357d",
  storageBucket: "novapagina-b357d.firebasestorage.app",
  messagingSenderId: "1060248426922",
  appId: "1:1060248426922:web:ff150165bf3c525bb4f3d3",
  measurementId: "G-NWEMVGPPMG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("form-aula").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const materia = document.getElementById("materia").value;
    const dataAula = document.getElementById("data-aula").value;
    const conteudo = document.getElementById("conteudo").value;
    const nomeArquivo = document.getElementById("nome-arquivo").value;
    const linkArquivo = document.getElementById("link-arquivo").value;
    const nomeGravacao = document.getElementById("nome-gravacao").value;
    const linkGravacao = document.getElementById("link-gravacao").value;

    if (!materia) {
        alert("Por favor, selecione uma matéria.");
        return;
    }

    try {
        await addDoc(collection(db, materia), {
            dataAula,
            conteudo,
            nomeArquivo,
            linkArquivo,
            nomeGravacao,
            linkGravacao
        });
        alert("Aula adicionada com sucesso!");
        document.getElementById("form-aula").reset();
    } catch (error) {
        console.error("Erro ao adicionar aula: ", error);
        alert("Erro ao adicionar aula. Tente novamente.");
    }
});
