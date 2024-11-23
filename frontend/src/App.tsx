import { Button, Input } from "antd";

import OpenSeadragonViewer from "./Viewer";
import { useState } from "react";

function App() {
  // const tileSource =
  // "https://openseadragon.github.io/example-images/duomo/duomo.dzi";
  const [tileSource, setTileSource] = useState(
    "https://openseadragon.github.io/example-images/duomo/duomo.dzi"
  );
  // "https://img.goodfon.ru/wallpaper/nbig/a/69/kartinka-3d-dikaya-koshka.webp"
  const [inputValue, setInputValue] = useState("");
  // const tileSource = {
  //   type: "image",
  //   url: "https://img.goodfon.ru/wallpaper/nbig/a/69/kartinka-3d-dikaya-koshka.webp",
  // };

  const handleChange = () => {
    setTileSource(inputValue);
  };

  return (
    <div>
      <Input
        onChange={(e) => setInputValue(e.target.value)}
        defaultValue="Combine input and button"
      />
      <Button onClick={handleChange} type="primary">
        Submit
      </Button>
      <OpenSeadragonViewer tileSource={tileSource} />
    </div>
  );
}

export default App;
