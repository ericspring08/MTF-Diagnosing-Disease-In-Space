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
    body: data.slice(0, 10).map(item => [item.data.disease, item.data.prediction.prediction, item.data.prediction.probability, new Date(item.data.timestamp.seconds * 1000).toLocaleString()]),
    startY: 54,
    theme: 'grid'
  });

  doc.save(`my_data_${Date()}.pdf`);
};

export const generateDiagnosisPDF = (
  disease,
  features,
  diagnosis,
  diagnosis_confidence,
) => {
  const doc = new jsPDF();

  doc.setFont('helvetica', 'normal');

  doc.setFontSize(24);
  doc.setTextColor(33, 150, 243); // Blue color
  doc.text(`Diagnosis Report: ${disease}`, 20, 30);

  doc.setFontSize(16);

  doc.setTextColor(0, 0, 0); // Black color

  doc.text('Features:', 20, 50);

  autoTable(doc, {
    head: [['Feature', 'Value']],
    body: Object.entries(features),
    startY: 54,
    theme: 'grid'
  });

  doc.text('Diagnosis:', 20, doc.lastAutoTable.finalY + 10);

  if (diagnosis === 0) {
    diagnosis = 'Negative';
  } else {
    diagnosis = 'Positive';
  }
  doc.text(diagnosis, 20, doc.lastAutoTable.finalY + 20);

  doc.text('Diagnosis Confidence:', 20, doc.lastAutoTable.finalY + 30);

  doc.text(`${diagnosis_confidence.toString()}%`, 20, doc.lastAutoTable.finalY + 40);

  const date = new Date().toLocaleDateString().split('/').join('-');
  doc.save(`${disease}_Diagnosis_Report_${date}.pdf`);
};

