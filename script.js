/* =========================
   MESSAGGI A SCHERMO
========================= */
function mostraMessaggio(testo, tipo) {
    let box = document.getElementById("messaggio");

    if (!box) return;

    box.textContent = testo;

    if (tipo === "errore") {
        box.style.color = "red";
    } else if (tipo === "successo") {
        box.style.color = "green";
    } else {
        box.style.color = "black";
    }

    setTimeout(() => {
        box.textContent = "";
    }, 3000);
}


/* =========================
   SLIDER FOTO (INVARIATO)
========================= */
function cambiaSlide(btn, direzione) {
    let slider = btn.parentElement;
    let slides = slider.querySelectorAll(".slide");

    let index = 0;

    slides.forEach((slide, i) => {
        if (slide.classList.contains("active")) {
            index = i;
        }
        slide.classList.remove("active");
    });

    index += direzione;

    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides[index].classList.add("active");
}


/* =========================
   DATABASE PRENOTAZIONI
========================= */
class DatabasePrenotazioni {
    constructor() {
        this.url = "https://script.google.com/macros/library/d/1DyVqZ3o8wVP6uH20FxRYCYAsX9ua59gWTzcgNSnydrP4sHqe8cuCzMIp/10";
        this.prenotazioni = [];

        this.carica();
    }

    prenota() {
        let nome = document.getElementById("nome").value;
        let progetto = document.getElementById("progetto").value;
        let data = document.getElementById('data-prenotazione').value;
        let orario = document.getElementById("orario").value;

        // 🔴 CONTROLLO CAMPI
        if (nome === "" || progetto === "" || data === "" || orario === "") {
            mostraMessaggio("⚠️ Compila tutti i campi!", "errore");
            return;
        }

        // 🔴 CONTROLLO SLOT OCCUPATO
        let occupato = this.prenotazioni.some(p => 
            p.data === data && 
            p.orario === orario
        );

        if (occupato) {
            mostraMessaggio("❌ Orario già prenotato per questa data!", "errore");
            return;
        }

        // 🔴 CONTROLLO DUPLICATO PROGETTO
        let duplicato = this.prenotazioni.some(p => 
            p.progetto === progetto && 
            p.data === data && 
            p.orario === orario
        );

        if (duplicato) {
            mostraMessaggio("❌ Questo progetto è già prenotato in questa data e orario!", "errore");
            return;
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

            // ✅ SUCCESSO
            mostraMessaggio("✅ Prenotazione salvata con successo!", "successo");
        });
    }

    // 🔄 CARICA DATI (senza mostrarli)
    carica() {
        fetch(this.url)
        .then(res => res.json())
        .then(data => {
            this.prenotazioni = data;
        });
    }

    // ❌ DISATTIVATA (ma lasciata come richiesto)
    aggiornaLista() {
        return;
    }

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

    pulisciCampi() {
        document.getElementById("nome").value = "";
        document.getElementById("progetto").value = "";
        document.getElementById("data-prenotazione").value = "";
    }
}


/* =========================
   AVVIO APP
========================= */
const db = new DatabasePrenotazioni();

function prenota() {
    db.prenota();
}
