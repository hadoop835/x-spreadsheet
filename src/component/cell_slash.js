import { h } from './element';
import Button from './button';
import { bindClickoutside, unbindClickoutside } from './event';
import { cssPrefix } from '../config';
import { t } from '../locale/locale';

/**
 * 单元格斜线
 */
export default class CellSlash {

  constructor() {
    this.cellSlashWarpEl = h('div', `${cssPrefix}-modal-warp`);
    this.cellSlashModalEl = h('div', `${cssPrefix}-modal modal-default`);
    this.cellSlashContentEl = h('div', `${cssPrefix}-modal-content`);
    this.cellSlashCloseEl = h('button', `${cssPrefix}-modal-close`).html(`<span class="">×</span>`).on('click', () => this.btnClick('cancel'));
    this.cellSlashHeaderEl = h('div', `header`).html(`<div class="title">单元格斜线配置</div>`);
    this.cellSlashInputEl = h('input', `${cssPrefix}-input`).attr("id", "x-spreadsheet-cell-slash-text");
    this.cellSlashLefttopE = h('input', ``).attr("type", "radio").attr("id", "x-spreadsheet-line-cell-lefttop")
      .attr("name", "x-spreadsheet-cell-line-start").attr("value", "lefttop").attr("checked", "checked");
    this.cellSlashRadioEl = h('div', `${cssPrefix}-radio`).children(this.cellSlashLefttopE,
      h('label', ``).css("display", "inline-block").attr("for", "x-spreadsheet-line-cell-lefttop").html("从左上角作为起点划线"));
    this.cellSlashLeftbottomE = h('input', ``).attr("type", "radio").attr("id", "x-spreadsheet-line-cell-leftbottom")
      .attr("name", "x-spreadsheet-cell-line-start").attr("value", "leftbottom");
    this.cellSlashRadioBottomEl = h('div', `${cssPrefix}-radio`).css("margin-left", "25px").children(this.cellSlashLeftbottomE,
      h('label', ``).css("display", "inline-block").attr("for", "x-spreadsheet-line-cell-leftbottom").html("从左下角作为起点划线"));
    this.cellSlashSpinEl = h('div', `spin`).css("height", "100%").children(
      h('div', ``).css("margin", "0px 0px 2px 2px").html("斜线文字以|分隔，如：学生|学科"),
      h('div', ``).children(this.cellSlashInputEl),
      this.cellSlashRadioEl,
      this.cellSlashRadioBottomEl,
    )
    this.cellSlashBodyEl = h('div', `body`).children(this.cellSlashSpinEl);
    this.cellSlashButtonOkEl =
      this.cellSlashFooterEl = h('div', `footer`).children(
        h('button', `${cssPrefix}-button`).children(h('span', ``).html("关闭")).on('click', () => this.btnClick('cancel')),
        h('button', `${cssPrefix}-button`).children(h('span', ``).html("确认")).on('click', () => this.btnClick('ok'))
      );
    this.cellSlashWarpEl = h('div', `${cssPrefix}-modal-warp`).children(
      this.cellSlashModalEl.css("width", "450px").css("height", "250px").css("top", "10%").children(
        this.cellSlashContentEl.children(
          this.cellSlashCloseEl,
          this.cellSlashHeaderEl,
          this.cellSlashBodyEl,
          this.cellSlashFooterEl,
        ),
        h('div', `${cssPrefix}-modal-clear`)
      ),
    )
    this.el = h('div', `${cssPrefix}-cell-slash`).css("display", "block").children(
      h('div', `${cssPrefix}-modal-mask`),
      this.cellSlashWarpEl,
    ).hide();
    this.ci = null;
    this.ri = null;
    this.context = null;
    this.redios = null;
  }

  btnClick(it) {
    if (it === 'ok') {
      const { ri, ci, context, redios } = this;
      let radios = document.getElementsByName("x-spreadsheet-cell-line-start");
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked == true) {
          this.redios = radios[i].value;
        }
      }
      this.context = document.getElementById("x-spreadsheet-cell-slash-text").value;
      if (this.ok) {
      debugger
        this.ok(ri, ci, this.context, this.redios);
      }
    }
    this.hide();
  }

  setOffset(v) {
    this.el.offset(v).show();
  }

  show() {
    this.el.show();
  }

  hide() {
    this.el.hide();
    unbindClickoutside(this.el);
  }
}
