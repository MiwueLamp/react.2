var copiaIDArchivo;

function enviarDatosSolPagador(formData) {
  try {
    const plantillaId = "1ImxwgeppmDdK_yS4YFk1Q3GSLIWNP9iAn_5JX0qDK38"
    const carpetaId = "1y8mhIne3KTUzMgNaLA-rpBhee9dIdIPU";


    var doc = DocumentApp.openById(plantillaId);//el contenido del archivo
    var archivoDoc = DriveApp.getFileById(plantillaId)//aqui cojo el archivo como tal
    var carpTemp = DriveApp.getFolderById(carpetaId);// aqui traigo la carpeta que almacena el doc

    var nombreCliente= formData.nombreCliente
    const nombreDocumento = "Derecho de petición a pagador - " + nombreCliente + " " + formData.cedulaCliente;

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

    var nombrePagador = formData.nombrePagador.toUpperCase();
    var nombreCliente = formData.nombreCliente.toUpperCase();
    var lugarExpe = formData.lugarExpe.toUpperCase();
    var nombrePagador = formData.nombrePagador.toUpperCase();

    var nombreCConciliacion = formData.nombreCConciliacion.toUpperCase();

    var cedulaCliente = formData.cedulaCliente.replace(/\D/g, ''); // Elimina caracteres no numéricos
    cedulaCliente = cedulaCliente.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Agrega puntos como separadores de miles

    nuevoDoc.getBody().replaceText("{{nombrePagador}}", nombrePagador);
    nuevoDoc.getBody().replaceText("{{nit}}", formData.nit);
    nuevoDoc.getBody().replaceText("{{corrreoPagador}}", formData.corrreoPagador);

    if (formData.corrreoPagador.indexOf(";") !== -1) {
      nuevoDoc.getBody().replaceText("{{correo}}","CORREOS");
    } else {
      nuevoDoc.getBody().replaceText("{{correo}}","CORREO");
    }

    nuevoDoc.getBody().replaceText("{{nombreCliente}}", nombreCliente);
    nuevoDoc.getBody().replaceText("{{cedulaCliente}}", cedulaCliente);
    nuevoDoc.getBody().replaceText("{{lugarExpe}}", lugarExpe);


    nuevoDoc.getBody().replaceText("{{fechaPresentacion}}", fechaPresentacion);
    nuevoDoc.getBody().replaceText("{{nombreCConciliacion}}", nombreCConciliacion);
    nuevoDoc.getBody().replaceText("{{identificado}}", formData.identificado);

    nuevoDoc.getBody().replaceText("{{fechaAuto}}", fechaAuto);
    nuevoDoc.getBody().replaceText("{{radicadoAuto}}", formData.radicadoAuto);


    nuevoDoc.saveAndClose();

    var linkDelDocumento = DriveApp.getFileById(copiaIDArchivo).getUrl();


    return { success: true, message: "Datos procesados con éxito", documentId: copiaIDArchivo, documentLink: linkDelDocumento };
  } catch (error) {
    console.log("Error processing data: ", error);
    return { success: false, message: "Error processing data: " + error.message };
  }
}



function generarPDFSolPagador(formData) {
  try {
    if (!formData.documentId) {
      console.error("No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId);
      return { success: false, message: "No se encontró el ID del documento. Asegúrate de generar el documento primero. " + formData.documentId };
    }

    var pdfBlob = DriveApp.getFileById(formData.documentId).getAs("application/pdf");
    // Dales un nombre al PDF usando la información del formulario
    var nombrePDF = "Derecho de petición a pagador " + formData.nombreCliente + ".pdf";
    
    // Crea una copia del PDF con el nuevo nombre
    var nuevoPDF = pdfBlob.setName(nombrePDF);


    const correoPresidente = formData.corrreoPagador;
    const asunto = "Derecho de petición a pagador - " + formData.nombreCliente;
    const cuerpo = "inserte cuerpo de correo";

    GmailApp.createDraft(correoPresidente, asunto, cuerpo, { attachments: [nuevoPDF] });

    DriveApp.getFileById(formData.documentId).setTrashed(true);

    return { success: true, message: "PDF generado y enviado a la bandeja de borradores con éxito" };
  } catch (error) {
    console.error("Error generando PDF y enviando a la bandeja de borradores:", error);
    return { success: false, message: "Error generando PDF y enviando a la bandeja de borradores: " + error.message };
  }
}











