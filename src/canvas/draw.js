/* global window */
function dpr() {
  return window.devicePixelRatio || 1;
}

function thinLineWidth() {
  return dpr() - 0.5;
}

function npx(px) {
  return parseInt(px * dpr(), 10);
}

function npxLine(px) {
  const n = npx(px);
  return n > 0 ? n - 0.5 : 0.5;
}

class DrawBox {
  constructor(x, y, w, h, padding = 0) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.padding = padding;
    this.bgcolor = '#ffffff';
    // border: [width, style, color]
    this.borderTop = null;
    this.borderRight = null;
    this.borderBottom = null;
    this.borderLeft = null;
  }

  setBorders({
    top, bottom, left, right,
  }) {
    if (top) this.borderTop = top;
    if (right) this.borderRight = right;
    if (bottom) this.borderBottom = bottom;
    if (left) this.borderLeft = left;
  }

  innerWidth() {
    return this.width - (this.padding * 2) - 2;
  }

  innerHeight() {
    return this.height - (this.padding * 2) - 2;
  }

  textx(align) {
    const { width, padding } = this;
    let { x } = this;
    if (align === 'left') {
      x += padding;
    } else if (align === 'center') {
      x += width / 2;
    } else if (align === 'right') {
      x += width - padding;
    }
    return x;
  }

  texty(align, h) {
    const { height, padding } = this;
    let { y } = this;
    if (align === 'top') {
      y += padding;
    } else if (align === 'middle') {
      y += height / 2 - h / 2;
    } else if (align === 'bottom') {
      y += height - padding - h;
    }
    return y;
  }

  topxys() {
    const { x, y, width } = this;
    return [[x, y], [x + width, y]];
  }

  rightxys() {
    const {
      x, y, width, height,
    } = this;
    return [[x + width, y], [x + width, y + height]];
  }

  bottomxys() {
    const {
      x, y, width, height,
    } = this;
    return [[x, y + height], [x + width, y + height]];
  }

  leftxys() {
    const {
      x, y, height,
    } = this;
    return [[x, y], [x, y + height]];
  }
}

function drawFontLine(type, tx, ty, align, valign, blheight, blwidth) {
  const floffset = { x: 0, y: 0 };
  if (type === 'underline') {
    if (valign === 'bottom') {
      floffset.y = 0;
    } else if (valign === 'top') {
      floffset.y = -(blheight + 2);
    } else {
      floffset.y = -blheight / 2;
    }
  } else if (type === 'strike') {
    if (valign === 'bottom') {
      floffset.y = blheight / 2;
    } else if (valign === 'top') {
      floffset.y = -((blheight / 2) + 2);
    }
  }

  if (align === 'center') {
    floffset.x = blwidth / 2;
  } else if (align === 'right') {
    floffset.x = blwidth;
  }
  this.line(
    [tx - floffset.x, ty - floffset.y],
    [tx - floffset.x + blwidth, ty - floffset.y],
  );
}

class Draw {
  constructor(el, width, height) {
    this.el = el;
    this.ctx = el.getContext('2d');
    this.resize(width, height);
    this.ctx.scale(dpr(), dpr());
  }

  resize(width, height) {
    // console.log('dpr:', dpr);
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.width = npx(width);
    this.el.height = npx(height);
  }

  clear() {
    const { width, height } = this.el;
    this.ctx.clearRect(0, 0, width, height);
    return this;
  }

  attr(options) {
    Object.assign(this.ctx, options);
    return this;
  }

  save() {
    this.ctx.save();
    this.ctx.beginPath();
    return this;
  }

  restore() {
    this.ctx.restore();
    return this;
  }

  beginPath() {
    this.ctx.beginPath();
    return this;
  }

  translate(x, y) {
    this.ctx.translate(npx(x), npx(y));
    return this;
  }

  scale(x, y) {
    this.ctx.scale(x, y);
    return this;
  }

  clearRect(x, y, w, h) {
    this.ctx.clearRect(x, y, w, h);
    return this;
  }

  backGround(src, x, y, w, h) {
    let img = new Image();
    img.crossOrigin = 'Anonymous'; //解决跨域问题
    let _self = this;
    img.onload = function () {
      _self.ctx.globalAlpha = 0.6;
      _self.ctx.drawImage(img, npx(x) - 0.5, npx(y) - 0.5, npx(w), npx(h));
    }
    img.src = src;
    return this;
  }

  fillRect(x, y, w, h) {
    this.ctx.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(w), npx(h));
    return this;
  }

  fillText(text, x, y) {
    this.ctx.fillText(text, npx(x), npx(y));
    return this;
  }

  /*
    txt: render text
    box: DrawBox
    attr: {
      align: left | center | right
      valign: top | middle | bottom
      color: '#333333',
      strike: false,
      cellslash:false, //单元格斜线
      cellslashdrawstart:'lefttop',
      font: {
        name: 'Arial',
        size: 14,
        bold: false,
        italic: false,
      }
    }
    textWrap: text wrapping
  */
  text(mtxt, box, attr = {}, textWrap = true) {
    const { ctx } = this;
    const {
      align, valign, font, color, strike, underline, cellslash,
    } = attr;
    if (cellslash) {
      this.addCellSlash(mtxt, box, attr, textWrap);
    } else {
      const tx = box.textx(align);
      ctx.save();
      ctx.beginPath();
      this.attr({
        textAlign: align,
        textBaseline: valign,
        font: `${font.italic ? 'italic' : ''} ${font.bold ? 'bold' : ''} ${npx(font.size)}px ${font.name}`,
        fillStyle: color,
        strokeStyle: color,
      });
      const txts = `${mtxt}`.split('\n');
      const biw = box.innerWidth();
      const ntxts = [];
      txts.forEach((it) => {
        const txtWidth = ctx.measureText(it).width;
        if (textWrap && txtWidth > npx(biw)) {
          let textLine = { w: 0, len: 0, start: 0 };
          for (let i = 0; i < it.length; i += 1) {
            if (textLine.w >= npx(biw)) {
              ntxts.push(it.substr(textLine.start, textLine.len));
              textLine = { w: 0, len: 0, start: i };
            }
            textLine.len += 1;
            textLine.w += ctx.measureText(it[i]).width + 1;
          }
          if (textLine.len > 0) {
            ntxts.push(it.substr(textLine.start, textLine.len));
          }
        } else {
          ntxts.push(it);
        }
      });
      const txtHeight = (ntxts.length - 1) * (font.size + 2);
      let ty = box.texty(valign, txtHeight);
      ntxts.forEach((txt) => {
        const txtWidth = ctx.measureText(txt).width;
        this.fillText(txt, tx, ty);
        if (strike) {
          drawFontLine.call(this, 'strike', tx, ty, align, valign, font.size, txtWidth);
        }
        if (underline) {
          drawFontLine.call(this, 'underline', tx, ty, align, valign, font.size, txtWidth);
        }
        ty += font.size + 2;
      });
      ctx.restore();
    }
    return this;
  }

  border(style, color) {
    const { ctx } = this;
    ctx.lineWidth = thinLineWidth;
    ctx.strokeStyle = color;
    // console.log('style:', style);
    if (style === 'medium') {
      ctx.lineWidth = npx(2) - 0.5;
    } else if (style === 'thick') {
      ctx.lineWidth = npx(3);
    } else if (style === 'dashed') {
      ctx.setLineDash([npx(3), npx(2)]);
    } else if (style === 'dotted') {
      ctx.setLineDash([npx(1), npx(1)]);
    } else if (style === 'double') {
      ctx.setLineDash([npx(2), 0]);
    }
    return this;
  }

  line(...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      ctx.beginPath();
      const [x, y] = xys[0];
      ctx.moveTo(npxLine(x), npxLine(y));
      for (let i = 1; i < xys.length; i += 1) {
        const [x1, y1] = xys[i];
        ctx.lineTo(npxLine(x1), npxLine(y1));
      }
      ctx.stroke();
    }
    return this;
  }
  /**
   * 画虚线
   */
  lineDash() {
    const { ctx } = this;
    ctx.lineDashOffset = 3;
    ctx.lineWidth = 3;
    ctx.setLineDash([3, 4, 3]);
  }
  /**
   * 
   * @param  box 
   */
  strokeBorders(box) {
    const { ctx } = this;
    ctx.save();
    // border
    const {
      borderTop, borderRight, borderBottom, borderLeft,
    } = box;
    if (borderTop) {
      this.border(...borderTop);
      // console.log('box.topxys:', box.topxys());
      this.line(...box.topxys());
    }
    if (borderRight) {
      this.border(...borderRight);
      this.line(...box.rightxys());
    }
    if (borderBottom) {
      this.border(...borderBottom);
      this.line(...box.bottomxys());
    }
    if (borderLeft) {
      this.border(...borderLeft);
      this.line(...box.leftxys());
    }
    ctx.restore();
  }

  dropdown(box) {
    const { ctx } = this;
    const {
      x, y, width, height,
    } = box;
    const sx = x + width - 15;
    const sy = y + height - 15;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(npx(sx), npx(sy));
    ctx.lineTo(npx(sx + 8), npx(sy));
    ctx.lineTo(npx(sx + 4), npx(sy + 6));
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 0, .45)';
    ctx.fill();
    ctx.restore();
  }

  error(box) {
    const { ctx } = this;
    const { x, y, width } = box;
    const sx = x + width - 1;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(npx(sx - 8), npx(y - 1));
    ctx.lineTo(npx(sx), npx(y - 1));
    ctx.lineTo(npx(sx), npx(y + 8));
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 0, 0, .65)';
    ctx.fill();
    ctx.restore();
  }

  frozen(box) {
    const { ctx } = this;
    const { x, y, width } = box;
    const sx = x + width - 1;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(npx(sx - 8), npx(y - 1));
    ctx.lineTo(npx(sx), npx(y - 1));
    ctx.lineTo(npx(sx), npx(y + 8));
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 255, 0, .85)';
    ctx.fill();
    ctx.restore();
  }

  rect(box, dtextcb) {
    const { ctx } = this;
    const {
      x, y, width, height, bgcolor,
    } = box;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = bgcolor || '#fff';
    ctx.rect(npxLine(x + 1), npxLine(y + 1), npx(width - 2), npx(height - 2));
    ctx.clip();
    ctx.fill();
    dtextcb();
    ctx.restore();
  }
  /**
   * 单元格斜线
   * @param {*} ctx 
   * @param {*} mtxt 
   * @param {*} box 
   * @param {*} attr 
   * @param {*} textWrap 
   * @param {*} distance 
   */
  drawCellSlash(ctx, mtxt, box, attr = {}, textWrap = true) {
    debugger
    const {
      color,
      cellslashdrawstart,
    } = attr;
    ctx.save();
		ctx.strokeStyle = color;
    ctx.beginPath();
    let texts = `${mtxt}`.split('|');
    if (texts && texts.length >= 2) {
      if (texts.length == 2) {
        if (cellslashdrawstart == 'leftbottom') {
          ctx.moveTo(npx(box.x), npx(box.y + box.height));
          ctx.lineTo(npx(box.x + box.width), npx(box.y));
          this.fillSlashText(ctx, texts[0], box.x + 10, box.y + 20);
          const txtWidth = ctx.measureText(texts[1]).width;
          this.fillSlashText(ctx, texts[1], box.x + box.width - txtWidth - 10, box.y + box.height - 20);

          // console.log("addCellSlash text txtWidth......",txtWidth);
        } else {
          ctx.moveTo(npx(box.x),npx(box.y));
          ctx.lineTo(npx(box.x+box.width), npx(box.y+box.height));
          this.fillSlashText(ctx, texts[0], box.x+2, box.y + box.height-8);
          const txtWidth = ctx.measureText(texts[1]).width;
          this.fillSlashText(ctx, texts[1], box.x + box.width - txtWidth, box.y+box.height/2);
        }
        ctx.stroke();
      } else if (texts.length == 3) {
        if (cellslashdrawstart == 'leftbottom') {
          ctx.moveTo(npx(box.x), npx(box.y + box.height));
          ctx.lineTo(npx(box.x + box.width / 2), npx(box.y));
          ctx.moveTo(npx(box.x), npx(box.y + box.height));
          ctx.lineTo(npx(box.x + box.width), npx(box.y + box.height / 2));

          this.fillSlashText(ctx, texts[0], box.x + 10, box.y + 20);
          const txtWidth = ctx.measureText(texts[1]).width;
          this.fillSlashText(ctx, texts[1], box.x + box.width - txtWidth - 10, box.y + 20);
          const txtWidth1 = ctx.measureText(texts[2]).width;
          this.fillSlashText(ctx, texts[2], box.x + box.width - txtWidth1 - 10, box.y + box.height - 20);
        } else {
          ctx.moveTo(npx(box.x), npx(box.y));
          ctx.lineTo(npx(box.x + box.width / 2), npx(box.y + box.height));
          ctx.moveTo(npx(box.x), npx(box.y));
          ctx.lineTo(npx(box.x + box.width), npx(box.y + box.height / 2));
          this.fillSlashText(ctx, texts[0], box.x + 2, box.y + box.height - 8);
          const txtWidth = ctx.measureText(texts[1]).width;
          this.fillSlashText(ctx, texts[1], box.x + box.width - txtWidth, box.y + box.height-8);
          const txtWidth1 = ctx.measureText(texts[2]).width;
          this.fillSlashText(ctx, texts[2], box.x + box.width - txtWidth1, box.y + box.height/4);
        }
        ctx.stroke();
		    ctx.closePath();
      } else {

      }
    }
    ctx.restore();
  }

  //添加单元格斜线
  addCellSlash(mtxt, box, attr = {}, textWrap = true) {
    const { ctx } = this;
    const {
      align, valign, font, color, strike, underline, cellslashdrawstart
    } = attr;
    this.attr({
      textAlign: align,
      textBaseline: valign,
      font: `${font.italic ? 'italic' : ''} ${font.bold ? 'bold' : ''} ${npx(font.size)}px ${font.name}`,
      fillStyle: color,
      strokeStyle: color,
    });
    //先画显示的画布斜线
    this.drawCellSlash(ctx, mtxt, box, attr, textWrap);
    return this;
  }

  fillSlashText(ctx, text, x, y) {
    ctx.fillText(text, npx(x), npx(y));
  }
}

export default {};
export {
  Draw,
  DrawBox,
  thinLineWidth,
  npx,
};
