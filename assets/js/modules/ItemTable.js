import $ from 'jquery';

export default class ItemTable {
    constructor () {
        this.identifier  = 'item';
        this.table       = $('#item');
        this.rows        = $('#item .row');
        this.nextButton  = $('#item-nav-buttons button.next');
        this.prevButton  = $('#item-nav-buttons button.previous');
        
        this.activeRow = {};
        this.init();
        this.events();
    }
    
    init () {
        $('#log .modal__header .active-name').text($('#active-name').text())
    }

    events () {
        this.rows.click(this.makeActiveRow.bind(this))
        this.nextButton.click(this.getAdjacentItem.bind(this))
        this.prevButton.click(this.getAdjacentItem.bind(this))
        $(document).keyup(this.handleKeyPress.bind(this))
    }
    
    makeActiveRow (event) {
        this.rows.removeClass('active');
        event.currentTarget.classList.add('active');
        const id        =  this.table.find('.active .id')[0].innerText,
              date      =  this.table.find('.active .date')[0].innerText,
              added     = +this.table.find('.active .added')[0].innerText,
              removed   = +this.table.find('.active .removed')[0].innerText,
              comments  =  this.table.find('.active .comments')[0].innerText,
              row       = {
                  id       : id,
                  date     : date,
                  added    : added,
                  removed  : removed,
                  comments : comments
              };
        this.activeRow = row;
        $('html').addClass('options-open');
        //
        $('#active-log-id').html(id);
        $('.active-log-date').html(date);
        //
        $('#u-added').val(added);
        $('#u-removed').val(removed);
        $('#u-comment').val(comments);
    }
    
    closeOptions (event) {
        this.rows.removeClass('active');
        this.activeRow = {};
        $('html').removeClass('options-open');
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
                          76: () => $('.log--open').first().trigger('click'), //'L'
                          81: () => location.replace('/') //'Q'
                      },
                      options: {
                          27: () => _.closeOptions(),
                          67: () => $('.edit-comment--open').first().trigger('click'),//'C'
                          69: () => $('.edit-log--open').first().trigger('click') //'E'
                      }
                  };
            console.log(key);
            if (typeof(methods[state][key]) == 'function') {
                methods[state][key]()
            } else {
                return false
            }
        }
    }
}
