class DatabasePrenotazioni {
    constructor() {
        this.url = "https://script.google.com/macros/s/AKfycbz2Kb_5X7bUSR_olDgRSbbG1lSP5SAw2JqIiZYOi3F86ghjv4xuGtqCin7z8MPw6jv3/exec";
        this.prenotazioni = [];
        this.lista = document.getElementById("lista");

        this.carica();
    }

    async carica() {
        try {
            const res = await fetch(this.url + "?t=" + Date.now());
            this.prenotazioni = await res.json();
            this.aggiornaLista();
        } catch (err) {
            console.error("Errore nel caricamento dati:", err);
        }
    }

    normalizzaData(d) {
        if (!d) return "";

        if (d.includes("/")) {
            let [gg, mm, aa] = d.split("/");
            return `${aa}-${mm}-${gg}`;
        }

        return d.split("T")[0];
    }

    async prenota() {
        let nome = document.getElementById("nome").value;
        let progetto = document.getElementById("progetto").value;
        let dataInput = document.getElementById("data-prenotazione").value;
        let orario = document.getElementById("orario").value;

        if (!nome || !dataInput || !orario) {
            alert("Compila tutti i campi!");
            return;
        }

        await this.carica();

        // 🔴 BLOCCO SLOT (data + ora)
        let occupato = this.prenotazioni.some(p =>
            this.normalizzaData(p.data) === dataInput &&
            String(p.orario).trim() === String(orario).trim()
        );

        if (occupato) {
            alert("❌ Già prenotato in questa data e orario!");
            return;
        }

        try {
            await fetch(this.url, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify({
                    azione: "aggiungi",
                    nome,
                    progetto,
                    orario,
                    data: dataInput
                })
            });

            alert("✅ Prenotazione inviata con successo!");
            this.pulisciCampi();

            setTimeout(() => this.carica(), 1500);

        } catch (err) {
            alert("Errore durante l'invio: " + err);
        }
    }

    aggiornaLista() {
        if (!this.lista) return;

        this.lista.innerHTML = "";

        this.prenotazioni.sort((a, b) =>
            new Date(this.normalizzaData(a.data)) - new Date(this.normalizzaData(b.data))
        );

        this.prenotazioni.forEach((pren, index) => {
            let li = document.createElement("li");

            let dataFormattata = this.normalizzaData(pren.data)
                .split("-")
                .reverse()
                .join("/");

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
        });

        setTimeout(() => this.carica(), 1500);
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

function prenota() {
    db.prenota();
}
