import $ from 'jquery';

export default class Modal {
    constructor (modalName , hasForm) {
        this.id           = modalName.trim();
        this.hasForm      = hasForm;
        this.modal        = $(`#${this.id}`);
        this.openTrigger  = $(`.${this.id}--open`);
        this.closeTrigger = $(`.${this.id}--close`);
        this.events();
    }

    events () {
        this.openTrigger.click(this.openModal.bind(this));
        this.closeTrigger.click(this.closeModal.bind(this));
        this.modal.keyup(this.handleKeyPress.bind(this));
    }

    openModal () {
        $(document).trigger('modal-open', this.id);
        this.modal.trigger('modal-open');
        $('html').addClass('modal-open');
        this.modal.addClass('modal--open');
        if (this.hasForm) {
            setTimeout(() => this.modal.find('input, select, textarea')[0].focus(), 100);
        }
        return false;
    }
    closeModal () {
        $(document).trigger('modal-close', this.id);
        this.modal.trigger('modal-close');
        $('html').removeClass('modal-open');
        this.modal.removeClass('modal--open');
        return false;
    }
    handleKeyPress (event) {
        if (event.keyCode === 27) {
            this.modal.removeClass('modal--open');
            $('html').removeClass('modal-open');
        };
    }
}
