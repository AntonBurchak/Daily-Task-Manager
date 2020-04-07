let removedData = JSON.parse(localStorage.getItem('removedData')) || [],
    finishedData = JSON.parse(localStorage.getItem('finishedData')) || [],
    wastedData = JSON.parse(localStorage.getItem('wastedData')) || [];

let display = localStorage.getItem('display') || 'table';
localStorage.setItem('display', display);

const indicators = {
    finished: finishedData.length,
    wasted: wastedData.length,
    removed: removedData.length
};


const watchIndicators = () => {
    const linkFinished = document.querySelector('.finished + span'),
        linkWasted = document.querySelector('.wasted + span'),
        linkRemoved = document.querySelector('.removed + span');

    linkFinished.textContent = indicators.finished;
    linkWasted.textContent = indicators.wasted;
    linkRemoved.textContent = indicators.removed;
}

// CHECK DEADLINES
data.forEach(element => {

    if (element.deadline !== '---') {
        const tmp = (element.deadline).split('-').reverse();
        const deadline = new Date(`${tmp[1]}/${tmp[0]}/${tmp[2]}`);
        const now = new Date();

        if ((deadline.getTime() - now.getTime()) <= 1440 * 60000 && (deadline.getTime() - now.getTime()) > 0) {
            element.status = 'fire';
        } else if (deadline.getTime() - now.getTime() > 0) {
            element.status = 'normal';
        } else if (deadline.getTime() - now.getTime() < 0) {
            element.status = 'wasted';
            wastedData.push(element);
            indicators.wasted++;
            localStorage.setItem('wastedData', JSON.stringify(wastedData));

            // let tmp = data;
            data = data.filter(card => {
                +card.id !== +element.id;
            });
            localStorage.setItem('cards', JSON.stringify(data));
        }
    }
    watchIndicators();
});
// /CHECK DEADLINES

// DELETE CARD FUNCTION
const deleteCard = (element) => {

    buttons = document.querySelectorAll('.main__item-context button');
    contextCardMenu();
    // let tmp = data;

    const removed = data.find(el => el.id == +element.getAttribute('data-id'));


    data = data.filter(card => {
        return +card.id !== +element.getAttribute('data-id');
    });
    removed.status = 'removed';
    localStorage.setItem('cards', JSON.stringify(data));

    removedData.push(removed);

    indicators.removed++;

    localStorage.setItem('removedData', JSON.stringify(removedData));

    watchIndicators();
}
// FINISH CARD FUNCTION
const finishCard = (element) => {
    buttons = document.querySelectorAll('.main__item-context button');
    contextCardMenu();

    let tmp = data;

    const finished = data.find(el => el.id == +element.getAttribute('data-id'));


    data = tmp.filter(card => {
        return +card.id !== +element.getAttribute('data-id');
    });

    localStorage.setItem('cards', JSON.stringify(data));
    finished.status = 'finished';
    finishedData.push(finished);

    indicators.finished++;

    localStorage.setItem('finishedData', JSON.stringify(finishedData));

    watchIndicators();
}

localStorage.setItem('cards', JSON.stringify(data));
localStorage.setItem('wastedData', JSON.stringify(wastedData));



watchIndicators();


const cardView = (string) => {
    if (localStorage.getItem('display') == 'table' && string.length >= 35) {
        return string = string.slice(0, 35) + '...';
    } else {
        return string;
    }
}




const contextCardMenu = () => {
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const type = button.getAttribute('data-type');
            const parent = button.parentElement.parentElement.parentElement.parentElement.parentElement;
            switch (type) {
                case 'del':
                    new Alert('warning', 'Эту карточку невозможно будет восстановить', 'delete', parent);

                    buttons = document.querySelectorAll('.main__item-context button');
                    break;
                case 'finish':
                    finishCard(parent);
                    render();
                    buttons = document.querySelectorAll('.main__item-context button');
                    break;
                case 'edit':
                    editCard(parent);
                    render();
                    buttons = document.querySelectorAll('.main__item-context button');
                    break;
                case 'watch':

            }
        })
    })
}


const removeAllTasksFromRemoved = () => {
    removedData = [];
    localStorage.setItem('removedData', JSON.stringify(removedData));
    indicators.removed = 0;
    watchIndicators();
    render(removedData);
}
const removeAllTasksFromFinished = () => {
    finishedData = [];
    localStorage.setItem('finishedData', JSON.stringify(finishedData));
    indicators.finished = 0;
    watchIndicators();
    render(finishedData);
}
const removeAllTasksFromWasted = () => {
    wastedData = [];
    localStorage.setItem('wastedData', JSON.stringify(wastedData));
    indicators.wasted = 0;
    watchIndicators();
    render(wastedData);
}

const editCard = (card) => {
    const parent_id = +card.getAttribute('data-id');
    buttons = document.querySelectorAll('.main__item-context button');
    contextCardMenu();
    const editElementWrapper = document.querySelector('.edit-card');
    const editElement = data.find(element => {
        return element.id === parent_id;
    });


    const elName = editElement.name;
    const elText = editElement.text;
    let elDead = editElement.deadline;

    const cardNameInput = document.querySelector('.edit-card-name');
    const cardTextInput = document.querySelector('.edit-card-text');
    const cardDateInput = document.querySelector('.edit-card-date');

    cardNameInput.value = elName;
    cardTextInput.value = elText;
    cardDateInput.value = elDead == '---' ? elDead = '' : elDead = elDead;

    textFormatter('edit');


    const btn = document.querySelector('.edit-card #createCard');
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        try {
            data.forEach(item => {
                if (item.id === parent_id) {
                    item.name = cardNameInput.value;
                    item.text = cardTextInput.value;
                    item.deadline = cardDateInput.value;
                };
            });

            localStorage.setItem('cards', JSON.stringify(data));
            render();

            const a = new Alert('success', 'Карточка отредактирована!');
        } catch (e) {
            alert(e);
        }


    });

    editElementWrapper.classList.add('active');


    document.querySelector('.edit-card .close').onclick = function () {
        document.querySelector('.edit-card').classList.remove('active');
    }
}