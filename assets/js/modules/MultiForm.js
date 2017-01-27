import $ from 'jquery';

export default class MultiForm {
    constructor (form, url, key) {
        this.forms   = $(`#${form} .multi-form form`);
        this.submit  = $(`#${form} .multi-form button.submit-all`);
        this.singles = $(`#${form} input.single`)
        this.url     = `/items${url}`;
        this.key     = key;
        this.events();
    }

    events () {
        this.submit.click(this.submitAll.bind(this))
    }
    submitAll (event) {
        let data = {},
            all  = [];
        
        this.singles.each(function () {
            data[$(this).attr(name)] = $(this).val()
        })
        
        this.forms.each(function () {
            let temp   = {},
                inputs = $(this).find('input');
            if (inputs[0].value != '') {
                inputs.each(function () {
                    let val = $(this).attr('type') == 'text' ? $(this).val() : +$(this).val();
                    temp[$(this).attr('name')] = val;
                })
                all.push(temp);
            }
        })
        
        data[this.key] = all;
        
        $.post(this.url, data, () => location.reload())
    }
}
