import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import petitions from "../Petitions/Petitions";
import { useEffect, useState } from "react";
import {
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  TextField,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "./EditPlace.scss";

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
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => petitions.CreatePlace(data);

  return (
    <Stack direction="row" ml={2} mt={5}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button style={{ background: "lightblue" }} href="/listplaces">
            Volver
          </Button>
        </Grid>
        <Grid item xs={4} style={{ textAlign: "center" }}>
          <Card sx={{ minWidth: 400 }}>
            <CardContent>
              <h1>Cargar Lugar</h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction="row" ml={2}>
                  <TextField required {...register("name")} label="Nombre" />
                </Stack>
                <Stack direction="row" ml={2}>
                  <TextField {...register("address")} label="Dirección" />
                </Stack>
                <Stack direction="row" ml={2}>
                  <TextField
                    required
                    {...register("lactitude")}
                    label="Latitud"
                  />
                </Stack>
                <Stack direction="row" ml={2}>
                  <TextField
                    required
                    {...register("longitude")}
                    label="Longitud"
                  />
                </Stack>
                <Stack direction="row" ml={2} mt={2}></Stack>
                <Stack direction="row" ml={2}>
                  <CheckboxesTagsCategory />
                </Stack>

                <Stack direction="row" ml={2} mt={2}>
                  <Button type="submit" style={{ background: "black" }}>
                    Cargar
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
  const [place, setPlace] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const responsePlace = petitions.GetPlaceById(id);
    const responseCategories = petitions.GetCategories();
    const place = await responsePlace;
    const categories = await responseCategories;
    setPlace(place);
    setCategories(categories);
  };

  let categoriesNames = [];
  categories.forEach((cat) => categoriesNames.push(cat.name));

  console.log(categoriesNames);

  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => petitions.EditPlace(data, id);

  return (
    <Stack direction="row" ml={2} mt={5}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button style={{ background: "lightblue" }} href="/listplaces">
            Volver
          </Button>
        </Grid>
        <Grid item xs={4} style={{ textAlign: "center" }}>
          <Card sx={{ minWidth: 400 }}>
            <CardContent>
              <h1>Editar Lugar</h1>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction="row" ml={2}>
                  <TextField
                    {...register("name")}
                    label="Nuevo Nombre"
                    placeholder={place.name}
                  />
                  <Stack direction="row" ml={2} />
                </Stack>
                <Stack direction="row" ml={2}>
                  <TextField
                    {...register("address")}
                    label="Nueva Dirección"
                    placeholder={place.address}
                  />
                </Stack>
                <Stack direction="row" ml={2}>
                  <TextField
                    {...register("lactitude")}
                    label="Nueva Latitud"
                    placeholder={place.lactitude}
                  />
                </Stack>
                <Stack direction="row" ml={2}>
                  <TextField
                    {...register("longitude")}
                    label="Nueva Longitud"
                    placeholder={place.longitude}
                  />
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <h6>Categoría</h6>
                </Stack>

                <Stack direction="row" ml={2}>
                  <select value={place.category} {...register("category")}>
                    {categoriesNames.map((c) => (
                      <option value={c}>{c}</option>
                    ))}
                  </select>
                </Stack>
                <Stack>
                  <CheckboxesTagsCategory />
                </Stack>
                <Stack direction="row" ml={2} mt={2}>
                  <Button type="submit" style={{ background: "black" }}>
                    Guardar Cambios
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function CheckboxesTagsCategory() {
  const [categoria, setCategoria] = useState([]);

  useEffect(() => {
    petitions.GetCategories().then((y) => {
      setCategoria(y.map((x) => x.name));
      console.log(y.map((x) => x.name));
    });
  }, []);

  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={categoria}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => <TextField {...params} label="Categorias" />}
    />
  );
}
