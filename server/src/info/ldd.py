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

ldd_results_descriptions = {
    'negative': "Based on your diagnosis, it's reassuring to confirm that you are not at severe risk for Chronic Obstructive Pulmonary Disease (COPD). To maintain good lung health, it's essential to prioritize regular exercise, avoid smoking, and ensure proper nutrition. Consulting resources like the American Lung Association's Nutrition and COPD guide can provide valuable insights into dietary habits that support lung function and overall well-being.",
    'positive': "Unfortunately, your results indicate a high risk of Chronic Obstructive Pulmonary Disease (COPD). It's crucial to prioritize quitting smoking immediately, adopt a healthy lifestyle including regular exercise and balanced nutrition, and seek prompt medical attention for further evaluation and management of your lung health.Additionally, we strongly advise consulting resources such as the American Lung Association's Nutrition and COPD guide for tailored nutritional advice and lifestyle strategies to help manage COPD symptoms and improve overall lung health."
}
