import $         from 'jquery';
import Modal     from './modules/Modal';
import Form      from './modules/Form';
import MultiForm from './modules/MultiForm';
import MainTable from './modules/MainTable';
import ItemTable from './modules/ItemTable';

import './modules/Menu';


const newModal      = new Modal('new', true);
const newForm       = new Form('new-item', '/items', 'item');

const newMultiModal = new Modal('new-multi', true);
const newMultiForm  = new MultiForm('new-multi', '/items/multi', 'items');

const logModal      = new Modal('log');
const logForm       = new Form('log-item', '/items/:itemId/push', 'log');

const deleteModal   = new Modal('delete');
const editModal     = new Modal('edit');

const multiLogModal = new Modal('logs');
const logMultiForm  = new MultiForm('logs', '/items/logs/multi', 'itemLogs');

const masterSheet   = new MainTable();
const itemSheet     = new ItemTable();

$('#delete-item').click(() => $(document).trigger('delete-item'));
