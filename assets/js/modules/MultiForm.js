import $ from 'jquery';

export default class Form {
    constructor (form, url, key) {
        this.forms = $('#' + form + '.multi-form form, #' + form + '.multi-form input.single');
        this.submitButton = $('#' + form + '.multi-form button.submit-all');
        this.key = key;
        this.url = url;
        this.events();
    }

    events () {
        this.submitButton.click(this.submitAll.bind(this))
    }
    submitAll (event) {
        let data = {},
            allFormsData = [];
        this.forms.each(function () {
            if ($(this).hasClass('single')) {
                data[$(this).attr('name')] = $(this).val();
            }
            else {
                if ($(this).find('input')[0].value === '') {}
                else allFormsData.push($(this).find('input').serialize());
            }
        })
        data[this.key] = allFormsData;
        $.post(this.url, data, () => {
            location.reload();
            return false;
        })
    }
}
