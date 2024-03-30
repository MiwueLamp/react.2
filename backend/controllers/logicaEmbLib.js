function guardarServidorEmbLib(usuario) {
  try {
    const sheetInicial = obtenerSheetEmbLib(env_().SHEET_BASE_INICIAL_EMBLIB);
    const userData = JSON.parse(usuario);
    Insert(userData, sheetInicial);
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

function guardarServidorComplemenEmbLib(usuario) {
  try {
    const sheetInicial = obtenerSheetEmbLib(env_().SHEET_BASE_COMPLEMENTO_EMBLIB);
    const userData = JSON.parse(usuario);
    Insert(userData, sheetInicial);
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

// The rest of the functions remain unchanged.

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
function eliminarUsuarioJur(id) {
  const sheetUsuarios = obtenerSheetJur(env_().SHEET_BASE_JURIDICA);
  const usuarioEliminar=_read(sheetUsuarios,id)
  sheetUsuarios.deleteRow(usuarioEliminar.row)
  return {
    titulo: "Usuario eliminado ",
    descripcion: "Usuario se elimino permanentemente",
  };
}

