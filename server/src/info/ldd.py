ldd_features = ["smoke", "FVC", "FEC1", "PEFR", "O2", "ABG-P-O2",
                "ABG-P-CO2", "ABG-pH Level", "Scan", "Asthama", "Other diseaes", "AGE"]
ldd_categorical_features = ["smoke", "PEFR", "O2", "ABG-P-O2",
                            "ABG-P-CO2", "ABG-pH Level", "Scan", "Asthama", "Other diseaes"]
ldd_numerical_features = ["FVC", "FEC1", "AGE"]
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
