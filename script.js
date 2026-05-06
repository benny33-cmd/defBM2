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
   SLIDER FOTO
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
   DATABASE PRENOTAZIONI (UNIFICATO)
========================= */
class DatabasePrenotazioni {
    constructor() {
        this.url = "https://script.google.com/macros/s/AKfycbwxLq6impTO7SOiV-Qt_rhexyUh3UPS0OH4ZnH6Z1yFge50uZ9-hpoPsKJULdAnpGc/exec";
        this.prenotazioni = [];

        this.carica();
    }

    /* =========================
       PRENOTA
    ========================= */
    prenota() {
        let nome = document.getElementById("nome").value;
        let progetto = document.getElementById("progetto").value;
        let data = document.getElementById("data-prenotazione").value;
        let orario = document.getElementById("orario").value;

        if (!nome || !progetto || !data || !orario) {
            mostraMessaggio("⚠️ Compila tutti i campi!", "errore");
            return;
        }

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

            console.log("RISPOSTA SERVER:", risposta);

            if (risposta === "GIÀ_PRENOTATO") {
                mostraMessaggio("❌ Progetto già prenotato in questa data e orario!", "errore");
                return;
            }

            if (risposta === "OK") {
                mostraMessaggio("✅ Prenotazione salvata con successo!", "successo");
                this.carica();
                this.pulisciCampi();
            } else {
                mostraMessaggio("⚠️ Errore imprevisto", "errore");
            }
        });
    }

    /* =========================
       CARICA PRENOTAZIONI
    ========================= */
    carica() {
        fetch(this.url)
        .then(res => res.json())
        .then(data => {
            this.prenotazioni = data;
        });
    }

    /* =========================
       ELIMINA
    ========================= */
    elimina(index) {
        let pren = this.prenotazioni[index];

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
            this.carica();
        });
    }

    /* =========================
       PULISCI CAMPI
    ========================= */
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
