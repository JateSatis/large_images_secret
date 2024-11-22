import { useEffect, useRef } from "react";
import OpenSeadragon from "openseadragon";

type TileType = {
  tileSource?: string;
};

const OpenSeadragonViewer = (props: TileType) => {
  const { tileSource } = props;
  const viewerRef = useRef(null);

  useEffect(() => {
    // Инициализация OpenSeadragon
    const viewer = OpenSeadragon({
      id: "openseadragon-viewer", // ID элемента DOM для рендера
      prefixUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.0.0/images/",
      tileSources: tileSource,
      showNavigator: true,
      defaultZoomLevel: 1,
      gestureSettingsMouse: {
        clickToZoom: true,
        scrollToZoom: true,
      },
    });

    return () => {
      // Очистка при размонтировании
      if (viewer) viewer.destroy();
    };
  }, [tileSource]);

  return (
    <div
      id="openseadragon-viewer"
      ref={viewerRef}
      style={{ width: "100%", height: "600px", border: "1px solid black" }}
    ></div>
  );
};

export default OpenSeadragonViewer;
