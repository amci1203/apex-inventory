import $         from 'jquery';
import Form      from './modules/Form';
import Modal     from './modules/Modal';
import MultiForm from './modules/MultiForm';
import MainTable from './modules/MainTable';
import ItemTable from './modules/ItemTable';
import DayReport from './modules/DayReport';

import './modules/Menu';

const sheet = $('#page-id').html() == 'main' ? new MainTable() : (() => {
    const sheet = $('#page-id').html() == 'item' ? new ItemTable() : DayReport();
    return sheet;
})()

const logModal      = new Modal('log', true),
      logForm       = new Form('log-item', '/:itemId', 'log' ),
      legend        = new Modal('legend');

if (sheet.identifier == 'all') {
    const newModal      = new Modal('new',       true),
          newMultiModal = new Modal('new-multi', true),
          logMultiModal = new Modal('logs',      true),
          editModal     = new Modal('edit',      true),
          printModal    = new Modal('print',     true),
          deleteModal   = new Modal('delete',    true);

    const newForm       = new Form('new-item', '', 'item');

    const newMultiForm  = new MultiForm('new-multi', '/multi', 'items'),
          logMultiForm  = new MultiForm('logs', '/logs/multi', 'itemLogs');

    $('#delete-item').click(() => $(document).trigger('delete-item'));
}
if (sheet.identifier == 'item') {
    const editLogModal     = new Modal('edit-log', true),
          editCommentModal = new Modal('edit-comment', true);
    
    const editComments     = new Form('edit-comment-form', '/:itemId/:logId', 'uLog', 'PUT');
}