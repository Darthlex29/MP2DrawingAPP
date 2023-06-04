import React, { useRef, useEffect, useMemo } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function Paint({ width, height }) {
  const canvasRef = useRef(null);

  const mouse = useMemo(() => {
    return {
      click: false,
      move: false,
      pos: { x: 0, y: 0 },
      pos_prev: false,
      color: "#000000",
    };
  }, []);

  const handleDrawing = () => {
    if (mouse.click && mouse.move && mouse.pos_prev) {
      socket.emit("drawLine", {
        line: [mouse.pos, mouse.pos_prev],
      });
      mouse.move = false;
    }
    mouse.pos_prev = { 
      x: mouse.pos.x, 
      y: mouse.pos.y };
    setTimeout(handleDrawing, 5);
  };
  handleDrawing();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function computePointInCanvas(clientX, clientY) {
      if (canvasRef.current) {
        const boundingRect = canvasRef.current.getBoundingClientRect();
        return {
          x: clientX - boundingRect.left,
          y: clientY - boundingRect.top,
        };
      } else {
        return null;
      }
    }

    const handleMouseDown = (e) => {
      mouse.click = true;
    };

    const handleMouseUp = (e) => {
      mouse.click = false;
    };

    const handleMouseMove = (e) => {
      mouse.move = true;
      const point = computePointInCanvas(e.clientX, e.clientY)
  /*     console.log(point)
      console.log(point.x)
      console.log(point.y) */
      mouse.pos.x = point.x;
      mouse.pos.y = point.y;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);

    socket.on("drawLine", (data) => {
      let line = data.line;
      console.log("se supone que aquí entra algo: "+line[0].x +" y "+ line[0].y)
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = mouse.color;
      ctx.moveTo(line[0].x, line[0].y);
      ctx.lineTo(line[1].x, line[1].y);
      ctx.stroke();
    });

    // Limpia los eventos al desmontar el componente
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      socket.off("drawLine");
    };
  }, [height, mouse, width]);


  return (
    <canvas
      
      className="drawing"
      width={width}
      height={height}
      style={canvasStyle}
      ref={canvasRef}
    />
  );
}

export default Paint;

const canvasStyle = {
  border: "1px solid black",
};
