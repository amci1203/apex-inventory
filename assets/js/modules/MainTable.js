import $ from 'jquery';

export default class MainTable {
    constructor () {
        this.table = $('#all');
        this.row = $('#all .row');
        this.getButton = $('#all .row .name');
        this.deleteButton = $('#all .row button.delete');
        this.editButton = $('#all .row button.edit');
        this.itemTable = $('#item');
        this.events();
    }

    events () {
        this.getButton.click(this.get.bind(this))
        this.editButton.click(this.edit.bind(this))
        this.deleteButton.click(this.delete.bind(this))
    }

    get (event) {
        let url = '/items/' + event.currentTarget.previousElementSibling.innerText;
        location.assign(url);
    }
    
    edit (event) {
        let newItemName = '';
        while (newItemName === '') {
            newItemName = prompt('Please enter a new name for this item').trim();
        }
        let url = '/items/' + event.currentTarget.firstElementChild.innerText;
        $.ajax({
            url: url,
            method: 'PUT',
            data: {newName: newItemName},
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
