# MTF: Diagnosing Disease in Space 

Authors: Benjamin Standefer and Eric Zhang

Advisor: Stewart Mayer

## Abstract

MTF (Model Testing Framework) evaluates machine learning algorithms based on factors specifically tailored to diagnosing disease in microgravity. We created multiple literature reviews, a new score for machine learning models that considers medical factors, and a user-friendly website to support the implementation of this framework.

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
Example of some Heart Disease Results
![target_accuracy](https://github.com/ericspring08/NasaHunch23/assets/69996843/f8cb5746-711d-409d-9643-daa27a68116c)
![target_logloss](https://github.com/ericspring08/NasaHunch23/assets/69996843/43931d15-37f9-42dd-b062-5fe837090a3b)
![target_shscore](https://github.com/ericspring08/NasaHunch23/assets/69996843/1752947d-0e2b-4d29-b39f-0da2ffd645d5)

As can be seen in the graphs above, a variety of metrics were taken into consideration when choosing models to include and affirming the integrity of the framework itself, including but not limited to: 
- Accuracy 
- Balanced Accuracy
- Precision
- Recall
- F1 Score 
- Log loss
- Specificity
- Jaccard Score
- AUC ROC
- Train Time
- Predict Time

**All results are located at [/mtf/results/](/mtf/results/)**

**All graphs are located at [/mtf/graphs/](/mtf/graphs/)**

We also created designed our own metrics that act as modified amalgamations of the metrics listed above to put emphasis on the severity of false negatives when making a diagnosis (as false negatives are much more indicative of sub-optimal performance in the medical field):

## Modified F1 Score + Log Loss Hybrid
![yᵢ → true label pᵢ → prob that label is 1 yᵢ → true label w₁, w₆ = 0 75 w₂, w₃, w₄, w₇ = 0 25 w₅ = 0 5 (1)](https://github.com/ericspring08/NasaHunch23/assets/69996843/9aef96cb-ad66-40a4-b901-28511deb61f2)

*Harmonic Mean of Specificity and Precision with a weighted average >0.5 + Typical Log Loss Function with weighted coefficients favoring emphasis on false negatives within the summation component coupled with an overall coefficient <0.5*

## Our Website
![Website](https://github.com/ericspring08/NasaHunch23/assets/69996843/8523faf8-931f-4735-b8c2-d001827e866f)

The MTF website was designed for clear, simple user accessibility and flexibility for a variety of symptoms and diseases. Symptom input information is presented in a form-format, and only the most relevant symptoms were included for each diagnosis. Results can be saved as a PDF, and confidence in a prediction is also included in every diagnosis. 




