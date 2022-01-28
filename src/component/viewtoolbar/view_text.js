import { Element, h } from '../element';
import { cssPrefix } from '../../config';

export default class ViewText extends Element {
  constructor(name,text) {
    super('div', `view-text`);
    this.iconNameEl = h('div', `view-text-${name}`);
    this.child(this.iconNameEl.html(text));
  }

  setName(name) {
    this.iconNameEl.className(`view-icon-img-${name}`);
  }
}
