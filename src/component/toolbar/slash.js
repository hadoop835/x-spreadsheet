import ToggleItem from './toggle_item';
/**
 * 单元格斜线
 */
export default class Slash extends ToggleItem {
  constructor() {
    super('slash');
  }
  
  change(){
      alert(1);
  }
}