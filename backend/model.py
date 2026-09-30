import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score
)


# ---------------------------------------
# 1. Load dataset
# ---------------------------------------

df = pd.read_csv("data/cleaned_dataset.csv")

print("Dataset loaded successfully!")
print("Shape:", df.shape)


# ---------------------------------------
# 2. Select features
# ---------------------------------------

features = [
    "Type",
    "Air temperature [K]",
    "Process temperature [K]",
    "Rotational speed [rpm]",
    "Torque [Nm]",
    "Tool wear [min]"
]

X = df[features]
y = df["Machine failure"]


print("\nFeatures:")
print(features)

print("\nTarget:")
print("Machine failure")


# ---------------------------------------
# 3. Separate categorical/numerical
# ---------------------------------------

categorical_features = ["Type"]

numerical_features = [
    "Air temperature [K]",
    "Process temperature [K]",
    "Rotational speed [rpm]",
    "Torque [Nm]",
    "Tool wear [min]"
]


# ---------------------------------------
# 4. Preprocessing
# ---------------------------------------

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        )
    ],
    remainder="passthrough"
)


# ---------------------------------------
# 5. Random Forest
# ---------------------------------------

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced",
    max_depth=12
)


# ---------------------------------------
# 6. Pipeline
# ---------------------------------------

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# ---------------------------------------
# 7. Train-test split
# ---------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining data:", X_train.shape)
print("Testing data:", X_test.shape)


# ---------------------------------------
# 8. Train
# ---------------------------------------

print("\nTraining model...")

pipeline.fit(X_train, y_train)

print("Model trained successfully!")


# ---------------------------------------
# 9. Prediction
# ---------------------------------------

y_pred = pipeline.predict(X_test)


# ---------------------------------------
# 10. Evaluation
# ---------------------------------------

print("\nAccuracy:")
print(accuracy_score(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# ---------------------------------------
# 11. Feature importance
# ---------------------------------------

rf_model = pipeline.named_steps["model"]

importances = rf_model.feature_importances_

feature_names = pipeline.named_steps[
    "preprocessor"
].get_feature_names_out()

importance_df = pd.DataFrame({
    "Feature": feature_names,
    "Importance": importances
})

importance_df = importance_df.sort_values(
    by="Importance",
    ascending=False
)

print("\nFeature Importance:")
print(importance_df)
# ---------------------------------------
# 12. Save trained model
# ---------------------------------------

joblib.dump(
    pipeline,
    "predictive_maintenance_model.pkl"
)

print("\nModel saved successfully!")