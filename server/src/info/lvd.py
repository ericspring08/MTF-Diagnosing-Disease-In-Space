lvd_features = ["Age", "Total_Bilirubin", "Direct_Bilirubin", "Alkaline_Phosphotase",
                "Alamine_Aminotransferase", "Aspartate_Aminotransferase", "Total_Protiens",
                "Albumin", "Albumin_and_Globulin_Ratio", "Gender"]
lvd_categorical_features = ["Gender"]
lvd_numerical_features = ["Age", "Total_Bilirubin", "Direct_Bilirubin", "Alkaline_Phosphotase",
                          "Alamine_Aminotransferase", "Aspartate_Aminotransferase", "Total_Protiens",
                          "Albumin", "Albumin_and_Globulin_Ratio"]
lvd_types = {
    "Age": int,
    "Total_Bilirubin": float,
    "Direct_Bilirubin": float,
    "Alkaline_Phosphotase": int,
    "Alamine_Aminotransferase": int,
    "Aspartate_Aminotransferase": int,
    "Total_Protiens": float,
    "Albumin": float,
    "Albumin_and_Globulin_Ratio": float,
    "Gender": str
}

lvd_form = {
    'Demographics': {
        'Age': {
            'title': 'Age',
            'type': 'numerical'
        },
        'Gender': {
            'title': 'Gender',
            'type': 'categorical',
            'options': {
                'Male': 'Male',
                'Female': 'Female'
            }
        }
    },
    'Liver Enzyme Tests': {
        'Alkaline_Phosphotase': {
            'title': 'Alkaline Phosphatase (IU/L)',
            'type': 'numerical'
        },
        'Alamine_Aminotransferase': {
            'title': 'Alamine Aminotransferase (IU/L)',
            'type': 'numerical'
        },
        'Aspartate_Aminotransferase': {
            'title': 'Aspartate Aminotransferase (IU/L)',
            'type': 'numerical'
        }
    },
    'Liver Protein Tests': {
        'Total_Protiens': {
            'title': 'Total Proteins (g/dL)',
            'type': 'numerical'
        },
        'Albumin': {
            'title': 'Albumin (g/dL)',
            'type': 'numerical'
        },
        'Albumin_and_Globulin_Ratio': {
            'title': 'Albumin and Globulin Ratio',
            'type': 'numerical'
        }
    },
    'Bilirubin Tests': {
        'Total_Bilirubin': {
            'title': 'Total Bilirubin (mg/dL)',
            'type': 'numerical'
        },
        'Direct_Bilirubin': {
            'title': 'Direct Bilirubin (mg/dL)',
            'type': 'numerical'
        }
    }
}
