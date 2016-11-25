import $ from 'jquery';

export default class MainTable {
    constructor () {
        this.table = $('#item');
        this.row = $('#item .row');
        this.nextButton = $('#item-nav-buttons button.next');
        this.prevButton = $('#item-nav-buttons button.previous');
        this.events();
    }

    events () {
        this.nextButton.click(this.getAdjacentItem.bind(this))
        this.prevButton.click(this.getAdjacentItem.bind(this))
    }
    
    getAdjacentItem (event) {
        let direction = event.currentTarget.innerText === 'Next' ? 1 : -1; // adds or subtract on to get next/previous item
        let currentItemId = location.pathname.split('/').reverse()[0];
        let newItemId = direction + +currentItemId;
        location.assign('/items/' + newItemId);
    }
}
