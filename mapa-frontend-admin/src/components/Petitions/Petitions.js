import axios from "axios";
import Swal from "sweetalert2";
const baseUrl = process.env.REACT_APP_BASE_URL;

async function GetUsers() {
  try {
    const response = await axios({
      url: `${baseUrl}/users`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user login token")}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
  }
  return [];
}

async function GetUserById(id) {
  try {
    const response = await GetUsers();
    return response.filter((u) => u._id === id)[0];
  } catch (err) {
    console.error(err);
  }
  return [];
}

async function RegisterUser(data) {
  try {
    const verify = await verifyUser(data);
    if (verify) {
      const response = await axios({
        url: `${baseUrl}/users`,
        method: "POST",
        data: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user login token")}`,
        },
      });
      Swal.fire({
        title: "Hecho!",
        text: "El usuario ha sido registrado correctamente",
        icon: "success",
        confirmButtonText: "Cerrar",
      });
      return response;
    } else {
      throw new Error();
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "No se pudo registrar el usuario. Asegurese de haber ingresado bien los datos o que el Nick o Email no este ya registrado y dado de alta",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
    console.log(error);
  }
}

async function ChangePassword(data) {
  try {
    const response = await axios({
      url: `${baseUrl}/users/changepassword`,
      method: "PUT",
      data: data,
    });
    Swal.fire({
      title: "Hecho!",
      text: `Su contraseña para ingresar es ${data.password}, puede cambiarla desde la configuracion de usuario`,
      icon: "success",
      confirmButtonText: "Cerrar",
    });
    return response;
  } catch (error) {
    console.log(error);
    Swal.fire({
      title: "Error!",
      text: `Su contraseña no ha podido cambiarse, quizas su usario este dado de baja o no este registrado`,
      icon: "error",
      confirmButtonText: "Cerrar",
    });
  }
}

async function ChangePasswordUser(data) {
  const user = await petitions.GetUserById(data.id);
  data.user = user;
  try {
    const response = await axios({
      url: `${baseUrl}/users/changepassworduser/${user._id}`,
      method: "PUT",
      data: data,
    });
    Swal.fire({
      title: "Hecho!",
      text: `Su contraseña se ha actualizado con exito`,
      icon: "success",
      confirmButtonText: "Cerrar",
    });
    return response;
  } catch (error) {
    console.log(error);
    Swal.fire({
      title: "Error!",
      text: `Su contraseña no ha podido cambiarse, revise los datos ingresados`,
      icon: "error",
      confirmButtonText: "Cerrar",
    });
  }
}

async function EditUser(data, id) {
  try {
    const user = await GetUserById(id);
    const verify = await verifyEditUser(data, user);
    if (verify) {
      const response = await axios({
        url: `${baseUrl}/users/${id}`,
        method: "PUT",
        data: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user login token")}`,
        },
      });
      Swal.fire({
        title: "Hecho!",
        text: "El usuario ha sido editado correctamente",
        icon: "success",
        confirmButtonText: "Regresar",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location = "/listusers";
        }
      });
      return response;
    } else {
      throw new Error();
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "El usuario no ha podido ser editado, asegurese de haber completado bien los campos y que el Nick o Email no este ya registrado y dado de alta",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
  }
}

async function EditUserStatus(data, id) {
  try {
    const user = await GetUserById(id);
    const verify = await verifyUser(user);
    if ((data && verify) || !data) {
      const response = await axios({
        url: `${baseUrl}/users/${id}/status/`,
        method: "PUT",
        data: { active: data },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user login token")}`,
        },
      });
      Swal.fire({
        title: "Hecho!",
        text: "El usuario ha cambiado de estado correctamente, presioné Cerrar para actualizar",
        icon: "success",
        confirmButtonText: "Cerrar",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location = window.location.href;
        }
      });
      return response;
    } else {
      throw new Error();
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "No se ha podido cambiar el estado del usuario, verifique si esta intentado de dar de alta un usuario con un Nick o Email ya registrado y dado de alta",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
  }
}

async function verifyUser(data) {
  const { email, nick } = data;
  const users = await GetUsers();
  const usersActive = users.filter((u) => u.active);
  const allNicksActive = usersActive.map((u) => u.nick);
  const allEmailsActive = usersActive.map((u) => u.email);
  return (
    !allNicksActive.includes(nick) &&
    !allEmailsActive.includes(email) &&
    isValidEmail(data.email)
  );
}

async function verifyEditUser(data, user) {
  const { email, nick } = data;
  const users = await GetUsers();
  const usersActive = users.filter((u) => u.active);
  const allNicksActive = usersActive.map((u) => u.nick);
  const allEmailsActive = usersActive.filter((u) => u.email);
  const allNicksActiveFilter = allNicksActive.filter((n) => n !== user.nick);
  const allEmailsActiveFilter = allEmailsActive.filter((e) => e !== user.email);
  return (
    !allNicksActiveFilter.includes(nick) &&
    !allEmailsActiveFilter.includes(email) &&
    (isValidEmail(data.email) || data.email === '')
  ); 
}

async function SendEmailReset(data) {
  const { email } = data;
  try {
    if (isValidEmail(email)) {
      const response = await axios({
        url: `${baseUrl}/users/password`,
        method: "PUT",
        data: data,
      });
      return response;
    } else {
      throw new Error();
    }
  } catch (err) {
    Swal.fire({
      title: "Error!",
      text: "No se ha podido enviar el email, verifique que el usuario sea correcto y que no este dado de baja",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
  }
}

function isValidEmail(email) {
  const validFormat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return validFormat.test(email)
}

async function LoginUser(data) {
  try {
    const response = await axios({
      url: `${baseUrl}/users/login`,
      method: "POST",
      data: data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user login token")}`,
      },
    });
    return response;
  } catch (err) {
    console.error(err);
    Swal.fire({
      title: "Error!",
      text: "Los datos son incorrectos o el usuario no esta dado de alta",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
  return [];
}

//Places

async function CreatePlace(data) {
  try {
    //console.log(data);
    const response = await axios({
      url: `${baseUrl}/places`,
      method: "POST",
      data: data,
    });
    Swal.fire({
      title: "Hecho!",
      text: "El lugar se creó correctamente",
      icon: "success",
      confirmButtonText: "Regresar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = "/listplaces";
      }
    });
    return response;
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "No se pudo crear el lugar. Asegurese de haber ingresado bien los datos",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
  }
}

async function GetPlaces() {
  try {
    const response = await axios({
      url: `${baseUrl}/places`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user login token")}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err);
  }
  return [];
}

async function GetPlaceById(id) {
  try {
    const response = await GetPlaces();
    return response.filter((u) => u._id === id)[0];
  } catch (err) {
    console.error(err);
  }
  return [];
}

async function DeletePlace(id) {
  try {
    const response = await axios({
      url: `${baseUrl}/places/`,
      method: "DELETE",
      data: { id: id },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user login token")}`,
      },
    });
    Swal.fire({
      title: "Hecho!",
      text: "El lugar se ha borrado correctamente, presioné Cerrar para actualizar",
      icon: "success",
      confirmButtonText: "Cerrar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = window.location.href;
      }
    });
    return response;
  } catch (err) {
    console.error(err);
    Swal.fire({
      title: "Error!",
      text: "Error inesperado, asegurese que el lugar ya no fue borrado",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
  }
  return [];
}

async function EditPlace(data, id) {
  try {
    const response = await axios({
      url: `${baseUrl}/places/${id}`,
      method: "PUT",
      data: data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user login token")}`,
      },
    });
    Swal.fire({
      title: "Hecho!",
      text: "El lugar ha sido editado correctamente",
      icon: "success",
      confirmButtonText: "Regresar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = "/listplaces";
      }
    });
    return response;
  } catch (err) {
    console.error(err);
    Swal.fire({
      title: "Error!",
      text: "Error al editar el lugar, asegurese de no haber ingresado una dirección ya registrada u otro dato incorrecto",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
}

async function CreateCategory(data) {
  try {
    const response = await axios({
      url: `${baseUrl}/categories`,
      method: "POST",
      data: data,
    });
    Swal.fire({
      title: "Hecho!",
      text: "La categoría se creó correctamente",
      icon: "success",
      confirmButtonText: "Cerrar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = "/listcategories";
      }
    });
    return response;
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "No se pudo crear la categoría. Asegurese de haber ingresado un nombre ya registrado",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
  }
}

async function GetCategories() {
  try {
    const response = await axios({
      url: `${baseUrl}/categories`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user login token")}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

async function GetCategoryById(id) {
  try {
    const response = await GetCategories();
    return response.filter((u) => u._id === id)[0];
  } catch (err) {
    console.error(err);
  }
  return [];
}

async function EditCategory(data, id) {
  try {
    const response = await axios({
      url: `${baseUrl}/categories/${id}`,
      method: "PUT",
      data: data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user login token")}`,
      },
    });
    Swal.fire({
      title: "Hecho!",
      text: "La categoría ha sido editada correctamente",
      icon: "success",
      confirmButtonText: "Regresar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = "/listcategories";
      }
    });
    return response;
  } catch (err) {
    console.error(err);
    Swal.fire({
      title: "Error!",
      text: "Error al editar la categoría, asegurese de no haber ingresado un nombre ya registrado incorrecto",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
}

async function DeleteCategory(id) {
  try {
    const category = GetCategoryById(id);
    const places = await GetPlaces();
    const categoriesActive = places.map((p) => p.category);
    if (categoriesActive.includes(category.name)) {
      throw new Error();
    } else {
      const response = await axios({
        url: `${baseUrl}/categories/`,

        method: "DELETE",
        data: { id: id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user login token")}`,
        },
      });
      Swal.fire({
        title: "Hecho!",
        text: "La categoría se ha borrado correctamente, presioné Cerrar para actualizar",
        icon: "success",
        confirmButtonText: "Cerrar",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location = window.location.href;
        }
      });
      return response;
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      title: "Error!",
      text: "Error al borrar la categoría, asegurese que esta categoria no este activa en un lugar o no haya sido borrada",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
  }
  return [];
}

// Features:

async function CreateFeature(data) {
  try {
    const response = await axios({
      url: `${baseUrl}/features`,
      method: "POST",
      data: data,
    });
    Swal.fire({
      title: "Hecho!",
      text: "La característica se creó correctamente",
      icon: "success",
      confirmButtonText: "Regresar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = "/listfeatures";
      }
    });
    return response;
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "No se pudo crear la característica. Asegurese de haber ingresado bien los datos",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
  }
}

async function GetFeatures() {
  try {
    const response = await axios({
      url: `${baseUrl}/features`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user login token")}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
  }
  return [];
}

async function GetFeatureById(id) {
  try {
    const response = await GetFeatures();
    return response.filter((u) => u._id === id)[0];
  } catch (err) {
    console.error(err);
  }
  return [];
}

async function EditFeature(data, id) {
  try {
    const response = await axios({
      url: `${baseUrl}/features/${id}`,
      method: "PUT",
      data: data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user login token")}`,
      },
    });
    Swal.fire({
      title: "Hecho!",
      text: "La característica ha sido editada correctamente",
      icon: "success",
      confirmButtonText: "Regresar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = "/listfeatures";
      }
    });
    return response;
  } catch (err) {
    console.error(err);
    Swal.fire({
      title: "Error!",
      text: "Error al editar la característica, asegurese de no haber ingresado una descripción ya registrada incorrecta",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
}

async function DeleteFeature(id) {
  try {
    const response = await axios({
      url: `${baseUrl}/features/`,
      method: "DELETE",
      data: { id: id },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user login token")}`,
      },
    });
    Swal.fire({
      title: "Hecho!",
      text: "La característica se ha borrado correctamente, presioné Cerrar para actualizar",
      icon: "success",
      confirmButtonText: "Cerrar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = window.location.href;
      }
    });
    return response;
  } catch (err) {
    console.error(err);
    Swal.fire({
      title: "Error!",
      text: "Error inesperado al borrar la característica, asegurese que no fue borrada con anterioridad",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
  }
}

const petitions = {
  RegisterUser,
  GetUsers,
  GetUserById,
  EditUser,
  ChangePassword,
  ChangePasswordUser,
  EditUserStatus,
  verifyUser,
  LoginUser,
  SendEmailReset,
  CreatePlace,
  GetPlaces,
  GetPlaceById,
  DeletePlace,
  EditPlace,
  CreateCategory,
  EditCategory,
  GetCategories,
  DeleteCategory,
  GetCategoryById,
  CreateFeature,
  GetFeatures,
  GetFeatureById,
  EditFeature,
  DeleteFeature,
};

export default petitions;
