import $ from 'jquery';

export default class ItemTable {
    constructor () {
        this.table = $('#item');
        this.row = $('#item .row');
        this.itemName = $('#item-pane .heading').text();
        this.nextButton = $('#item-nav-buttons button.next');
        this.prevButton = $('#item-nav-buttons button.previous');
        this.events();
    }

    events () {
        this.nextButton.click(this.getAdjacentItem.bind(this))
        this.prevButton.click(this.getAdjacentItem.bind(this))
    }
    
    getAdjacentItem (event) {
        let direction = event.currentTarget.innerText === 'Next' ? '/next' : '/prev';
        location.assign('/items/' + this.itemName +  direction);
    }
}
