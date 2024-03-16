import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateMyDataPDF = (data) => {

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text('My Data', 105, 20, null, null, 'center');

  doc.setFontSize(12);

  doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 105, 30, null, null, 'center');

  doc.setFontSize(16);

  doc.text('Last Ten Entries', 105, 50, null, null, 'center');

  autoTable(doc, {
    head: [['Disease', 'Prediction', 'Probability', 'Timestamp']],
    body: data.slice(0, 10).map(item => [item.disease, item.prediction.prediction, item.prediction.probability, new Date(item.timestamp.seconds * 1000).toLocaleString()]),
    startY: 54,
    theme: 'grid'
  });

  doc.save('my_data.pdf');
};
