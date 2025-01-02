"use client";
import { createContext, useEffect, useState, useRef } from "react";
import { Stage, Layer, Circle, Rect } from "react-konva";
import Konva from "konva";
export default function Home() {
  //initializes dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  //initializes all state
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapeType, setShapeType] = useState(null);
  const [point1, setPoint1] = useState({
    x1: 0,
    y1: 0,
  });
  const [point2, setPonit2] = useState({
    x2: 0,
    y2: 0,
  });
  const layerRef = useRef(null);

  useEffect(() => {
    // Set the canvas size after the component mounts (client-side)
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  const handleMouseDown = (e) => {
    //grab latest mouse position
    const pos = e.target.getStage().getPointerPosition();
    point1.x1 = pos.x;
    point1.y1 = pos.y;
    setIsDrawing(true);
    console.log(point1);
  };

  const handleMouseMove = (e) => {
    //keeping in case we want to customize by dragging out
    if (!isDrawing) return;
    const pos = e.target.getStage().getPointerPosition();
    point2.x2 = pos.x;
    point2.y2 = pos.y;
    console.log(point2);
  };

  const handleMouseUp = (e) => {
    //once we let release/unclick we create the shape
    setIsDrawing(false);
    console.log(point1, point2);
    const shape = createShape(point1, point2);
    //add it our shapes
    setShapes((prevShapes) => [...prevShapes, shape]);
  };

  const createShape = (p1, p2) => {
    let distanceP1toP2 = Math.sqrt((p2.x2 - p1.x1) ** 2 + (p2.y2 - p1.y1) ** 2);
    let shape;
    if (shapeType === "circle") {
      shape = new Konva.Circle({
        id: Date.now().toString(),
        radius: distanceP1toP2,
        fill: "red",
        stroke: "black",
        strokeWidth: 5,
        x: p1.x1,
        y: p1.y1,
      });
    } else if (shapeType === "rectangle") {
      shape = new Konva.Rect({
        id: Date.now().toString(),
        height: p2.y2 - p1.y1,
        width: p2.x2 - p1.x1,
        fill: "blue",
        stroke: "black",
        strokeWidth: 5,
        x: p1.x1,
        y: p1.y1,
      });
    }
    console.log(shape);
    return shape;
  };

  const handleShapeType = (shape) => {
    setShapeType(shape);
  };
  return (
    <div>
      <div>
        <p>Write or draw a letter to a climate changer:</p>
        <button
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={() => handleShapeType("circle")}
        >
          Add Circle
        </button>
        <button
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={() => handleShapeType("rectangle")}
        >
          Add Rectangle
        </button>
      </div>
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* stage is a div wrapper */}
        <Layer ref={layerRef}>
          {/* layer is 2d canvas element */}
          {/* Render all shapes */}
          {shapes.map((shape) => {
            if (shape instanceof Konva.Circle) {
              return (
                <Circle
                  key={shape.attrs.id}
                  radius={shape.attrs.radius}
                  fill={shape.attrs.fill}
                  stroke={shape.attrs.stroke}
                  strokeWidth={shape.attrs.strokeWidth}
                  x={shape.attrs.x}
                  y={shape.attrs.y}
                />
              );
            } else if (shape instanceof Konva.Rect) {
              return (
                <Rect
                  key={shape.attrs.id}
                  width={shape.attrs.width}
                  height={shape.attrs.height}
                  fill={shape.attrs.fill}
                  stroke={shape.attrs.stroke}
                  strokeWidth={shape.attrs.strokeWidth}
                  x={shape.attrs.x}
                  y={shape.attrs.y}
                />
              );
            }
          })}
        </Layer>
      </Stage>
    </div>
  );
}
