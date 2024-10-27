import { fabric } from "fabric";
import React, { useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import { useLocation, useNavigate } from "react-router-dom";

const CanvasEditor = () => {
  const location = useLocation();
  const { imageUrl } = location.state || {};
  const canvasContainerRef = useRef(null); // Reference for the canvas DOM element
  const fabricCanvasRef = useRef(null); // Reference for the Fabric.js canvas instance
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Goes back to the previous page
  };

  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasContainerRef.current, {
      width: 600,
      height: 400,
    });
    fabricCanvasRef.current = canvas; // Store the Fabric.js canvas instance in a separate ref

    const loadImage = () => {
      // Load image with crossOrigin enabled
      fabric.Image.fromURL(
        imageUrl,
        (img) => {
          if (fabricCanvasRef.current) {
            img.set({ selectable: false });

            // Calculate scale to cover canvas while maintaining aspect ratio
            const canvasAspect = canvas.width / canvas.height;
            const imageAspect = img.width / img.height;

            if (canvasAspect >= imageAspect) {
              img.scaleToWidth(canvas.width); // Scale image width to match canvas
            } else {
              img.scaleToHeight(canvas.height); // Scale image height to match canvas
            }

            // Center the image
            img.set({
              left: (canvas.width - img.width * img.scaleX) / 2,
              top: (canvas.height - img.height * img.scaleY) / 2,
            });

            fabricCanvasRef.current.add(img);
            fabricCanvasRef.current.sendToBack(img);
          }
        },
        { crossOrigin: "anonymous" }
      );
    };

    loadImage(); // Call the function to load the image

    // Cleanup function to dispose of the Fabric.js canvas
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose(); // Dispose the Fabric.js canvas instance
        fabricCanvasRef.current = null; // Reset Fabric.js canvas reference
      }
    };
  }, [imageUrl]);
  const logCanvasLayers = () => {
    const layers = fabricCanvasRef.current.getObjects().map((obj) => ({
      type: obj.type,
      left: obj.left,
      top: obj.top,
      width: obj.width * obj.scaleX,
      height: obj.height * obj.scaleY,
      fill: obj.fill || null,
      text: obj.text || null,
      src: obj.src || null,
    }));

    console.log("Canvas Layers:", layers);
  };

  const addText = () => {
    console.log("object");
    if (!fabricCanvasRef.current) return; // Guard clause
    const text = new fabric.Textbox("Enter text", {
      left: 50,
      top: 50,
      fontSize: 20,
      editable: true,
    });
    fabricCanvasRef.current.add(text).setActiveObject(text);
  };

  const addShape = (type) => {
    if (!fabricCanvasRef.current) return; // Guard clause
    let shape;
    switch (type) {
      case "circle":
        shape = new fabric.Circle({
          radius: 50,
          fill: "transparent", // Transparent fill
          stroke: "black", // Black border color
          strokeWidth: 2, // Border width
          left: 100,
          top: 100,
        });
        break;
      case "rectangle":
        shape = new fabric.Rect({
          width: 100,
          height: 50,
          fill: "transparent", // Transparent fill
          stroke: "black", // Black border color
          strokeWidth: 2, // Border width
          left: 150,
          top: 150,
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: "transparent", // Transparent fill
          stroke: "black", // Black border color
          strokeWidth: 2, // Border width
          left: 200,
          top: 200,
        });
        break;
      default:
        return;
    }
    fabricCanvasRef.current.add(shape).setActiveObject(shape);
  };

  const addPolygon = (sides = 5, radius = 50) => {
    if (!fabricCanvasRef.current) {
      return;
    }

    const points = [];
    const angle = (2 * Math.PI) / sides;

    for (let i = 0; i < sides; i++) {
      const x = radius * Math.cos(i * angle);
      const y = radius * Math.sin(i * angle);
      points.push({ x, y });
    }

    const polygon = new fabric.Polygon(points, {
      left: 250,
      top: 250,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      selectable: true,
    });

    fabricCanvasRef.current.add(polygon).setActiveObject(polygon);
    // fabricCanvasRef.current.renderAll(); // Ensure canvas is re-rendered
  };

  const downloadImage = () => {
    if (!fabricCanvasRef.current) return; // Guard clause
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: "png",
      quality: 1,
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "modified-image.png";
    link.click();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Image Editor</h1>

        <div>
          <Button variant="dark" className="me-2" onClick={logCanvasLayers}>
            Log Canvas Layers
          </Button>
          <Button variant="secondary" onClick={handleBack}>
            Home
          </Button>
        </div>
      </div>

      <div className="d-flex gap-10 align-items-center flex-wrap mb-3 mt-5">
        <Button variant="dark" onClick={addText}>
          Add Text
        </Button>
        <Button variant="dark" onClick={() => addShape("circle")}>
          Add Circle
        </Button>
        <Button variant="dark" onClick={() => addShape("rectangle")}>
          Add Rectangle
        </Button>
        <Button variant="dark" onClick={() => addShape("triangle")}>
          Add Triangle
        </Button>
        <Button variant="dark" onClick={() => addPolygon(5, 50)}>
          Add Polygon
        </Button>
        <Button variant="dark" onClick={downloadImage}>
          Download
        </Button>
      </div>

      <canvas ref={canvasContainerRef} style={{ border: "1px solid black" }} />
    </div>
  );
};

export default CanvasEditor;
