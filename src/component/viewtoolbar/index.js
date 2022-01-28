/* global window */

import First from './first';
import End from './end';
import Next from './next';
import Last from './last';
import VPrint from './print';
import Valign from '../toolbar/valign';
import Autofilter from '../toolbar/autofilter';
import Bold from '../toolbar/bold';
import Italic from '../toolbar/italic';
import Strike from '../toolbar/strike';
import Underline from '../toolbar/underline';
import Border from '../toolbar/border';
import Clearformat from '../toolbar/clearformat';
import Paintformat from '../toolbar/paintformat';
import TextColor from '../toolbar/text_color';
import FillColor from '../toolbar/fill_color';
import FontSize from '../toolbar/font_size';
import Font from '../toolbar/font';
import Format from '../toolbar/format';
import Formula from '../toolbar/formula';
import Freeze from '../toolbar/freeze';
import Merge from '../toolbar/merge';
import Print from '../toolbar/print';
import Textwrap from '../toolbar/textwrap';
import More from '../toolbar/more';
import Item from '../toolbar/item';

import { h } from '../element';
import { cssPrefix } from '../../config';
import { bind } from '../event';

function buildDivider() {
  return h('div', `${cssPrefix}-toolbar-divider`);
}

function initBtns2() {
  this.btns2 = [];
  this.items.forEach((it) => {
    if (Array.isArray(it)) {
      it.forEach(({ el }) => {
        const rect = el.box();
        const { marginLeft, marginRight } = el.computedStyle();
        this.btns2.push([el, rect.width + parseInt(marginLeft, 10) + parseInt(marginRight, 10)]);
      });
    } else {
      const rect = it.box();
      const { marginLeft, marginRight } = it.computedStyle();
      this.btns2.push([it, rect.width + parseInt(marginLeft, 10) + parseInt(marginRight, 10)]);
    }
  });
}

function moreResize() {
  const {
    el, btns, moreEl, btns2,
  } = this;
  const { moreBtns, contentEl } = moreEl.dd;
  el.css('width', `${this.widthFn()}px`);
  const elBox = el.box();

  let sumWidth = 160;
  let sumWidth2 = 12;
  const list1 = [];
  const list2 = [];
  btns2.forEach(([it, w], index) => {
    sumWidth += w;
    if (index === btns2.length - 1 || sumWidth < elBox.width) {
      list1.push(it);
    } else {
      sumWidth2 += w;
      list2.push(it);
    }
  });
  btns.html('').children(...list1);
  moreBtns.html('').children(...list2);
  contentEl.css('width', `${sumWidth2}px`);
  if (list2.length > 0) {
    moreEl.show();
  } else {
    moreEl.hide();
  }
}

function genBtn(it) {
  const btn = new Item();
  btn.el.on('click', () => {
    if (it.onClick) it.onClick(this.data.getData(), this.data);
  });
  btn.tip = it.tip || '';

  let { el } = it;

  if (it.icon) {
    el = h('img').attr('src', it.icon);
  }

  if (el) {
    const icon = h('div', `${cssPrefix}-icon`);
    icon.child(el);
    btn.el.child(icon);
  }

  return btn;
}

export default class ViewToolbar {
  
  constructor(data, widthFn, isHide = false) {
    this.data = data;
    this.change = () => {};
    this.widthFn = widthFn;
    this.isHide = isHide;
    const style = data.defaultStyle();
    this.items = [
      [
        this.first = new First(), 
      ],
      buildDivider(),
      [
        this.next = new Next(),
      ],
      buildDivider(),
      [
        this.last = new Last(),
        this.end = new End(),
      ],
      buildDivider(),
      [
        this.printEl = new VPrint (),
      ],
      
      
      
    ];

    this.el = h('div', `${cssPrefix}-toolbar`);
    this.btns = h('div', `${cssPrefix}-toolbar-btns`);

    this.items.forEach((it) => {
      if (Array.isArray(it)) {
        it.forEach((i) => {
          this.btns.child(i.el);
          i.change = (...args) => {
            this.change(...args);
          };
        });
      } else {
        this.btns.child(it.el);
      }
    });

    this.el.child(this.btns);
    if (isHide) {
      this.el.hide();
    } else {
      this.reset();
      setTimeout(() => {
        initBtns2.call(this);
        moreResize.call(this);
      }, 0);
      bind(window, 'resize', () => {
        moreResize.call(this);
      });
    }
  }

  paintformatActive() {
    return this.paintformatEl.active();
  }

  paintformatToggle() {
    this.paintformatEl.toggle();
  }

  trigger(type) {
    this[`${type}El`].click();
  }

  resetData(data) {
    this.data = data;
    this.reset();
  }
//last:"上一页",next:"下一页",:"首页",end:"末页"
  reset() {
    if (this.isHide) return;
    const { data } = this;
    const style = data.getSelectedCellStyle();
    // console.log('canUndo:', data.canUndo());
   // this.mergeEl.setState(data.canUnmerge(), !data.selector.multiple());
   // this.autofilterEl.setState(!data.canAutofilter());
    // this.mergeEl.disabled();
    // console.log('selectedCell:', style, cell);
    const { font, format } = style;
    // this.printEl.setState(format);
    // this.fontEl.setState(font.name);
    // this.fontSizeEl.setState(font.size);
    // this.boldEl.setState(font.bold);
    // this.italicEl.setState(font.italic);
    // this.underlineEl.setState(style.underline);
    // this.strikeEl.setState(style.strike);
    // this.textColorEl.setState(style.color);
    // this.fillColorEl.setState(style.bgcolor);
    // this.alignEl.setState(style.align);
    // this.valignEl.setState(style.valign);
    // this.textwrapEl.setState(style.textwrap);
    // console.log('freeze is Active:', data.freezeIsActive());
    //this.freezeEl.setState(data.freezeIsActive());
  }
}
