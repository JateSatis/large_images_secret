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
        // "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.0.0/images/",
        "./src/assets/icons/",
      tileSources: tileSource,
      showNavigator: true,
      defaultZoomLevel: 1,
      gestureSettingsMouse: {
        clickToZoom: true,
        scrollToZoom: true,
      },
      drawer: "canvas", // '''
      opacity: 1, // прозрачность
      showReferenceStrip: true,
      navigationControlAnchor: 3,
      NavImages: {
        zoomIn: {
          REST: "zoom_in_rest.png",
          GROUP: "zoom_in_hover.png",
          HOVER: "zoom_in_hover.png",
          DOWN: "zoom_in_down.png",
        },
        zoomOut: {
          REST: "zoom_out_rest.png",
          GROUP: "zoom_out_hover.png",
          HOVER: "zoom_out_hover.png",
          DOWN: "zoom_out_down.png",
        },
        home: {
          REST: "home_rest.png",
          GROUP: "home_hover.png",
          HOVER: "home_hover.png",
          DOWN: "home_down.png",
        },
        fullpage: {
          REST: "fullpage_rest.png",
          GROUP: "fullpage_hover.png",
          HOVER: "fullpage_hover.png",
          DOWN: "fullpage_down.png",
        },
      },
      // collectionMode: true,
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
