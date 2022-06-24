import DropdownItem from './dropdown_item';
import DropdownBarcode from '../dropdown_barcode';
/**
 * 条形码和二维码
 */
export default class Barcode extends DropdownItem {
  constructor() {
    super('barcode');
  }

  getValue(it) {
    return it.key;
  }

  dropdown() {
    return new DropdownBarcode([{"key":"qrcode","value":"二维码"}, {"key":"barcode","value":"条形码"}]);
  }
}
