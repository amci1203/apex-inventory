import $ from 'jquery';

export default function DayReport () {
    
    let backDate    = '',
        forwardDate = '';
    
    const d        = new Date(),
          today    = d.toISOString().substring(0,10),
          current  = location.pathname.slice(-10),
          back     = $('#back'),
          forward  = $('#forward'),
          url      = `/items/print/:date`,
          go       = date => url.replace(':date', date);
    
    const setDates = (function () {
        const d  = new Date(current);
        d.setDate(d.getDate() - 1);
        backDate    = d.toISOString().substring(0,10)
        d.setDate(d.getDate() + 2);
        forwardDate = d.toISOString().substring(0,10)
        return null;
    })();
          
    function handleKeyPresses (event) {
      const code = String(event.keyCode),
            keys = {
                27: () => location.replace('/items'), //ESC
                37: () => location.replace(go(backDate)),// LEFT ARROW
                39: () => location.replace(go(forwardDate)) // RIGHT ARROW
            };
      console.log(code);
        if (current == today && code == 39) return false
      if ( typeof keys[event.keyCode] == 'function') keys[event.keyCode]();
      else return false
    }; 

    return (function () {
        $(document).keyup(handleKeyPresses);
        return { identifier: 'print' }
    })()
}