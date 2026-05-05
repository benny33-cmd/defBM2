class DatabasePrenotazioni {
    constructor() {
        // Carica le prenotazioni o crea un oggetto vuoto
        this.prenotazioni = JSON.parse(localStorage.getItem("prenotazioni")) || [];
        this.lista = document.getElementById("lista");
        this.aggiornaLista();
    }

    prenota() {
        let nome = document.getElementById("nome").value;
        let progetto = document.getElementById("progetto").value;
        let data = document.getElementById('data-prenotazione').value; // Assicurati che l'ID sia corretto
        let orario = document.getElementById("orario").value;

        // Validazione campi
        if (nome === "" || data === "" || orario === "") {
            alert("Per favore, compila tutti i campi (Nome, Data e Orario)!");
            return;
        }

        // 🔴 CONTROLLO: Stesso progetto, stessa data e stesso orario
        // Verifichiamo se esiste già una prenotazione con questi tre criteri
        let giaPrenotato = this.prenotazioni.some(pren => 
            pren.progetto === progetto && 
            pren.data === data && 
            pren.orario === orario
        );

        if (giaPrenotato) {
            alert("Questo progetto è già occupato per la data e l'orario selezionati!");
            return;
        }

        // Aggiunta prenotazione all'array
        this.prenotazioni.push({
            nome: nome,
            progetto: progetto,
            data: data,
            orario: orario
        });

        this.salva();
        this.aggiornaLista();
        this.pulisciCampi();
    }

    aggiornaLista() {
        this.lista.innerHTML = "";

        // Ordiniamo le prenotazioni per data (opzionale ma utile)
        this.prenotazioni.sort((a, b) => new Date(a.data) - new Date(b.data));

        this.prenotazioni.forEach((pren, index) => {
            let li = document.createElement("li");
            
            // Formattazione data italiana (opzionale)
            let dataFormattata = pren.data.split('-').reverse().join('/');

            li.innerHTML = `
                <strong>${dataFormattata}</strong> ore <strong>${pren.orario}</strong>: 
                ${pren.nome} ha prenotato <em>${pren.progetto}</em>
                <button onclick="db.elimina(${index})">❌</button>
            `;

            this.lista.appendChild(li);
        });
    }

    elimina(index) {
        this.prenotazioni.splice(index, 1);
        this.salva();
        this.aggiornaLista();
    }

    salva() {
        localStorage.setItem("prenotazioni", JSON.stringify(this.prenotazioni));
    }

    pulisciCampi() {
        document.getElementById("nome").value = "";
        document.getElementById("data-prenotazione").value = "";
    }
}

// ISTANZA
const db = new DatabasePrenotazioni();

// Funzione chiamata dal tasto HTML
function prenota() {
    db.prenota();
}
