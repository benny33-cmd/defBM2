let prenotazioni = {};

function prenota() {
    let nome = document.getElementById("nome").value;
    let progetto = document.getElementById("progetto").value;
    let orario = document.getElementById("orario").value;

    if (nome === "") {
        alert("Inserisci il nome!");
        return;
    }

    if (prenotazioni[orario]) {
        alert("Orario già prenotato!");
        return;
    }

    prenotazioni[orario] = nome + " - " + progetto;

    aggiornaLista();
}

function aggiornaLista() {
    let lista = document.getElementById("lista");
    lista.innerHTML = "";

    for (let orario in prenotazioni) {
        let li = document.createElement("li");
        li.textContent = orario + " → " + prenotazioni[orario];
        lista.appendChild(li);
    }
}

/* SLIDER */
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
