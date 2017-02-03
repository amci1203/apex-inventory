import $ from 'jquery';

export default class MainTable {
    constructor () {
        this.identifier     = 'all';
        this.tables         = $('#all table');
        this.rows           = $('#all table .row');
        
        this.filterToggle   = $('#low-only');
        this.openItem       = $('#open');
        this.editItem       = $('#edit-item');
        
        this.activeRow = {}
        this.events();
    }
    events () {
        this.rows.dblclick(this.get.bind(this))
        this.rows.click(this.makeActiveRow.bind(this))

        $(document).keydown(this.handleKeyPresses.bind(this))
        this.openItem.click(this.get.bind(this))
        this.editItem.click(this.edit.bind(this))
        this.filterToggle.click(this.filterLowItems.bind(this))
        
        $('#confirm-delete').on('input', this.handleDeleteButtonState.bind(this))
        $('#record-date').on('input', this.handlePrintButtonState.bind(this))
        $(document).on('delete-item', this.erase.bind(this))
        $('#print-records').click(() => location.assign(`/items/print/${$('#record-date').val()}`));
    }
    makeActiveRow (event) {
        this.rows.removeClass('active');
        event.currentTarget.classList.add('active');
        const id       =  this.rows.filter('.active').find('.id')[0].innerText,
              low      = +this.rows.filter('.active').find('.low')[0].innerText,
              name     =  this.rows.filter('.active').find('.name')[0].innerText,
              stock    = +this.rows.filter('.active').find('.stock')[0].innerText,
              category =  this.rows.filter('.active').find('.category')[0].innerText,
              row      = {
                  id       : id,
                  category : category,
                  name     : name,
                  stock    : stock,
                  low      : low 
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
    closeSidebars (event) {
    if ($('html').hasClass('options-open')) {
        this.rows.removeClass('active');
        this.activeRow = {};
        $('html').removeClass('options-open');
    }
    if ($('html').hasClass('sidebar-open'))
        $('html').removeClass('sidebar-open');
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
    filterLowItems () {
        if (!$('html').hasClass('options-open')) {
            this.filterToggle.toggleClass('active');
            this.rows.not('.row--low').toggleClass('hidden');
            
            this.tables.toggleClass('hidden');
            this.tables.has('.row--low').toggleClass('hidden');
        }
    }
    
    handlePrintButtonState () {
        const confirmed = $('#record-date').val() != '';
        if (confirmed) $('#print-records').removeAttr('disabled')
        else $('#print-records').attr('disabled', 'disabled')
    }
    handleDeleteButtonState () {
        const confirmed = ($('#confirm-delete').val().trim().toUpperCase() == this.activeRow.name.toUpperCase());
        if (confirmed) $('#delete-item').removeAttr('disabled');
        else $('#delete-item').attr('disabled', 'disabled');
    }
    handleKeyPresses (event) {
        const _       = this,
              key     = String(event.keyCode),
              state   = $('html').hasClass('options-open') ? 'options' : 'main',
              methods = {
                main: {
                    27: () => $('#sidebar-toggle').trigger('click'), //ESC
                    67: () => $('#sidebar-toggle').trigger('click'), //'C'
                    72: () => $('.legend--toggle').first().trigger('click'), //'H'
                    75: () => $('#low-only').trigger('click'), //'K'
                    76: () => $('.logs--open').first().trigger('click'), //'L'
                    77: () => $('.new-multi--open').first().trigger('click'), //'M'
                    78: () => $('.new--open').first().trigger('click'), //'N'
                    80: () => $('.print--open').first().trigger('click'), //'P'
                },
                options: {
                    27: () => _.closeSidebars(), //ESC
                    67: () => $('#sidebar-toggle').trigger('click'), //'C'
                    68: () => $('.delete--open').first().trigger('click'), //'D'
                    69: () => $('.edit--open').first().trigger('click'), //'E'
                    72: () => $('.legend--toggle').first().trigger('click'), //'H'
                    76: () => $('.log--open').first().trigger('click'), // 'L'
                    79: () => _.get() //'O'
                }
            }
        const alwaysAllowedKeyCodes = ['72'],
              specialCase           = alwaysAllowedKeyCodes.indexOf(key) != -1;
        console.log(key);
        if ($('html').hasClass('modal-open') && !specialCase) {
//            event.stopPropagation()
        }
        else if (typeof(methods[state][key]) == 'function') {
            methods[state][key]()
        } else {
            return false
        }
    }
}
