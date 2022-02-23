import Dropdown from '../dropdown';
import { h } from '../element'; 
import { cssPrefix } from '../../config';
import { PAGE } from './page';

export default class DropdownRecord extends Dropdown {
  constructor() {
    const pages = PAGE.map(it => h('div', `${cssPrefix}-item`)
      .on('click', () => {
        this.setTitle(it.title);
        this.change(it);
      })
      .child(it.title));
    super(PAGE[0].title, '160px', true, 'bottom-left', ...pages);
  }
}
