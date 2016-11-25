import $ from 'jquery';

export default class MainTable {
    constructor () {
        this.table = $('#all');
        this.row = $('#all .row');
        this.getButton = $('#all .row .name');
        this.deleteButton = $('#all .row button.delete');
        this.editButton = $('#all .row button.edit-name');
        this.warnButton = $('#all .row button.edit-warning');
        this.itemTable = $('#item');
        this.events();
    }

    events () {
        this.getButton.click(this.get.bind(this))
        this.editButton.click(this.edit.bind(this))
        this.warnButton.click(this.edit.bind(this))
        this.deleteButton.click(this.delete.bind(this))
    }

    get (event) {
        let url = '/items/' + event.currentTarget.previousElementSibling.innerText;
        location.assign(url);
    }
    
    edit (event) {
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
    
    delete (event) {
        let item = this.getButton.closest().prevObject[0].innerText;
        let confirmed = confirm('Are you sure you want to delete ' + item + '?', confirmed)
        if (confirmed) {
            let url = '/items/' + event.currentTarget.firstElementChild.innerText;
            $.ajax({
                url: url,
                method: 'DELETE',
                success: () => { location.reload() }
            })
        }
    }
}
