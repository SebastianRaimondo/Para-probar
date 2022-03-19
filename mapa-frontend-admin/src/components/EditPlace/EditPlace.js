import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import petitions from "../Petitions/Petitions";
import { useEffect, useState, useRef } from "react";
import {
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import "./EditPlace.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function EditPlace() {
  const { id } = useParams();

  let form;

  if (id === "new") {
    form = FormNewPlace();
  } else {
    form = FormEditPlace(id);
  }
  return form;
}

function FormNewPlace() {
  const iconList = Object.keys(Icons)
    .filter((key) => key !== "fas" && key !== "prefix")
    .map((icon) => Icons[icon]);

  library.add(...iconList);

  const { register, handleSubmit } = useForm();

  const [categories, setCategories] = useState([]);
  const [feature, setFeature] = useState([]);
  const [features, setFeatures] = useState([]);
  const [file, setFile] = useState();

  const onSubmit = async (data) => {
    let fileName = await sendHandler();
    data.image = fileName;
    data.categories = categories;
    data.features = features;
    petitions.CreatePlace(data);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setFeature(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const responseCategories = petitions.GetCategories();
    const categories = await responseCategories;
    setCategories(categories);
    const featureValues = await petitions.GetFeatures();
    setFeatures(featureValues.map((x) => x.name));
  };

  const selectedHandler = (e) => {
    let arrayFiles = Array.from(e.target.files)
    console.log(arrayFiles)
    setFile(arrayFiles);
  };

  const sendHandler = async () => {
    let formdata = new FormData();

   // formdata.append( "image", file[0])
   file.forEach(el => formdata.append( "images", el))



    //formdata.append("image", file[0]);
    //console.log(file)


     console.log(formdata.getAll("images"))
    const response = await fetch("http://localhost:8080/places/img", {
      method: "POST",
      enctype: "multipart/form-data",
      body: formdata,
      
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));
    document.getElementById("fileinput").value = null;
    return response;
  };
  //const inputFileRef = useRef();

  return (
    <Stack direction="row" ml={2} mt={3}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button
            variant="contained"
            style={{ background: "#053742" }}
            href="/listplaces"
          >
            <KeyboardBackspaceIcon /> Volver
          </Button>
        </Grid>
        <Grid item xs={4} style={{ textAlign: "center" }}>
          <Card style={{ background: "#E8F0F2" }} sx={{ minWidth: 400 }}>
            <CardContent>
              <h1>Nuevo Lugar</h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction="row" ml={2}>
                  <TextField
                    style={{ background: "white" }}
                    required
                    {...register("name")}
                    label="Nombre"
                  />
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <TextField
                    style={{ background: "white" }}
                    required
                    {...register("address")}
                    label="Dirección"
                  />
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <TextField
                    style={{ background: "white" }}
                    required
                    {...register("lactitude")}
                    label="Latitud"
                  />
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <TextField
                    style={{ background: "white" }}
                    required
                    {...register("longitude")}
                    label="Longitud"
                  />
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <TextField
                    style={{
                      background: "white",
                      width: "100%",
                    }}
                    {...register("description")}
                    label="Descripcion"
                  />
                </Stack>
                <Stack ml={2} mt={2}>
                  <p>
                    <b>Seleccione categoria</b>
                  </p>
                  <Select
                    {...register("category")}
                    required
                    placeholder="Categoria"
                  >
                    {categories.map(({ name, icon }) => (
                      <MenuItem value={name}>
                        {`${name}`}
                        {<FontAwesomeIcon icon={icon} />}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <div>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="feature-multiple-checkbox-label">
                        Caracteristicas
                      </InputLabel>
                      <Select
                        labelId="feature-multiple-checkbox-label"
                        id="feature-multiple-checkbox"
                        multiple
                        value={feature}
                        onChange={handleChange}
                        input={<OutlinedInput label="Caracteristicas" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {features.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={feature.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </Stack>

                <Stack direction="row" ml={2} mt={2}>
                  <Typography align="inherit" mt={0.3} variant="button">
                    {"Cargar imagen"}
                  </Typography>

                  <input
                    id="fileinput"
                    onChange={selectedHandler}
                    type="file"
                    className="form-control"
                    multiple
                  />
                </Stack>

                <Stack direction="row" ml={2} mt={2}>
                  <Button
                    //onClick={sendHandler}
                    variant="contained"
                    type="submit"
                    style={{ background: "#39A2DB" }}
                  >
                    <CheckCircleTwoToneIcon /> Guardar
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

function FormEditPlace(id) {
  const iconList = Object.keys(Icons)
    .filter((key) => key !== "fas" && key !== "prefix")
    .map((icon) => Icons[icon]);

  library.add(...iconList);
  const { register, handleSubmit, control } = useForm();

  const [place, setPlace] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [feature, setFeature] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setFeature(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChangeSelectedCategory = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategory(value);
  };

  const getData = async () => {
    const responsePlace = petitions.GetPlaceById(id);
    const responseCategories = petitions.GetCategories();
    const place = await responsePlace;
    const categories = await responseCategories;
    const featureValues = await petitions.GetFeatures();
    setFeatures(featureValues.map((x) => x.name));
    setPlace(place);
    setFeature(place.features);
    setCategories(categories);
    setSelectedCategory(place.category ? place.category.trim() : "");
  };

  const onSubmit = (data) => {
    data.categories = categories;
    data.features = feature;
    petitions.EditPlace(data, id);
  };

  const inputFileRef = useRef();

  return (
    <Stack direction="row" ml={2} mt={3}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button
            variant="contained"
            style={{ background: "#053742" }}
            href="/listplaces"
          >
            <KeyboardBackspaceIcon /> Volver
          </Button>
        </Grid>
        <Grid item xs={4} style={{ textAlign: "center" }}>
          <Card style={{ background: "#E8F0F2" }} sx={{ minWidth: 400 }}>
            <CardContent>
              <h1>Editar Lugar</h1>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction="row" ml={2}>
                  <TextField
                    style={{ background: "white" }}
                    {...register("name")}
                    label="Nuevo Nombre"
                    placeholder={place.name}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <TextField
                    style={{ background: "white" }}
                    {...register("address")}
                    label="Nueva Dirección"
                    placeholder={place.address}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <TextField
                    style={{ background: "white" }}
                    {...register("lactitude")}
                    label="Nueva Latitud"
                    placeholder={place.lactitude}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <TextField
                    style={{ background: "white" }}
                    {...register("longitude")}
                    label="Nueva Longitud"
                    placeholder={place.longitude}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <TextField
                    style={{ background: "white", width: "100%" }}
                    {...register("description")}
                    label="Nueva Descripcion"
                    placeholder={place.description}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Stack>

                <Stack ml={2} mt={2}>
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="feature-multiple-checkbox-label">
                      Categoria
                    </InputLabel>
                    <Select
                      {...register("category")}
                      required
                      input={<OutlinedInput label="Categoria" />}
                      value={selectedCategory}
                      onChange={handleChangeSelectedCategory}
                    >
                      {categories.map(({ name, icon }) => (
                        <MenuItem value={name}>
                          {name}
                          {<FontAwesomeIcon icon={icon} />}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <div>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="feature-multiple-checkbox-label">
                        Caracteristicas
                      </InputLabel>
                      <Select
                        {...register("features")}
                        multiple
                        value={feature}
                        onChange={handleChange}
                        input={<OutlinedInput label="Caracteristicas" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {features.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={feature.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <Typography align="inherit" mt={0.3} variant="button">
                    {"Cargar imagen"}
                  </Typography>

                  <input
                    type="file"
                    ref={inputFileRef}
                    name="image"
                    placeholder={place.longitude}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ background: "#39A2DB" }}
                  >
                    <CheckCircleTwoToneIcon /> Guardar Cambios
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
