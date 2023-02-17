import Konva from "konva";
import { Group, Rect, Text } from "react-konva";

interface BorderRectWithText {
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  onDragMove: (evt: Konva.KonvaEventObject<DragEvent>) => void;
  onClick: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
}
export const BorderRectWithText = ({ value, x, y, width, height, onDragMove, onClick }: BorderRectWithText) => (
  <Group x={x} y={y} onDragMove={onDragMove} onClick={onClick} draggable>
    <Text text={`${value}`} stroke="blue" strokeWidth={1} />
    <Rect width={width} height={height} stroke="red" strokeWidth={1} />
  </Group>
);
