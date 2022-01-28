import DropdownItem from './dropdown_item';
import DropdownPrint from './dropdown_print';

export default class Print extends DropdownItem {
  constructor() {
    super('print');
  }

  getValue(it) {
    return it.key;
  }

  dropdown() {
    return null;//new DropdownPrint();
  }
}
