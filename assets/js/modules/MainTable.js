import $ from 'jquery';

export default class MainTable {
    constructor () {
        this.table = $('#all');
        this.selectableElement = $('#all .row > td:first-child');
        this.itemTable = $('#item');
        this.events();
    }

    events () {
        this.selectableElement.click(this.get.bind(this))
    }

    get (event) {
        let url = '/items/' + event.currentTarget.getAttribute('data-id');
        $.get(url, (data) => {

        })
    }
}
