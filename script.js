class DatabasePrenotazioni {
    constructor() {
        this.prenotazioni = JSON.parse(localStorage.getItem("prenotazioni")) || {};
        this.lista = document.getElementById("lista");

        this.aggiornaLista();
    }

    prenota() {
        let nome = document.getElementById("nome").value;
        let progetto = document.getElementById("progetto").value;
        let orario = document.getElementById("orario").value;

        if (nome === "") {
            alert("Inserisci il nome!");
            return;
        }

        // se non esiste quell'orario, lo creo come array
        if (!this.prenotazioni[orario]) {
            this.prenotazioni[orario] = [];
        }

        // aggiungo prenotazione (NON sovrascrive)
        this.prenotazioni[orario].push({
            nome: nome,
            progetto: progetto
        });

        this.salva();
        this.aggiornaLista();
    }

    aggiornaLista() {
        this.lista.innerHTML = "";

        for (let orario in this.prenotazioni) {
            this.prenotazioni[orario].forEach((pren, index) => {

                let li = document.createElement("li");

                li.innerHTML = `
                    ${orario} → ${pren.nome} - ${pren.progetto}
                    <button onclick="db.elimina('${orario}', ${index})">❌</button>
                `;

                this.lista.appendChild(li);
            });
        }
    }

    elimina(orario, index) {
        this.prenotazioni[orario].splice(index, 1);

        // se non ci sono più prenotazioni in quell'orario, lo elimino
        if (this.prenotazioni[orario].length === 0) {
            delete this.prenotazioni[orario];
        }

        this.salva();
        this.aggiornaLista();
    }

    salva() {
        localStorage.setItem("prenotazioni", JSON.stringify(this.prenotazioni));
    }
}

// ISTANZA GLOBALE
const db = new DatabasePrenotazioni();

// collega il bottone HTML
function prenota() {
    db.prenota();
}
