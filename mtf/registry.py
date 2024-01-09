from sklearn.utils import all_estimators

estimators = all_estimators(type_filter='classifier')

estimators_with_proba = []

for index, (name, classifier) in enumerate(estimators):
    # Filter to must have predict_proba
    if hasattr(classifier, 'predict_proba'):
        estimators_with_proba.append((name, classifier))
        print(index, name)


print(len(estimators_with_proba))
