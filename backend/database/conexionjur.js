function conexionJur() {
    return SpreadsheetApp.openById(env_().ID_DATABASE_JUR);
  }
  function obtenerSheetJur(NAME) {
    return conexionJur().getSheetByName(NAME);
  }
  function obtenerDatosJur(NAME) {
    return obtenerSheetJur(NAME).getDataRange().getDisplayValues();
  }