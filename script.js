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



document.getElementById('apply').addEventListener('click', drawImg);
document.getElementById('reset').addEventListener('click', () => {
  overlayText.value = '';
  document.querySelectorAll('input[type=checkbox]').forEach(box => box.checked = false);
  drawImg();
});
