import { Element, h } from '../element';
import { cssPrefix } from '../../config';

export default class ViewIcon extends Element {
  constructor(name) {
    super('div', `${cssPrefix}-icon`);
    this.iconNameEl = h('div', `view-icon-img-${name}`);
    this.child(this.iconNameEl);
  }

  setName(name) {
    this.iconNameEl.className(`view-icon-img-${name}`);
  }
}
