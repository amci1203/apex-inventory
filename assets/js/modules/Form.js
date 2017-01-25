import $ from 'jquery';

export default class Form {
    constructor (form, url, key) {
        this.form    = $(`#${form}`);
        this.submit  = $(`#${form} button.submit`);
        this.data    = $(`#${form} input:not([type="submit"])`);
        this.url     = url;
        this.key     = key;
        this.events();
    }

    events () {
        this.submit.click(this.handle.bind(this))
    }

    handle (event) {
        const temp = {},
              data = {},
              url  = this.url.indexOf(':') == -1 ? this.url : this.url.replace(':itemId', $('#active-id').html())
        this.data.each(function () {
            let val = $(this).attr('type') == 'text' ? $(this).val() : +$(this).val();
            temp[$(this).attr('name')] = val;
        })
        data[this.key] = temp;
        $.post(url, data) 
        .success((data) => location.reload())
    }
}
