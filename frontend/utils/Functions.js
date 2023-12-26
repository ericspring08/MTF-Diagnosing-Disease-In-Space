/*import { jsPDF } from 'jspdf';
export const createPDF = (
     disease,
     features,
     diagnosis,
     diagnosis_confidence,
) => {
     const doc = new jsPDF();
     doc.text(`${disease}`, 10, 10);
     doc.text(`Diagnosis: ${diagnosis}`, 10, 20);
     doc.text(`Diagnosis Confidence: ${diagnosis_confidence * 100}%`, 10, 30);
     // loop through the features
     var index = 0;
     for (const [key, value] of Object.entries(features)) {
          index++;
          doc.text(`${key}: ${value}`, 10, 30 + index * 10);
     }
     const currentDate = new Date();
     const date = `${currentDate.getFullYear()}-${
          currentDate.getMonth() + 1
     }-${currentDate.getDate()}`;
     doc.save(`${disease}-diagnosis-${date}.pdf`);
};
*/
import { jsPDF } from 'jspdf';

export const createPDF = (
  disease,
  features,
  diagnosis,
  diagnosis_confidence,
) => {
  const doc = new jsPDF();

  // Set font styles
  doc.setFont('helvetica', 'normal');

  // Title
  doc.setFontSize(24);
  doc.setTextColor(33, 150, 243); // Blue color
  doc.text(`Diagnosis Report: ${disease}`, 20, 30);

  // Subtitle
  doc.setFontSize(16);
  doc.setTextColor(0); // Reset to black
  doc.text(`Diagnosis: ${diagnosis}`, 20, 45);
  doc.text(
    `Diagnosis Confidence: ${(diagnosis_confidence * 100).toFixed(2)}%`,
    20,
    60
  );

  // Features Section
  doc.setFontSize(14);
  let posY = 80;
  for (const [key, value] of Object.entries(features)) {
    doc.setTextColor(33, 33, 33); // Darker color for feature names
    doc.text(`${key}:`, 20, posY);
    doc.setTextColor(77, 77, 77); // Lighter color for feature values
    doc.text(`${value}`, 40, posY);
    posY += 15;
  }

  // Footer with Date
  const currentDate = new Date();
  const date = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;
  doc.setTextColor(100);
  doc.setFontSize(10);
  doc.text(`Generated on: ${date}`, 20, 280);

  // Save the PDF with a formatted file name
  doc.save(`${disease}_Diagnosis_Report_${date}.pdf`);
};
