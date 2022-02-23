import ViewDropdownItem from './view_dropdown_item';
import DropdownRecord from './dropdown_record';

export default class Record extends ViewDropdownItem {
  constructor() {
    super('record');
  }

  getValue(it) {
    return it.key;
  }

  dropdown() {
    return new DropdownRecord();
  }
}
