

// data, fileName,
const html2canvas = require('html2canvas');
const jsPDF = require('jspdf');

const exportPDF = ( grafica, fecha, titulo ) => {

    html2canvas(grafica).then(function (canvas) {
        var d = new Date();
    
        var doc = new jsPDF("l", "pt");

        if (logo) {
          doc.addImage(logo, "PNG", 682, 5, 120, 60);
        }

        var wid = 0;
        var hgt = 0;/*
        var img = canvas.toDataURL(
          "image/png",
          (wid = canvas.width),
          (hgt = canvas.height)
        );*/
        var hratio = hgt / wid;
        var width = doc.internal.pageSize.width - 40;
        var height = width * hratio;
        doc.setFontSize(20);
        doc.setFont("Helvetica", "bold");
        doc.text(titulo, 35, 25);
        doc.setFontSize(12);

        doc.text("Fecha:", 40, 75);

        doc.setTextColor('red');
        doc.text(`${fecha}`, 180, 75); //Fecha

        doc.addImage(img, "PNG", 20, 145, width, height);
        //doc.save(me.fileName + ".pdf");
        doc.save(`${titulo} ${fecha}.pdf`);
      });
};

module.exports = exportPDF;