function enviarDatosAlSerd(jsonData, capturaImage, capturaImageFirma) {
    try {
        var formData = JSON.parse(jsonData);
  
      var imagenAcredores = capturaImage;
      var imagenFirma = capturaImageFirma;
  
      var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  
      Object.keys(formData).forEach(function (key) {
        var data = formData[key];
        var documento = {
          nombreAcredor: data.nombreAcredor,
          nit: data.nit,
          correoAcredor: data.correoAcredor,
          nombreCliente: data.nombreCliente,
          identificado: data.identificado,
          cedulaCliente: data.cedulaCliente,
          lugarExpedicion: data.lugarExpedicion,
          radicadoProceso: data.radicadoProceso,
          nombreCConciliacion: data.nombreCConciliacion,
          nombrePagador: data.nombrePagador,
          imagenAcredores: imagenAcredores,
          firmaCliente: imagenFirma,
          apartadosDelResuelve: data.apartadosDelResuelve,
          fechaPresentacionSolicitud: data.fechaPresentacionSolicitud,
          fechaAuto: data.fechaAuto
        };
  
        generarDoc(documento);
      });
    } catch (error) {
       RE3console.error("Error en el servidor:", error);
    }
  }
  
  
  
    function generarDoc(documento) {
      //identificaciones
      const plantillaOfi = "1-6tWrZg4WMdQTC15JmS5sv9RHJZIuski";
      var temporalID = "14SmI-MccumvwsUx4V1zKbDYuXCe1pXJX";
    
      //conexiones
      var word = DocumentApp.openById(plantillaOfi);
      var contenidoPlantilla = DriveApp.getFileById(plantillaOfi)
      var carpetaTemp = DriveApp.getFolderById(temporalID);
    
      //crearcopia
      var copiaArchivo = contenidoPlantilla.makeCopy(carpetaTemp);
      var copiaID = copiaArchivo.getId();
      var nombreDocumento = "Admisión. Solicitud acreedor-" + documento.nombreCliente + " " + documento.cedulaCliente;
      copiaArchivo.setName(nombreDocumento);
      var doc = DocumentApp.openById(copiaID);
      doc.setName(nombreDocumento);
    
      // remplazar variables
      doc.getBody().replaceText("{{nombreAcredor}}", documento.nombreAcredor)
      doc.getBody().replaceText("{{nit}}", documento.nit);
      doc.getBody().replaceText("{{correoAcredor}}", documento.correoAcredor);
      doc.getBody().replaceText("{{nombreCliente}}", documento.nombreCliente);
      doc.getBody().replaceText("{{identificado}}", documento.identificado);
      doc.getBody().replaceText("{{cedulaCliente}}", documento.cedulaCliente);
      doc.getBody().replaceText("{{fechaPresentacionSolicitud}}", documento.fechaPresentacionSolicitud);
      doc.getBody().replaceText("{{fechaAuto}}", documento.fechaAuto);
      doc.getBody().replaceText("{{radicadoProceso}}", documento.radicadoProceso);
      doc.getBody().replaceText("{{nombreCConciliacion}}", documento.nombreCConciliacion);
      doc.getBody().replaceText("{{nombrePagador}}", documento.nombrePagador);
    
      // Reemplazar imágenes
      var imagenAcredoresBlob = UrlFetchApp.fetch(documento.imagenAcredores).getBlob();
      doc.getBody().replaceText("{{imagenAcredores}}", "");
      doc.getBody().appendImage(imagenAcredoresBlob);
    
      var firmaClienteBlob = UrlFetchApp.fetch(documento.firmaCliente).getBlob();
      doc.getBody().replaceText("{{firmaCliente}}", "");
      doc.getBody().appendImage(firmaClienteBlob);
    
      doc.getBody().replaceText("{{apartadosDelResuelve}}", documento.apartadosDelResuelve);
    
      doc.saveAndClose();
    }
    
    
  
  
    function enviarDatosAlSer(formData, capturaImage, capturaImageFirma) {
      try {
        // Abre el documento por su ID (reemplaza 'ID_DEL_DOCUMENTO' con el ID real de tu documento)
        const plantillaOfi = "1-1-6tWrZg4WMdQTC15JmS5sv9RHJZIuski";
        var temporalID = "1Hm-e0DODpjQjbcYKGfFdqmxZ6KhWDX4H";
    
        //conexiones
        var word = DocumentApp.openById(plantillaOfi);
        var contenidoPlantilla = DriveApp.getFileById(plantillaOfi)
        var carpetaTemp = DriveApp.getFolderById(temporalID);
    
        //crearcopia
        var copiaArchivo = contenidoPlantilla.makeCopy(carpetaTemp);
        var copiaID = copiaArchivo.getId();
        var nombreDocumento = "Admisión. Solicitud acreedor-" + formData.nombreCliente + " " + formData.cedulaCliente;
        copiaArchivo.setName(nombreDocumento);
        var doc = DocumentApp.openById(copiaID);
        doc.setName(nombreDocumento);
    
        var documento = DocumentApp.openById('doc');
    
        // Reemplaza campos en el documento con los datos del formulario
        reemplazarCampoEnDocumento(documento, '{{nombreAcredor}}', formData.nombreAcredor);
        reemplazarCampoEnDocumento(documento, '{{nit}}', formData.nit);
        reemplazarCampoEnDocumento(documento, '{{correoAcredor}}', formData.correoAcredor);
        reemplazarCampoEnDocumento(documento, '{{nombreCliente}}', formData.nombreCliente);
        reemplazarCampoEnDocumento(documento, '{{identificado}}', formData.identificado);
        reemplazarCampoEnDocumento(documento, '{{cedulaCliente}}', formData.cedulaCliente);
        reemplazarCampoEnDocumento(documento, '{{fechaPresentacionSolicitud}}', formData.fechaPresentacionSolicitud);
        reemplazarCampoEnDocumento(documento, '{{fechaAuto}}', formData.fechaAuto);
        reemplazarCampoEnDocumento(documento, '{{radicadoProceso}}', formData.radicadoProceso);
        reemplazarCampoEnDocumento(documento, '{{nombreCConciliacion}}', formData.nombreCConciliacion);
        reemplazarCampoEnDocumento(documento, '{{nombrePagador}}', formData.nombrePagador);
    
    
        // Guarda los cambios en el documento
        documento.saveAndClose();
    
        // Almacena las imágenes en Google Drive y obtén sus URLs
        var urlImagenAcredores = almacenarImagenEnDrive(capturaImage, 'imagenAcredores');
        var urlFirmaCliente = almacenarImagenEnDrive(capturaImageFirma, 'firmaCliente');
    
        // Reemplaza las URLs de las imágenes en el documento
        reemplazarCampoEnDocumento(documento, '{{IMAGEN_ACREEDORES}}', urlImagenAcredores);
        reemplazarCampoEnDocumento(documento, '{{FIRMA_CLIENTE}}', urlFirmaCliente);
    
        // Devuelve una respuesta de éxito al cliente
        return "Datos procesados con éxito";
      } catch (error) {
       logger.log("Error al procesar los datos: " + error.message);
      }
    }
    
    // Función para reemplazar un campo en el documento
    function reemplazarCampoEnDocumento(documento, campo, valor) {
      // Utiliza el servicio de DocumentApp para reemplazar texto en el cuerpo del documento
      documento.getBody().replaceText(campo, valor);
    }
    
    // Función para almacenar una imagen en Google Drive y obtener su URL
    function almacenarImagenEnDrive(imagenBase64, nombreArchivo) {
      var blob = Utilities.newBlob(Utilities.base64Decode(imagenBase64), 'image/jpeg', nombreArchivo);
      var archivo = DriveApp.createFile(blob);
      // Obtén la URL del archivo recién creado
      var urlImagen = archivo.getUrl();
      // Elimina el archivo de Google Drive, ya que ya tenemos la URL
      DriveApp.getFileById(archivo.getId()).setTrashed(true);
      return urlImagen;
    }
    