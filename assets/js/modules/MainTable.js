import $ from 'jquery';

export default class MainTable {
    constructor () {
        this.table        = $('#all');
        this.rows         = $('#all .row');
        this.getButton    = $('#all .row .name');
        this.itemTable    = $('#item');
        
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
        $('html').removeClass('options-open');
    }
    get (event) {
        const url = `/items/${this.activeRow.id}`;
        location.assign(url);
    }
    edit (event) {
        console.log(event.currentTarget)
        const url       = `/items/${this.activeRow.id}`,
              uName     =  $('#u-name').val()     || this.activeRow.name,
              uCategory =  $('#u-category').val() || this.activeRow.category,
              uLow      = +$('#u-low').val() || this.activeRow.low,
              data      = {
                  name: uName,
                  category: uCategory,
                  lowAt: uLow
              }
        $.ajax({
            url: url,
            method: 'PUT',
            data: { update: data },
            success: (data) => {
                console.log(data)
                location.reload()
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
    handleKeyPresses (keyCode) {
        if ($('html').hasClass('options-open') && !$('html').hasClass('modal-open')) {
            const _       = this,
                  key     = String(keyCode.keyCode),
                  methods = {
                      27: () => _.closeOptions() //ESC

                  };
            if (methods.hasOwnProperty(key) && typeof(methods[key]) == 'function') {
                methods[key]()
            } else return false
        }
    }
}
