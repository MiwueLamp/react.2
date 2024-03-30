var copiaIDArchivo;

function enviarConsentimientoInsolvencia(formData) {
  try {
    const plantillaId = "1UEgvaQeymdpc9g6QNd_FyP0DlwDrBOhKmpG1erI6Yak"
    const carpetaId = "1-E7H7OfVZOHIsGOF-qTrf4TYbmo-88Fs";


    var doc = DocumentApp.openById(plantillaId);//el contenido del archivo
    var archivoDoc = DriveApp.getFileById(plantillaId)//aqui cojo el archivo como tal
    var carpTemp = DriveApp.getFolderById(carpetaId);// aqui traigo la carpeta que almacena el doc

    var nombreDeudor= formData.nombreDeudor
    const nombreDocumento = "Consentimiento. Insolvencia- " + nombreDeudor + " " + formData.cedulaDeudor;

    // crear plantilla 
    var copiaPlantilla = archivoDoc.makeCopy(carpTemp)
    copiaPlantilla.setName(nombreDocumento.toUpperCase());//ojo
    //tomar copia
    copiaIDArchivo = copiaPlantilla.getId();
    var nuevoDoc = DocumentApp.openById(copiaIDArchivo);

    //Declaracion de fechas
    var fechaDiligenciamiento = new Date(formData.fechaDiligenciamiento);

    fechaDiligenciamiento.setDate(fechaDiligenciamiento.getDate() + 1);

    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    var mesDiligenciamiento = meses[fechaDiligenciamiento.getMonth()];

    var formtDiligenciamiento = Utilities.formatString("%d de %s del %s", fechaDiligenciamiento.getDate(), mesDiligenciamiento, fechaDiligenciamiento.getFullYear());
  

    fechaPresentacion= formtDiligenciamiento;

    // declaracion de la informacion
    var nombreDeudor = formData.nombreDeudor.toUpperCase();
    var asesor = formData.asesor.toUpperCase();

    var cedulaDeudor = formData.cedulaDeudor.replace(/\D/g, ''); // Elimina caracteres no numéricos
    cedulaDeudor = cedulaDeudor.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Agrega puntos como separadores de miles

    nuevoDoc.getBody().replaceText("{{nombreDeudor}}", nombreDeudor);
    nuevoDoc.getBody().replaceText("{{cedulaDeudor}}", cedulaDeudor);
    nuevoDoc.getBody().replaceText("{{fechaPresentacion}}", fechaPresentacion);

    nuevoDoc.getBody().replaceText("{{asesor}}", asesor);

    nuevoDoc.saveAndClose();

    var linkDelDocumento = DriveApp.getFileById(copiaIDArchivo).getUrl();

    return { success: true, message: "Datos procesados con éxito", documentId: copiaIDArchivo, documentLink: linkDelDocumento };
  } catch (error) {
    console.log("Error processing data: ", error);
    return { success: false, message: "Error processing data: " + error.message };
  }
}



function generarPDFConsentimientoInsolvencia(formData) {
  try {
    if (!formData.documentId) {
      console.error("No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId);
      return { success: false, message: "No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId };
    }

    var pdfBlob = DriveApp.getFileById(formData.documentId).getAs("application/pdf");
    // Dales un nombre al PDF usando la información del formulario
    var nombrePDF = "Consentimiento Informado Insolvencia Económica_" + formData.nombreDeudor + ".pdf";
    
    // Crea una copia del PDF con el nuevo nombre
    var nuevoPDF = pdfBlob.setName(nombrePDF);


    const correoPresidente = "";
    const asunto = "Consentimiento Informado Insolvencia Económica_" + formData.nombreDeudor;
    const cuerpo = "inserte cuerpo de correo";

    GmailApp.createDraft(correoPresidente, asunto, cuerpo, { attachments: [nuevoPDF] });

    DriveApp.getFileById(formData.documentId).setTrashed(true);

    return { success: true, message: "PDF generado y enviado a la bandeja de borradores con éxito" };
  } catch (error) {
    console.error("Error generando PDF y enviando a la bandeja de borradores:", error);
    return { success: false, message: "Error generando PDF y enviando a la bandeja de borradores: " + error.message };
  }
}











