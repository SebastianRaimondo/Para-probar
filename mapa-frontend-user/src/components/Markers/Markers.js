import React from "react";
import { Marker, Popup } from "react-leaflet";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { useState, useEffect } from "react";
import petitions from "../Petitions";
import "./Markers.scss";
import ImagePopUp from "../ImagePopUp";

const Markers = () => {
  const places = JSON.parse(sessionStorage.getItem("places"));
  if (places === null) {
    window.location = window.location.href;
  }
  const markers = places.map((place, i) => (
    <Marker
      key={i}
      position={[place.lactitude, place.longitude]}
      icon={IconPlace(place)}
    >
      <Popup>
        <h3>{place.name}</h3>
        <p>{place.description}</p>
        <p>{InfoPlace(place)}</p>
      </Popup>
    </Marker>
  ));
  return markers;
};

const stylebox = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "90%",
  width: 750,
  overflow: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function IconPlace(place) {
  const iconList = Object.keys(Icons)
    .filter((key) => key !== "fas" && key !== "prefix")
    .map((icon) => Icons[icon]);

  library.add(...iconList);
  const [icon, setIcon] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await petitions.GetIconNameByCategoryName(place.category);
    setIcon(response);
  };
  const iconMarkup = renderToStaticMarkup(
    <FontAwesomeIcon icon={icon} Color="red" />
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
    className: "dummy",
  });
  return customMarkerIcon;
}

function InfoPlace(place) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Button onClick={handleOpen}>Ver info</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >


        <Box sx={stylebox}>
          <Button onClick={handleClose}>
            <CloseIcon color="primary" />
          </Button>
          <Stack>
          {console.log(place.image[0])}

          {place.image.map(e =>
            <ImagePopUp  imagen = {"http://localhost:8080/images/" + e}/>)}
          </Stack>
          <Stack className="modal-title">
            <b>Nombre:</b>
          </Stack>
          <Stack>{place.name}</Stack>
          <Stack className="modal-title">
            <b>Categoría:</b>
          </Stack>
          <Stack>{place.category}</Stack>
          <Stack className="modal-title">
            <b>Descripción:</b>
          </Stack>
          <Stack>{place.description}</Stack>
          <Stack className="modal-title">
            <b>Características:</b>
          </Stack>
          <Stack>
            {place.features.map((f) => (
              <li>{f}</li>
            ))}
          </Stack>
          {FormRating(place)}
          {FormComment(place)}
        </Box>
      </Modal>
    </div>
  );
}

function FormComment(place) {
  const { register, handleSubmit } = useForm();
  const [state, setState] = useState(place);

  const onSubmit = async (data) => {
    const newComment = await petitions.CreateComment(data);
    let dataCommentToPlace = {};
    dataCommentToPlace.place = state;
    dataCommentToPlace.comment = newComment;
    const response = await petitions.AddCommentToPlace(dataCommentToPlace);
    setState(response.data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack className="modal-title">
        <b>Dejar una opinión</b>
      </Stack>
      <Stack direction="row">
        <TextField
          style={{ background: "white" }}
          {...register("name")}
          required
          label="Nombre"
          placeholder="Nombre"
        />
      </Stack>
      <Stack mt="3px">
        <TextField
          style={{ background: "white" }}
          {...register("text")}
          required
          label="Comentario"
          placeholder="Comentario"
        />
      </Stack>
      <Stack direction="row" mt="3px">
        <Button
          variant="contained"
          type="submit"
          style={{ background: "gray" }}
        >
          Dejar opinión
        </Button>
      </Stack>
      <Stack className="modal-title">
        <b>Opiniones</b>
      </Stack>
      <Stack mt={2}>
        {state.comments.map((c) => (
          <Stack mt={1}>
            <div
              style={{
                backgroundColor: "lightblue",
              }}
            >
              <b>{c.name}</b>
              <p>{c.text}</p>
            </div>
          </Stack>
        ))}
      </Stack>
    </form>
  );
}

function FormRating(place) {
  const getColorRating = (place) => {
    if (place.rating <= 2) {
      return "red";
    } else if (state.rating <= 3) {
      return "yellow";
    } else {
      return "green";
    }
  };

  const { register, handleSubmit } = useForm();
  const [state, setState] = useState(place);
  const [stateColor, setStateColor] = useState(getColorRating(place));

  const onSubmit = async (data) => {
    data.place = state;
    const response = await petitions.EditRating(data);
    setState(response.data);
    setStateColor(getColorRating(response.data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack className="modal-title">
        <b>
          Puntaje
          <div style={{ color: `${stateColor}` }}>{state.rating}</div>
        </b>
      </Stack>
      <Stack className="modal-title">
        <b>Dar puntuación</b>
      </Stack>
      <Stack direction="row">
        <Select {...register("rating")}>
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
          <MenuItem value="4">4</MenuItem>
          <MenuItem value="5">5</MenuItem>
        </Select>
      </Stack>
      <Stack direction="row" mt="3px">
        <Button
          variant="contained"
          type="submit"
          style={{ background: "gray" }}
        >
          Dejar puntaje
        </Button>
      </Stack>
    </form>
  );
}

export default Markers;
