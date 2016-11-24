import $ from 'jquery';

export default class MainTable {
    constructor () {
        this.table = $('#all');
        this.row = $('#all .row');
        this.deleteButton = $('#all .row > .delete button');
        this.itemTable = $('#item');
        this.events();
    }

    events () {
        this.row.click(this.get.bind(this))
        this.deleteButton.click(this.delete.bind(this))
    }

    get (event) {
        let url = '/items/' + event.currentTarget.firstElementChild.innerText;
        location.assign(url);
    }
    
    delete (event) {
        console.log(event.currentTarget.previousElementSibling.previousElementSibling);
        let url = '/items';
    }
}
