/* 
   messaggio post prenotazione */
function mostraMessaggio(testo, tipo = "info") {
    const box = document.getElementById("messaggio");
    if (!box) return;

    box.textContent = testo;

    if (tipo === "errore") box.style.color = "red";
    else if (tipo === "successo") box.style.color = "green";
    else box.style.color = "black";

    setTimeout(() => {
        box.textContent = "";
    }, 3000);
}


/* foto che scorrono*/
function cambiaSlide(btn, direzione) {
    const slider = btn.parentElement;
    const slides = slider.querySelectorAll(".slide");

    const attiva = slider.querySelector(".active");
    let index = Array.from(slides).indexOf(attiva);

    attiva.classList.remove("active");

    index = (index + direzione + slides.length) % slides.length;

    slides[index].classList.add("active");
}


/* prenotazioni */
class DatabasePrenotazioni {
    constructor() {
        this.url = "https://script.google.com/macros/s/AKfycbz9HrbD7jZP5SslzkJ3wiYqXVdafOw6Gi0xpdEqxw5sWR5P8GaO0ZEizjqUbSY6HDHQ/exec";
    }

    prenota() {
        const nome = document.getElementById("nome").value.trim();
        const progetto = document.getElementById("progetto").value;
        const data = document.getElementById("data-prenotazione").value;
        const orario = document.getElementById("orario").value;

        if (!nome || !data) {
            mostraMessaggio("⚠️ Compila tutti i campi!", "errore");
            return;
        }

        
        const dataFormattata = new Date(data).toISOString().split("T")[0];

        mostraMessaggio("⏳ Invio prenotazione...", "info");

        fetch(this.url, {
            method: "POST",
            body: JSON.stringify({
                nome: nome,
                progetto: progetto,
                data: dataFormattata,
                orario: orario
            })
        })
        .then(res => res.text())
        .then(risposta => {
            console.log("RISPOSTA:", risposta);

            if (risposta === "OK") {
                mostraMessaggio("✅ Prenotazione salvata!", "successo");
                this.pulisciCampi();
            } else if (risposta === "GIÀ_PRENOTATO") {
                mostraMessaggio("❌ Già prenotato!", "errore");
            } else {
                mostraMessaggio("⚠️ Errore dal server", "errore");
            }
        })
        .catch(err => {
            console.error(err);
            mostraMessaggio("❌ Errore di connessione", "errore");
        });
    }

    pulisciCampi() {
        document.getElementById("nome").value = "";
        document.getElementById("data-prenotazione").value = "";

        document.getElementById("progetto").selectedIndex = 0;
        document.getElementById("orario").selectedIndex = 0;
    }
}



const db = new DatabasePrenotazioni();

function prenota() {
    db.prenota();
}
