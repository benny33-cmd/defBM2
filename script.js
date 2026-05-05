class DatabasePrenotazioni {
    constructor() {
        this.url = "https://script.google.com/macros/s/AKfycbzqiFbj0DxSYVySVp9qpzH6K_400H82y5p7Hb-PvACCR8K3KSOGNF2ivbh7wEVxSjQf/exec";
        this.prenotazioni = [];
        this.lista = document.getElementById("lista");

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

        // 🔴 CONTROLLO DUPLICATO (anche su tutto il database)
        let occupato = this.prenotazioni.some(p =>
            p.progetto === progetto &&
            p.data === data &&
            p.orario === orario
        );

        if (occupato) {
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

    carica() {
        fetch(this.url)
        .then(res => res.json())
        .then(data => {
            this.prenotazioni = data;
            this.aggiornaLista();
        });
    }

    aggiornaLista() {
        this.lista.innerHTML = "";

        let oggi = new Date();

        // 🔥 calcolo settimana corrente
        let inizioSettimana = new Date(oggi);
        inizioSettimana.setDate(oggi.getDate() - oggi.getDay() + 1); // lunedì

        let fineSettimana = new Date(inizioSettimana);
        fineSettimana.setDate(inizioSettimana.getDate() + 6);

        this.prenotazioni.forEach((pren, index) => {

            let dataPren = new Date(pren.data);

            // 🔴 MOSTRA SOLO SETTIMANA CORRENTE
            if (dataPren >= inizioSettimana && dataPren <= fineSettimana) {

                let li = document.createElement("li");

                let dataFormattata = pren.data
                    ? pren.data.split('-').reverse().join('/')
                    : "";

                li.innerHTML = `
                    <strong>${dataFormattata}</strong> ore <strong>${pren.orario}</strong>: 
                    ${pren.nome} ha prenotato <em>${pren.progetto}</em>
                `;

                this.lista.appendChild(li);
            }
        });
    }

    elimina(index) {
        // 🔴 NON cancelliamo dal foglio → solo refresh
        this.carica();
    }

    salva() {
        localStorage.setItem("prenotazioni", JSON.stringify(this.prenotazioni));
    }

    pulisciCampi() {
        document.getElementById("nome").value = "";
        document.getElementById("data-prenotazione").value = "";
    }
}

const db = new DatabasePrenotazioni();

function prenota() {
    db.prenota();
}
