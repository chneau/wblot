import Konva from "konva";
import { useContext, useState } from "react";
import { Image as KonvaImage, Layer, Stage, Text } from "react-konva";
import { BorderRectWithText } from "./BorderRectWithText";
import { DropzoneContext } from "./DropzoneContext";

interface Rectangles {
  value: number;
  x: number;
  y: number;
}
export const App = () => {
  const { image } = useContext(DropzoneContext);
  const [width, setWidth] = useState(45);
  const [height, setHeight] = useState(15);
  const [rectangles, setRectangles] = useState<Rectangles[]>([]);
  const onDragMoveHandler = (idx: number, evt: Konva.KonvaEventObject<DragEvent>) => {
    const newRectangles = [...rectangles];
    newRectangles[idx] = { ...newRectangles[idx], x: evt.target.x(), y: evt.target.y() };
    setRectangles(newRectangles);
  };
  const onCanvasClick = (evt: Konva.KonvaEventObject<MouseEvent>) => {
    if (!evt.evt.ctrlKey) return;
    const stage = evt.target.getStage();
    if (!stage) return console.error("No stage");
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return console.error("No pointer position");
    let { x, y } = pointerPosition;
    x -= width / 2;
    y -= height / 2;
    setRectangles([...rectangles, { value: rectangles.length + 1, x, y }]);
  };
  const onClickHandler = (idx: number, evt: Konva.KonvaEventObject<MouseEvent>) => {
    if (!evt.evt.ctrlKey) return;
    const newRectangles = rectangles.filter((_, i) => idx != i);
    setRectangles(newRectangles);
  };
  return (
    <Stage width={window.innerWidth} height={window.innerHeight} onClick={onCanvasClick}>
      <Layer>{image ? <KonvaImage image={image} /> : <Text text="Drag and drop a picture" x={window.innerWidth / 2} y={window.innerHeight / 2} />}</Layer>
      {rectangles.map((rect, idx) => (
        <BorderRectWithText //
          key={idx}
          width={width}
          height={height}
          onDragMove={(evt) => onDragMoveHandler(idx, evt)}
          onClick={(evt) => onClickHandler(idx, evt)}
          {...rect}
        />
      ))}
    </Stage>
  );
};
