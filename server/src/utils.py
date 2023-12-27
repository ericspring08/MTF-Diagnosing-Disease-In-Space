hdd_features = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach",
                "exang", "oldpeak", "slope", "ca", "thal"]
hdd_categorical_features = ["sex", "cp", "fbs", "restecg", "exang", "slope", "ca", "thal"]
hdd_numerical_features = ["age", "trestbps", "chol", "thalach", "oldpeak"]
hdd_types = {
    "age": int,
    "sex": int,
    "cp": int,
    "trestbps": int,
    "chol": int,
    "fbs": int,
    "restecg": int,
    "thalach": int,
    "exang": int,
    "oldpeak": float,
    "slope": int,
    "ca": int,
    "thal": int
}

form_hdd = {
    'Basic Information': {
        'sex': {
            'title': 'Sex',
            'type': 'categorical',
            'options': {
                'Male': '1',
                'Female': '0'
            }
        },
        'age': {
            'title': 'Age',
            'type': 'numerical'
        },
        'cp': {
            'title': 'Chest Pain Type',
            'type': 'categorical',
            'options': {
                'No Chest Pain': '0',
                'Mild Chest Pain': '1',
                'Moderate Chest Pain': '2',
                'Severe Chest Pain': '3'
            }
        },
        'exang': {
            'title': 'Exercise Induced Angina',
            'type': 'categorical',
            'options': {
                'Yes': '1',
                'No': '0'
            }
        },
    },
    'Blood Work': {
        'trestbps': {
            'title': 'Resting Blood Pressure',
            'type': 'numerical'
        },
        'chol': {
            'title': 'Serum Cholestrol',
            'type': 'numerical'
        },
        'fbs': {
            'title': 'Fasting Blood Sugar',
            'type': 'categorical',
            'options': {
                'Yes': '1',
                'No': '0'
            }
        },
    },
    'EKG': {
        'thalach': {
            'title': 'Maximum Heart Rate Achieved',
            'type': 'numerical'
        },
        'restecg': {
            'title': 'Resting Electrocardiographic Results',
            'type': 'categorical',
            'options': {
                'Normal': '0',
                'Abnormal': '1',
                'Showing probable or definite left ventricular hyperthrophy': '2'
            }
        },
        'oldpeak': {
            'title': 'ST Depression Induced by Exercise Relative to Rest',
            'type': 'numerical'
        },
        'slope': {
            'title': 'Slope of the Peak Exercise ST Segment',
            'type': 'categorical',
            'options': {
                'Upsloping': '0',
                'Flat': '1',
                'Downsloping': '2'
            }
        },
        'ca': {
            'title': 'Number of Major Vessels Colored by Flourosopy',
            'type': 'categorical',
            'options': {
                '0': '0',
                '1': '1',
                '2': '2',
                '3': '3'
            }
        },
        'thal': {
            'title': 'Thalassemia',
            'type': 'categorical',
            'options': {
                'Normal': '0',
                'Fixed Defect': '1',
                'Reversable Defect': '2'
            }
        },
    },
}

format_dict = {
    'hdd': {
        'features': hdd_features,
        'target': 'target',
        'model': './src/models/hdd_model.pkl',
        'standard_scaler': './src/preprocessor/hdd_standard_scaler.pkl',
        'categorical': hdd_categorical_features,
        'numerical': hdd_numerical_features,
        'type': hdd_types,
        'form': form_hdd,
    }
}

disease_options = {
    'diseases': [
        {
            'value': 'hdd',
            'label': 'Heart Disease',
            'description': 'Heart disease describes a range of conditions that affect your heart. Diseases under the heart disease umbrella include blood vessel diseases, such as coronary artery disease; heart rhythm problems (arrhythmias); and heart defects you\'re born with (congenital heart defects), among others.',
        },
        {
            'value': 'kdd',
            'label': 'Kidney Disease',
            'description': 'Kidney disease means your kidneys are damaged and can’t filter blood the way they should. You are at greater risk for kidney disease if you have diabetes or high blood pressure. If you experience kidney failure, treatments include kidney transplant or dialysis.',
        }
    ]
}