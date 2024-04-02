kdd_features = ["age", "bp", "sg", "al", "su", "rbc", "pc", "pcc", "ba", "bgr", "bu",
                "sc", "sod", "pot", "hemo", "pcv", "wc", "rc", "htn", "dm", "cad", "appet", "pe", "ane"]
kdd_categorical_features = ["su", "rbc", "pc", "pcc",
                            "ba", "htn", "dm", "cad", "appet", "pe", "ane"]
kdd_numerical_features = ["age", "bp", "sg", "al", "bgr",
                          "bu", "sc", "sod", "pot", "hemo", "pcv", "wc", "rc"]
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
