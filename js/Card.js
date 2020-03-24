// jshint esversion:6


let data = JSON.parse(localStorage.getItem('cards')) || [], i = localStorage.getItem('identifier') || 0;

class Card {
    constructor(name, postdate, postmin, text, deadline) {
        this.name = name || '';
        this.postdate = postdate || '';
        this.postmin = postmin || '';
        this.text = text || '';
        this.deadline = deadline || '';
        this.id = i++;

    }

    toObject() {
        return {
            name: this.name,
            postdate: this.postdate,
            postmin: this.postmin,
            text: this.text,
            deadline: this.deadline,
            id: +this.id
        };
    }

    send() {
        data.push(this.toObject());
        localStorage.setItem('cards', JSON.stringify(data));
        localStorage.setItem('identifier', i);
    }

    show() {
    }
}




// const create = () => {

// }
