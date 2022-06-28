import { h } from '../element';
import { cssPrefix } from '../../config';
import { unbind, bindClickoutside, unbindClickoutside } from '../event';

function menuBuildDivider() {
  return h('div', `menu-item divider`);
}

const menuItems = [
  { key: 'delete', title: "删除" },
  { key: 'divider' },
  { key: 'fixed', title: "固定" },
];
const circle = [
  { css: "cc top-left" },
  { css: "cc top-center" },
  { css: "cc top-right" },
  { css: "cc middle-left" },
  { css: "cc middle-right" },
  { css: "cc bottom-left" },
  { css: "cc bottom-center" },
  { css: "cc bottom-right" },
];

function buildMenuItem(item) {
  if (item.key === 'divider') {
    return h('div', `menu-item divider`);
  }
  return h('div', `menu-item`)
    .on('click', () => {
      this.itemClick(item.key);
      this.hide();
    })
    .children(
      item.title,
    );
}

function buildMenu() {
  return menuItems.map(it => buildMenuItem.call(this, it));
}


function dpr() {
  return window.devicePixelRatio || 1;
}

function npx(px) {
  return parseInt(px * dpr(), 10);
}


/**
 * 公共插入图片处理
 * 包含 二维码、图表
 */
export default class CommonChart {
  /**
   * 
   * @param {*} sheet 
   * @param {*} css 样式
   * @param {*} id 
   * @param {*} element 元素
   * @param {*} viewFn 
   * @param {*} isHide 
   */
  constructor(sheet, id, css, viewFn, isHide = false) {
    this.menuItems = buildMenu.call(this);
    this.sheet = sheet;
    this.id = id;
    this.fixed = false;
    this.itemClick = () => { };
    this.itemDrag = () => { }
    this.change = () => { }
    this.viewFn = viewFn;
    this.isHide = isHide;
    this.css = css;
    this.elmouseX = 0;
    this.elmouseY = 0;
    this.eloffsetL = 0;
    this.eloffsetT = 0;
    this.elleft = 0;
    this.eltop = 0;
    this.elDowm = false;
    this.move = false;
    this.imgEl = null;
    this.fixed = false;
    this.type=null;
    //右键菜单
    this.layerMenuEl = h('div', `${cssPrefix}-layer-menu`).children(...this.menuItems).hide();
    this.dragCircleEl = h('div', `${cssPrefix}-drag-circle`).children(...circle.map(it => this.buildCircleItem.call(this, it)));

    this.dragContentEl = h('div', `${cssPrefix}-drag-content`).children(this.element(this));
    this.dragMoverEl = h('div', `${cssPrefix}-drag-mover`);
    this.el = h('div', `${cssPrefix}-drag-container ${css}  selected`).active().attr("id", this.id)
      .children(
        this.dragContentEl,
        this.dragCircleEl,
        this.dragMoverEl,
        this.layerMenuEl,
      ); 
    this.dragMoverEl.on('mousedown', (evt) => {
      evt.preventDefault();
      this.layerMenuEl.hide();
      const view = this.el.offset();
      this.eloffsetL = view.left;
      this.eloffsetT = view.top;
      this.elmouseX = evt.clientX;
      this.elmouseY = evt.clientY;
      this.elDowm = true;
      this.move = false;
      this.sheet.overlayerEl.on("mousemove", (env) => {
        env.preventDefault();
        if (this.elDowm) {
          let rect = this.sheet.data.getCellRectByXY(env.offsetX, env.offsetY);
          this.elleft = rect.left;
          this.eltop = rect.top;
          if (rect.ri === -1) {
            this.eltop = 25;
          }
          if (rect.ci === -1) {
            this.elleft = 60;
          }
          this.el.css("left", this.elleft + "px");
          this.el.css("top", this.eltop + "px");
        }
      });
      if (evt.buttons === 2) {
        this.setPosition(evt.offsetX, evt.offsetY)
      }
    }).on("mouseup", (env) => {
      env.preventDefault();
      if (this.elDowm && this.elleft > 0 && this.eltop > 0) {
        this.el.css("left", this.elleft + "px");
        this.el.css("top", this.eltop + "px");
      }
      this.elDowm = false;
      this.move = false;
    });
  }
  /**
   * 
   * @param {*} x 
   * @param {*} y 
   * @returns 
   */
  setPosition(x, y) {
    this.elDowm = false;
    if (this.isHide) return;
    const { layerMenuEl, dragMoverEl } = this;
    const { width } = layerMenuEl.show().offset();
    const view = dragMoverEl.offset();
    const vhf = view.height / 2;
    let left = x;
    if (view.width - x <= width) {
      left -= width;
    }
    layerMenuEl.css('left', `${left}px`);
    if (y > vhf) {
      layerMenuEl.css('bottom', `${view.height - y}px`)
        .css('max-height', `${y}px`)
        .css('top', 'auto');
    } else {
      layerMenuEl.css('top', `${y}px`)
        .css('max-height', `${view.height - y}px`)
        .css('bottom', 'auto');
    }
    bindClickoutside(layerMenuEl);
  }

  hide() {
    const { layerMenuEl } = this;
    layerMenuEl.hide();
    unbindClickoutside(layerMenuEl);
  }
  select(){
     this.el.addClass("selected");
  }
  unselect(){
    this.el.removeClass("selected");
  }
  change(tag,id){
    alert("change")
  }
  /**
   * 
   * @param {*} item 
   * @returns 
   */
  buildCircleItem(item) {
    this.elDowm = false;
    let move = false;
    return h('div', item.css)
      .on('mousedown', (evt) => {
        move = true;
        let ev = evt || event;
        let disX = ev.clientX;
        let disY = ev.clientY;
        const view = this.el.offset();
        let width = view.width;
        let height = view.height;
        let left = view.left;
        let top = view.top;
        this.sheet.el.on('mousemove', (mev) => {
          if (move) {
            let mevt = mev || window.event;
            let x = mevt.clientX;
            let y = mevt.clientY;
            if (item.css === "cc top-left") { //左上
              this.el.css("width", (width - (x - disX)) + 'px');
              this.el.css("height", (height - (y - disY)) + 'px');
              this.el.css("left", (left + (x - disX)) + 'px');
              this.el.css("top", (top + (y - disY)) + 'px');
            } else if (item.css === "cc top-center") {//向上
              this.el.css("height", (height - (y - disY)) + 'px');
              this.el.css("top", (top + (y - disY)) + 'px');
            } else if (item.css === "cc top-right") {//右上
              this.el.css("width", (width + (x - disX)) + 'px');
              this.el.css("height", (height - (y - disY)) + 'px');
              this.el.css("right", (left - (x - disX)) + 'px');
              this.el.css("top", (top + (y - disY)) + 'px');
            } else if (item.css === "cc middle-left") {//向左
              this.el.css("width", (width - (x - disX)) + 'px');
              this.el.css("height", height + 'px');
              this.el.css("left", (left + (x - disX)) + 'px');
            } else if (item.css === "cc middle-right") {//向右
              this.el.css("width", (width + (x - disX)) + 'px');
              this.el.css("height", height + 'px');
              this.el.css("right", (left - (x - disX)) + 'px');
            } else if (item.css === "cc bottom-left") {//左下
              this.el.css("width", (width - (x - disX)) + 'px');
              this.el.css("height", (height + (y - disY)) + 'px');
              this.el.css("left", (left + (x - disX)) + 'px');
              this.el.css("bottom", (top + (y + disY)) + 'px');
            } else if (item.css === "cc bottom-center") {//向下
              this.el.css("height", (height + (y - disY)) + 'px');
              this.el.css("bottom", (top - (y + disY)) + 'px');
            } else if (item.css === "cc bottom-right") {//右下
              this.el.css("width", (width + (x - disX)) + 'px');
              this.el.css("height", (height + (y - disY)) + 'px');
              this.el.css("right", (left - (x - disX)) + 'px');
              this.el.css("bottom", (top + (y + disY)) + 'px');
            }
          }
        }).on('mouseup', () => {
          move = false;
        });
      }).on("mouseup", () => {
        move = false;
      });
  }

  element(id) { }


}