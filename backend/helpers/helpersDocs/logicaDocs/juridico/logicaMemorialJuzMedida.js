var copiaIDArchivo;

function enviarMemorialJuzMedida(formData) {
  try {
    const plantillaId = "1NRzMIRSkhV2vo7uXB15MK8jdTIepUoZ4soFF9RNp2oQ"
    const carpetaId = "1edCcaWxoHfYTxo4z2sZW2vcp4nJyUMIc";
    var doc = DocumentApp.openById(plantillaId);//el contenido del archivo
    var archivoDoc = DriveApp.getFileById(plantillaId)//aqui cojo el archivo como tal
    var carpTemp = DriveApp.getFolderById(carpetaId);// aqui traigo la carpeta que almacena el doc
    var nombreCliente= formData.nombreCliente
    const nombreDocumento = "Liquidación. Memorial al juzgado de la medida - " + nombreCliente + " " + formData.cedulaCliente;
    // crear plantilla 
    var copiaPlantilla = archivoDoc.makeCopy(carpTemp)
    copiaPlantilla.setName(nombreDocumento.toUpperCase());//ojo
    //tomar copia
    copiaIDArchivo = copiaPlantilla.getId();
    var nuevoDoc = DocumentApp.openById(copiaIDArchivo);
    //Declaracion de fechas
    var fechaPre = new Date(formData.fechaPresentacion);
    var fechaAce = new Date(formData.fechaAuto);
    var fechaAceInicio = new Date(formData.fechaAutoInicio);
    fechaPre.setDate(fechaPre.getDate() + 1);
    fechaAce.setDate(fechaAce.getDate() + 1);
    fechaAceInicio.setDate(fechaAceInicio.getDate() + 1);

    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    var mesPre = meses[fechaPre.getMonth()];
    var mesAce = meses[fechaAce.getMonth()];
    var mesAceInicio = meses[fechaAceInicio.getMonth()];

    var formtPre = Utilities.formatString("%d de %s del %s", fechaPre.getDate(), mesPre, fechaPre.getFullYear());
    var formtAce = Utilities.formatString("%d de %s del %s", fechaAce.getDate(), mesAce, fechaAce.getFullYear());
    var formtAceInicio = Utilities.formatString("%d de %s del %s", fechaAceInicio.getDate(), mesAceInicio, fechaAceInicio.getFullYear());
    
    fechaPresentacion= formtPre;
    fechaAuto = formtAce;
    fechaAutoInicio = formtAceInicio;
    // declaracion de la informacion
    var nombreJuzgado = formData.nombreJuzgado.toUpperCase();
    var nombreCliente = formData.nombreCliente.toUpperCase();
    var cedulaCliente = formData.cedulaCliente.replace(/\D/g, ''); // Elimina caracteres no numéricos
    cedulaCliente = cedulaCliente.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Agrega puntos como separadores de miles
    var lugarExpe = formData.lugarExpe.toUpperCase();

    var nombrePagador = formData.nombrePagador.toUpperCase();
    var nombreDemandante = formData.nombreDemandante.toUpperCase();


    var nombreCConciliacion = formData.nombreCConciliacion.toUpperCase();
    var nombreDemandados = formData.nombreDemandados.toUpperCase();

    nuevoDoc.getBody().replaceText("{{nombreJuzgado}}", nombreJuzgado);
    nuevoDoc.getBody().replaceText("{{CorreoJuzgado}}", formData.CorreoJuzgado);



    
    nuevoDoc.getBody().replaceText("{{radicadoProceso}}", formData.radicadoProceso);

    nuevoDoc.getBody().replaceText("{{nombreCliente}}", nombreCliente);
    nuevoDoc.getBody().replaceText("{{cedulaCliente}}", cedulaCliente);
    nuevoDoc.getBody().replaceText("{{lugarExpe}}", lugarExpe);

    nuevoDoc.getBody().replaceText("{{fechaPresentacion}}", fechaPresentacion);
    nuevoDoc.getBody().replaceText("{{identificado}}", formData.identificado);
    nuevoDoc.getBody().replaceText("{{nombreCConciliacion}}", nombreCConciliacion);

    nuevoDoc.getBody().replaceText("{{nombreDemandante}}", nombreDemandante);

    var nuevoTexto;
    if (nombreDemandante.includes("Y") || nombreDemandante.includes(";")) {
      nuevoTexto = "DEMANDANTES";
    } else {
      nuevoTexto = "DEMANDANTE";
    }
    nuevoDoc.getBody().replaceText("{{demandante}}", nuevoTexto);

    nuevoDoc.getBody().replaceText("{{fechaAuto}}", fechaAuto);
    nuevoDoc.getBody().replaceText("{{radicadoAuto}}", formData.radicadoAuto);

    nuevoDoc.getBody().replaceText("{{fechaAutoInicio}}", fechaAutoInicio);
    nuevoDoc.getBody().replaceText("{{radicadoAutoInicio}}", formData.radicadoAutoInicio);

    nuevoDoc.getBody().replaceText("{{radicadoSusProEjecutivo}}", formData.radicadoSusProEjecutivo);
    nuevoDoc.getBody().replaceText("{{radicadoSusEmbargos}}", formData.radicadoSusEmbargos);

    nuevoDoc.getBody().replaceText("{{nombrePagador}}", nombrePagador);
    var nuevoTexto2;
    if (nombrePagador.includes("Y") || nombrePagador.includes(",")) {
      nuevoTexto2= "pagadores";
    } else {
      nuevoTexto2 = "pagador";
    }
    nuevoDoc.getBody().replaceText("{{pagador}} ", nuevoTexto2);


    nuevoDoc.getBody().replaceText("{{nombreDemandados}}", nombreDemandados);
    var nuevoTexto1;
    if (nombreDemandados.includes("Y") || nombreDemandados.includes(";")) {
      nuevoTexto1 = "DEMANDADOS";
    } else {
      nuevoTexto1 = "DEMANDADO";
    }
    nuevoDoc.getBody().replaceText("{{demandado}}", nuevoTexto1);

    nuevoDoc.saveAndClose();

    var linkDelDocumento = DriveApp.getFileById(copiaIDArchivo).getUrl();


    return { success: true, message: "Datos procesados con éxito", documentId: copiaIDArchivo, documentLink: linkDelDocumento };
  } catch (error) {
    console.log("Error processing data: ", error);
    return { success: false, message: "Error processing data: " + error.message };
  }
}



function generarPDFJuzMedida(formData) {
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


    const CorreoJuzgado = formData.CorreoJuzgado;
    const asunto = "Liquidación. Memorial al juzgado de la medida - " + formData.nombreCliente;
    const cuerpo = "inserte cuerpo de correo";

    GmailApp.createDraft(CorreoJuzgado, asunto, cuerpo, { attachments: [nuevoPDF] });

    DriveApp.getFileById(formData.documentId).setTrashed(true);

    return { success: true, message: "PDF generado y enviado a la bandeja de borradores con éxito" };
  } catch (error) {
    console.error("Error generando PDF y enviando a la bandeja de borradores:", error);
    return { success: false, message: "Error generando PDF y enviando a la bandeja de borradores: " + error.message };
  }
}











