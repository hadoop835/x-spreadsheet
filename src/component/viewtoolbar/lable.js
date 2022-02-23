import Item from '../toolbar/item'; 
import InputText from './input';

export default class InputItem extends Item {
  element() {
    return super.element()
      .child(new InputText(this.tag))
      .on('click', () => this.change(this.tag));
  }

  setState(disabled) {
    this.el.disabled(disabled);
  }
}
