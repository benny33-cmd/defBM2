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
            console.error("Errore caricamento:", err);
        }
    }

    normalizzaData(d) {
        if (!d) return "";

        // yyyy-mm-dd già ok
        if (d.includes("-")) return d.split("T")[0];

        // dd/mm/yyyy
        if (d.includes("/")) {
            let [gg, mm, aa] = d.split("/");
            return `${aa}-${mm}-${gg}`;
        }

        return d;
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

        // 🔴 BLOCCO VERO (stesso giorno + ora)
        let occupato = this.prenotazioni.some(p =>
            this.normalizzaData(p.data) === dataInput &&
            String(p.orario).trim() === String(orario).trim()
        );

        if (occupato) {
            alert("❌ Già prenotato in questa data e orario!");
            return;
        }

        try {
            const res = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    azione: "aggiungi",
                    nome,
                    progetto,
                    orario,
                    data: dataInput
                })
            });

            const result = await res.text();

            if (result.includes("GIÀ PRENOTATO")) {
                alert("❌ Slot già occupato (server)");
                return;
            }

            alert("✅ Prenotazione effettuata!");
            this.pulisciCampi();
            this.carica();

        } catch (err) {
            console.error(err);
            alert("Errore invio prenotazione");
        }
    }

    aggiornaLista() {
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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                azione: "elimina",
                nome: pren.nome,
                progetto: pren.progetto,
                orario: pren.orario,
                data: pren.data
            })
        })
        .then(() => this.carica());
    }

    pulisciCampi() {
        document.getElementById("nome").value = "";
        document.getElementById("data-prenotazione").value = "";
        document.getElementById("orario").value = "";
    }
}

const db = new DatabasePrenotazioni();

function prenota() {
    db.prenota();
}
