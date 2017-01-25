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

        $(document).keyup(this.handleEsc.bind(this))
        $('#open').click(this.get.bind(this))
        $('#edit-item').click(this.edit.bind(this))
        $(document).on('delete-item', this.delete.bind(this))
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
    delete (event) {
        const url = `/items/${this.activeRow.id}`
        $.ajax({
            url: url,
            method: 'DELETE',
            success: () => { location.reload() }
        })
    }
    handleEsc (key) {
        if ($('html').hasClass('options-open') && key.keyCode == 27) {
            this.closeOptions()
        } else return false;
    }
}
