class DatabasePrenotazioni {
    constructor() {
        this.url = "https://script.google.com/macros/s/AKfycbw9qJtE2p5_JlxTB7jyDm5VccCDj9IRoueGvyzXil59jLror-LqdNaEAXdd45btAvha/exec";
        this.prenotazioni = [];
        this.lista = document.getElementById("lista");

        this.carica(); // carica dati dal foglio
    }

    prenota() {
        let nome = document.getElementById("nome").value;
        let progetto = document.getElementById("progetto").value;
        let data = document.getElementById('data-prenotazione').value;
        let orario = document.getElementById("orario").value;

        // ✅ VALIDAZIONE
        if (nome === "" || data === "" || orario === "") {
            alert("Per favore, compila tutti i campi!");
            return;
        }

        // 🔴 CONTROLLO duplicato (locale)
        let giaPrenotato = this.prenotazioni.some(pren => 
            pren.progetto === progetto && 
            pren.data === data && 
            pren.orario === orario
        );

        if (giaPrenotato) {
            alert("Questo progetto è già occupato per la data e l'orario selezionati!");
            return;
        }

        // 📡 INVIO A GOOGLE SHEETS
        fetch(this.url, {
        method: "POST",
        mode: "no-cors", // Necessario per Apps Script
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, progetto, orario, data })
        })
        .then(res => res.text())
        .then(risposta => {
            if (risposta === "errore") {
                alert("Già prenotato nel database!");
            } else {
                this.carica(); // aggiorna lista dal server
                this.pulisciCampi();
            }
        });
    }

    // 🔄 CARICA DATI DAL FOGLIO
    carica() {
        fetch(this.url)
        .then(res => res.json())
        .then(data => {
            this.prenotazioni = data;
            this.aggiornaLista();
        });
    }

    aggiornaLista() {
        this.lista.innerHTML = "";

        // ordina per data
        this.prenotazioni.sort((a, b) => new Date(a.data) - new Date(b.data));

        this.prenotazioni.forEach((pren, index) => {

            let li = document.createElement("li");

            let dataFormattata = pren.data 
                ? pren.data.split('-').reverse().join('/')
                : "";

            li.innerHTML = `
                <strong>${dataFormattata}</strong> ore <strong>${pren.orario}</strong>: 
                ${pren.nome} ha prenotato <em>${pren.progetto}</em>
                <button onclick="db.elimina(${index})">❌</button>
            `;

            this.lista.appendChild(li);
        });
    }

    // ⚠️ NOTA: elimina SOLO lato client (Google Sheets non cancella)
   elimina(index) {
    let pren = this.prenotazioni[index];

    fetch(this.url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            azione: "elimina",
            nome: pren.nome,
            progetto: pren.progetto,
            orario: pren.orario,
            data: pren.data
        })
    }).then(() => {
        this.carica(); // aggiorna lista
    });
}

    salva() {
        // NON serve più con Google Sheets, ma la lasciamo per compatibilità
        localStorage.setItem("prenotazioni", JSON.stringify(this.prenotazioni));
    }

    pulisciCampi() {
        document.getElementById("nome").value = "";
        document.getElementById("data-prenotazione").value = "";
    }
}

// ISTANZA
const db = new DatabasePrenotazioni();

// collegamento bottone HTML
function prenota() {
    db.prenota();
}
