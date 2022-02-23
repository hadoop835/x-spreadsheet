import ExtendItem from './extend_item'; 
import { h } from '../element';
import { cssPrefix } from '../../config';

export default class ExtendToggleItem extends ExtendItem {
  element() {
    const { tag} = this;  
    let img = h('div', `${cssPrefix}-icon ${tag}`);
    let input = h('input', ``).attr("type","file").attr("id",`${tag}`).hide().on("change",(env)=>{this.onchange(env)});
    img.children(input);
    return super.element()
      .child(img)
      .on('click', () => this.click());
  }

  onchange(env) {
    this.upload(this.tag,env);
  }

  click() {
    this.change(this.tag, this.toggle());
  }

  setState(active) {
    this.el.active(active);
  }

  toggle() {
    return this.el.toggle();
  }

  active() {
    return this.el.hasClass('active');
  }
}
