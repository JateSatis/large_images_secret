import { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";

type TileType = {
  tileSource?: string;
};

const OpenSeadragonViewer = (props: TileType) => {
  const { tileSource } = props;
  const viewerRef = useRef(null);
  const minimapRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Инициализация OpenSeadragon
    if (!viewerRef.current || !minimapRef.current) {
      console.error(
        "Не удалось найти контейнеры для OpenSeadragon или миникарты."
      );
      return;
    }
    const viewer = OpenSeadragon({
      // id: "openseadragon-viewer", // ID элемента DOM для рендера
      id: viewerRef.current.id,
      prefixUrl:
        // "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.0.0/images/",
        "./src/assets/icons/",
      // navigatorId: "minimap-navigator",
      navigatorId: minimapRef.current.id,
      tileSources: tileSource,
      showNavigator: true,
      defaultZoomLevel: 1,
      gestureSettingsMouse: {
        clickToZoom: true,
        scrollToZoom: true,
      },
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
    console.log("OpenSeadragon инициализирован.");
    // setIsInitialized(true);
    return () => {
      // Очистка при размонтировании
      if (viewer) viewer.destroy();
      console.log("Уничтожение OpenSeadragon.");
    };

    // const navigatorElement = viewer.navigator.element.id;
    // console.log(navigatorElement);
    // }, [tileSource]);
  }, []);

  useEffect(() => {
    console.log("viewerRef:", viewerRef.current);
    console.log("minimapRef:", minimapRef.current.id);
  });

  return (
    // <div
    //   id="openseadragon-viewer"
    //   ref={viewerRef}
    //   style={{ width: "100%", height: "600px", border: "1px solid black" }}
    // ></div>
    <div className="container">
      {/* Сайдбар */}
      <div className="sidebar">
        <h2>Сайдбар</h2>
        <div
          ref={minimapRef}
          id="custom-minimap-id"
          className="minimap-container"
        ></div>
      </div>

      {/* Контейнер OpenSeadragon */}
      <div ref={viewerRef} id="openseadragon-container"></div>
    </div>
  );
};

export default OpenSeadragonViewer;
