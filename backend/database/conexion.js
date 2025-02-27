/**
 * conexion
 * @return {String} retorna la base de datos
 */
function conexion() {
  return SpreadsheetApp.openById(env_().ID_DATABASE);
}
function conexionJur() {
  return SpreadsheetApp.openById(env_().ID_DATABASE_JUR);
}

/**
 * obtenerSheet
 * @param {String} NAME nombre de la hoja de la base de datos
 * @return {String} retorna una hoja de la base de datos
 */
function obtenerSheet(NAME) {
  return conexion().getSheetByName(NAME);
}
function obtenerSheetJur(NAME) {
  return conexionJur().getSheetByName(NAME);
}

/**
 * obtenerDatos
 * @param {String} NAME nombre de la hoja de la base de datos
 * @return {Array} retorna todos los datos en un arreglo bidimencional de una hoja de la base de datos
 */
function obtenerDatos(NAME) {
  return obtenerSheet(NAME).getDataRange().getDisplayValues();
}
function obtenerDatosJur(NAME) {
  return obtenerSheetJur(NAME).getDataRange().getDisplayValues();
}

