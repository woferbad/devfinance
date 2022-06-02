const Modal = {
    toggle() {
        document.querySelector(".modal-overlay").classList.toggle('active');
    }

};
const transactions = [
    // {
    //     description: "fgkjf",
    //     amount: -10000,
    //     date: "2022-05-26"

    // }

];
let array = [];
for (let i = 0; i < 10; i++) {
    array.push(Math.round(Math.random() * 10))

}

const Transactions = {
    all: transactions,

    add(novo) {
        Transactions.all.push(novo)
    },
    remove(indice) {
        console.log("Remove", "ID", indice);
        for (i in Transactions.all) {
            console.log("s", Transactions.all[i].id, indice, Transactions.all[i]);
            if (Transactions.all[i].id == indice) {
                Transactions.all.splice(i, 1);
            }
        }
    },

    incomes() {
        let income = 0;
        Transactions.all.forEach((transactions) => {
            if (transactions.amount > 0) {
                income = income + Number(transactions.amount);
            }
        });
        console.log(Transactions.all, "RRR");
        return income*100;
    },
    expanses() {
        let expense = 0;
        Transactions.all.forEach((transactions) => {
            if (transactions.amount < 0) {
                expense += Number(transactions.amount);
            }
        });

        return expense*100;
    },
    total() {
        return Transactions.incomes() + Transactions.expanses();
    },
    toRemove(index) {
        console.log(index);
        
       
    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement("tr");
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        console.log(index);
        const CSSclass = transaction.amount > 0 ? "income" : "expanse";
        const amount = UTIL.formatCurrency(transaction.amount*100);
        const html = `
     <td class="description">${transaction.description}</td>
     <td class="${CSSclass}">${amount}</td>
     <td class="date">${UTIL.formatDate(transaction.date)}</td>
     <td >
     <img src="./assets/minus.svg" alt="Remover transação" onclick="Transactions.toRemove(${index})">
     </td>
     `
        return html
    },
    updateBalance() {
        document.getElementById("incomeDisplay").innerHTML = UTIL.formatCurrency(Transactions.incomes());
        document.getElementById("expanseDisplay").innerHTML = UTIL.formatCurrency(Transactions.expanses());
        document.getElementById("totalDisplay").innerHTML = UTIL.formatCurrency(Transactions.total());
    },
    clearTransaction() {
        DOM.transactionsContainer.innerHTML = ""
    }
};

const UTIL = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";
        value = String(value).replace(/\D/g, "");
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        return signal + value;
    },
    formatDate(value) {
        const splittedDate = value.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
};

const Form = {
    description: document.getElementById("description"),
    amount: document.getElementById("amount"),
    date: document.getElementById("date"),

    getValue() {

        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    submit(event) {
        event.preventDefault();
        Transactions.add(Form.getValue())
        try {
            Form.validateFilds();
            DOM.addTransaction(Form.getValue(),1);
            DOM.updateBalance()
            Form.clearFilds()
            Modal.toggle()

        } catch (error) {
            alert(error.message)
        }



    },
    validateFilds() {
        const {
            description,
            amount,
            date
        } = Form.getValue()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "")
            throw new Error("Por favor, preencha todos os campos")

    },
    clearFilds() {
        console.log("Aqui");
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },
    formatValues() {
        let {
            description,
            amount,
            date
        } = Form.getValue()
        amount = UTIL.formatCurrency(amount)
        date = UTIL.formatDate(date)
    }
}

const APP = {
    init() {
        Transactions.all.map((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        DOM.updateBalance();
    },
    reload() {
        DOM.clearTransaction();
        APP.init();
    }
};

APP.init();