const target1 = document.querySelector('.add-card #textFormatter');
const target2 = document.querySelector('.edit-card #textFormatter');

class textfield {
	static insertHead(target) {
		return (target.value += `<h1> </h1>\n`);
	}
	static insertBold(target) {
		return (target.value += `<b> </b>\n`);
	}
	static insertItalic(target) {
		return (target.value += `<i> </i>\n`);
	}
	static insertUnder(target) {
		return (target.value += `<ins> </ins>\n`);
	}
	static insertDel(target) {
		return (target.value += `<del> </del>\n`);
	}
	static insertQuote(target) {
		return (target.value += `<blockqoute> </blockqoute>\n`);
	}
	static insertLink(target) {
		return (target.value += `<a href="" target="_blank"> </a>\n`);
	}
	static insertList(target) {
		return (target.value += `<ul>\n  <li></li>\n</ul>\n`);
	}
	static insertPicture(target) {
		return (target.value += `<img> </img>\n`);
	}

	static clear() {
		return (target.textContent = ``);
	}
}

const textFormatter = (node) => {
	let types, newTarget;
	if (node == 'create') {
		types = document.querySelectorAll('.add-card .textarea__buttons button');
		newTarget = target1;
	}
	if (node == 'edit') {
		types = document.querySelectorAll('.edit-card .textarea__buttons button');
		newTarget = target2;
	}

	types.forEach((button) => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			const type = button.getAttribute('data-type');

			switch (type) {
				case 'heading':
					textfield.insertHead(newTarget);
					break;
				case 'bold':
					textfield.insertBold(newTarget);
					break;
				case 'italic':
					textfield.insertItalic(newTarget);
					break;
				case 'underline':
					textfield.insertUnder(newTarget);
					break;
				case 'del':
					textfield.insertDel(newTarget);
					break;
				case 'qoute':
					textfield.insertQuote(newTarget);
					break;
				case 'link':
					textfield.insertLink(newTarget);
					break;
				case 'list':
					textfield.insertList(newTarget);
					break;
				case 'image':
					textfield.insertPicture(newTarget);
					break;
			}
		});
	});
};

textFormatter('create');
