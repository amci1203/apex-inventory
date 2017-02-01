import $ from 'jquery';

export default class MultiForm {
    constructor (form, url, key) {
        this.forms   = $(`#${form} .multi-form form`);
        this.submit  = $(`#${form} .multi-form button.submit-all`);
        this.singles = $(`#${form} input.single`)
        this.url     = `/items${url}`;
        this.key     = key;
        
        this.init();
        this.events();
    }
    
    init () {
        this.forms.attr('action', 'javacript:')
    }

    events () {
        this.submit.click(this.handle.bind(this))
    }
    handle (event) {
        let data = {},
            all  = [];
        
        this.singles.each(function () {
            data[$(this).attr(name)] = $(this).val()
        })
        
        this.forms.each(function () {
            let temp   = {},
                inputs = $(this).find('input');
            if (inputs.eq(0).val() != '') {
                inputs.each(function () {
                    let val = $(this).attr('type') == 'number' ? +$(this).val() : $(this).val().trim();
                    temp[$(this).attr('name')] = val;
                })
                all.push(temp);
            }
        })
        
        data[this.key] = all;
        
        $.post(this.url, data, () => location.reload())
    }
}
