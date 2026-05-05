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

        // se non esiste quell'orario, lo creo
        if (!this.prenotazioni[orario]) {
            this.prenotazioni[orario] = [];
        }

        // 🔴 CONTROLLO: stesso progetto nello stesso orario
        let esiste = this.prenotazioni[orario].some(pren => pren.progetto === progetto);

        if (esiste) {
            alert("Questo progetto è già prenotato in questo orario!");
            return;
        }

        // aggiunta prenotazione
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

// ISTANZA
const db = new DatabasePrenotazioni();

function prenota() {
    db.prenota();
}



