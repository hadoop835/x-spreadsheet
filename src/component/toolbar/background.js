import { h } from '../element';
import { cssPrefix } from '../../config';
import { unbind , bindClickoutside, unbindClickoutside} from '../event';


function menuBuildDivider() {
    return h('div', `menu-item divider`);
}

const menuItems = [
    { key: 'delete', title: "删除"},
    { key: 'divider' },
    { key: 'fixed', title: "固定"},
    { key: 'divider' },
    { key: 'divider' },
    { key: 'backend', title: "设为套打图片"},
  ];
const circle = [
    {css:"circle top-left"},
    {css:"circle top-center"},
    {css:"circle top-right"},
    {css:"circle middle-left"},
    {css:"circle middle-right"},
    {css:"circle bottom-left"},
    {css:"circle bottom-center"},
    {css:"circle bottom-right"},
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

  

export default class Background {
  //"http://localhost:8085/jmreport/img/excel_online/a1644654762265.jpg"
    constructor(sheet,id,src,viewFn, isHide = false) {
        this.menuItems = buildMenu.call(this);
        this.sheet = sheet;
        this.fixed=false;
        this.itemClick = () => {};
        this.itemDrag=() =>{}
        this.viewFn = viewFn;
        this.isHide = isHide;
        this.el = h('div', `spreadsheet-drag-container img  selected`).active().attr("id",id);
        this.dragContentEl = h('div',`spreadsheet-drag-content`);
        this.imgEl  = h('div',``);
        this.imgEl.css("position","absolute");
        this.imgEl.css("bottom","0px");
        this.imgEl.css("width","100%");
        this.imgEl.css("height","100%");
        this.imageEl = h("img",'');
        this.imageEl.attr("crossorigin","Anonymous");
        this.imageEl.attr("src",src);
        this.imgEl.children(this.imageEl);
        this.fileInputEl = h("input",'');
        this.fileInputEl.attr("type","file");
        this.fileInputEl.css("display","none");
        this.dragContentEl.children(this.imgEl,this.fileInputEl);
        this.dragCircleEl = h('div',`spreadsheet-drag-circle`);
        this.dragCircleEl.children(...circle.map(it => this.buildCircleItem.call(this, it)));
        //右键
        this.layermenuEl = h("div",'spreadsheet-layer-menu');
        this.layermenuEl.children(...this.menuItems).hide();
        this.el.children(
            this.dragContentEl,
            this.dragCircleEl,
            this.layermenuEl,
        )
        this.elmouseX=0;
        this.elmouseY=0;
        this.eloffsetL=0;
        this.eloffsetT=0;
        this.elleft = 0;
        this.eltop=0;
        this.elDowm = false;
        this.move=false;
        this.dragContentEl.on('mousedown', (evt) => { 
          evt.preventDefault();
          const view = this.el.offset();
          this.eloffsetL = view.left;  
          this.eloffsetT = view.top;  
          this.elmouseX = evt.clientX;  
          this.elmouseY = evt.clientY;
          this.elDowm = true; 
          this.move=false;
          this.sheet.overlayerEl.on("mousemove",(env)=>{
            env.preventDefault();
            if(this.elDowm){
            let rect = this.sheet.data.getCellRectByXY(env.offsetX, env.offsetY);
            this.elleft = rect.left;
            this.eltop = rect.top;
              if(rect.ri===-1){
                this.eltop = 25;
              }
              if(rect.ci===-1){
                this.elleft = 60;
              }
              this.el.css("left",this.elleft+"px");
              this.el.css("top",this.eltop+"px");
            }
          })
        }).on("mouseup",(env)=>{ 
          env.preventDefault();
          if(this.elDowm && this.elleft>0 && this.eltop>0){
            this.el.css("left",this.elleft+"px");
            this.el.css("top",this.eltop+"px");
          }
          this.elDowm = false;
          this.move=false; 
        });
        this.dragContentEl
        .on('mousedown', (evt) => {
            this.layermenuEl.hide();
            if (evt.buttons === 2) {
                this.setPosition(evt.offsetX, evt.offsetY)
            }
        });
        
    }

    hide() {
        const { layermenuEl } = this;
        layermenuEl.hide();
        unbindClickoutside(layermenuEl);
      }
    
      setPosition(x, y) {
        this.elDowm =false;
        if (this.isHide) return;
        const { layermenuEl,dragContentEl } = this;
        const { width } = layermenuEl.show().offset();
        const view = dragContentEl.offset();
        const vhf = view.height / 2;
        let left = x;
        if (view.width - x <= width) {
          left -= width;
        }
        layermenuEl.css('left', `${left}px`);
        if (y > vhf) {
            layermenuEl.css('bottom', `${view.height - y}px`)
            .css('max-height', `${y}px`)
            .css('top', 'auto');
        } else {
            layermenuEl.css('top', `${y}px`)
            .css('max-height', `${view.height - y}px`)
            .css('bottom', 'auto');
        }
        bindClickoutside(layermenuEl);
      }
      
      buildCircleItem(item) {  
        this.elDowm = false;
        let move =false;
       return h('div', item.css)
         .on('mousedown', (evt) => { 
            move = true;
           let ev = evt||event;
           let disX = ev.clientX;
           let disY = ev.clientY;
           const view = this.el.offset();
           let width = view.width;
           let height = view.height;
           let left = view.left;
           let top = view.top;
           this.sheet.el.on('mousemove', (mev) => { 
             if(move){
              let mevt = mev || window.event;
              let x = mevt.clientX;
              let y = mevt.clientY;
              if(item.css === "circle top-left"){ //左上
               this.el.css("width", (width - (x - disX)) + 'px');
               this.el.css("height",(height-(y-disY))+'px');
               this.el.css("left",(left + (x - disX)) + 'px');
               this.el.css("top",(top + (y - disY)) + 'px');
              }else if(item.css === "circle top-center"){//向上
                this.el.css("height",(height-(y-disY))+'px');
                this.el.css("top",(top + (y - disY)) + 'px');
              }else if(item.css === "circle top-right"){//右上
                this.el.css("width", (width + (x - disX)) + 'px');
                this.el.css("height",(height-(y-disY))+'px');
                this.el.css("right",(left - (x - disX)) + 'px');
                this.el.css("top",(top + (y - disY)) + 'px'); 
              }else if(item.css === "circle middle-left"){//向左
                this.el.css("width", (width - (x - disX)) + 'px');
                this.el.css("height",height+'px');
                this.el.css("left",(left + (x - disX)) + 'px'); 
              }else if(item.css === "circle middle-right"){//向右
                this.el.css("width", (width + (x - disX)) + 'px');
                this.el.css("height",height+'px');
                this.el.css("right",(left - (x - disX)) + 'px');
              }else if(item.css === "circle bottom-left"){//左下
                this.el.css("width", (width - (x - disX)) + 'px');
                this.el.css("height",(height+(y-disY))+'px');
                this.el.css("left",(left + (x - disX)) + 'px');
                this.el.css("bottom",(top + (y + disY)) + 'px');
              }else if(item.css === "circle bottom-center"){//向下
                this.el.css("height",(height+(y-disY))+'px');
                this.el.css("bottom",(top - (y + disY)) + 'px'); 
              }else if(item.css === "circle bottom-right"){//右下
                this.el.css("width", (width + (x - disX)) + 'px');
                this.el.css("height",(height+(y-disY))+'px');
                this.el.css("right",(left - (x - disX)) + 'px');
                this.el.css("bottom",(top + (y + disY)) + 'px');
              }
             }
            }).on('mouseup', (mev) => {
              move = false;
          }); 
        }).on("mouseup",()=>{
             move = false;
       });
     } 
}