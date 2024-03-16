import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generateMyDataPDF = (data) => {
  const docDefinition = {
    content: [
      { text: 'My Data', style: 'header' },
      { text: `Date Generated: ${new Date().toLocaleDateString()}`, style: 'date' },
      { text: '\n' },
      { text: 'Last Ten Entries', style: 'subheader' },
      { text: '\n' },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*'],
          body: [
            ['Disease', 'Prediction', 'Probability', 'Timestamp'],
            ...data.slice(0, 10).map(item => [item.disease, item.prediction.prediction, item.prediction.probability, new Date(item.timestamp.seconds * 1000).toLocaleString()])
          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      date: {
        fontSize: 12,
        margin: [0, 0, 0, 10]
      }
    }
  };

  pdfMake.createPdf(docDefinition).download('my_data.pdf');
};
