import { useEffect, useRef } from "react";
import OpenSeadragon from "openseadragon";

type TileType = {
  tileSource?: string;
};

const OpenSeadragonViewer = (props: TileType) => {
  const { tileSource } = props;
  const viewerRef = useRef<HTMLDivElement | null>(null); // Указываем, что это div
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const viewerInstanceRef = useRef<OpenSeadragon.Viewer | null>(null);

  useEffect(() => {
    const viewer = OpenSeadragon({
      // id: "openseadragon-viewer", // ID элемента DOM для рендера
      id: viewerRef.current.id,
      prefixUrl:
        // "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.0.0/images/",
        "./src/assets/icons/",
      // navigatorId: "minimap-navigator",
      // navigatorId: minimapRef.current.id,
      tileSources: tileSource,
      showNavigator: true,
      defaultZoomLevel: 1,
      // navigatorAutoResize: false,
      gestureSettingsMouse: {
        clickToZoom: true,
        scrollToZoom: true,
      },
      opacity: 1, // прозрачность
      showReferenceStrip: true,
      navigationControlAnchor: 3,
      navImages: {
        zoomIn: {
          REST: "zoomin_rest.svg",
          GROUP: "zoomin_hover.svg",
          HOVER: "zoomin_hover.svg",
          DOWN: "zoomin_down.svg",
        },
        zoomOut: {
          REST: "zoom_out_rest.svg",
          GROUP: "zoom_out_hover.svg",
          HOVER: "zoom_out_hover.svg",
          DOWN: "zoom_out_down.svg",
        },
        home: {
          REST: "home_rest.svg",
          GROUP: "home_hover.svg",
          HOVER: "home_hover.svg",
          DOWN: "home_down.svg",
        },
        fullpage: {
          REST: "fullpage_rest.svg",
          GROUP: "fullpage_hover.svg",
          HOVER: "fullpage_hover.svg",
          DOWN: "fullpage_down.svg",
        },
      },
      // collectionMode: true,
    });

    viewer.navigator.element.style.zIndex = "500";

    return () => viewer.destroy();

    // const navigatorElement = viewer.navigator.element.id;
    // console.log(navigatorElement);
    // }, [tileSource]);
  }, []);

  // useEffect(() => {
  //   console.log("viewerRef:", viewerRef.current);
  //   console.log("minimapRef:", minimapRef.current.id);
  // });

  return (
    <div
      id="openseadragon-viewer"
      ref={viewerRef}
      style={{ width: "100%", height: "600px", border: "1px solid black" }}
    ></div>
    // <div className="viewer-container">
    //   <div id="openseadragon-viewer" ref={viewerRef}></div>
    //   <div className="sidebar">
    //     <h3>Сайдбар</h3>
    //     <p>Контент сайдбара</p>
    //   </div>
    // </div>
  );
};

export default OpenSeadragonViewer;
