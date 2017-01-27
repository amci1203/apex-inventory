import $ from 'jquery';

export default class MainTable {
    constructor () {
        this.identifier = 'all';
        this.table      = $('#all');
        this.rows       = $('#all .row');
        this.getButton  = $('#all .row .name');
        this.itemTable  = $('#item');
        
        this.activeRow = {}
        this.events();
    }
    events () {
        this.rows.dblclick(this.get.bind(this))
        this.rows.click(this.makeActiveRow.bind(this))

        $(document).keyup(this.handleKeyPresses.bind(this))
        $('#open').click(this.get.bind(this))
        $('#edit-item').click(this.edit.bind(this))
        
        $('#confirm-delete').on('input', this.handleDeleteButtonState.bind(this))
        $(document).on('delete-item', this.erase.bind(this))
    }
    makeActiveRow (event) {
        this.rows.removeClass('active');
        event.currentTarget.classList.add('active');
        const id       =  this.table.find('.active .id')[0].innerText,
              low      = +this.table.find('.active .low')[0].innerText,
              name     =  this.table.find('.active .name')[0].innerText,
              stock    = +this.table.find('.active .stock')[0].innerText,
              category =  this.table.find('.active .category')[0].innerText,
              row      = {
                  id      : id,
                  category: category,
                  name    : name,
                  stock   : stock,
                  low     : low 
              };
        this.activeRow = row;
        $('html').addClass('options-open');
        //
        $('#active-id').html(id);
        $('.active-name').html(name);
        $('.active-stock').html(stock);
        //
        $('#u-name').val(name);
        $('#u-category').val(category);
        $('#u-low').val(low);
    }
    closeOptions (event) {
        this.rows.removeClass('active');
        this.activeRow = {};
        $('html').removeClass('options-open');
    }
    get (event) {
        const url = `/items/${this.activeRow.id}`;
        location.assign(url);
    }
    edit (event) {
        const url       = `/items/${this.activeRow.id}`,
              uName     =  $('#u-name').val()     || this.activeRow.name,
              uCategory =  $('#u-category').val() || this.activeRow.category,
              uLow      = +$('#u-low').val()      || this.activeRow.low,
              data      = {
                  name     : uName,
                  category : uCategory,
                  lowAt    : uLow
              }
        $.ajax({
            url: url,
            method: 'PUT',
            data: { update: data },
            success: (res) => {
                if (!res.error) location.reload()
                else {
                    $('#edit-form').find('.error')[0].innerHTML = res.error;
                }
            }
        })
    }
    erase (event) {
        const url = `/items/${this.activeRow.id}`;
        $.ajax({
            url: url,
            method: 'DELETE',
            success: () => { location.reload() }
        })
    }
    handleDeleteButtonState () {
        const confirmed = ($('#confirm-delete').val().trim().toUpperCase() == this.activeRow.name.toUpperCase());
        if (confirmed) $('#delete-item').removeAttr('disabled')
        else $('#delete-item').attr('disabled', 'disabled')
    }
    handleKeyPresses (event) {
        console.log('FIRED')
        console.log($('html').hasClass('modal-open'))
        if ($('html').hasClass('modal-open')) {
            event.stopPropagation();
        } else {
            const _       = this,
                  key     = String(event.keyCode),
                  state   = $('html').hasClass('options-open') ? 'main' : 'options',
                  methods = {
                    main: {
                        27: () => _.closeOptions(), //ESC
                        67: () => $('#sidebar-toggle').trigger('click'), //'C'
                        68: () => $('.delete--open').first().trigger('click'), //'D'
                        69: () => $('.edit--open').first().trigger('click'), //'E'
                        76: () => $('.log--open').first().trigger('click'), // 'L'
                        79: () => _.get() //'O'
                    },
                    options: {
                        67: () => $('#sidebar-toggle').trigger('click'), //'C'
                        78: () => $('.new--open').first().trigger('click'), //'N'
                        77: () => $('.new-multi--open').first().trigger('click'), //'M'
                        76: () => $('.logs--open').first().trigger('click') //'L'
                    }
                }
            console.log(key);
            if (typeof(methods[state][key]) == 'function') {
                methods[state][key]()
            } else {
                return false
            }
        }
    }
}
