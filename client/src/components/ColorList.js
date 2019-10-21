import React, { useState } from "react";
import { axiosWithAuth, reset, handleChange } from "../functions";
import { AddCircle, ArrowBack } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

import Modal from "./Modal";

const ColorList = ({ colors, updateColors }) => {
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [colorName, setColorName] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [colorId, setColorId] = useState(0);
  const [noInputModal, setNoInputModal] = useState(false);
  const [properHexModal, setProperHexModal] = useState(false);
  const history = useHistory();

  const editColor = color => {
    setEditing(true);
    setAdding(false);
    setColorId(color.id);
    setColorCode(color.code.hex);
    setColorName(color.color);
  };

  const saveEdit = e => {
    e.preventDefault();
    const colorObj = {
      color: colorName,
      code: { hex: colorCode },
      id: colorId
    };

    if (!colorObj.code.hex || !colorObj.color) {
      setNoInputModal(true);
    } else if (colorObj.code.hex[0] !== "#" || colorObj.code.hex.length !== 7) {
      setProperHexModal(true);
    } else {
      axiosWithAuth()
        .put(`/api/colors/${colorId}`, colorObj)
        .then(res => {
          updateColors(
            colors.map(color => (color.id === colorId ? colorObj : color))
          );
          reset(
            [setEditing, setColorName, setColorCode],
            [editing, colorName, colorCode]
          );
        })
        .catch(err => console.log(err));
    }
  };

  const deleteColor = deletingColor => {
    axiosWithAuth()
      .delete(`/api/colors/${deletingColor.id}`)
      .then(res => {
        updateColors(colors.filter(color => color.id !== deletingColor.id));
      })
      .catch(err => console.log(err.response));
  };

  const addColor = e => {
    e.preventDefault();
    const colorObj = {
      color: colorName,
      code: { hex: colorCode }
    };
    if (!colorObj.code.hex || !colorObj.color) {
      setNoInputModal(true);
    } else if (colorObj.code.hex[0] !== "#" || colorObj.code.hex.length !== 7) {
      setProperHexModal(true);
    } else {
      axiosWithAuth()
        .post("/api/colors", colorObj)
        .then(res => {
          updateColors([...colors, colorObj]);
          setAdding(false);
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <div className="colors-wrap">
      {noInputModal && (
        <Modal
          content={
            <h2>Opps! Looks like you forgot to fill in all required feilds.</h2>
          }
          handleClose={() => setNoInputModal(false)}
        />
      )}
      {properHexModal && (
        <Modal
          content={<h2>Please enter a valid hex code.</h2>}
          handleClose={() => setProperHexModal(false)}
        />
      )}
      <div className="color-list-head">
        <ArrowBack
          onClick={() => {
            localStorage.removeItem("token");
            history.push("/");
          }}
          className="icon"
        />
        <p>colors</p>
        <AddCircle
          onClick={() => {
            reset(
              [setEditing, setColorName, setColorCode],
              [editing, colorName, colorCode]
            );
            setAdding(!adding);
          }}
          className="icon"
        />
      </div>
      <hr />
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className="delete"
                onClick={e => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e => handleChange(e, setColorName)}
              value={colorName}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e => handleChange(e, setColorCode)}
              value={colorCode}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {adding && (
        <form onSubmit={addColor}>
          <legend>add new color</legend>
          <label>
            color name:
            <input
              onChange={e => handleChange(e, setColorName)}
              value={colorName}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e => handleChange(e, setColorCode)}
              value={colorCode}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button
              onClick={e => {
                e.preventDefault();
                setAdding(false);
              }}
            >
              cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ColorList;
