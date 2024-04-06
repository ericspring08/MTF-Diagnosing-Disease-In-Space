tdd_features = ["age", "sex", "on thyroxine", "on antithyroid medication", "sick", "thyroid surgery", "I131 treatment",
                "query hypothyroid", "query hyperthyroid", "goitre", "tumor", "hypopituitary", "TSH", "T3", "TT4", "T4U", "FTI"]
tdd_numerical_features = ["age", "TSH", "T3", "TT4", "T4U", "FTI"]
tdd_categorical_features = ["sex", "on thyroxine", "on antithyroid medication", "sick", "thyroid surgery",
                            "I131 treatment", "query hypothyroid", "query hyperthyroid", "goitre", "tumor", "hypopituitary"]
tdd_types = {
    "age": int,
    "sex": str,
    "on thyroxine": str,
    "on antithyroid medication": str,
    "sick": str,
    "thyroid surgery": str,
    "I131 treatment": str,
    "query hypothyroid": str,
    "query hyperthyroid": str,
    "goitre": str,
    "tumor": str,
    "hypopituitary": str,
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
        'on thyroxine': {
            'title': 'On Thyroxine?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'on antithyroid medication': {
            'title': 'On Antithyroid medication?',
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
        'thyroid surgery': {
            'title': 'Have had Thyroid Surgery?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'I131 treatment': {
            'title': 'Have had I131 treatment?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'query hypothyroid': {
            'title': 'Do you think you have Hypothyroidism?',
            'type': 'categorical',
            'options': {
                'Yes': 't',
                'No': 'f'
            }
        },
        'query hyperthyroid': {
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

tdd_results_description = {
    'negative': "Your recent diagnosis suggests that your thyroid function is moderate to above average, with no signs of hypothyroidism. This indicates a healthy thyroid status for now. However, it's still important to stay vigilant and schedule periodic check-ups to ensure ongoing thyroid health.",
    'positive': "Your diagnosis indicates hypothyroidism, requiring prompt medical attention. It's crucial to consult with a healthcare professional for further evaluation and management. Early intervention and treatment can help address symptoms and prevent potential complications associated with hypothyroidism."
}
