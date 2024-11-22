import UploadButton from "./UploadButton";
import OpenSeadragonViewer from "./Viewer";

function App() {
  // const tileSource =
  //   "https://openseadragon.github.io/example-images/duomo/duomo.dzi";
  const tileSource = {
    type: "image",
    url: "https://img.goodfon.ru/wallpaper/nbig/a/69/kartinka-3d-dikaya-koshka.webp",
  };
  return (
    <div>
      <OpenSeadragonViewer tileSource={tileSource} />
      <UploadButton />
    </div>
  );
}

export default App;
