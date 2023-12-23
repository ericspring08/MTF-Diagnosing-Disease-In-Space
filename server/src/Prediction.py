from src.utils import *
import pandas as pd
from pickle import load


class Prediction(object):
    def __init__(self, data, disease):
        # Data in format of dictionary
        self.data = data
        self.disease = disease

    def preprocess(self):
        # Preprocess the data
        headers = format_dict[self.disease]['features']
        categorical = format_dict[self.disease]['categorical']
        numerical = format_dict[self.disease]['numerical']
        preprocessor_file = format_dict[self.disease]['standard_scaler']
        # Load the preprocessor
        with open(preprocessor_file, 'rb') as preprocessor_file:
            preprocessor = load(preprocessor_file)
        # Convert the data into dataframe
        df = pd.DataFrame([self.data], columns=headers)
        # Convert the categorical features into one-hot encoding
        df = preprocessor.transform(df)
        self.data = df

    def predict(self):
        # Load the model
        model_file = format_dict[self.disease]['model']
        with open(model_file, 'rb') as model_file:
            model = load(model_file)
        # Predict the data
        prediction = model.predict(self.data)
        probability = model.predict_proba(self.data)
        return prediction, probability
