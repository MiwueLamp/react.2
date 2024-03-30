var copiaIDArchivo;

function enviarAdmisMemoJuzMedida(formData) {
  try {
    const plantillaId = "1odO_vmbOl13AOoNdAiMnPk4BrjGplt9-eSxUTh89T8k"
    const carpetaId = "1ZA_H8YWYXlxDMnB-G7566MQgvDEnfPTS";


    var doc = DocumentApp.openById(plantillaId);//el contenido del archivo
    var archivoDoc = DriveApp.getFileById(plantillaId)//aqui cojo el archivo como tal
    var carpTemp = DriveApp.getFolderById(carpetaId);// aqui traigo la carpeta que almacena el doc

    var nombreCliente= formData.nombreCliente
    const nombreDocumento = "Solicitud Admisión Memorial Juzgado Medida- " + nombreCliente + " " + formData.cedulaCliente;

    // crear plantilla 
    var copiaPlantilla = archivoDoc.makeCopy(carpTemp)
    copiaPlantilla.setName(nombreDocumento.toUpperCase());//ojo
    //tomar copia
    copiaIDArchivo = copiaPlantilla.getId();
    var nuevoDoc = DocumentApp.openById(copiaIDArchivo);

    //Declaracion de fechas
    var fechaPre = new Date(formData.fechaPresentacion);
    var fechaAce = new Date(formData.fechaAuto);

    fechaPre.setDate(fechaPre.getDate() + 1);
    fechaAce.setDate(fechaAce.getDate() + 1);

    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    var mesPre = meses[fechaPre.getMonth()];
    var mesAce = meses[fechaAce.getMonth()];

    var formtPre = Utilities.formatString("%d de %s del %s", fechaPre.getDate(), mesPre, fechaPre.getFullYear());
    var formtAce = Utilities.formatString("%d de %s del %s", fechaAce.getDate(), mesAce, fechaAce.getFullYear());

    fechaPresentacion= formtPre;
    fechaAuto = formtAce;


    // declaracion de la informacion

    var nombreJuzgado = formData.nombreJuzgado.toUpperCase();
    var nombreDemandante = formData.nombreDemandante.toUpperCase();
    var nombreDemandados = formData.nombreDemandados.toUpperCase();
    var nombreCliente = formData.nombreCliente.toUpperCase();
    var lugarExpe = formData.lugarExpe.toUpperCase();
    var nombrePagador = formData.nombrePagador.toUpperCase();

    var nombreCConciliacion = formData.nombreCConciliacion.toUpperCase();

    var cedulaCliente = formData.cedulaCliente.replace(/\D/g, ''); // Elimina caracteres no numéricos
    cedulaCliente = cedulaCliente.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Agrega puntos como separadores de miles

    nuevoDoc.getBody().replaceText("{{nombreJuzgado}}", nombreJuzgado);
    nuevoDoc.getBody().replaceText("{{CorreoJuzgado}}", formData.CorreoJuzgado);
    if (formData.CorreoJuzgado.indexOf(";") !== -1) {
      nuevoDoc.getBody().replaceText("{{correo}}","CORREOS");
    } else {
      nuevoDoc.getBody().replaceText("{{correo}}","CORREO");
    }

    nuevoDoc.getBody().replaceText("{{nombreDemandante}}", nombreDemandante);
    var nuevoTexto;
    var nuevoTextodemandante;
    if (nombreDemandante.includes("Y") || nombreDemandante.includes(";")) {
      nuevoTexto = "DEMANDANTES";
      nuevoTextodemandante = "a los demandantes";
    } else {
      nuevoTexto = "DEMANDANTE";
      nuevoTextodemandante = "al demandante";
    }
    nuevoDoc.getBody().replaceText("{{demandante}}", nuevoTexto);
    nuevoDoc.getBody().replaceText("{{complementoDemandante}}", nuevoTextodemandante);

    nuevoDoc.getBody().replaceText("{{nombreDemandados}}", nombreDemandados);
    var nuevoTexto1;
    if (nombreDemandados.includes("Y") || nombreDemandados.includes(";")) {
      nuevoTexto1 = "DEMANDADOS";
    } else {
      nuevoTexto1 = "DEMANDADO";
    }
    nuevoDoc.getBody().replaceText("{{demandado}}", nuevoTexto1);

    nuevoDoc.getBody().replaceText("{{nombreCliente}}", nombreCliente);
    nuevoDoc.getBody().replaceText("{{cedulaCliente}}", cedulaCliente);
    nuevoDoc.getBody().replaceText("{{lugarExpe}}", lugarExpe);
    nuevoDoc.getBody().replaceText("{{radicadoProceso}}", formData.radicadoProceso);
    nuevoDoc.getBody().replaceText("{{identificado}}", formData.identificado);
    nuevoDoc.getBody().replaceText("{{fechaPresentacion}}", fechaPresentacion);
    nuevoDoc.getBody().replaceText("{{nombreCConciliacion}}", nombreCConciliacion);
    nuevoDoc.getBody().replaceText("{{fechaAuto}}", fechaAuto);
    nuevoDoc.getBody().replaceText("{{radicadoAuto}}", formData.radicadoAuto);
    nuevoDoc.getBody().replaceText("{{nombrePagador}}", nombrePagador);

    var nuevoTextopagador;
    if (nombrePagador.includes("Y") || nombrePagador.includes(",")) {
      nuevoTextopagador = "pagadores";
    } else {
      nuevoTextopagador = "al pagador";
    }
    nuevoDoc.getBody().replaceText("{{complementoPagador}}", nuevoTextopagador);

    nuevoDoc.saveAndClose();

    var linkDelDocumento = DriveApp.getFileById(copiaIDArchivo).getUrl();


    return { success: true, message: "Datos procesados con éxito", documentId: copiaIDArchivo, documentLink: linkDelDocumento };
  } catch (error) {
    console.log("Error processing data: ", error);
    return { success: false, message: "Error processing data: " + error.message };
  }
}



function generarPDFSusProceso(formData) {
  try {
    if (!formData.documentId) {
      console.error("No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId);
      return { success: false, message: "No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId };
    }

    var pdfBlob = DriveApp.getFileById(formData.documentId).getAs("application/pdf");
    // Dales un nombre al PDF usando la información del formulario
    var nombrePDF = " Suspensión Del Proceso_" + formData.nombreCliente + ".pdf";
    
    // Crea una copia del PDF con el nuevo nombre
    var nuevoPDF = pdfBlob.setName(nombrePDF);


    const correoJuzgado = formData.CorreoJuzgado;
    const asunto = "Admisión Memorial Juzgado Medida - " + formData.nombreCliente;
    const cuerpo = "inserte cuerpo de correo";

    GmailApp.createDraft(correoJuzgado, asunto, cuerpo, { attachments: [nuevoPDF] });

    DriveApp.getFileById(formData.documentId).setTrashed(true);

    return { success: true, message: "PDF generado y enviado a la bandeja de borradores con éxito" };
  } catch (error) {
    console.error("Error generando PDF y enviando a la bandeja de borradores:", error);
    return { success: false, message: "Error generando PDF y enviando a la bandeja de borradores: " + error.message };
  }
}











