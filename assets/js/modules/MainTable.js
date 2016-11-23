import $ from 'jquery';

export default class MainTable {
    constructor () {
        this.table = $('#all');
        this.item = $('#all .row > td:first-child');
        this.deleteButton = $('#all .row > td:last-child');
        this.itemTable = $('#item');
        this.events();
    }

    events () {
        this.item.click(this.get.bind(this))
    }

    get (event) {
        console.log(event);
        let url = '/items/' + event.currentTarget.getAttribute('data-id');
        $.get(url, (data) => {

        })
    }
}
