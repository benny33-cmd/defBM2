class DatabasePrenotazioni {
    constructor() {
        this.url = "https://script.google.com/macros/s/AKfycbz2Kb_5X7bUSR_olDgRSbbG1lSP5SAw2JqIiZYOi3F86ghjv4xuGtqCin7z8MPw6jv3/exec";
        this.prenotazioni = [];
        this.lista = document.getElementById("lista");

        this.carica();
    }

    prenota() {
        let nome = document.getElementById("nome").value;
        let progetto = document.getElementById("progetto").value;
        let data = document.getElementById('data-prenotazione').value;
        let orario = document.getElementById("orario").value;

        if (nome === "" || data === "" || orario === "") {
            alert("Compila tutti i campi!");
            return;
        }

        // 🔴 BLOCCO DOPPIONE (stesso progetto, stessa data, stesso orario)
       // 🔴 BLOCCO SLOT OCCUPATO (stessa data + stesso orario)
        // Assicurati che 'prenotazioni' sia l'array che contiene i dati del foglio
     let occupato = prenota.some(p => 
        p.progetto === progetto && 
        p.data === data && 
        p.orario === orario
    );

     if (occupato) {
       alert("Questo progetto è già prenotato in questa data e orario!");
       return; // Blocca l'esecuzione come nel controllo campi
  }
       

        // 📡 INVIO DATI
        fetch(this.url, {
            method: "POST",
            body: JSON.stringify({
                azione: "aggiungi",
                nome,
                progetto,
                orario,
                data
            })
        })
        .then(() => {
            this.carica();
            this.pulisciCampi();
        });
    }

    // 🔄 CARICA DAL FOGLIO
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

        this.prenotazioni.sort((a, b) =>
            new Date(a.data) - new Date(b.data)
        );

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

    // ❌ ELIMINA (sincronizzato con Google Sheets)
    elimina(index) {
        let pren = this.prenotazioni[index];

        fetch(this.url, {
            method: "POST",
            body: JSON.stringify({
                azione: "elimina",
                nome: pren.nome,
                progetto: pren.progetto,
                orario: pren.orario,
                data: pren.data
            })
        })
        .then(() => {
            this.carica();
        });
    }

    salva() {
        localStorage.setItem("prenotazioni", JSON.stringify(this.prenotazioni));
    }

    pulisciCampi() {
        document.getElementById("nome").value = "";
        document.getElementById("data-prenotazione").value = "";
    }
}

const db = new DatabasePrenotazioni();

function prenota() {
    db.prenota();
}
