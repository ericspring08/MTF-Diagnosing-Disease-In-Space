from src.info.hdd import hdd_features, hdd_categorical_features, hdd_numerical_features, hdd_types, form_hdd
from src.info.kdd import kdd_features, kdd_categorical_features, kdd_numerical_features, kdd_types, form_kdd
from src.info.ldd import ldd_features, ldd_categorical_features, ldd_numerical_features, ldd_types, form_ldd
from src.info.tdd import tdd_features, tdd_categorical_features, tdd_numerical_features, tdd_types, form_tdd

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
        'model': './src/models/tdd_model.pkl',
        'standard_scaler': './src/preprocessor/tdd_preprocessor.pkl',
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
