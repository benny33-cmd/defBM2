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
        // ✅ FIX: tolto ?html=true
        this.url = "https://script.google.com/macros/s/AKfycbzqFVXGz-ieZ-zNBCIeCE3euByko7ilIoY3SUFuWnnOhOCAnqzh5jSJeBqdAUIu3owv/exec";
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

        // 🔧 NORMALIZZA DATA
        function normalizzaData(d) {
            if (!d) return "";
            let date = new Date(d);
            return date.toISOString().split("T")[0];
        }

        // 🔴 CONTROLLO SLOT OCCUPATO
        let occupato = this.prenotazioni.some(p => 
            normalizzaData(p.data) === normalizzaData(data) &&
            p.orario === orario
        );

        if (occupato) {
            mostraMessaggio("❌ Orario già prenotato per questa data!", "errore");
            return;
        }

        // 🔴 CONTROLLO DUPLICATO PROGETTO
        let duplicato = this.prenotazioni.some(p => 
            p.progetto === progetto &&
            normalizzaData(p.data) === normalizzaData(data) &&
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
        .then(res => res.text())
        .then(risposta => {

            if (risposta === "GIÀ_PRENOTATO") {
                mostraMessaggio("❌ Progetto già prenotato in questa data e orario!", "errore");
                return;
            }

            if (risposta === "OK") {
                this.carica();
                this.pulisciCampi();
                mostraMessaggio("✅ Prenotazione salvata con successo!", "successo");
            } else {
                mostraMessaggio("⚠️ Errore imprevisto", "errore");
            }
        });
    }

    // 🔄 CARICA DATI
    carica() {
        fetch(this.url)
        .then(res => res.json())
        .then(data => {
            this.prenotazioni = data;
        });
    }

    // ❌ DISATTIVATA
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
