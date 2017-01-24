import $ from 'jquery';

export default (function Menu () {
    const toggle  = $('#sidebar-toggle');
    function toggleSidebar () {
      $('html').toggleClass('sidebar-open scroll-lock');
        if ($('html').hasClass('sidebar-open')) {
            $(document).trigger('sidebar-closed');
        } else {
            $(document).trigger('sidebar-opened');
        }
    }
    function handleEsc (key) {
        if ($('html').hasClass('sidebar-open') && key.keyCode == 27) {
            $('html').removeClass('sidebar-open scroll-lock');
            $(document).trigger('sidebar-closed');
        } else return false
    }
    
    return (function () {
        toggle.click(toggleSidebar);
        $(document).keyup(handleEsc);
    })()
})()