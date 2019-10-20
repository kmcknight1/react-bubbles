import React, { useState, useEffect } from "react";

import { axiosWithAuth } from "../functions";
import Bubbles from "./Bubbles";
import ColorList from "./ColorList";

const BubblePage = props => {
  const [colorList, setColorList] = useState([]);

  console.log("HISTORY", props.history);

  useEffect(() => {
    axiosWithAuth()
      .get("/api/colors")
      .then(res => setColorList(res.data))
      .catch(err => console.log(err.response));
  }, []);

  useEffect(() => () => localStorage.removeItem("token"), []);

  return (
    <div className="bubble-page">
      <ColorList colors={colorList} updateColors={setColorList} />
      <Bubbles colors={colorList} />
    </div>
  );
};

export default BubblePage;
