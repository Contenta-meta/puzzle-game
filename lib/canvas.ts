export const getMousePos = (e: React.MouseEvent, rect: DOMRect) => {
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (x < 0 || y < 0) {
    return null;
  }

  return { x, y };
};

export const drawPath = (
  ctx: CanvasRenderingContext2D,
  paths: { x: number; y: number }[]
) => {
  ctx.beginPath();
  ctx.moveTo(paths[0].x, paths[0].y);
  for (let i = 1; i < paths.length; i++) ctx.lineTo(paths[i].x, paths[i].y);
  ctx.closePath();
};

export const fillPath = ({
  ctx,
  paths,
  fillStyle,
}: {
  ctx: CanvasRenderingContext2D;
  paths: { x: number; y: number }[];
  fillStyle?: string;
}) => {
  ctx.save();
  drawPath(ctx, paths);
  if (fillStyle) ctx.fillStyle = fillStyle;
  ctx.clip();
  ctx.fill();
  ctx.restore();
};

const getShapeSize = (paths: { x: number; y: number }[]) => {
  let top = 0;
  let bottom = Infinity;
  let right = 0;
  let left = Infinity;

  paths.forEach((c) => {
    if (c.x > right) right = c.x;
    if (c.x < left) left = c.x;
    if (c.y < bottom) bottom = c.y;
    if (c.y > top) top = c.y;
  });

  const width = right - left;
  const height = top - bottom;

  return { width, height, left, right, top, bottom };
};

const trimCanvas = (
  ctx: CanvasRenderingContext2D,
  left: number,
  bottom: number,
  width: number,
  height: number
) => {
  const copy = document.createElement("canvas").getContext("2d")!;
  const trimmed = ctx.getImageData(left, bottom, width, height);
  copy.canvas.width = width;
  copy.canvas.height = height;
  copy.putImageData(trimmed, 0, 0);
  return copy.canvas;
};

export const cropPath = ({
  width,
  height,
  paths,
  image,
}: {
  width: number;
  height: number;
  paths: { x: number; y: number }[];
  image: HTMLImageElement;
}) => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  fillPath({ ctx, paths });
  ctx.save();
  ctx.clip();
  ctx.drawImage(image, 0, 0);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.restore();

  const shapeSize = getShapeSize(paths);
  const trimmedCanvas = trimCanvas(
    ctx,
    shapeSize.left,
    shapeSize.bottom,
    shapeSize.width,
    shapeSize.height
  );
  const { x, y } = paths[0];

  return {
    id: `${x}${y}`,
    src: trimmedCanvas.toDataURL(),
    x,
    y,
    width: shapeSize.width,
    height: shapeSize.height,
  };
};
