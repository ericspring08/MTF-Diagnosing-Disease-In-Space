# MTF: Diagnosing Disease in Space 

Authors: Benjamin Standefer and Eric Zhang

Advisor: Stewart Mayer

## Abstract

MTF, or Model Testing Framework, is a substructure for evaluating a variety of machine learning algorithims and determining the best model to diagnosis any given disease. This framework uses traditional model assessments combined with composite metrics designed by the authors. It runs proficiently with unbalanced datasets and is designed for low-tech implementation. 

## Tackling Disease Diagnosis in Space

Diseases to focus on for research and analysis were chosen based on likely frequency in a real-life space environment. The diseases we chose were: 

- Cardiovascular Disease
- Respiratory Disease
- Kidney Disease 
- Thyroid Disease 
- Liver Disease 

Root causes of these diseases are likely to differ in microgravity environments versus on earth, but symptomatically they will present similarly, and treatment usually correlates as well. 

The datasets were chosen to reflect a variety of racial, sexual, and other physical demographics. 

## Research

More than 50 papers and reputable articles were read and considered before, during, and after the design process. Of those works, the most thorough and overarching papers were assimilated into multiple literature reviews or used to design preliminary symptom formalizations. 

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




