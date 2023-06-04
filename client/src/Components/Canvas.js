/* import { useRef } from "react"; */
import { useOnDraw } from "../Hooks/Hooks";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const Canvas = ({ width, height }) => {
  const { setCanvasRef, onCanvasMouseDown } = useOnDraw(onDraw, reciveDraw);
  let context = null;

  socket.on('onDraw', data =>{
    const line = data.line;
    try {
        console.log("Esto es lo que vuelve: "+ line[0].x +", "+ line[0].y)
        /***
         * socket.on('draw_line', data => {
        let line = data.line;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(line[0].x, line[0].y );
        ctx.lineTo(line[1].x, line[1].y );
        ctx.stroke();
      });
         */
        // drawLine(line.point, line.prevPoint, ctx, "#000000", 5); 
    } catch (error) {
        
    }
    
  }); 
  
  function reciveDraw(ctx){
    context = ctx; 
    if(context != null){
      console.log("Hay algo ahí.")
    }else{
      console.log("No hay nada.")
    }
    
  }

  function onDraw(ctx, point, prevPoint) {
    drawLine(prevPoint, point, ctx, "#000000", 5);
    socket.emit('onDraw', {line:[point, prevPoint, ctx, "#000000", 5]})
  }

  function drawLine(start, end, ctx, color, width) {
    
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <canvas
      width={width}
      height={height}
      onMouseDown={onCanvasMouseDown}
      style={canvasStyle}
      ref={setCanvasRef}
    />
  );
};

export default Canvas;

const canvasStyle = {
  border: "1px solid black",
};
