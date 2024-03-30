var copiaIDArchivo;

function enviarJuzliq(formData) {
  try {
    const plantillaId = "1lVVvQdTZIFYSBQBGkIuEq3wq88IzB9FLxQo7DJB6_xs"
    const carpetaId = "1g3ywt5S4pn5Ki8I61rvVqPFIUaOhScA8";


    var doc = DocumentApp.openById(plantillaId);//el contenido del archivo
    var archivoDoc = DriveApp.getFileById(plantillaId)//aqui cojo el archivo como tal
    var carpTemp = DriveApp.getFolderById(carpetaId);// aqui traigo la carpeta que almacena el doc

    var nombreCliente= formData.nombreCliente
    const nombreDocumento = "Memorial al juzgado de liquidación- " + nombreCliente + " " + formData.cedulaCliente;

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
    var nombreJuzgado = formData.nombreJuzgado.toUpperCase();
    var identificado = formData.identificado;
    var lugarExpedicion = formData.lugarExpedicion.toUpperCase();
    var nombreDemandante = formData.nombreDemandante.toUpperCase();
    var nombreDemandado = formData.nombreDemandados.toUpperCase();
    var nombreCConciliacion = formData.nombreCConciliacion.toUpperCase();
    var nombreCliente = formData.nombreCliente.toUpperCase();

    var nombrePagadores = formData.nombrePagadores.toUpperCase();


    var cedulaCliente = formData.cedulaCliente.replace(/\D/g, ''); // Elimina caracteres no numéricos
    cedulaCliente = cedulaCliente.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Agrega puntos como separadores de miles

    nuevoDoc.getBody().replaceText("{{nombreJuzgado}}", nombreJuzgado);
    nuevoDoc.getBody().replaceText("{{correoJuzgado}}", formData.correoJuzgado);
    nuevoDoc.getBody().replaceText("{{radicado}}", formData.radicado);

    nuevoDoc.getBody().replaceText("{{nombreDemandante}}", nombreDemandante);

    if (nombreDemandante.indexOf(";") !== -1) {
      nuevoDoc.getBody().replaceText("{{demandante}}","DEMANDANTES");
    } else {
      nuevoDoc.getBody().replaceText("{{demandante}}","DEMANDANTE");
    }



    nuevoDoc.getBody().replaceText("{{nombreDemandados}}", nombreDemandado);
    if (nombreDemandado.indexOf(";") !== -1) {
      nuevoDoc.getBody().replaceText("{{demandado}}","DEMANDADOS");
    } else {
      nuevoDoc.getBody().replaceText("{{demandado}}","DEMANDADO");
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
    nuevoDoc.getBody().replaceText("{{nombrePagadores}}", nombrePagadores);

    var nuevoTexto;
    if (nombrePagadores.includes("Y") || nombrePagadores.includes(",")) {
      nuevoTexto = "mis pagadores";
    } else {
      nuevoTexto = "mi pagador";
    }
    
    nuevoDoc.getBody().replaceText("{{pagadores}}", nuevoTexto);

    nuevoDoc.saveAndClose();

    var linkDelDocumento = DriveApp.getFileById(copiaIDArchivo).getUrl();


    return { success: true, message: "Datos procesados con éxito", documentId: copiaIDArchivo, documentLink: linkDelDocumento };
  } catch (error) {
    console.log("Error processing data: ", error);
    return { success: false, message: "Error processing data: " + error.message };
  }
}

function generarPDFJuzliq(formData) {
  try {
    console.log("Iniciando generación de PDF. Document ID:", formData.documentId);

    if (!formData.documentId) {
      console.error("No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId);
      return { success: false, message: "No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId };
    }

    var pdfBlob = DriveApp.getFileById(formData.documentId).getAs("application/pdf");
    // Dales un nombre al PDF usando la información del formulario
    var nombrePDF = "Solicitud de Suspensión del Proceso - " + formData.nombreCliente + formData.cedulaCliente+".pdf";
    
    // Crea una copia del PDF con el nuevo nombre
    var nuevoPDF = pdfBlob.setName(nombrePDF);


    const CorreoJuzgado = formData.correoJuzgado;
    const asunto = "Memorial al juzgado de liquidación- " + formData.nombreCliente;
    const cuerpo = "inserte cuerpo de correo";

    GmailApp.createDraft(CorreoJuzgado, asunto, cuerpo, { attachments: [nuevoPDF] });

    DriveApp.getFileById(formData.documentId).setTrashed(true);

    return { success: true, message: "PDF generado y enviado a la bandeja de borradores con éxito" };
  } catch (error) {
    console.error("Error generando PDF y enviando a la bandeja de borradores:", error);
    return { success: false, message: "Error generando PDF y enviando a la bandeja de borradores: " + error.message };
  }
}












