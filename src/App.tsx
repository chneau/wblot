import Konva from "konva";
import { useContext, useState } from "react";
import { Image as KonvaImage, Layer, Stage, Text } from "react-konva";
import { DropzoneContext } from "./DropzoneContext";
import { Rectangle, RectangleManager } from "./RectangleManager";

export const App = () => {
  const { image } = useContext(DropzoneContext);
  const [width, setWidth] = useState(45);
  const [height, setHeight] = useState(15);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
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
  return (
    <Stage width={window.innerWidth} height={window.innerHeight} onClick={onCanvasClick}>
      <Layer>
        {image ? <KonvaImage image={image} /> : <Text text="Drag and drop a picture" x={window.innerWidth / 2} y={window.innerHeight / 2} />}
        <RectangleManager rectangles={rectangles} setRectangles={setRectangles} width={width} height={height} />
      </Layer>
    </Stage>
  );
};
