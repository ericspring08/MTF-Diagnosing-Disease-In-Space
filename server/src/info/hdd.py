hdd_features = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach",
                "exang", "oldpeak", "slope", "ca", "thal"]
hdd_categorical_features = ["sex", "cp", "fbs",
                            "restecg", "exang", "slope", "ca", "thal"]
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
            'title': 'Resting Blood Pressure mm/Hg',
            'type': 'numerical'
        },
        'chol': {
            'title': 'Serum Cholestrol mg/dL',
            'type': 'numerical'
        },
        'fbs': {
            'title': 'Fasting Blood Sugar >120mg/dL',
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
                'Upsloping': '2',
                'Flat': '1',
                'Downsloping': '0'
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
            'title': 'Thallium myocardial perfusion scan results',
            'type': 'categorical',
            'options': {
                'Normal': '1',
                'Fixed Defect': '2',
                'Reversable Defect': '3'
            }
        },
    },
}
hdd_results_descriptions = {
    'negative': "Based on your diagnosis, it's reassuring to confirm that you are free from any significant heart conditions such as coronary artery disease, arrhythmia, or impending heart failure. Additionally, your symptoms suggest that you are in a satisfactory state of health, with no cause for immediate concern. This conclusion is supported by 90 % of patients who present similar symptoms and are found to be in good health upon examination. This conclusion was made with the help of information from the National Heart, Lung, and Blood Institute’s publication Your Guide to a Healthy Heart.",
    'positive': "Based on your diagnosis, it's concerning to note that you are at risk for significant heart conditions such as coronary artery disease, arrhythmia, or impending heart failure. Immediate medical attention is advised for a more in-depth diagnosis and exploration of treatment options. This conclusion is supported by a dataset of over 1000 patients with varying levels of symptoms of cardiovascular distress. This conclusion was made with the help of information from the National Heart, Lung, and Blood Institute’s publication Your Guide to a Healthy Heart."
}
