/**
 * conexion
 * @return {String} retorna la base de datos
 */
function conexionEmbLib() {
  return SpreadsheetApp.openById(env_().ID_DATABASE_EMB_LIB);
}


/**
 * obtenerSheetEmbLib
 * @param {String} NAME nombre de la hoja de la base de datos
 * @return {String} retorna una hoja de la base de datos
 */
function obtenerSheetEmbLib(NAME) {
  return conexionEmbLib().getSheetByName(NAME);
}


/**
 * obtenerDatos
 * @param {String} NAME nombre de la hoja de la base de datos
 * @return {Array} retorna todos los datos en un arreglo bidimencional de una hoja de la base de datos
 */
function obtenerDatosEmbLib(NAME) {
  return obtenerSheetEmbLib(NAME).getDataRange().getDisplayValues();
}


