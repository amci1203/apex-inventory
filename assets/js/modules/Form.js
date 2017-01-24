import $ from 'jquery';

export default class Form {
    constructor (form, url, method, key) {
        this.form = $('#' + form);
        this.submitButton = $('#' + form + ' button.submit');
        this.method = method;
        this.data = $('#' + form + ' input:not([type="submit"])');
        this.url = url;
        this.key = key;
        this.events();
    }

    events () {
        this.submitButton.click(this.getFormMethod.bind(this))
    }

    postSubmitHandler (event) {
        let data = {},
            url = '';
        data[this.key] = this.data.serialize();
        if (this.url.indexOf(':') !== -1) {
            url = this.url.replace(':itemId', event.currentTarget.firstElementChild.innerText);
        }
        else { url = this.url; }
        $.post(url, data, () => {
            console.log('POST request done');
         }, 'json')
        location.reload();
        return false;
    }

    getSubmitHandler (event) {
        $.get(this.url, (data) => {
            alert(data);
        }, 'json')
    }

    getFormMethod () {
        let method = this.method;
        let methods = {
            'post': () => { return this.postSubmitHandler(event) },
            'get': () =>  { return this.getSubmitHandler(event) },
            'delete': () =>  { return this.deleteSubmitHandler(event) }
        };

        if (typeof methods[method] !== 'function') {
            throw new Error('Invalid method.');
        }

        return methods[method]();
    }

}
