
import { jsPDF } from 'jspdf';

export const createPDF = (
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
  doc.setTextColor(0); 
  doc.text(`Diagnosis: ${diagnosis}`, 20, 45);
  doc.text(
    `Diagnosis Confidence: ${(diagnosis_confidence * 100).toFixed(2)}%`,
    20,
    60
  );

 
  doc.setFontSize(14);
  let posY = 80;
  for (const [key, value] of Object.entries(features)) {
    doc.setTextColor(33, 33, 33); 
    doc.text(`${key}:`, 20, posY);
    doc.setTextColor(77, 77, 77); 
    doc.text(`${value}`, 40, posY);
    posY += 15;
  }


  const currentDate = new Date();
  const date = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;
  doc.setTextColor(100);
  doc.setFontSize(10);
  doc.text(`Generated on: ${date}`, 20, 280);

  
  doc.save(`${disease}_Diagnosis_Report_${date}.pdf`);
};
