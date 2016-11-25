import Modal from './modules/Modal';
import Form from './modules/Form';
import MainTable from './modules/MainTable';
import ItemTable from './modules/ItemTable';

const newForm = new Form('new-item', 'post', '/items');

const modal = new Modal('new');

const masterSheet = new MainTable();
const itemSheet = new ItemTable();
