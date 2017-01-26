import $ from 'jquery';

export default class ItemTable {
    constructor () {
        this.table = $('#item');
        this.row = $('#item .row');
        this.itemName = $('#item-pane .heading').text();
        this.nextButton = $('#item-nav-buttons button.next');
        this.prevButton = $('#item-nav-buttons button.previous');
        
        this.init();
        this.events();
    }
    
    init () {
        $('#log .modal__header .active-name').text($('#active-name').text())
    }

    events () {
        this.nextButton.click(this.getAdjacentItem.bind(this))
        this.prevButton.click(this.getAdjacentItem.bind(this))
        $(document).keyup(this.handleKeyPress.bind(this))
    }
    
    getAdjacentItem (event) {
        let direction = event.currentTarget.innerText === 'Next' ? '/next' : '/prev';
        location.assign('/items/' + this.itemName +  direction);
    }
    
    handleKeyPress (event) {
        console.log(event.keyCode)
        if (!$('html').hasClass('modal-open')) {
            const _       = this,
                  key     = String(event.keyCode),
                  methods = {
                      27: () => location.assign('/'), //ESC
                      76: () => $('.log--open').first().trigger('click') // 'L'
                  };
            if (methods.hasOwnProperty(key) && typeof(methods[key]) == 'function') {
                methods[key]()
            } else return false
        }
    }
}
