// jshint esversion:6


let buttons = document.querySelectorAll('.main__item-context button');


let viewLinks;
let viewer;
let viewerClose;

const createCard = (form) => {
    let cardInfo = [
        form.querySelector('input[name="name"]').value,
        getCurrentDate().post,
        getCurrentDate().postmin,
        form.querySelector('textarea[name="text"]').value,
        form.querySelector('input[name="date"]').value || '---'
    ];

    let card;
    const tmp = (form.querySelector('input[name="date"]').value).split('-').reverse();
    const deadline = new Date(`${tmp[1]}/${tmp[0]}/${tmp[2]}`);
    const now = new Date();

    if (
        (cardInfo[0].length === 0 || cardInfo[0].trim() === '') ||
        (cardInfo[3].length === 0 || cardInfo[3].trim() === '') ||
        (cardInfo[4].length === 0 || cardInfo[4].trim() === '') //||
       // (deadline.getTime() - now.getTime() < 0)
    ) {

        const a = new Alert('error', 'Invalid values in inputs OR invalid deadline date');
        return a;

    } else {
        card = new Card(...cardInfo);
        card.send();


        
        const b = new Alert('success', 'Вы успешно добавили карточку!');
        
        form.querySelectorAll('input , textarea').forEach(el => {
            el.value = '';
        });
        document.querySelector('.add-card').classList.remove('active');
    }
};


const addCard = () => {
    let btn = document.querySelector('#createCard');

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        createCard(btn.parentElement);
        render();
    });
};

function viewCardRender(maindata = data) {
    viewLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const PARENT = link.parentElement.parentElement.parentElement.parentElement.parentElement;
            const PARENT_ID = +PARENT.getAttribute('data-id');
            const watching = maindata.find(item => {
                return item.id === PARENT_ID;
            });



            // contextCardMenu();


            const pattern = `
            <div class="close"></div>
                <div class="wrapper">
                    <div class="viewCard__inner">
                        <div class="viewCard__group-text">
                            <h2 class="viewCard__name">${watching.name}</h2>
                            <p class="viewCard__text">${watching.text}</p>
                        </div>
                        <div class="viewCard__group-info">
                            <div class="viewCard__dates">
                                <p class="viewCard__postdate"><span>Дата публикации:</span> <span>${watching.postdate}</span></p>
                                <p class="viewCard__deadline"><span>Дата завершения:</span> <span>${watching.deadline.split('-').reverse().join('.')}</span></p>
                            </div>
                            
                            <div class="viewCard__buttons">
                                <div class="group">
                                    <button id="finishCard" data-type="finish">Завершить</button>
                                </div>
                                <div class="group">
                                    <button id="editCard" data-type="edit">Редактировать</button>
                                    <button id="removeCard" data-type="del">Удалить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `

            viewer = document.querySelector('.viewCard');

            viewer.innerHTML = pattern;
            viewer.classList.add('active');
            viewerClose = document.querySelector('.viewCard .close');

            viewerClose.addEventListener('click', () => {
                viewer.classList.remove('active');
            });

            viewer.querySelectorAll('.viewCard__buttons button').forEach((link) => {
                link.addEventListener('click', () => {
                    switch (link.getAttribute('data-type')) {
                        case "finish":
                            finishCard(PARENT);
                            viewer.classList.remove('active');
                            render();
                            const a = new Alert('success', 'Карточка перемещена в раздел "Завершённые"')
                            break;
                        case "del":
                            new Alert('warning', 'Эту карточку невозможно будет восстановить', 'delete', PARENT);

                            render();

                            break;
                        case "edit":
                            editCard(PARENT);
                            viewer.classList.remove('active');
                        // render();
                        // const a = new Alert('success', 'Карточка перемещена в раздел "Удалённые"')
                    }
                })

            });
        });
    });
};


const render = (maindata = data) => {
    let parent = document.querySelector('.main__content');
    parent.innerHTML = (maindata.length == 0) ? '<h1>Нет записей</h1>' : '';
    let additional = '';
    if (location.href.indexOf('/feed') !== -1) {
        additional = '../../';
    } else {
        additional = '';
    }
    maindata.forEach((card, index) => {
        let pattern = `
            <div class="main__item${card.status ? ' ' + card.status : ''}" data-id=${card.id}>
                <div class="main__item-group1">
                    <p class="main__item-name">${cardView(card.name)}</p>
                    <div class="main__item-postdate">
                        <time>${card.postdate}</time> <br>
                        <span class="min-sec">${card.postmin}</span>
                    </div>
                </div>
                
                <p class="main__item-text">${card.text.trim()}</p>
                <div class="main__item-group2">
                    <p>Deadline:</p>
                    <time class="main__item-deadline">${card.deadline.split('-').reverse().join('.')}</time>
                </div>
                
                <div class="main__item-wrapper">
                    <div class="main__item-context">
                        <ul>
                            <li><button data-type="edit"><img src="${additional}images/pen.png"></button></li>
                            <li><button data-type="watch"><img src="${additional}images/eye.png"></button></li>
                            <li><button data-type="del"><img src="${additional}images/del.png"></button></li>
                            <li><button data-type="finish"><img src="${additional}images/success.png"></button></li>
                        </ul>
                    </div>
                </div>
                
            </div>
            `;
        parent.innerHTML += pattern;
    });
    buttons = document.querySelectorAll('.main__item-context button');
    contextCardMenu();

    viewLinks = document.querySelectorAll('button[data-type="watch"]');
    viewer = document.querySelector('.viewCard');
    viewCardRender(maindata);
};
// viewCardRender();



const getCurrentDate = () => {
    let date = new Date(),
        day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear(),
        hours = date.getHours(),
        mins = date.getMinutes();

    day = (('' + day).length == 2) ? day : `0${day}`;
    month = (('' + month).length == 2) ? month : `0${month}`;

    (hours + '').length == 1 ? hours = '0' + hours : null;
    (mins + '').length == 1 ? mins = '0' + mins : null;

    return {
        post: `${day}.${month}.${year}`,
        min: `${year}-${month}-${day}`,
        postmin: `${hours}:${mins}`
    };
};
// console.log(getCurrentDate());

const minDate = () => {
    let inp = document.querySelector('input[type="date"]');

    inp.setAttribute('min', getCurrentDate().min);
};



const addPageActive = () => {
    const link = location.href;
    if (link.indexOf('/feed/finished') == -1 && link.indexOf('/feed/wasted') == -1 && link.indexOf('/feed/removed') == -1) {
        let pageAddClose = document.querySelector('.add-card .close');
        let anchor = document.querySelector('.add');
        let arr = [pageAddClose, anchor];

        arr.forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.success').style.opacity = '0';
                let pageAdd = document.querySelector('.add-card');
                pageAdd.classList.toggle('active');
            });
        });
    }
};




(function () {
    const block = document.querySelector('.displayTipe')

    block.addEventListener('click', () => {
        const displayWrapper = document.querySelector('.main__content');
        const main = document.querySelectorAll('.main__item-name');

        block.classList.toggle('display-column');
        displayWrapper.classList.toggle('display-column');

        if (block.classList.contains('display-column')) {
            localStorage.setItem('display', 'column');
        } else {
            localStorage.setItem('display', 'table')
        }
        addPageActive();
        controller();
    });
})();


contextCardMenu();

const changeDisplay = () => {
    const vision = document.querySelector('.displayTipe');
    const mainVision = document.querySelector('.main__content');
    if (localStorage.getItem('display') == 'table') {
        mainVision.classList.remove('display-column')
        vision.classList.remove('display-column');
    } else {
        mainVision.classList.add('display-column')
        vision.classList.add('display-column');
    }
}
function controller() {
    const link = location.href;

    localStorage.setItem('url', link);
    changeDisplay();
    if (link.indexOf('/feed/finished') !== -1) {
        document.querySelector('.removeAll').addEventListener('click', (e) => {
            e.preventDefault();
            removeAllTasksFromFinished();
        });
        return render(finishedData);
    }
    else if (link.indexOf('/feed/wasted') !== -1) {
        document.querySelector('.removeAll').addEventListener('click', (e) => {
            e.preventDefault();
            removeAllTasksFromWasted();
        });
        return render(wastedData)
    }
    else if (link.indexOf('/feed/removed') !== -1) {
        document.querySelector('.removeAll').addEventListener('click', (e) => {
            e.preventDefault();
            removeAllTasksFromRemoved();
        });
        return render(removedData)
    }

    else {
        addCard();
        minDate();
        addPageActive()
        return render();
    }


};
controller();
// window.location.href = localStorage.getItem('url');
