import Dropdown from './dropdown';
import Icon from './icon';
import { h } from './element';
import { cssPrefix } from '../config';

export default class DropdownBarCode extends Dropdown {
  constructor(codes) {
    const nformulas = codes.map(it => h('div', `${cssPrefix}-item`)
      .on('click', () => {
        this.hide();
        this.change(it);
      })
      .child(it.value));
    super(new Icon('barcode'), '180px', true, 'bottom-left', ...nformulas);
  }
}
