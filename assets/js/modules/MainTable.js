import $ from 'jquery';

export default class MainTable {
    constructor () {
        this.table        = $('#all');
        this.rows         = $('#all .row');
        this.getButton    = $('#all .row .name');
        this.deleteButton = $('#all .row button.delete');
        this.editButton   = $('#all .row button.edit-name');
        this.warnButton   = $('#all .row button.edit-warning');
        this.itemTable    = $('#item');
        
        this.activeRow = {}
        this.events();
    }
    events () {
        this.rows.dblclick(this.get.bind(this))
        this.rows.click(this.makeActiveRow.bind(this))
        this.editButton.click(this.edit.bind(this))
        this.warnButton.click(this.edit.bind(this))
        this.deleteButton.click(this.remove.bind(this))
        
//        $(document).on('sidebar-closed', this.closeOptions.bind(this))
        $(document).keyup(this.handleEsc.bind(this))
    }
    makeActiveRow (event) {
        event.currentTarget.classList.add('active');
        let id    =  this.table.find('.active .id')[0].innerText,
            name  =  this.table.find('.active .name')[0].innerText,
            stock = +this.table.find('.active .stock')[0].innerText,
            row = {
                id:    id,
                name:  name,
                stock: stock
            };
        this.activeRow = row;
        $('html').addClass('options-open');
    }
    closeOptions (event) {
        this.rows.removeClass('active');
        $('html').removeClass('options-open');
    }
    get (event)    {
        let url = '/items/' + this.activeRow.id;
        location.assign(url);
    }
    edit (event)   {
        let newValue = '';
        while (newValue === '') {
            if (event.currentTarget.innerText[0] === "!") {
                newValue = Number(prompt('Please enter a new value to warn for low stock.'));
            }
            else if (event.currentTarget.innerText[0] === undefined) {
                let value = prompt('Please enter a new name for this item');
                if (value !== null) newValue = value.trim();
                else newValue = null;
            }
        }
        if (newValue === null) return false;
        console.log(newValue);
        let url = '/items/' + event.currentTarget.firstElementChild.innerText;
        $.ajax({
            url: url,
            method: 'PUT',
            data: (() => {
                if (typeof(newValue) === 'number') {
                    return {update: {lowAt: newValue}}
                } else {
                    return {update: {name: newValue}}
                }
            })(),
            success: () => { location.reload() }
        })
    }
    remove (event) {
        let item = this.getButton.closest().prevObject[0].innerText;
        let confirmed = confirm('Are you sure you want to delete ' + item + '?');
        if (confirmed) {
            let url = '/items/' + event.currentTarget.firstElementChild.innerText;
            $.ajax({
                url: url,
                method: 'DELETE',
                success: () => { location.reload() }
            })
        }
    }
    handleEsc (key) {
        if ($('html').hasClass('options-open') && key.keyCode == 27) {
            this.closeOptions()
        } else return false;
    }
}
