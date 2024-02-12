# MTF: Diagnosing Disease in Space 

Authors: Benjamin Standefer and Eric Zhang

Advisor: Stewart Mayer

## Abstract

MTF, or Model Testing Framework, is a substructure for evaluating a variety of machine learning algorithms and determining the best model to diagnosis any given disease. This framework uses traditional model assessments combined with composite metrics designed by the authors. It runs proficiently with unbalanced datasets and is designed for low-tech implementation. 

## Tackling Disease Diagnosis in Space

Diseases to focus on for research and analysis were chosen based on likely frequency in a real-life space environment. The diseases we chose were: 

- Cardiovascular Disease
- Respiratory Disease
- Kidney Disease 
- Thyroid Disease 
- Liver Disease 

All of these are pertinent disorders and malfunctions that affect astronauts on the ISS, but not always in the most intuitive fashion. For example, our datasets were often based on disorders that would not in any way be applicable to astronauts at first glance. Our patient set was not the picture of health like astronauts are required to be, and the disorders occasionally had to do with substances not even present on the ISS, like alcohol and fatty foods. After researching data analytics in relation to space health, however, we uncovered some interesting parallels to be drawn here:

- One disease we chose was CAD, using a database verified by UC Berkeley's Biomedical branch, Coronary artery disease symptomatically and treatment-wise presents very similarly to a variety of heart malfunctions present in space, such as anatomical ovular reformation due to gravitational changes or loss of blood volume and atrophy of transport vessels 
This means we can look at datasets of individuals suffering from these illnesses on earth and draw conclusions about astronauts in space 
- Another example would be the slinky effect, were astronauts have poor pulmonary ventilation due to microgravity-induced compression of lung tissue, these changes are similar physiologically to pulmonary disorders on earth like early stage-lung cancer and COPD


The datasets were chosen to reflect a variety of racial, sexual, and other physical demographics. 

## Research

More than 50 papers and reputable articles were read and considered before, during, and after the design process. Of those works, the most thorough and overarching papers were assimilated into multiple literature reviews or used to design preliminary symptom formalizations. 

Link to Review:
https://1drv.ms/x/s!AuAo3fIYJbLehAbY97Ew8uRGxJ_V?e=Gl6TZ3

## Experimentation

Rounds of experimentation were performed, the shortest trials lasting less than a minute and the longest taking close to 48 hours. All key graphical and numerical data from each experiment was saved for reference as both the framework and metrics were tweaked for peak performance. 

## Results

we gotta insert some graphs here Eric

As can be seen in the graphs above, a variety of metrics were taken into consideration when choosing models to include and affirming the integrity of the framework itself, including but not limited to: 
- Accuracy 
- Balanced Accuracy
- Precision
- Recall
- F1 Score 
- Log loss
- Specificity

We also created designed our own metrics that act as modified amalgamations of the metrics listed above to put emphasis on the severity of false negatives when making a diagnosis (as false negatives are much more indicative of sub-optimal performance in the medical field):

Modified F1 Score + Log Loss Hybrid: 

*Harmonic Mean of Specificity and Precision with a weighted average >0.5 + Typical Log Loss Function with weighted coefficients favoring emphasis on false negatives within the summation component coupled with an overall coefficient <0.5*

## Our Website

The MTF website was designed for clear, simple user accessibility and flexibility for a variety of symptoms and diseases. Symptom input information is presented in a form-format, and only the most relevant symptoms were included for each diagnosis. Results can be saved as a PDF, and confidence in a prediction is also included in every diagnosis. 




