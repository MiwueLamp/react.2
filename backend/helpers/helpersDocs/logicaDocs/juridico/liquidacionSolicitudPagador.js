var copiaIDArchivo;

function enviarDatosSusLib(formData) {
  try {
    const plantillaId = "1qKbiMn7sp9DKNIRDnhXwKWJDca3-n-f5lIxXlop9ZMQ"
    const carpetaId = "1bq55j75HiE4SWxy-1ziXgI3hlSkFrYMu";


    var doc = DocumentApp.openById(plantillaId);//el contenido del archivo
    var archivoDoc = DriveApp.getFileById(plantillaId)//aqui cojo el archivo como tal
    var carpTemp = DriveApp.getFolderById(carpetaId);// aqui traigo la carpeta que almacena el doc

    var nombreCliente= formData.nombreCliente
    const nombreDocumento = "Liquidación. Solicitud pagador-" + nombreCliente + " " + formData.cedulaCliente;

    // crear plantilla 
    var copiaPlantilla = archivoDoc.makeCopy(carpTemp)
    copiaPlantilla.setName(nombreDocumento.toUpperCase());//ojo
    //tomar copia
    copiaIDArchivo = copiaPlantilla.getId();
    var nuevoDoc = DocumentApp.openById(copiaIDArchivo);



    //Declaracion de fechas
    var fechaPre = new Date(formData.fechaPresentacionSolicitud);
    var fechaAce = new Date(formData.fechaAuto);
    var fechaIniLiq = new Date(formData.fechaIniLiq);

    fechaPre.setDate(fechaPre.getDate() + 1);
    fechaAce.setDate(fechaAce.getDate() + 1);
    fechaIniLiq.setDate(fechaIniLiq.getDate() + 1);

    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    var mesPre = meses[fechaPre.getMonth()];
    var mesAce = meses[fechaAce.getMonth()];
    var mesLiq = meses[fechaIniLiq.getMonth()];


    var formtPre = Utilities.formatString("%d de %s del %s", fechaPre.getDate(), mesPre, fechaPre.getFullYear());
    var formtAce = Utilities.formatString("%d de %s del %s", fechaAce.getDate(), mesAce, fechaAce.getFullYear());
    var formtLiq = Utilities.formatString("%d de %s del %s", fechaIniLiq.getDate(), mesLiq, fechaIniLiq.getFullYear());


    fechaPresentacion= formtPre;
    fechaAuto = formtAce;
    fechaIniLiq = formtLiq;

    // declaracion de la informacion
    var nombreAcredor = formData.nombreAcredor.toUpperCase();
    var nombreCliente = formData.nombreCliente.toUpperCase();
    var lugarExpedicion = formData.lugarExpedicion.toUpperCase();
    var nombreCConciliacion = formData.nombreCConciliacion.toUpperCase();
    var nombrePagador = formData.nombrePagador.toUpperCase();
    var nombreJuzAper = formData.nombreJuzAper.toUpperCase();

    var cedulaCliente = formData.cedulaCliente.replace(/\D/g, ''); // Elimina caracteres no numéricos
    cedulaCliente = cedulaCliente.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Agrega puntos como separadores de miles

    nuevoDoc.getBody().replaceText("{{nombreAcredor}}", nombreAcredor);
    nuevoDoc.getBody().replaceText("{{nit}}", formData.nit);
    nuevoDoc.getBody().replaceText("{{correoAcredor}}", formData.correoAcredor);
    if (formData.correoAcredor.indexOf(";") !== -1) {
      nuevoDoc.getBody().replaceText("{{correo}}","CORREOS");
    } else {
      nuevoDoc.getBody().replaceText("{{correo}}","CORREO");
    }

    nuevoDoc.getBody().replaceText("{{nombreCliente}}", nombreCliente);
    nuevoDoc.getBody().replaceText("{{identificado}}",  formData.identificado);
    nuevoDoc.getBody().replaceText("{{cedulaCliente}}", cedulaCliente);
    nuevoDoc.getBody().replaceText("{{lugarExpedicion}}", lugarExpedicion);
    nuevoDoc.getBody().replaceText("{{fechaPresentacionSolicitud}}", fechaPresentacion);
    nuevoDoc.getBody().replaceText("{{fechaAuto}}", fechaAuto);
    nuevoDoc.getBody().replaceText("{{fechaIniLiq}}", fechaIniLiq);
    nuevoDoc.getBody().replaceText("{{radicadoProceso}}", formData.radicadoProceso);
    nuevoDoc.getBody().replaceText("{{radicadoProcesoAper}}", formData.radicadoProcesoAper);
    nuevoDoc.getBody().replaceText("{{nombreCConciliacion}}", nombreCConciliacion);
    nuevoDoc.getBody().replaceText("{{nombreJuzAper}}", nombreJuzAper);
    nuevoDoc.getBody().replaceText("{{nombrePagador}}", nombrePagador);


    nuevoDoc.saveAndClose();

    var linkDelDocumento = DriveApp.getFileById(copiaIDArchivo).getUrl();


    return { success: true, message: "Datos procesados con éxito", documentId: copiaIDArchivo, documentLink: linkDelDocumento };
  } catch (error) {
    console.log("Error processing data: ", error);
    return { success: false, message: "Error processing data: " + error.message };
  }
}



function generarPDFSusLib(formData) {
  try {
    console.log("Iniciando generación de PDF. Document ID:", formData.documentId);

    if (!formData.documentId) {
      console.error("No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId);
      return { success: false, message: "No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId };
    }

    var pdfBlob = DriveApp.getFileById(formData.documentId).getAs("application/pdf");
    // Dales un nombre al PDF usando la información del formulario
    var nombrePDF = "Liquidación. Solicitud pagador" + formData.nombreCliente + ".pdf";
    
    // Crea una copia del PDF con el nuevo nombre
    var nuevoPDF = pdfBlob.setName(nombrePDF);

    // Envía el PDF a la bandeja de borradores de Gmail
    const correoAcredor = formData.correoAcredor;
    const asunto = "Liquidación. Solicitud pagador - " + formData.nombreCliente;
    const cuerpo = "inserte cuerpo de correo";

    GmailApp.createDraft(correoAcredor,asunto, cuerpo, { attachments: [nuevoPDF] });

    DriveApp.getFileById(formData.documentId).setTrashed(true);

    return { success: true, message: "PDF generado y enviado a la bandeja de borradores con éxito" };
  } catch (error) {
    console.error("Error generando PDF y enviando a la bandeja de borradores:", error);
    return { success: false, message: "Error generando PDF y enviando a la bandeja de borradores: " + error.message };
  }
}











