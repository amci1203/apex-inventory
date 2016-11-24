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

    postSubmitHandler (event) {
        let data = this.data.serialize();
        $.post(this.url, { item: data }, () => {
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
            'post': () => { return this.postSubmitHandler() },
            'get': () =>  { return this.getSubmitHandler() },
            'delete': () =>  { return this.deleteSubmitHandler() }
        };

        if (typeof methods[method] !== 'function') {
            throw new Error('Invalid method.');
        }

        return methods[method]();
    }

}
