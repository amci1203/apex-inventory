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
            console.log($(this).val())
            let val = $(this).attr('type') == 'number' ? +$(this).val() : $(this).val().trim(); 
            temp[$(this).attr('name')] = val;
        })
        data[this.key] = temp;
        $.post(url, data) 
        .success((res) => {
            if (!res.error) location.reload()
            else {
                this.form.find('.error')[0].innerHTML = res.error;
            }
        })
    }
}
