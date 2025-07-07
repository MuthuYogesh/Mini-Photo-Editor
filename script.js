const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const textOverlay = document.getElementById('overlayText');
const currentImage = new Image();

const imgList = document.querySelectorAll('.templates')

let textX = 0;
let textY = 0;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

imgList.forEach(img=>{
    img.addEventListener('click', ()=>{loadImg(img.src)})
})

const loadImg = (src)=>{
    currentImage.src = src;
    currentImage.onload = ()=>{
        canvas.width = currentImage.width;
        canvas.height = currentImage.height;
        const align = getAlign();
        const fontsize = getFontSize();
        const font = getFontStyle();
        ctx.font = `${fontsize}px ${font}`;
        // const textWidth = ctx.measureText(textOverlay.value).width;
        // // console.log("TextWidth: ",textWidth, "Canvas Width: ", canvas.width);
        if (align === 'left') {
            textX = 10; 
        } else if (align === 'center') {
            textX = canvas.width / 2;
        } else if (align === 'right') {
            textX = canvas.width;
        }
        textY = canvas.height / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(currentImage, textX, textY);
        drawImg();
    }
}

const getFontSize = ()=>{
    const size = parseInt(document.getElementById('fontsize').value);
    return Math.floor(canvas.height * (size / 100));
}

const getFontStyle = ()=>{
    const font = document.getElementById('fontselect').value;
    return font;
}

const getAlign = ()=>{
    const align = document.getElementById('alignselect').value;
    return align;
}

const drawImg = ()=>{
  let filters = '';
  if (document.getElementById('blur').checked) filters += 'blur(50px) ';
  if (document.getElementById('grayscale').checked) filters += 'grayscale(100%) ';
  if (document.getElementById('sepia').checked) filters += 'sepia(1)';

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = filters.trim();
  ctx.drawImage(currentImage, 0, 0);
  ctx.filter = 'none';

  ctx.font = `${getFontSize()}px ${getFontStyle()}`;
  ctx.fillStyle = 'black';
  align = getAlign();
  ctx.textAlign = getAlign();
        if (align === 'left') {
            textX = 10; 
        } else if (align === 'center') {
            textX = canvas.width / 2;
        } else if (align === 'right') {
            textX = canvas.width; 
        }
  textY = canvas.height / 2;
  // loadImg(currentImage.src);
  ctx.fillText(textOverlay.value, textX, textY);
  console.log(textOverlay.value);
}

const mainDraw = ()=>{
  let filters = '';
  if (document.getElementById('blur').checked) filters += 'blur(50px) ';
  if (document.getElementById('grayscale').checked) filters += 'grayscale(100%) ';
  if (document.getElementById('sepia').checked) filters += 'sepia(1)';

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = filters.trim();
  ctx.drawImage(currentImage, 0, 0);
  ctx.filter = 'none';
  ctx.font = `${getFontSize()}px ${getFontStyle()}`;
  ctx.fillStyle = 'black';
  ctx.textAlign = getAlign();
  ctx.fillText(textOverlay.value, textX, textY);
}

document.getElementById('apply').addEventListener('click', drawImg);
document.getElementById('reset').addEventListener('click', () => {
  overlayText.value = '';
  document.querySelectorAll('input[type=checkbox]').forEach(box => box.checked = false);
  drawImg();
});

canvas.addEventListener('mousedown', (e) => {
  console.log("down")
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / canvas.clientWidth;
  const scaleY = canvas.height / canvas.clientHeight;
  const mouseX = (e.clientX - rect.left) * scaleX;
  const mouseY = (e.clientY - rect.top) * scaleY;

  const fontsize = getFontSize();
  const font = getFontStyle();
  
  ctx.font = `${fontsize}px ${font}`;
  const textWidth = ctx.measureText(textOverlay.value).width;
  const textHeight = fontsize;
  const align = getAlign();

  let hitboxXStart, hitboxXEnd;
  if (align === 'left') {
    hitboxXStart = textX;
    hitboxXEnd = textX + textWidth;
  } else if (align === 'center') {
    hitboxXStart = textX - textWidth / 2;
    hitboxXEnd = textX + textWidth / 2;
  } else if (align === 'right') {
    hitboxXStart = textX - textWidth;
    hitboxXEnd = textX;
  }

  if (
    mouseX >= hitboxXStart &&
    mouseX <= hitboxXEnd &&
    mouseY >= textY - textHeight &&
    mouseY <= textY
  ) {
    isDragging = true;
    dragOffsetX = mouseX - textX;
    dragOffsetY = mouseY - textY;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / canvas.clientWidth;
  const scaleY = canvas.height / canvas.clientHeight;
  const align = getAlign();

  let newX = (e.clientX - rect.left) * scaleX - dragOffsetX;

  const fontsize = getFontSize();
  const font = getFontStyle();
  ctx.font = `${fontsize}px ${font}`;
  const textWidth = ctx.measureText(textOverlay.value).width;

  if (align === 'left') {
    newX = Math.max(0, Math.min(newX, canvas.width - textWidth));
  } else if (align === 'center') {
    newX = Math.max(textWidth / 2, Math.min(newX, canvas.width - textWidth / 2));
  } else if (align === 'right') {
    newX = Math.max(textWidth, Math.min(newX, canvas.width));
  }

  textX = newX;
  textY = (e.clientY - rect.top) * scaleY - dragOffsetY;
  mainDraw();
});

canvas.addEventListener('mouseup', () => {
    console.log("up")
  isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    console.log("leave")
  isDragging = false;
});
