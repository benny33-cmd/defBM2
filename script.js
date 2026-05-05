// CARICA prenotazioni dal "database" (LocalStorage)
let prenotazioni = JSON.parse(localStorage.getItem("prenotazioni")) || {};

// Mostra subito le prenotazioni salvate
aggiornaLista();

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

    salvaDatabase();
    aggiornaLista();
}

function aggiornaLista() {
    let lista = document.getElementById("lista");
    lista.innerHTML = "";

    for (let orario in prenotazioni) {
        let li = document.createElement("li");

        li.innerHTML = `
            ${orario} → ${prenotazioni[orario]}
            <button onclick="eliminaPrenotazione('${orario}')">❌</button>
        `;

        lista.appendChild(li);
    }
}

// Salva nel "database"
function salvaDatabase() {
    localStorage.setItem("prenotazioni", JSON.stringify(prenotazioni));
}

// Elimina prenotazione
function eliminaPrenotazione(orario) {
    delete prenotazioni[orario];
    salvaDatabase();
    aggiornaLista();
}
