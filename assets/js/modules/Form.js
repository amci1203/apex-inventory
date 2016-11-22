import $ from 'jquery';

export default class Form {
    constructor (form, method, url) {
        this.form = $('#' + form);
        this.submitButton = $('#' + form + ' > button.submit');
        this.method = method;
        this.data = $('#' + form + ' input:not([type="submit"])');
        this.url = url;
        this.events();
    }

    events () {
        this.submitButton.click(this.getFormMethod.bind(this))
    }

    postSubmitHandler () {
        let data = this.data.serialize();
        console.log(data);
        $.post(this.url, { item: data }, () => {
            this.form.submit()
        }, 'json')
        return false;
    }

    getSubmitHandler () {
        let body = this.data.serialize();
        $.get(this.url, (data) => {
            alert(data);
        }, 'json')
    }

    getFormMethod () {
        let method = this.method;
        let methods = {
            'post': () => { return this.postSubmitHandler() },
            'get': () =>  { return this.getSubmitHandler() }
        };

        if (typeof methods[method] !== 'function') {
            throw new Error('Invalid method.');
        }

        return methods[method]();
    }

    formReqBody (callback) {
        let body = {};
        this.data.each(() => {
            let key = $(this).attr('name'),
                val = $(this).val()
            body[key] = val;
        })
        callback(body)
    }

    clearForm () {
        this.data.val('');
        return false;
    }
}
