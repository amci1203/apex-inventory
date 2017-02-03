import $ from 'jquery';

export default function DayReport () {
    let backDate    = '',
        forwardDate = '';
    
    const back     = $('#back'),
          forward  = $('#forward'),
          url      = `/items/print/:date`,
          setDate  = date => url.replace(':date', date);
          
    const setDates = (function () {
        const d  = new Date(location.pathname.slice(-10));
        d.setDate(d.getDate() - 1);
        backDate    = d.toISOString().substring(0,10)
        d.setDate(d.getDate() + 2);
        forwardDate = d.toISOString().substring(0,10)
        return null;
    })();
          
    function handle (event) {
      const code = String(event.keyCode),
            keys = {
                37: () => console.log(setDate(backDate)),// LEFT ARROW
                39: () => console.log(setDate(forwardDate)) // RIGHT ARROW
            };
      console.log(code);
      if ( typeof keys[event.keyCode] == 'function') keys[event.keyCode]();
      else return false
    }; 

    return (function () {
       $(document).keyup(handle);
        
        return { identifier: 'print' }
    })()
}