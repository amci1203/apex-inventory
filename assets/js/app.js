import $         from 'jquery';
import Modal     from './modules/Modal';
import Form      from './modules/Form';
import MultiForm from './modules/MultiForm';
import MainTable from './modules/MainTable';
import ItemTable from './modules/ItemTable';

import './modules/Menu';


const newModal      = new Modal('new',       true);
const newMultiModal = new Modal('new-multi', true);
const logModal      = new Modal('log',       true);
const multiLogModal = new Modal('logs',      true);
const editModal     = new Modal('edit',      true);
const deleteModal   = new Modal('delete',    true);

const newForm       = new Form('new-item', '/items', 'item');
const logForm       = new Form('log-item', '/items/:itemId/push', 'log');

const newMultiForm  = new MultiForm('new-multi', '/items/multi', 'items');
const logMultiForm  = new MultiForm('logs', '/items/logs/multi', 'itemLogs');

const sheet = location.pathname == '/items' ? new MainTable() : new ItemTable();

$('#delete-item').click(() => $(document).trigger('delete-item'));
