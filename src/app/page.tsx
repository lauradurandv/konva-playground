"use client";
import { useEffect, useState, useRef } from "react";
import { Stage, Layer, Circle, Rect, Line } from "react-konva";
import Konva from "konva";
import {
  ShapeTypes,
  ToolTypes,
  LineData,
  ShapeOptions,
  KonvaMouseEventType,
  PointType
} from "../types/types";

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [toolType, setToolType] = useState<ToolTypes>("pen");
  const [color, setColor] = useState("#2563eb");
  const [shapes, setShapes] = useState<ShapeTypes[]>([]);
  const [lines, setLines] = useState<LineData[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapeType, setShapeType] = useState<ShapeOptions>("");

  const [point1, setPoint1] = useState<PointType>({
    x: 0,
    y: 0,
  });
  const [point2, setPoint2] = useState<PointType>({
    x: 0,
    y: 0,
  });
  const layerRef = useRef(null);

  useEffect(() => {
    // Set the canvas size after the component mounts (client-side)
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  const handleMouseDown = (e: KonvaMouseEventType) => {
    //grab latest mouse position
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) {
      return;
    }
    point1.x = pos.x;
    point1.y = pos.y;
    setIsDrawing(true);

    //explicity check tool not selected
    if (toolType === "") {
      console.warn("No tool selected");
      return;
    }

    //If pen/eraser is active, we begin to draw/erase the line
    if (toolType === "pen" || toolType === "eraser") {
      setLines([
        ...lines,
        { toolType, toolColor: color, points: [point1.x, point1.y] },
      ]);
    }
  };

  const handleMouseMove = (e: KonvaMouseEventType) => {
    //grab the second point
    if (!isDrawing) return;
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) {
      return;
    }
    point2.x = pos.x;
    point2.y = pos.y;

    //continue to draw/erase the line
    if (toolType === "pen" || toolType === "eraser") {
      const lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point2.x, point2.y]);
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  const handleMouseUp = () => {
    //once we let release/unclick we create the shape
    setIsDrawing(false);
    const shape = createShape(point1, point2);
    //add it our shapes
    setShapes((prevShapes) => [...prevShapes, shape]);
  };

  const createShape = (p1:PointType, p2:PointType) => {
    const distanceP1toP2 = Math.sqrt(
      (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2
    );
    let shape;
    if (shapeType === "circle") {
      shape = new Konva.Circle({
        id: Date.now().toString(),
        radius: distanceP1toP2,
        fill: color,
        stroke: "black",
        strokeWidth: 5,
        x: p1.x,
        y: p1.y,
      });
    } else if (shapeType === "rectangle") {
      shape = new Konva.Rect({
        id: Date.now().toString(),
        height: p2.y - p1.y,
        width: p2.x - p1.x,
        fill: color,
        stroke: "black",
        strokeWidth: 5,
        x: p1.x,
        y: p1.y,
      });
    }
    return shape;
  };

  const handleShapeType = (shape: ShapeOptions) => {
    setToolType("");
    setShapeType(shape);
  };

  const handleToolType = (tool: ToolTypes) => {
    setShapeType("");
    setToolType(tool);
  };

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = "".concat(e.target.value);
    setColor(color);
  };

  const handleReset = () => {
    setShapes([]);
    setLines([]);
    console.log("reset hit");
  };

  return (
    <div>
      <div>
        <p>Write or draw a letter to a climate changer:</p>
        <button
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={() => handleShapeType("circle")}
        >
          Circle
        </button>
        <button
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={() => handleShapeType("rectangle")}
        >
          Rectangle
        </button>
        <button
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={() => handleToolType("pen")}
        >
          Pen
        </button>
        <button
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={() => handleToolType("eraser")}
        >
          Eraser
        </button>
        <label
          htmlFor="hs-color-input"
          className="block text-sm font-medium mb-2 dark:text-white"
        >
          Color picker
        </label>
        <input
          type="color"
          className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
          id="hs-color-input"
          value={color}
          title="Choose your color"
          onChange={handleColor}
        ></input>
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
          {/*Render Lines*/}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.toolColor}
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.toolType === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
      <div>
        <button
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
