hdd_features = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach",
                "exang", "oldpeak", "slope", "ca", "thal"]
kdd_features = ["age", "bp", "sg", "al", "su", "rbc", "pc", "pcc", "ba", "bgr", "bu",
                "sc", "sod", "pot", "hemo", "pcv", "wc", "rc", "htn", "dm", "cad", "appet", "pe", "ane"]
kdd_categorical_features = ["su", "rbc", "pc", "pcc",
                            "ba", "htn", "dm", "cad", "appet", "pe", "ane"]
kdd_numerical_features = ["age", "bp", "sg", "al", "bgr",
                          "bu", "sc", "sod", "pot", "hemo", "pcv", "wc", "rc"]
ldd_features = ["smoke", "FVC", "FEC1", "PEFR", "O2", "ABG-P-O2",
                "ABG-P-CO2", "ABG-pH Level", "Scan", "Asthama", "Other diseaes", "AGE"]
ldd_categorical_features = ["smoke", "PEFR", "O2", "ABG-P-O2",
                            "ABG-P-CO2", "ABG-pH Level", "Scan", "Asthama", "Other diseaes"]
ldd_numerical_features = ["FVC", "FEC1", "AGE"]
hdd_categorical_features = ["sex", "cp", "fbs",
                            "restecg", "exang", "slope", "ca", "thal"]
hdd_numerical_features = ["age", "trestbps", "chol", "thalach", "oldpeak"]
tdd_features = ["age", "sex", "on_thyroxine", "on antithyroid meds", "sick", "thyroid_surgery", "I131_treatment",
                "query_hypothyroid", "query_hyperthyroid", "goitre", "tumor", "hypopituitary", "TSH", "T3", "TT4", "T4U", "FTI"]
tdd_numerical_features = ["age", "TSH", "T3", "TT4", "T4U", "FTI"]
tdd_categorical_features = ["sex", "on_thyroxine", "on antithyroid meds", "sick", "thyroid_surgery",
                            "I131_treatment", "query_hypothyroid", "query_hyperthyroid", "goitre", "tumor", "hypopituitary"]
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
kdd_types = {
    "age": int,
    "bp": int,
    "sg": float,
    "al": int,
    "su": int,
    "rbc": str,
    "pc": str,
    "pcc": str,
    "ba": str,
    "bgr": float,
    "bu": int,
    "sc": float,
    "sod": int,
    "pot": float,
    "hemo": float,
    "pcv": int,
    "wc": int,
    "rc": float,
    "htn": str,
    "dm": str,
    "cad": str,
    "appet": str,
    "pe": str,
    "ane": str
}
ldd_types = {
    "smoke": str,
    "FVC": float,
    "FEC1": float,
    "PEFR": str,
    "O2": str,
    "ABG-P-O2": str,
    "ABG-P-CO2": str,
    "ABG-pH Level": str,
    "Scan": str,
    "Asthama": str,
    "Other diseaes": str,
    "AGE": int
}
tdd_types = {
    "age": int,
    "sex": str,
    "on_thyroxine": bool,
    "on antithyroid meds": bool,
    "sick": bool,
    "thyroid_surgery": bool,
    "I131_treatment": bool,
    "query_hypothyroid": bool,
    "query_hyperthyroid": bool,
    "goitre": bool,
    "tumor": bool,
    "hypopituitary": bool,
    "TSH": float,
    "T3": float,
    "TT4": float,
    "T4U": float,
    "FTI": float,
}
form_tdd = {
    'Basics': {
        'age': {
            'title': 'Age',
            'type': 'numerical'
        },
        'sex': {
            'title': 'Sex',
            'type': 'categorical',
            'options': {
                'Male': 'M',
                'Female': 'F'
            }
        },
        'on_thyroxine': {
            'title': 'On thyroxine?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'on antithyroid meds': {
            'title': 'On Antithyroid meds?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'sick': {
            'title': 'Sick?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'thyroid_surgery': {
            'title': 'Have had Thyroid Surgery?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'I131_treatment': {
            'title': 'Have had I131 treatment?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'query_hypothyroid': {
            'title': 'Do you think you have Hypothyroidism?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'query_hyperthyroid': {
            'title': 'Do you think you have Hyperthyroidism?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'goitre': {
            'title': 'Do you have goiter?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'tumor': {
            'title': 'Do you have a thyroid tumor?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'hypopituitary': {
            'title': 'Do you have hypopituitarism?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
    },
    'Bloodwork': {
        'TSH': {
            'title': 'TSH in Blood (µU/mL)',
            'type': 'numerical'
        },
        'T3': {
            'title': 'T3 in Blood (nmol/L)',
            'type': 'numerical'
        },
        'TT4': {
            'title': 'TT4 in Blood (nmol/L)',
            'type': 'numerical'
        },
        'T4U': {
            'title': 'T4U in Blood (mcg/dL)',
            'type': 'numerical'
        },
        'FTI': {
            'title': 'FTI in Blood (μg/dL)',
            'type': 'numerical'
        },
    }

}
form_ldd = {
    'Basics': {
        'AGE': {
            'title': 'Age',
            'type': 'numerical'
        },
        'smoke': {
            'title': 'Have Smoked?',
            'type': 'categorical',
            'options': {
                'Yes': 'T',
                'No': 'F'
            }
        },
        'Asthama': {
            'title': 'Have Asthama?',
            'type': 'categorical',
            'options': {
                'Yes': 'T',
                'No': 'F'
            }
        },
        'Other diseaes': {
            'title': 'Currently Have Other Diseases?',
            'type': 'categorical',
            'options': {
                'Yes': 'T',
                'No': 'F'
            }
        },
    },
    'Testing Specifics': {
        'FVC': {
            'title': 'Forced Vital Capacity (L)',
            'type': 'numerical'
        },
        'FEC1': {
            'title': 'Forced Expiratory Volume (L)',
            'type': 'numerical'
        },
        'PEFR': {
            'title': 'Normal Levels of Peak Expiratory Flow Rate? (320-550L/min)',
            'type': 'categorical',
            'options': {
                'Yes': 'F',
                'No': 'T'
            }
        },
        'O2': {
            'title': 'Normal Oxygen Saturation? (95-100%)',
            'type': 'categorical',
            'options': {
                'Yes': 'F',
                'No': 'T'
            }
        },
        'ABG-P-O2': {
            'title': 'Normal Arterial Blood Gas Partial Pressure of Oxygen? (75-100mmHg)',
            'type': 'categorical',
            'options': {
                'Yes': 'F',
                'No': 'T'
            }
        },
        'ABG-P-CO2': {
            'title': 'Normal Arterial Blood Gas Partial Pressure of Carbon Dioxide? (35-40mmHg)',
            'type': 'categorical',
            'options': {
                'Yes': 'F',
                'No': 'T'
            }
        },
        'ABG-pH Level': {
            'title': 'Normal Arterial Blood Acidity? (7.35-7.45pH)',
            'type': 'categorical',
            'options': {
                'Yes': 'F',
                'No': 'T'
            }
        },
        'Scan': {
            'title': 'Type of Imaging Scan performed',
            'type': 'categorical',
            'options': {
                'X-ray': 'X-ray',
                'MRI': 'MRI'
            }
        }
    }
}
form_kdd = {
    'Basic Patient and Urine Information': {
        'age': {
            'title': 'Age',
            'type': 'numerical'
        },
        'bp': {
            'title': 'Blood Pressure in mm/Hg',
            'type': 'numerical'
        },
        'sg': {
            'title': 'Specific Gravity of Urine',
            'type': 'numerical'
        },
        'appet': {
            'title': 'Appetite',
            'type': 'categorical',
            'options': {
                'Poor': 'poor',
                'Good': 'good'
            }
        },
        'su': {
            'title': 'Urine Sugar',
            'type': 'categorical',
            'options': {
                'Essentially None': '0',
                'Trace amounts': '2',
                'Moderately High Levels': '4',
                'Very High Levels': '5'
            }
        },
    },
    'Blood Work': {
        'al': {
            'title': 'Albumin g/dL',
            'type': 'numerical'
        },
        'rbc': {
            'title': 'Red Blood Cell Count Category',
            'type': 'categorical',
            'options': {
                'Normal': 'normal',
                'Abnormal': 'abnormal'
            }
        },
        'pc': {
            'title': 'Pus Cell Count Category',
            'type': 'categorical',
            'options': {
                'Normal': 'normal',
                'Abnormal': 'abnormal'
            }
        },
        'pcc': {
            'title': 'Pus Cell Clumps',
            'type': 'categorical',
            'options': {
                'Present': 'present',
                'Not Present': 'notpresent'
            }
        },
        'ba': {
            'title': 'Bacteria in Bloodstream',
            'type': 'categorical',
            'options': {
                'Present': 'present',
                'Not Present': 'notpresent'
            }
        },
        'bgr': {
            'title': 'Blood Glucose Random mg/dL',
            'type': 'numerical'
        },
        'bu': {
            'title': 'Blood Urea mg/dL',
            'type': 'numerical'
        },
        'sc': {
            'title': 'Serum Creatine mg/dL',
            'type': 'numerical'
        },
        'sod': {
            'title': 'Blood Sodium mEg/L',
            'type': 'numerical'
        },
        'pot': {
            'title': 'Blood Potassium mEq/L',
            'type': 'numerical'
        },
        'hemo': {
            'title': 'Hemoglobin Count g/dL',
            'type': 'numerical'
        },
        'pcv': {
            'title': 'Packed Cell Volume (%)',
            'type': 'numerical'
        },
        'wc': {
            'title': 'White Blood Cell Count #/μL',
            'type': 'numerical'
        },
        'rc': {
            'title': 'Red Blood Cell Count million/mm^3',
            'type': 'numerical'
        },
    },
    'Other Conditions': {
        'ane': {
            'title': 'Anemia',
            'type': 'categorical',
            'options': {
                'Yes': 'yes',
                'No': 'no'
            }
        },
        'pe': {
            'title': 'Pedal Edema',
            'type': 'categorical',
            'options': {
                'Yes': 'yes',
                'No': 'no'
            }
        },
        'cad': {
            'title': 'Coronary Artery Disese',
            'type': 'categorical',
            'options': {
                'Yes': 'yes',
                'No': 'no'
            }
        },
        'htn': {
            'title': 'Hypertension',
            'type': 'categorical',
            'options': {
                'Yes': 'yes',
                'No': 'no'
            }
        },
    }
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

format_dict = {
    'hdd': {
        'name': 'Heart Disease',
        'features': hdd_features,
        'target': 'target',
        'model': './src/models/hdd_model_accuracy.pkl',
        'standard_scaler': './src/preprocessor/hdd_preprocessor_accuracy.pkl',
        'categorical': hdd_categorical_features,
        'numerical': hdd_numerical_features,
        'type': hdd_types,
        'form': form_hdd,
    },
    'kdd': {
        'name': 'Kidney Disease',
        'features': kdd_features,
        'target': 'target',
        'model': './src/models/kdd_model.pkl',
        'standard_scaler': './src/preprocessor/kdd_preprocessor.pkl',
        'categorical': kdd_categorical_features,
        'numerical': kdd_numerical_features,
        'type': kdd_types,
        'form': form_kdd,
    },
    'ldd': {
        'name': 'Lung Disease',
        'features': ldd_features,
        'target': 'target',
        'model': './src/models/ldd_model.pkl',
        'standard_scaler': './src/preprocessor/ldd_preprocessor.pkl',
        'categorical': ldd_categorical_features,
        'numerical': ldd_numerical_features,
        'type': ldd_types,
        'form': form_ldd,
    },
    'tdd': {
        'name': 'Thyroid Disease',
        'features': tdd_features,
        'target': 'target',
        'model': '',
        'standard_scaler': './src/preprocessor/tdd_standard_scaler.pkl',
        'categorical': tdd_categorical_features,
        'numerical': tdd_numerical_features,
        'type': tdd_types,
        'form': form_tdd,
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
        },
        {
            'value': 'ldd',
            'label': 'Lung Disease',
            'description': 'Lung disease refers to various conditions affecting the lungs, impairing their function and often causing symptoms like coughing, shortness of breath, and decreased oxygen intake. These conditions range from infections like pneumonia to chronic diseases such as COPD and asthma, impacting breathing and overall respiratory health.'
        },
        {
            'value': 'tdd',
            'label': 'Thyroid Disease',
            'description': 'Thyroid disease refers to conditions affecting the thyroid glands function, leading to hormonal imbalances that can impact metabolism, energy levels, and various bodily functions',
        }
    ]
}
