lvd_features = ["Age", "Total_Bilirubin", "Direct_Bilirubin", "Alkaline_Phosphotase",
                "Alanine_Aminotransferase", "Aspartate_Aminotransferase", "Total_Protiens",
                "Albumin", "Albumin_and_Globulin_Ratio", "Gender"]
lvd_categorical_features = ["Gender"]
lvd_numerical_features = ["Age", "Total_Bilirubin", "Direct_Bilirubin", "Alkaline_Phosphotase",
                          "Alanine_Aminotransferase", "Aspartate_Aminotransferase", "Total_Protiens",
                          "Albumin", "Albumin_and_Globulin_Ratio"]
lvd_types = {
    "Age": int,
    "Total_Bilirubin": float,
    "Direct_Bilirubin": float,
    "Alkaline_Phosphotase": int,
    "Alanine_Aminotransferase": int,
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
        'Alanine_Aminotransferase': {
            'title': 'Alanine Aminotransferase (IU/L)',
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

lvd_results_description = {
    'negative': "It's reassuring to confirm that you are not at high risk for Hepatitis (A, B, C, D, or E). However, it's important to continue practicing preventive measures such as practicing good hygiene and avoiding sharing needles or personal items. For further information on Hepatitis and its prevention, you may find valuable insights from reputable sources like MedlinePlus's Hepatitis resources.",
    'positive': "Your results indicate a potential risk of Hepatitis (A, B, C, D, or E). It's crucial to seek further evaluation from a healthcare professional for appropriate testing and diagnosis. Additionally, it's recommended to educate yourself about Hepatitis and its management strategies, which can be found in reliable resources such as MedlinePlus's Hepatitis materials."
}
