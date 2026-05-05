class DatabasePrenotazioni {
    constructor() {
        // URL della tua Web App (Assicurati che sia l'ultima versione pubblicata)
        this.url = "https://script.google.com/macros/s/AKfycbz2Kb_5X7bUSR_olDgRSbbG1lSP5SAw2JqIiZYOi3F86ghjv4xuGtqCin7z8MPw6jv3/exec";
        this.prenotazioni = [];
        this.lista = document.getElementById("lista");

        // Caricamento iniziale
        this.carica();
    }

    // 🔄 CARICA DAL FOGLIO
    carica() {
        fetch(this.url + "?t=" + new Date().getTime())
            .then(res => res.json())
            .then(data => {
                this.prenotazioni = data;
                this.aggiornaLista();
            })
            .catch(err => console.error("Errore nel caricamento dati:", err));
    }

    prenota() {
        let nome = document.getElementById("nome").value;
        let progetto = document.getElementById("progetto").value;
        let dataInput = document.getElementById("data-prenotazione").value;
        let orario = document.getElementById("orario").value;

        // 1. CONTROLLO CAMPI VUOTI
        if (nome === "" || dataInput === "" || orario === "" || progetto === "") {
            alert("Compila tutti i campi!");
            return;
        }

        // 🔄 BLOCCO: progetto già prenotato
        let occupato = this.prenotazioni.some(p =>
            String(p.progetto).trim() === String(progetto).trim()
        );

        if (occupato) {
            alert("❌ Questo progetto è già stato prenotato e non può essere prenotato di nuovo!");
            return;
        }

        // 3. 📡 INVIO DATI AL SERVER
        fetch(this.url, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
                azione: "aggiungi",
                nome: nome,
                progetto: progetto,
                orario: orario,
                data: dataInput
            })
        })
        .then(() => {
            alert("✅ Prenotazione inviata con successo!");
            this.pulisciCampi();

            // refresh dopo 1.5s
            setTimeout(() => this.carica(), 1500);
        })
        .catch(err => alert("Errore durante l'invio: " + err));
    }

    aggiornaLista() {
        if (!this.lista) return;
        this.lista.innerHTML = "";

        // Ordina per data
        this.prenotazioni.sort((a, b) => new Date(a.data) - new Date(b.data));

        this.prenotazioni.forEach((pren, index) => {
            let li = document.createElement("li");

            let dataFormattata = pren.data
                ? (pren.data.includes("T")
                    ? pren.data.split("T")[0]
                    : pren.data
                ).split("-").reverse().join("/")
                : "";

            li.innerHTML = `
                <strong>${dataFormattata}</strong> ore <strong>${pren.orario}</strong>: 
                ${pren.nome} ha prenotato <em>${pren.progetto}</em>
                <button onclick="db.elimina(${index})">❌</button>
            `;

            this.lista.appendChild(li);
        });
    }

    elimina(index) {
        let pren = this.prenotazioni[index];

        if (!confirm("Vuoi davvero eliminare questa prenotazione?")) return;

        fetch(this.url, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
                azione: "elimina",
                nome: pren.nome,
                progetto: pren.progetto,
                orario: pren.orario,
                data: pren.data
            })
        })
        .then(() => {
            setTimeout(() => this.carica(), 1500);
        });
    }

    pulisciCampi() {
        document.getElementById("nome").value = "";
        document.getElementById("progetto").value = "";
        document.getElementById("data-prenotazione").value = "";
        document.getElementById("orario").value = "";
    }
}

// Inizializzazione
const db = new DatabasePrenotazioni();

// Funzione globale
function prenota() {
    db.prenota();
}
