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
    mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
    setTimeout(handleDrawing, 5);
  };
  handleDrawing();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleMouseDown = (e) => {
      mouse.click = true;
    };

    const handleMouseUp = (e) => {
      mouse.click = false;
    };

    const handleMouseMove = (e) => {
      mouse.move = true;
      mouse.pos.x = e.clientX;
      mouse.pos.y = e.clientY;
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
      ctx.moveTo(line[0].x * width, line[0].y * height);
      ctx.lineTo(line[1].x * width, line[1].y * height);
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
      ref={canvasRef}
      className="drawing"
      width={width}
      height={height}
      style={canvasStyle}
    />
  );
}

export default Paint;

const canvasStyle = {
  border: "1px solid black",
};