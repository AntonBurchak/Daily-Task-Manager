
class Alert {
    constructor(type = 'success', text, additionalType, additionalTarget) { // type must be 'success', 'error' or 'warning'
        const validation = (type == 'success' || type == 'error' || type == 'warning') ? true : false;


        this._type = validation ? type : 'error';
        this._text = validation ? text : 'Failed to create card, not valid type: ' + type;

        this._wrap = document.createElement('div')


        additionalType ? this.aType = additionalType : null;
        additionalTarget ? this.aTarget = additionalTarget : null;

        this.createAlert()
    }

    createAlert() {
        document.querySelector('.notification') ? document.querySelector('.notification').parentElement.removeChild(document.querySelector('.notification')) : null;
        const pattern = `
        <h3>${this._text}</h3>
        <div>
            <button class="btn_ok">Ok</button>
            ${this.aType == 'delete' ? ' <button class="btn_no">Отменить</button>' : ''}
        </div>
       `;

        this._wrap.classList.add(`notification`);
        this._wrap.classList.add(this._type);

        this._wrap.innerHTML = pattern;
        document.body.appendChild(this._wrap);

        document.querySelector('.notification button.btn_ok').addEventListener('click', () => {
            if (this.aType == 'delete') deleteCard(this.aTarget);
            render();
            viewer.classList.remove('active');
            this.closeAlert();
        });
        if (this.aType == 'delete') {
            document.querySelector('.notification button.btn_no').addEventListener('click', () => {
                this.closeAlert();
            });
        }

    }

    closeAlert() {
        this._type = null;
        this._text = null;
        this._wrap = null;
        document.querySelector('.notification').parentElement.removeChild(document.querySelector('.notification'));
    }
}


