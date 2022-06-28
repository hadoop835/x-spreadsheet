import { h } from '../element';
import { cssPrefix } from '../../config';
import CommonChart from './common_chart';
import { unbind, bindClickoutside, unbindClickoutside } from '../event';
import QRCode from 'qrcode';
import { thinLineWidth } from '../../canvas/draw';

/**
 * 公共插入图片处理
 * 包含 二维码、图表
 */
export default class QrCodeChart extends CommonChart {
  /**
   * 
   * @param {*} sheet 
   * @param {*} css 样式
   * @param {*} id 
   * @param {*} element 元素
   * @param {*} viewFn 
   * @param {*} isHide 
   */
  constructor(sheet, id, viewFn, isHide = false) {
    super(sheet, id, "qrcode", viewFn, isHide);
    this.type="qrcode";
  }

  element(obj) {
    this.imgEl = h("img", '').attr("id", "qr-" + this.id).attr("src", "");
    return h("div", '').css("position", "absolute").css("bottom", "0px").css("width", "100%").css("height", "100%").children(
      this.imgEl,
    )
  }
  setImage() {
    const { imgEl, el, dragCircleEl } = this;
    QRCode.toDataURL("1111".toString(), { errorCorrectionLevel: 'H' }, function (err, url) {
      imgEl.attr("src", url);
    })
    el.css("width", "128px").css("height", "128px");
    dragCircleEl.hide();
  }

}