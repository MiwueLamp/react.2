var copiaIDArchivo;

function enviarDatosVigilancia(formData) {
  try {
    const plantillaId = "1hl-YmBZMjVHm4cztzpHcPUxN5T68U8HDBvnJfttK8HM"
    const carpetaId = "1Ya0bTV0TIsYrInwC9o7DSHIr6YS98dq0";


    var doc = DocumentApp.openById(plantillaId);//el contenido del archivo
    var archivoDoc = DriveApp.getFileById(plantillaId)//aqui cojo el archivo como tal
    var carpTemp = DriveApp.getFolderById(carpetaId);// aqui traigo la carpeta que almacena el doc

    var nombreCliente= formData.nombreCliente
    const nombreDocumento = "Vigilancia - " + nombreCliente + " " + formData.cedulaCliente;

    // crear plantilla 
    var copiaPlantilla = archivoDoc.makeCopy(carpTemp)
    copiaPlantilla.setName(nombreDocumento.toUpperCase());//ojo
    //tomar copia
    copiaIDArchivo = copiaPlantilla.getId();
    var nuevoDoc = DocumentApp.openById(copiaIDArchivo);



    //Declaracion de fechas
    var fechaPresentacion = new Date(Date.parse(formData.fechaPresentacionInsolvencia));
    var fechaAce = new Date(Date.parse(formData.fechaAuto));
    var fechaSuspencion = new Date(Date.parse(formData.fechaSuspencion));
    var fechaSolicitud = new Date(Date.parse(formData.fechaPresentacionSolicitud));

    fechaPresentacion.setDate(fechaPresentacion.getDate() + 1);
    fechaAce.setDate(fechaAce.getDate() + 1);
    fechaSuspencion.setDate(fechaSuspencion.getDate() + 1);
    fechaSolicitud.setDate(fechaSolicitud.getDate() + 1);

    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    var mesPre = meses[fechaPresentacion.getMonth()];
    var mesAce = meses[fechaAce.getMonth()];
    var mesSuspencion = meses[fechaSuspencion.getMonth()];
    var mesSolicitud = meses[fechaSolicitud.getMonth()];


    var formtPre = Utilities.formatString("%d de %s del %s", fechaPresentacion.getDate(), mesPre, fechaPresentacion.getFullYear());
    var formtAce = Utilities.formatString("%d de %s del %s", fechaAce.getDate(), mesAce, fechaAce.getFullYear());
    var formtSuspencion = Utilities.formatString("%d de %s del %s", fechaSuspencion.getDate(), mesSuspencion, fechaSuspencion.getFullYear());
    var formtSolicitud = Utilities.formatString("%d de %s del %s", fechaSolicitud.getDate(), mesSolicitud, fechaSolicitud.getFullYear());

    
    // declaracion de la informacion
    var nombreCSeccional = formData.nombreCSeccional.toUpperCase();
    var nombreJuzgado = formData.nombreJuzgado.toUpperCase();
    var demandante = formData.demandante.toUpperCase();
    var nombreCliente = formData.nombreCliente.toUpperCase();
    var lugarExpe = formData.lugarExpe.toUpperCase();
    var nombreOperador = formData.nombreOperador.toUpperCase();
    var nombreCConciliacion = formData.nombreCConciliacion.toUpperCase();
    var referencia = formData.referencia.toUpperCase();
    var demandado = formData.demandado.toUpperCase();
    var infoDemandado = formData.infoDemandado.toUpperCase();
    var infoDemandante = formData.infoDemandante.toUpperCase();

    var cedulaCliente = formData.cedulaCliente.replace(/\D/g, ''); // Elimina caracteres no numéricos
    cedulaCliente = cedulaCliente.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Agrega puntos como separadores de miles

    nuevoDoc.getBody().replaceText("{{nombreCSeccional}}", nombreCSeccional);
    nuevoDoc.getBody().replaceText("{{correoCPresidencia}}", formData.correoCPresidencia);
    nuevoDoc.getBody().replaceText("{{correoCSecretaria}}", formData.correoCSecretaria);
    nuevoDoc.getBody().replaceText("{{nombreJuzgado}}", nombreJuzgado);
    nuevoDoc.getBody().replaceText("{{demandante}}", demandante);
    nuevoDoc.getBody().replaceText("{{infoDemandante}}", infoDemandante);
    nuevoDoc.getBody().replaceText("{{nombreCliente}}", nombreCliente);
    nuevoDoc.getBody().replaceText("{{cedulaCliente}}", cedulaCliente);
    nuevoDoc.getBody().replaceText("{{lugarExpe}}", lugarExpe);
    nuevoDoc.getBody().replaceText("{{nombreOperador}}", nombreOperador);
    nuevoDoc.getBody().replaceText("{{operador}}", formData.operador);
    nuevoDoc.getBody().replaceText("{{radicadoInsolvencia}}", formData.radicadoInsolvencia);
    nuevoDoc.getBody().replaceText("{{mesesSolicitud}}", formData.mesesSolicitud);
    nuevoDoc.getBody().replaceText("{{fechaPresentacion}}", formtPre);
    nuevoDoc.getBody().replaceText("{{fechaAuto}}", formtAce);
    nuevoDoc.getBody().replaceText("{{fechaSuspencion}}", formtSuspencion);
    nuevoDoc.getBody().replaceText("{{fechaSolicitud}}", formtSolicitud);
    nuevoDoc.getBody().replaceText("{{radicadoProceso}}", formData.radicadoProceso);
    nuevoDoc.getBody().replaceText("{{nombreCConciliacion}}", nombreCConciliacion);
    nuevoDoc.getBody().replaceText("{{referencia}}", referencia);
    nuevoDoc.getBody().replaceText("{{demandado}}", demandado);
    nuevoDoc.getBody().replaceText("{{infoDemandado}}", infoDemandado);



    nuevoDoc.saveAndClose();

    var linkDelDocumento = DriveApp.getFileById(copiaIDArchivo).getUrl();


    return { success: true, message: "Datos procesados con éxito", documentId: copiaIDArchivo, documentLink: linkDelDocumento };
  } catch (error) {
    console.log("Error processing data: ", error);
    return { success: false, message: "Error processing data: " + error.message };
  }
}



function generarPDFVigilancia(formData) {
  try {
    console.log("Iniciando generación de PDF. Document ID:", formData.documentId);

    if (!formData.documentId) {
      console.error("No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId);
      return { success: false, message: "No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId };
    }

    var pdfBlob = DriveApp.getFileById(formData.documentId).getAs("application/pdf");
    // Dales un nombre al PDF usando la información del formulario
    var nombrePDF = "Solicitud_Vigilancia_" + formData.nombreCliente + ".pdf";
    
    // Crea una copia del PDF con el nuevo nombre
    var nuevoPDF = pdfBlob.setName(nombrePDF);

    const correoPresidente = formData.correoCPresidencia;
    const correoSecretaria = formData.correoCSecretaria;
    const correos = correoPresidente + ", "+correoSecretaria
    const asunto = "Solicitud de vigilancia judicial - " + formData.nombreCliente;
    const cuerpo = `inserte cuerpo de correo`;

    GmailApp.createDraft(correos, asunto, cuerpo, { attachments: [nuevoPDF] });

    DriveApp.getFileById(formData.documentId).setTrashed(true);

    return { success: true, message: "PDF generado y enviado a la bandeja de borradores con éxito" };
  } catch (error) {
    console.error("Error generando PDF y enviando a la bandeja de borradores:", error);
    return { success: false, message: "Error generando PDF y enviando a la bandeja de borradores: " + error.message };
  }
}











