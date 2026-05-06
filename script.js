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
        this.url = "https://script.google.com/macros/s/AKfycbz2Kb_5X7bUSR_olDgRSbbG1lSP5SAw2JqIiZYOi3F86ghjv4xuGtqCin7z8MPw6jv3/exec";
        this.prenotazioni = [];

        // ❌ NON SERVE PIÙ LA LISTA
        // this.lista = document.getElementById("lista");

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

        let occupato = this.prenotazioni.some(p => 
            p.data === data && 
            p.orario === orario
        );

        if (occupato) {
            alert("Orario già prenotato per questa data!");
            return;
        }

        let duplicato = this.prenotazioni.some(p => 
            p.progetto === progetto && 
            p.data === data && 
            p.orario === orario
        );

        if (duplicato) {
            alert("Questo progetto è già prenotato in questa data e orario!");
            return;
        }

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

    // 🔄 CARICA DATI (ma NON li mostra)
    carica() {
        fetch(this.url)
        .then(res => res.json())
        .then(data => {
            this.prenotazioni = data;

            // ❌ BLOCCATA LA VISUALIZZAZIONE
            // this.aggiornaLista();
        });
    }

    // ❌ DISATTIVATA COMPLETAMENTE
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
