import $ from 'jquery';

export default class Form {
    constructor (form, url, key, method) {
        this.form    = $(`#${form}`);
        this.submit  = $(`#${form} button.submit`);
        this.data    = $(`#${form}`).find('input:not([type="submit"]), select, textarea');
        this.url     = `/items${url}`;
        this.key     = key;
        this.method  = method || 'POST';
        
        this.init();
        this.events();
    }
    
    init () {
        this.form.attr('action', 'javacript:')
    }

    events () {
        this.submit.click(this.handle.bind(this))
    }

    handle (event) {
        const temp = {},
              data = {},
              url  = (() => {
                  let i   = 0,
                      tmp = this.url;
                  do {
                   if (tmp.indexOf(':') == -1) break;
                   else {
                       if (i == 0) {
                           tmp = tmp.replace(':itemId', $('#active-id').html());
                       }
                       if (i == 1) {
                           tmp = tmp.replace(':logId', $('#active-log-id').html());
                       }
                       i++;
                   }
                  } while (tmp.indexOf(':') != -1);
                  return tmp;
              })();
        this.data.each(function () {
            let val = $(this).attr('type') == 'number' ? +$(this).val() : $(this).val().trim(); 
            temp[$(this).attr('name')] = val;
        })
        data[this.key] = temp;
        $.ajax({
            url: url,
            method: this.method,
            data: data,
        }) 
        .success(res => {
            if (!res.error) {
                location.reload();
                return false
            }
            else {
                this.form.find('.error')[0].innerHTML = res.error;
            }
        })
    }
}
