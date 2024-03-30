function guardarUser(usuario) {
  try {
    const sheetUsuarios = obtenerSheet(env_().SHEET_BASE_LIQUIDACION);
    const userData = JSON.parse(usuario);
    Insert(userData, sheetUsuarios);
    return {
      titulo: "Registro exitoso",
      descripcion: "Ya se encuentra el usuario en la base de datos.",
    };
  } catch (error) {
    return {
      titulo: "Ops ha ocurrido un error! " + error,
      descripcion: "Por favor contacte a soporte.",
    };
  }
}

function guardarUserJur(usuario) {
  try {
    const sheetUsuarios = obtenerSheetJur(env_().SHEET_BASE_JURIDICA);
    const userData = JSON.parse(usuario);
    Insert(userData, sheetUsuarios);
    return {
      titulo: "Registro exitoso",
      descripcion: "Ya se encuentra el usuario en la base de datos.",
    };
  } catch (error) {
    return {
      titulo: "Ops ha ocurrido un error! " + error,
      descripcion: "Por favor contacte a soporte.",
    };
  }
}

function listarRegistros(id = undefined) {
  // return obtenerDatos(env_().SH_REGISTRO_USUARIOS);
  return JSON.stringify(_read(obtenerSheet(env_().SHEET_BASE_LIQUIDACION), id));
}

function listarRegistrosJur(id) {
    return JSON.stringify(_read(obtenerSheetJur(env_().SHEET_BASE_JURIDICA), id));
}

// The rest of the functions remain unchanged.


function actualizarUsuario(id, datos) {
  try {
    const sheetUsuarios = obtenerSheet(env_().SHEET_BASE_LIQUIDACION);
    Update(id, datos, sheetUsuarios);
    return {
      titulo: "Actualizado correctamente",
      descripcion: "Ya se encuentra el usuario actualizado en la base de datos.",
    };
  } catch (error) {
    return {
      titulo: "Ops ha ocurrido un error! " + error,
      descripcion: "Por favor contacte a soporte.",
    };
  }
}
function actualizarUsuarioJur(id, datos) {
  try {
    const sheetUsuarios = obtenerSheetJur(env_().SHEET_BASE_JURIDICA);
    Update(id, datos, sheetUsuarios);
    return {
      titulo: "Actualizado correctamente",
      descripcion: "Ya se encuentra el usuario actualizado en la base de datos.",
    };
  } catch (error) {
    return {
      titulo: "Ops ha ocurrido un error! " + error,
      descripcion: "Por favor contacte a soporte.",
    };
  }
}
function eliminarUsuario(id) {
  const sheetUsuarios = obtenerSheet(env_().SHEET_BASE_LIQUIDACION);
  const usuarioEliminar=_read(sheetUsuarios,id)
  sheetUsuarios.deleteRow(usuarioEliminar.row)
  return {
    titulo: "Usuario eliminado ",
    descripcion: "Usuario se elimino permanentemente",
  };
}
function eliminarUsuarioJur(id) {
  const sheetUsuarios = obtenerSheetJur(env_().SHEET_BASE_JURIDICA);
  const usuarioEliminar=_read(sheetUsuarios,id)
  sheetUsuarios.deleteRow(usuarioEliminar.row)
  return {
    titulo: "Usuario eliminado ",
    descripcion: "Usuario se elimino permanentemente",
  };
}

