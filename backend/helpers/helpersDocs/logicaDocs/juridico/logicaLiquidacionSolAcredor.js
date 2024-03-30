var copiaIDArchivo;

function enviarSolAcreedor(formData) {
  try {
    const plantillaId = "1Liq8qf7x93kVc1oBp9WJJZZWJSbG9jEqxKYQmemACqY"
    const carpetaId = "1xTU5zKCcWcWhywGJRN-Ns5N4tWgv69T3";


    var doc = DocumentApp.openById(plantillaId);//el contenido del archivo
    var archivoDoc = DriveApp.getFileById(plantillaId)//aqui cojo el archivo como tal
    var carpTemp = DriveApp.getFolderById(carpetaId);// aqui traigo la carpeta que almacena el doc

    var nombreCliente= formData.nombreCliente
    const nombreDocumento = "Admisión. Solicitud acreedor-" + nombreCliente + " " + formData.cedulaCliente;

    // crear plantilla 
    var copiaPlantilla = archivoDoc.makeCopy(carpTemp)
    copiaPlantilla.setName(nombreDocumento.toUpperCase());//ojo
    //tomar copia
    copiaIDArchivo = copiaPlantilla.getId();
    var nuevoDoc = DocumentApp.openById(copiaIDArchivo);



    //Declaracion de fechas
    var fechaPre = new Date(formData.fechaPresentacionSolicitud);
    var fechaAce = new Date(formData.fechaAuto);
    var fechaAutoIniLiq = new Date(formData.fechaAutoIniLiq);

    fechaPre.setDate(fechaPre.getDate() + 1);
    fechaAce.setDate(fechaAce.getDate() + 1);
    fechaAutoIniLiq.setDate(fechaAutoIniLiq.getDate() + 1);

    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    var mesPre = meses[fechaPre.getMonth()];
    var mesAce = meses[fechaAce.getMonth()];
    var mesAutoIniLiq = meses[fechaAutoIniLiq.getMonth()];


    var formtPre = Utilities.formatString("%d de %s del %s", fechaPre.getDate(), mesPre, fechaPre.getFullYear());
    var formtAce = Utilities.formatString("%d de %s del %s", fechaAce.getDate(), mesAce, fechaAce.getFullYear());
    var formtAutoIniLiq = Utilities.formatString("%d de %s del %s", fechaAutoIniLiq.getDate(), mesAutoIniLiq, fechaAutoIniLiq.getFullYear());


    fechaPresentacion= formtPre;
    fechaAuto = formtAce;
    fechaAutoIniLiq = formtAutoIniLiq;

    // declaracion de la informacion
    var nombreAcreedor = formData.nombreAcreedor.toUpperCase();
    var identificado = formData.identificado;
    var lugarExpedicion = formData.lugarExpedicion.toUpperCase();

    var nombreCConciliacion = formData.nombreCConciliacion.toUpperCase();
    var nombreCliente = formData.nombreCliente.toUpperCase();
    var nombreJuzgadoAperLiq = formData.nombreJuzgadoAperLiq.toUpperCase();
    var nombrePagador = formData.nombrePagador.toUpperCase();


    var cedulaCliente = formData.cedulaCliente.replace(/\D/g, ''); // Elimina caracteres no numéricos
    cedulaCliente = cedulaCliente.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Agrega puntos como separadores de miles

    nuevoDoc.getBody().replaceText("{{nombreAcreedor}}", nombreAcreedor);
    nuevoDoc.getBody().replaceText("{{nit}}", formData.nit);
    nuevoDoc.getBody().replaceText("{{correoAcreedor}}", formData.correoAcreedor);
    if (formData.correoAcreedor.indexOf(",") !== -1) {
      nuevoDoc.getBody().replaceText("{{correo}}","correos");
    } else {
      nuevoDoc.getBody().replaceText("{{correo}}","correo");
    }

    nuevoDoc.getBody().replaceText("{{identificado}}", identificado);
    nuevoDoc.getBody().replaceText("{{nombreCliente}}", nombreCliente);
    nuevoDoc.getBody().replaceText("{{cedulaCliente}}", cedulaCliente);
    nuevoDoc.getBody().replaceText("{{lugarExpedicion}}", lugarExpedicion);

    nuevoDoc.getBody().replaceText("{{fechaPresentacionSolicitud}}", fechaPresentacion);
    nuevoDoc.getBody().replaceText("{{nombreCConciliacion}}", nombreCConciliacion);

    nuevoDoc.getBody().replaceText("{{fechaAuto}}", fechaAuto);
    nuevoDoc.getBody().replaceText("{{radicadoProceso}}", formData.radicadoProceso);

    nuevoDoc.getBody().replaceText("{{fechaAutoIniLiq}}", fechaAutoIniLiq);
    nuevoDoc.getBody().replaceText("{{nombreJuzgadoAperLiq}}", nombreJuzgadoAperLiq);
    nuevoDoc.getBody().replaceText("{{radicadoProcesoAperLiq}}", formData.radicadoProcesoAperLiq);
    
    nuevoDoc.getBody().replaceText("{{nombrePagador}}", nombrePagador);
    if (nombrePagador.indexOf(",") !== -1) {
      nuevoDoc.getBody().replaceText("{{pagador}}","pagadores");
    } else {
      nuevoDoc.getBody().replaceText("{{pagador}}","pagador");
    }

    nuevoDoc.saveAndClose();

    var linkDelDocumento = DriveApp.getFileById(copiaIDArchivo).getUrl();


    return { success: true, message: "Datos procesados con éxito", documentId: copiaIDArchivo, documentLink: linkDelDocumento };
  } catch (error) {
    console.log("Error processing data: ", error);
    return { success: false, message: "Error processing data: " + error.message };
  }
}

function generarPDFSolAcreedor(formData) {
  try {
    console.log("Iniciando generación de PDF. Document ID:", formData.documentId);

    if (!formData.documentId) {
      console.error("No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId);
      return { success: false, message: "No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId };
    }

    var pdfBlob = DriveApp.getFileById(formData.documentId).getAs("application/pdf");
    // Dales un nombre al PDF usando la información del formulario
    var nombrePDF = "Memorial - Solicitud De Suspensión Del Proceso" + formData.nombreCliente + ".pdf";
    
    // Crea una copia del PDF con el nuevo nombre
    var nuevoPDF = pdfBlob.setName(nombrePDF);


    const correoAcreedor = formData.correoAcreedor;
    const asunto = "Memorial al juzgado de liquidación- " + formData.nombreCliente;
    const cuerpo = "inserte cuerpo de correo";

    GmailApp.createDraft(correoAcreedor, asunto, cuerpo, { attachments: [nuevoPDF] });

    DriveApp.getFileById(formData.documentId).setTrashed(true);

    return { success: true, message: "PDF generado y enviado a la bandeja de borradores con éxito" };
  } catch (error) {
    console.error("Error generando PDF y enviando a la bandeja de borradores:", error);
    return { success: false, message: "Error generando PDF y enviando a la bandeja de borradores: " + error.message };
  }
}












