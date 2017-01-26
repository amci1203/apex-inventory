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
        if (!$('html').hasClass('modal-open')) {
            const _       = this,
                  key     = String(event.keyCode),
                  state   = !$('html').hasClass('options-open') ? 'main' : 'options',
                  methods = {
                      main: {
                          27: () => location.replace('/'), //ESC
                          76: () => $('.log--open').first().trigger('click') //'L'
                      },
                      options: {}
                  };
            console.log(key);
            if (methods[state].hasOwnProperty(key) && typeof(methods[state][key]) == 'function') {
                methods[state][key]()
            } else {
                return false
            }
        }
    }
}
