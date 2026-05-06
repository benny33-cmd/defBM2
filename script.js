/* =========================
   MESSAGGI A SCHERMO
========================= */
function mostraMessaggio(testo, tipo = "info") {
    const box = document.getElementById("messaggio");
    if (!box) return;

    box.textContent = testo;

    const colori = {
        errore: "red",
        successo: "green",
        info: "black"
    };

    box.style.color = colori[tipo] || "black";

    setTimeout(() => {
        box.textContent = "";
    }, 3000);
}


/* =========================
   SLIDER FOTO (OTTIMIZZATO)
========================= */
function cambiaSlide(btn, direzione) {
    const slider = btn.parentElement;
    const slides = slider.querySelectorAll(".slide");

    const attiva = slider.querySelector(".active");
    let index = Array.from(slides).indexOf(attiva);

    attiva.classList.remove("active");

    index = (index + direzione + slides.length) % slides.length;

    slides[index].classList.add("active");
}


/* =========================
   DATABASE PRENOTAZIONI
========================= */
class DatabasePrenotazioni {
    constructor() {
        this.url = "https://script.google.com/macros/s/AKfycbzkUldbBdNTrcYIFTm8UPJtnzVN3yL67qqO1UwWtFxUe2lOa46H5A-qtcNwbUame1DW/exec";
        this.prenotazioni = [];

        this.carica();
    }

    /* =========================
       PRENOTA
    ========================= */
    prenota() {
        const nome = document.getElementById("nome").value.trim();
        const progetto = document.getElementById("progetto").value;
        const data = document.getElementById("data-prenotazione").value;
        const orario = document.getElementById("orario").value;

        if (!nome || !progetto || !data || !orario) {
            mostraMessaggio("⚠️ Compila tutti i campi!", "errore");
            return;
        }

        // Controllo duplicati lato client
        const giàEsiste = this.prenotazioni.some(p =>
            p.progetto === progetto &&
            p.data === data &&
            p.orario === orario
        );

        if (giàEsiste) {
            mostraMessaggio("❌ Già prenotato per questo orario!", "errore");
            return;
        }

        mostraMessaggio("⏳ Invio prenotazione...", "info");

        fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                progetto,
                orario,
                data
            })
        })
        .then(res => res.text())
        .then(risposta => {
            if (risposta === "GIÀ_PRENOTATO") {
                mostraMessaggio("❌ Già prenotato!", "errore");
                return;
            }

            if (risposta === "OK") {
                mostraMessaggio("✅ Prenotazione salvata!", "successo");
                this.carica();
                this.pulisciCampi();
            } else {
                mostraMessaggio("⚠️ Errore imprevisto", "errore");
            }
        })
        .catch(() => {
            mostraMessaggio("❌ Errore di connessione", "errore");
        });
    }

    /* =========================
       CARICA DATI
    ========================= */
    carica() {
        mostraMessaggio("🔄 Caricamento dati...", "info");

        fetch(this.url)
            .then(res => res.json())
            .then(data => {
                this.prenotazioni = data;
                this.render();
            })
            .catch(() => {
                mostraMessaggio("❌ Errore caricamento dati", "errore");
            });
    }

    /* =========================
       RENDER LISTA
    ========================= */
    render() {
        const lista = document.getElementById("lista");
        if (!lista) return;

        lista.innerHTML = "";

        if (this.prenotazioni.length === 0) {
            lista.innerHTML = "<li>Nessuna prenotazione</li>";
            return;
        }

        this.prenotazioni.forEach((pren, index) => {
            const li = document.createElement("li");

            li.textContent = `${pren.nome} - ${pren.progetto} - ${pren.data} - ${pren.orario}`;

            const btn = document.createElement("button");
            btn.textContent = "❌";
            btn.style.marginLeft = "10px";

            btn.onclick = () => this.elimina(index);

            li.appendChild(btn);
            lista.appendChild(li);
        });
    }

    /* =========================
       ELIMINA
    ========================= */
    elimina(index) {
        const pren = this.prenotazioni[index];

        if (!confirm("Vuoi eliminare questa prenotazione?")) return;

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
        .then(() => {
            mostraMessaggio("🗑️ Prenotazione eliminata", "info");
            this.carica();
        })
        .catch(() => {
            mostraMessaggio("❌ Errore eliminazione", "errore");
        });
    }

    /* =========================
       PULISCI CAMPI
    ========================= */
    pulisciCampi() {
        document.getElementById("nome").value = "";
        document.getElementById("data-prenotazione").value = "";

        document.getElementById("progetto").selectedIndex = 0;
        document.getElementById("orario").selectedIndex = 0;
    }
}


/* =========================
   AVVIO APP
========================= */
const db = new DatabasePrenotazioni();

function prenota() {
    db.prenota();
}
    
