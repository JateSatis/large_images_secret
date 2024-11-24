import { useEffect, useRef } from "react";
import OpenSeadragon from "openseadragon";
import styles from "./Viewer.module.scss";
import axios from "axios";

type TileType = {
  tileSource?: string;
  zoom?: number;
  x?: number;
  y?: number;
  flag?: boolean;
};

const OpenSeadragonViewer = (props: TileType) => {
  const { tileSource, zoom, x, y, flag, handlerCoords } = props;
  const viewerRef = useRef<HTMLDivElement | null>(null); // Указываем, что это div
  const viewerInstanceRef = useRef<OpenSeadragon.Viewer | null>(null);
  const navigatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(tileSource);

    if (viewerRef.current && !viewerInstanceRef.current) {
      viewerInstanceRef.current = OpenSeadragon({
        element: viewerRef.current, // Указываем DOM-элемент
        tileSources: tileSource,
        showNavigator: true,
        navigatorAutoFade: false,
        defaultZoomLevel: 1,
        // toolbar: "toolbar-container",
        // navigatorContainer: navigatorRef.current,
        navigatorContainer: "navigator-container",
        prefixUrl: "./src/assets/icons/",
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
      });
    } else if (viewerInstanceRef.current) {
      //       // Если Viewer уже инициализирован, обновляем его source
      viewerInstanceRef.current.open(tileSource);
    }

    //     // const viewer = OpenSeadragon({
    //     //   // id: "openseadragon-viewer", // ID элемента DOM для рендера
    //     //   id: viewerRef.current.id,
    //     //   prefixUrl:
    //     //     // "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.0.0/images/",
    //     //     "./src/assets/icons/",
    //     //   // navigatorId: "minimap-navigator",
    //     //   // navigatorId: minimapRef.current.id,
    //     //   tileSources: tileSource,
    //     //   showNavigator: true,
    //     //   defaultZoomLevel: 1,
    //     //   // navigatorAutoResize: false,
    //     //   gestureSettingsMouse: {
    //     //     clickToZoom: true,
    //     //     scrollToZoom: true,
    //     //   },
    //     //   opacity: 1, // прозрачность
    //     //   showReferenceStrip: true,
    //     //   navigationControlAnchor: 3,
    //     // navImages: {
    //     //   zoomIn: {
    //     //     REST: "zoomin_rest.svg",
    //     //     GROUP: "zoomin_hover.svg",
    //     //     HOVER: "zoomin_hover.svg",
    //     //     DOWN: "zoomin_down.svg",
    //     //   },
    //     //   zoomOut: {
    //     //     REST: "zoom_out_rest.svg",
    //     //     GROUP: "zoom_out_hover.svg",
    //     //     HOVER: "zoom_out_hover.svg",
    //     //     DOWN: "zoom_out_down.svg",
    //     //   },
    //     //   home: {
    //     //     REST: "home_rest.svg",
    //     //     GROUP: "home_hover.svg",
    //     //     HOVER: "home_hover.svg",
    //     //     DOWN: "home_down.svg",
    //     //   },
    //     //   fullpage: {
    //     //     REST: "fullpage_rest.svg",
    //     //     GROUP: "fullpage_hover.svg",
    //     //     HOVER: "fullpage_hover.svg",
    //     //     DOWN: "fullpage_down.svg",
    //     //   },
    //     // },
    //     //   // collectionMode: true,
    //     // });

    //     // viewer.navigator.element.style.zIndex = "500";

    if (zoom && x && y) {
      const zoomLevel = zoom; // Желаемый уровень зума
      const zoomCenter = new OpenSeadragon.Point(x, y); // Координаты в viewport

      // Установить зум с фокусом на точке

      viewerInstanceRef.current.addHandler("open", () => {
        viewerInstanceRef.current.viewport.zoomTo(
          zoomLevel,
          zoomCenter
          // viewerInstanceRef.current.viewport.imageToViewportCoordinates(
          //   zoomCenter
          // )
        ); // Зум сработает только после загрузки изображения
      });

      console.log(zoom, x, y);
    }

    const currentCenter = viewerInstanceRef.current.viewport.getCenter();
    // const imagePoint =
    //   viewerInstanceRef.current.viewport.viewportToImageCoordinates(
    //     currentCenter
    //   );
    // console.log(
    //   "Current Center (image coordinates):",
    //   imagePoint.x,
    //   currentCenter
    // );

    // useEffect(() => {
    // if (flag) {
    const currentZoom = viewerInstanceRef.current.viewport.getZoom();
    // function generateUniqueName(prefix = "item") {
    //   const timestamp = Date.now(); // Возвращает время в миллисекундах с 1970 года
    //   return `${prefix}_${timestamp}`;
    // }

    //console.log(generateUniqueName()); // Пример: item_1700821834231

    const requestData = {
      x: currentCenter.x,
      y: currentCenter.y,
      zoom: currentZoom,
      dziKey: tileSource,
      originalName: "item_" + Date.now(),
    };
    handlerCoords(requestData);
    // }
    // console.log("Current Zoom Level:", currentZoom);
    // const sendTo = async () => {
    //   try {
    // const requestData = {
    //   x: currentCenter.x,
    //   y: currentCenter.y,
    //   zoom: currentZoom,
    //   dziKey: tileSource,
    // };
    //     const response = await axios.post(
    //       "http://93.183.82.224:3000/images/create-screenshot",
    //       requestData
    //     );
    //     console.log("Response data:", response.data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // }, [flag]);

    // viewerInstanceRef.current.addHandler("open", () => {
    //   viewerInstanceRef.current.viewport.zoomTo(2.0); // Зум сработает только после загрузки изображения
    // });

    viewerInstanceRef.current.addHandler("canvas-click", function (event) {
      const viewportPoint = viewerInstanceRef.current.viewport.pointFromPixel(
        event.position
      );
      const imagePoint =
        viewerInstanceRef.current.viewport.viewportToImageCoordinates(
          viewportPoint
        );
      addMarker(imagePoint);
    });

    return () => {
      viewerInstanceRef.current?.destroy();
      viewerInstanceRef.current = null;
    };

    //     // const navigatorElement = viewer.navigator.element.id;
    //     // console.log(navigatorElement);
  }, [tileSource]);
  //   // }, []);

  //   // useEffect(() => {
  //   //   console.log("viewerRef:", viewerRef.current);
  //   //   console.log("minimapRef:", minimapRef.current.id);
  //   // });

  return (
    <div className={styles.viewerContainer}>
      <div ref={viewerRef} className={styles.openseadragonCanvas}></div>
      <div className={styles.viewerOverlay}>
        <div className={styles.sidebar}>
          <div ref={navigatorRef} className={styles.navigator}></div>{" "}
          {/* Контейнер для миникарты */}
          {/* <button>+</button>
          <button>-</button>
          <div className={styles.zoomInfo}>1.0x</div>
          <button>⬆️</button>
          <button>⤢</button> */}
          {/* <div id="toolbar-container"></div> */}
          <hr />
          {/* <div className={styles.actions}>
            <div>Комментарий</div>
            <div>Скриншот</div>
            <div>Нейросеть</div>
            <div className={styles.curveInfo}>Кривые 376 x 0</div>
            <div className={styles.curveGraph}></div>
          </div> */}
        </div>
      </div>
      <div className={styles.menu}></div>
    </div>
  );

  //     // <div className={styles.viewerContainer}>
  //     //   <div ref={viewerRef} className={styles.openseadragonCanvas}></div>
  //     //   <div className={styles.viewerOverlay}>
  //     //     <div className={styles.sidebar}>
  //     //       <button>+</button>
  //     //       <button>-</button>
  //     //       <div className={styles.zoomInfo}>1.0x</div>
  //     //       <button>⬆️</button>
  //     //       <button>⤢</button>
  //     //       <hr />
  //     //       <div className={styles.actions}>
  //     //         <div>Комментарий</div>
  //     //         <div>Скриншот</div>
  //     //         <div>Нейросеть</div>
  //     //         <div className={styles.curveInfo}>Кривые 376 x 0</div>
  //     //         <div className={styles.curveGraph}></div>
  //     //       </div>
  //     //     </div>
  //     //   </div>
  //     // </div>

  //     // <div
  //     //   id="openseadragon-viewer"
  //     //   ref={viewerRef}
  //     //   style={{ width: "100%", height: "600px", border: "1px solid black" }}
  //     // ></div>

  //     // <div className="viewer-container">
  //     //   <div id="openseadragon-viewer" ref={viewerRef}></div>
  //     //   <div className="sidebar">
  //     //     <h3>Сайдбар</h3>
  //     //     <p>Контент сайдбара</p>
  //     //   </div>
  //     // </div>
  //   );
};

export default OpenSeadragonViewer;
