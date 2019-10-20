import React, { useState } from "react";
import { axiosWithAuth } from "../functions";
import { AddCircle, ArrowBack } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

import Modal from "./Modal";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState(initialColor);
  const [noInputModal, setNoInputModal] = useState(false);
  const [properHexModal, setProperHexModal] = useState(false);
  const history = useHistory();

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        updateColors(
          colors.map(color =>
            color.id === colorToEdit.id ? colorToEdit : color
          )
        );
      })
      .catch(err => console.log(err));
    setEditing(false);
  };

  const deleteColor = deletingColor => {
    // make a delete request to delete this color
    axiosWithAuth()
      .delete(`/api/colors/${deletingColor.id}`)
      .then(res => {
        updateColors(colors.filter(color => color.id !== deletingColor.id));
      })
      .catch(err => console.log(err.response));
  };

  const addColor = e => {
    e.preventDefault();
    if (!newColor.code.hex || !newColor.color) {
      setNoInputModal(true);
    } else if (newColor.code.hex[0] !== "#" || newColor.code.hex.length !== 7) {
      setProperHexModal(true);
    } else {
      axiosWithAuth()
        .post("/api/colors", newColor)
        .then(res => {
          updateColors([...colors, newColor]);
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
        />
        <p>colors</p>
        <AddCircle onClick={() => setAdding(!adding)} />
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
              </span>{" "}
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
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
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
        <form onSubmit={e => addColor(e)}>
          <legend>add new color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setNewColor({ ...newColor, color: e.target.value })
              }
              value={newColor.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setNewColor({
                  ...newColor,
                  code: { hex: e.target.value }
                })
              }
              value={newColor.code.hex}
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
