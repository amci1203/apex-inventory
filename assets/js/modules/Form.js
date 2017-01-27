import $ from 'jquery';

export default class Form {
    constructor (form, url, key, method) {
        this.form    = $(`#${form}`);
        this.submit  = $(`#${form} button.submit`);
        this.data    = $(`#${form}`).find('input:not([type="submit"]), select, textarea');
        this.url     = `/items${url}`;
        this.key     = key;
        this.method  = method || 'POST';
        
        this.events();
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
                   if (tmp.indexOf(':') == -1) return tmp;
                   else {
                       if (i == 0) {
                           tmp.replace(':itemId', $('#active-id').html());
                       }
                       if (i == 1) {
                           tmp.replace(':logId', $('#active-log-id').html());
                       }
                       i++;
                   }
                  } while (tmp.indexOf(':') != -1);
                  return tmp;
              })();
        console.log(url); //HERE
        this.data.each(function () {
            console.log($(this).val())
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
            if (!res.error) location.reload()
            else {
                this.form.find('.error')[0].innerHTML = res.error;
            }
        })
    }
}
