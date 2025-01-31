import Konva from "konva";
import { Circle } from "konva/lib/shapes/Circle";
import { Rect } from "konva/lib/shapes/Rect";

export type ShapeTypes = Rect | Circle;
export type ToolTypes = "pen" | "eraser" | "";
export type ShapeOptions = "circle" | "rectangle" | "";
export type PointType = {
  x: number;
  y: number;
};
export type KonvaMouseEventType = Konva.KonvaEventObject<MouseEvent>;
export interface LineData {
  toolType: ToolTypes;
  toolColor: string;
  points: number[];
}
