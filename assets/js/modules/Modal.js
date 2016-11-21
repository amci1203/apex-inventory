import $ from 'jquery';

export default class Modal {
    constructor (modalName) {
        this.modal = $('#' + modalName);
        this.openTrigger = $('.' + modalName + '--open');
        this.closeTrigger = $('.' + modalName + '--close');
        this.events();
    }

    events () {
        this.openTrigger.click(this.openModal.bind(this));
        this.closeTrigger.click(this.closeModal.bind(this));
        $(document).keyup(this.handleKeyPress.bind(this));
    }

    openModal () {
        this.modal.addClass('modal--open');
        return false;
    }
    closeModal () {
        this.modal.removeClass('modal--open');
        return false;
    }
    handleKeyPress (key) {
        if (key.keyCode === 27) this.modal.removeClass('modal--open');
    }
}