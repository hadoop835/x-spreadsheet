import Dropdown from '../dropdown';
import { h } from '../element'; 
import { cssPrefix } from '../../config';
import { PRINT } from './page';
import ViewIcon from './view_icon';

export default class DropdownPrint extends Dropdown {
  constructor() {
    const viewIcon = new ViewIcon("print");
    const prints = PRINT.map(it => h('div', `${cssPrefix}-item`)
      .on('click', () => {
        //this.setTitle(it.title);
        this.change(it);
      })
      .child(it.title));
    super(viewIcon, '160px', true, 'bottom-left', ...prints);
  }
}
