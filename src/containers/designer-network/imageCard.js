import React, { memo, useEffect, useRef } from 'react';
import styles from './styles.module.scss';
import physicals from '../../data/drip.json';


const canvasWidth = 1920;
const canvasHeight = 1000;
const bubbleSize = 400;
const photoSize = 340;

const designerCircle = {
  index: 0,
  x: 0,
  y: 0,
  vx: 1,
  vy: 5,
  init: function (number) {
    const rowNum = (number / 4) | 0;
    const colNum = number % 10;

    this.x = (Math.random() + rowNum) * (canvasWidth / 4);
    this.y = (Math.random() + colNum) * (canvasHeight / 4);
    this.vy = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 0.5);

    this.index = number;
  },
  draw: function (ctx, bubbleImg, photoImg) {
    if (
      (this.x + bubbleSize / 2 < 0 || this.x - bubbleSize / 2 > canvasWidth) &&
      (this.y - bubbleSize / 2 > canvasHeight || this.y + bubbleSize / 2 < 0)
    )
      return;

    ctx.drawImage(
      bubbleImg,
      this.x - bubbleSize / 2,
      this.y - bubbleSize / 2,
      bubbleSize,
      bubbleSize,
    );
    if (photoImg) {
      ctx.drawImage(photoImg, this.x - (photoSize - 30) / 2, this.y - (photoSize - 30) / 2, photoSize - 30, photoSize - 30);
    }
  },

  move: function (width, height, list) {
    this.x = this.x - this.vx;
    if (this.x + bubbleSize / 2 < 0) {
      this.x = this.x + (width / 4) * ((list.length / 4) | 0);
    }

    list.forEach((item, index) => {
      if (index <= this.index) return;
      const distX = Math.abs(item.x - this.x);
      const distY = Math.abs(item.y - this.y);

      const dist = distX * distX + distY * distY > 0 ? Math.sqrt(distX * distX + distY * distY) : 0;

      if (dist < photoSize) {
        this.vy = (Math.abs(this.vy) * (item.y - this.y)) / distY;
        list[index].vy = (Math.abs(list[index].vy) * (this.y - item.y)) / distY;

        this.x = this.x - (Math.abs(this.vx) * (item.x - this.x)) / distX;
        list[index].x = list[index].x - (Math.abs(list[index].vx) * (this.x - item.x)) / distX;
      }
    });

    const newY = this.y - this.vy;
    if (
      (newY < bubbleSize / 2 && this.y >= bubbleSize / 2) ||
      (newY > height - bubbleSize / 2 && this.y <= height - bubbleSize / 2)
    )
      this.vy *= -1;

    this.y -= this.vy;
  },
};

const DesignerList = () => {
  const images = physicals;
  const digitalIds = [
    '/images/skins/1.png',
    '/images/skins/2.png',
    '/images/skins/3.png',
    '/images/skins/4.png',
    '/images/skins/5.png',
    '/images/skins/6.png',
    '/images/skins/7.png',
    '/images/skins/8.png',
    '/images/skins/9.png',
    '/images/skins/10.png',
  ];
  const designerCircles = Array(images.length + 10)
      .fill()
      .map((item) => Object.assign({}, designerCircle));
  const canvasRef = useRef();
  const raf = useRef();

  useEffect(() => {
    const initialize = async () => {
      var bubbleImage = new Image();
      var photoImages = Array(images.length)
        .fill()
        .map((item, index) =>  new Image());
      
      photoImages.map((item, index) => item.src = images[index].imageUrl)
  
      var collections = Array(digitalIds.length)
        .fill()
        .map((item, index) => {
          const image = new Image();
          image.src = digitalIds[index];
          return image;
        });
      
      photoImages = [...photoImages, ...collections];
  
      const canvasObj = canvasRef.current;
      const context = canvasObj ? canvasObj.getContext('2d') : null;
  
      function draw() {
        context.clearRect(0, 0, canvasObj.width, canvasObj.height);
        designerCircles.forEach((item, index) => {
          designerCircles[index].draw(context, bubbleImage, photoImages[index]);
          designerCircles[index].move(canvasObj.width, canvasObj.height, designerCircles);
        });
        raf.current = window.requestAnimationFrame(draw);
      }
  
      function init() {
        bubbleImage.src = '/images/squareframe.png';
        designerCircles.forEach((item, index) => designerCircles[index].init(index));
        window.cancelAnimationFrame(raf.current);
        raf.current = window.requestAnimationFrame(draw);
      }
  
      if (context) init();
      return () => {
        window.cancelAnimationFrame(raf.current);
      };
    }

    initialize();
  }, []);

  return (
    <div className={styles.wrapperSquareItems}>
      <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} />
    </div>
  );
};

export default memo(DesignerList);
