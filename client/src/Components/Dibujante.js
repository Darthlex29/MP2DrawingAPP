import "../Styles/Dibujante.css";
import io from "socket.io-client";
import React, { useRef, useEffect, useState } from "react";
import { fabric } from 'fabric';

const socket = io("http://localhost:4000");

const Dibujante = () => {
    const canvasRef = useRef(null);
  
    useEffect(() => {
      const canvas = new fabric.Canvas(canvasRef.current, {
        // Paso 1: Configuración del lugar y tamaño del lienzo
        width: 500, // Ancho del lienzo en píxeles
        height: 500, // Altura del lienzo en píxeles
        left: window.innerWidth / 2 - 450, // Posición izquierda del lienzo en la página
        top: window.innerHeight / 2 - 300, // Posición superior del lienzo en la página
        backgroundColor: "#f0f0f0", // Color de fondo del lienzo
      });
  
      // Configuración opcional del lienzo
      canvas.isDrawingMode = true; //Indica si es dibujable el lienzo
      canvas.freeDrawingBrush.width = 5; //Indica el ancho del pincel utilizado para dibujar en pizeles
      canvas.freeDrawingBrush.color = "#000000"; //Establece el color del pincel utilizado para dibujar en el lienzo
  
      // Evento de clic del ratón
      canvas.on("mouse:down", (options) => {
        console.log(
          "Clic del ratón en las coordenadas:",
          options.pointer.x,
          options.pointer.y
        );
      });
  
      // Evento de movimiento del ratón
      canvas.on("mouse:move", (options) => {
        console.log(
          "Movimiento del ratón en las coordenadas:",
          options.pointer.x,
          options.pointer.y
        );
      });
  
      // Evento de liberación del ratón
      canvas.on("mouse:up", (options) => {
        console.log(
          "Liberación del ratón en las coordenadas:",
          options.pointer.x,
          options.pointer.y
        );
      });
  
      const handleClearCanvas = () => {
        canvas.clear();
      };
  
      return () => {
        // Limpia y destruye el lienzo al desmontar el componente
        canvas.dispose();
      };
    }, []);
  
    
  
    return (
      <div>
        <canvas ref={canvasRef} className="canvas-container" />
      </div>
    );
  };
export default Dibujante;
