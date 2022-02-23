import ViewDropdownItem from './view_dropdown_item';
import DropdownExport from './dropdown_export';

export default class Export extends ViewDropdownItem {
  constructor() {
    super('export');
  }

  getValue(it) {
    return it.key;
  }

  dropdown() {
    return new DropdownExport();
  }
}
