import axios from "axios";
import styles from "./Menu.module.scss"; // Подключите файл CSS
import { createContext, useContext } from "react";
import { Button } from "antd";

const Menu = ({ handleDataFromBackend, handleDataToBackend, coords }) => {
  const ScreenshotsContext = createContext();

  const handleClick = async () => {
    try {
      // const response = await axios
      //   .get("http://93.183.82.224:3000/images/get-screenshots")
      //   .then((res) => res.json());
      const response = await fetch(
        "http://93.183.82.224:3000/images/get-screenshots"
      ).then((res) => res.json());
      console.log(response[0]);
      handleDataFromBackend(response[1]);
    } catch (err) {
      console.log(err);
    }
  };

  const createScreenshot = async () => {
    // console.log("Current Zoom Level:", currentZoom);

    try {
      const response = await axios.post(
        "http://93.183.82.224:3000/images/create-screenshot",
        coords
      );
      console.log("Response data:", response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.menu}>
      {/* <div id="toolbar-container"></div> */}
      <Button onClick={handleClick}>All files</Button>
      <Button onClick={createScreenshot}>Make a Screenshot</Button>
      <Button>Comment</Button>
    </div>
  );
};

export default Menu;
