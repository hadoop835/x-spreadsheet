import Item from '../toolbar/item';
import ViewIcon from './view_icon';
import ViewText from './view_text';

export default class IconItem extends Item {
  element() {
    return super.element()
      .child(new ViewIcon(this.tag))
      .child(new ViewText(this.tag,this.value))
      .on('click', () => this.change(this.tag));
  }

  setState(disabled) {
    this.el.disabled(disabled);
  }
}
