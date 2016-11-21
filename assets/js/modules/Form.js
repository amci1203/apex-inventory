import $ from 'jquery';

export default class Form {
    constructor (form) {
        this.form = $('#' + form);
        this.data = $('#' + form + ' input')
    }
}