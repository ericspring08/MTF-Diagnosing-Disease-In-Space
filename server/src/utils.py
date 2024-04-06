from src.info.hdd import hdd_features, hdd_categorical_features, hdd_numerical_features, hdd_types, form_hdd, hdd_results_descriptions
from src.info.kdd import kdd_features, kdd_categorical_features, kdd_numerical_features, kdd_types, form_kdd, kdd_results_description
from src.info.ldd import ldd_features, ldd_categorical_features, ldd_numerical_features, ldd_types, form_ldd, ldd_results_descriptions
from src.info.tdd import tdd_features, tdd_categorical_features, tdd_numerical_features, tdd_types, form_tdd, tdd_results_description
from src.info.lvd import lvd_features, lvd_categorical_features, lvd_numerical_features, lvd_types, lvd_form, lvd_results_description

format_dict = {
    'hdd': {
        'name': 'Heart Disease',
        'features': hdd_features,
        'target': 'target',
        'model': './src/models/hdd_model.pkl',
        'standard_scaler': './src/preprocessor/hdd_preprocessor.pkl',
        'categorical': hdd_categorical_features,
        'numerical': hdd_numerical_features,
        'type': hdd_types,
        'form': form_hdd,
        'results_description': hdd_results_descriptions
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
        'results_description': kdd_results_description
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
        'results_description': ldd_results_descriptions
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
        'results_description': tdd_results_description
    },
    'lvd': {
        'name': 'Liver Disease',
        'features': lvd_features,
        'target': 'Dataset',
        'model': './src/models/lvd_model.pkl',
        'standard_scaler': './src/preprocessor/lvd_preprocessor.pkl',
        'categorical': lvd_categorical_features,
        'numerical': lvd_numerical_features,
        'type': lvd_types,
        'form': lvd_form,
        'results_description': lvd_results_description
    }
}
diagnosis_options = [
    {
        'value': 'hdd',
        'label': 'Heart Disease',
        'description': 'Heart disease describes a range of conditions that affect your heart. Diseases under the heart disease umbrella include blood vessel diseases, such as coronary artery disease; heart rhythm problems (arrhythmias); and heart defects you\'re born with (congenital heart defects), among others.',
        'type': 'disease',
        'path': '/form/hdd',
    },
    {
        'value': 'kdd',
        'label': 'Kidney Disease',
        'description': 'Kidney disease means your kidneys are damaged and can’t filter blood the way they should. You are at greater risk for kidney disease if you have diabetes or high blood pressure. If you experience kidney failure, treatments include kidney transplant or dialysis.',
        'type': 'disease',
        'path': '/form/kdd',
    },
    {
        'value': 'ldd',
        'label': 'Lung Disease',
        'description': 'Lung disease refers to various conditions affecting the lungs, impairing their function and often causing symptoms like coughing, shortness of breath, and decreased oxygen intake. These conditions range from infections like pneumonia to chronic diseases such as COPD and asthma, impacting breathing and overall respiratory health.',
        'type': 'disease',
        'path': '/form/ldd'
    },
    {
        'value': 'tdd',
        'label': 'Thyroid Disease',
        'description': 'Thyroid disease refers to conditions affecting the thyroid glands function, leading to hormonal imbalances that can impact metabolism, energy levels, and various bodily functions',
        'type': 'disease',
        'path': '/form/tdd'
    },
    {
        'value': 'lvd',
        'label': 'Liver Disease',
        'description': 'Liver disease refers to a range of conditions affecting the liver’s function and structure. These conditions can cause liver inflammation, scarring, and damage, leading to liver failure and other complications. Common liver diseases include hepatitis, cirrhosis, and liver cancer.',
        'type': 'disease',
        'path': '/form/lvd'
    },
    {
        'value': 'ekg',
        'label': 'Vernier EKG',
        'description': 'The Vernier EKG sensor measures electrical signals produced during heart activity. The sensor is placed on the skin and can be used to measure heart rate, heart rate variability, and more. The sensor can be used to monitor heart health and activity.',
        'type': 'sensor',
        'path': '/sensor/ekg'
    }
]
