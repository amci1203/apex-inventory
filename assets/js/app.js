import $         from 'jquery';
import Modal     from './modules/Modal';
import Form      from './modules/Form';
import MultiForm from './modules/MultiForm';
import MainTable from './modules/MainTable';
import ItemTable from './modules/ItemTable';


const newModal      = new Modal('new');
const newForm       = new Form('new-item', '/items/new', 'post', 'item');

const multiNewModal = new Modal('new-multi');
const newMultiForm  = new MultiForm('new-multi', '/items/new/multi', 'items');

const logModal      = new Modal('log');
const logForm       = new Form('log-item', '/items/:itemId/push', 'post', 'log');

const multiLogModal = new Modal('logs');
const logMultiForm  = new MultiForm('logs', '/items/logs/multi', 'itemLogs');

const masterSheet   = new MainTable();
const itemSheet     = new ItemTable();

$('#sidebar-toggle').click(() => {
    $('html').toggleClass('sidebar-open scroll-lock');
})
