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
        $('#edit').click(() => {})
        $(document).on('delete-item', this.delete.bind(this))
    }
    makeActiveRow (event) {
        event.currentTarget.classList.add('active');
        const row = {
            id   :  this.table.find('.active .id')[0].innerText,
            name :  this.table.find('.active .name')[0].innerText,
            stock: +this.table.find('.active .stock')[0].innerText,
        };
        this.activeRow = row;
        $('html').addClass('options-open');
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
        const url = `/items/${this.activeRow.id}`;
        $.ajax({
            url: url,
            method: 'PUT',
            data: { update: data },
            success: () => { location.reload() }
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
