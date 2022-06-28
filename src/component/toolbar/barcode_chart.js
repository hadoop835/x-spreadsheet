import { h } from '../element';
import { cssPrefix } from '../../config';
import CommonChart from './common_chart';
import { unbind, bindClickoutside, unbindClickoutside } from '../event';
import JsBarcode from 'jsbarcode';

/**
 * 公共插入图片处理
 * 包含 二维码、图表
 */
export default class BarCodeChart extends CommonChart{
  /**
   * 
   * @param {*} sheet 
   * @param {*} css 样式
   * @param {*} id 
   * @param {*} element 元素
   * @param {*} viewFn 
   * @param {*} isHide 
   */
  constructor(sheet,id, viewFn, isHide = false) {
    super(sheet,id,"barcode",viewFn,isHide); 
    this.type="barcode";
  }

  element(obj){
    return h("div",'').css("position","absolute").css("bottom","0px").css("width","100%").css("height","100%").children(
      h("img",'').attr("id","bar-"+obj.id).attr("src","")
    )
  }
  setImage(){ 
    JsBarcode("#bar-"+this.id, "1234567890128", {
      lineColor: "#0aa",
      height:40,
      displayValue: true,
      fontSize:16,
    });
  }
  
}