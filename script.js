let prenotazioni = {};

function prenota() {
    let nome = document.getElementById("nome").value;
    let progetto = document.getElementById("progetto").value;
    let orario = document.getElementById("orario").value;

    if (nome === "") {
        alert("Inserisci il nome!");
        return;
    }

    if (prenotazioni[orario]) {
        alert("Orario già prenotato!");
        return;
    }

    prenotazioni[orario] = nome + " - " + progetto;

    aggiornaLista();
}

function aggiornaLista() {
    let lista = document.getElementById("lista");
    lista.innerHTML = "";

    for (let orario in prenotazioni) {
        let li = document.createElement("li");
        li.textContent = orario + " → " + prenotazioni[orario];
        lista.appendChild(li);
    }
}
