import { Button, Input } from "antd";

import OpenSeadragonViewer from "./Viewer";
import { useState } from "react";
import { Sidebar } from "./widgets/Sidebar/Sidebar";
import Menu from "./widgets/Menu/Menu";

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

  const [backendData, setBackendData] = useState(null);

  const handleDataFromBackend = (data) => {
    console.log("Received data:", data);
    setBackendData(data); // Обновляем состояние
  };

  console.log(backendData);

  const [flag, setFlag] = useState(false);
  const handleDataToBackend = () => {
    setFlag(true);
  };

  const [coords, setCoords] = useState();
  const handlerCoords = (data) => {
    setCoords(data);
  };

  return (
    <div>
      <OpenSeadragonViewer
        tileSource={
          backendData
            ? "http://93.183.82.224:3000/images/download-file/" +
              backendData.dziKey
            : "https://openseadragon.github.io/example-images/duomo/duomo.dzi"
        }
        zoom={backendData ? backendData.viewportZoom : 0}
        x={backendData ? backendData.viewportX : 0}
        y={backendData ? backendData.viewportY : 0}
        flag={flag}
        handlerCoords={handlerCoords}
      />
      <Menu
        handleDataFromBackend={handleDataFromBackend}
        handleDataToBackend={handleDataToBackend}
        coords={coords}
      />

      {/* <Input
        onChange={(e) => setInputValue(e.target.value)}
        defaultValue="Combine input and button"
      />
      <Button onClick={handleChange} type="primary">
        Submit
      </Button> */}
    </div>
  );
}

export default App;
