import { jsPDF } from 'jspdf';
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
