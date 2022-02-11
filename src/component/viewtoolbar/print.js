import ViewDropdownItem from './view_dropdown_item';
import DropdownPrint from './dropdown_print';

export default class Print extends ViewDropdownItem {
  constructor() {
    super('print');
  }

  getValue(it) {
    return it.key;
  }

  dropdown() {
    return new DropdownPrint();
  }
}
