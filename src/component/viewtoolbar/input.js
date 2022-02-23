import { Element, h } from '../element';
import { cssPrefix } from '../../config';

export default class InputText extends Element {
  constructor(name,text) {
    super('div', `btn-text-input`);
    this.iconNameEl = h('div', 'btn-input');
    let html="<input type='text'/>"
    this.lableNameEl = h('div', 'btn-text');
    this.child(this.iconNameEl.html(html));
    let label = '<span class="" style="margin-left: 8px; display: inline-block; line-height: 17px;">/</span><span class="">3</span><span class=""> &nbsp;&nbsp;(共86条)</span>'
    this.child(this.lableNameEl.html(label))
  }

  setName(name) {
    this.iconNameEl.className(`view-icon-img-${name}`);
  }
}
