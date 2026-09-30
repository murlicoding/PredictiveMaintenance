from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# ==========================================
# LOAD MODEL
# ==========================================

model = joblib.load("predictive_maintenance_model.pkl")

print("Model loaded successfully!")


# ==========================================
# HOME
# ==========================================

@app.route("/")
def home():

    return jsonify({
        "message": "Predictive Maintenance API is running"
    })


# ==========================================
# UPLOAD CSV
# ==========================================

@app.route("/upload", methods=["POST"])
def upload_file():

    if "file" not in request.files:

        return jsonify({
            "error": "No file uploaded"
        }), 400

    file = request.files["file"]

    if file.filename == "":

        return jsonify({
            "error": "No file selected"
        }), 400

    if not file.filename.endswith(".csv"):

        return jsonify({
            "error": "Only CSV files are allowed"
        }), 400

    try:

        df = pd.read_csv(file)

        features = [
            "Type",
            "Air temperature [K]",
            "Process temperature [K]",
            "Rotational speed [rpm]",
            "Torque [Nm]",
            "Tool wear [min]"
        ]

        missing_columns = [
            column
            for column in features
            if column not in df.columns
        ]

        if missing_columns:

            return jsonify({
                "error": "Missing required columns",
                "missing_columns": missing_columns
            }), 400

        X = df[features]

        predictions = model.predict(X)

        predictions = predictions.tolist()

        total_machines = len(predictions)

        predicted_failures = sum(
            1
            for prediction in predictions
            if prediction == 1
        )

        safe_machines = (
            total_machines -
            predicted_failures
        )

        failure_rate = (
            predicted_failures /
            total_machines
        ) * 100

        return jsonify({

            "message":
                "Prediction completed successfully",

            "rows":
                total_machines,

            "columns":
                len(df.columns),

            "total_machines":
                total_machines,

            "predicted_failures":
                predicted_failures,

            "safe_machines":
                safe_machines,

            "failure_rate":
                round(failure_rate, 2),

            "predictions":
                predictions

        })

    except Exception as e:

        print("UPLOAD ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# ==========================================
# ANALYTICS
# ==========================================

@app.route("/analytics", methods=["GET"])
def analytics():

    try:

        df = pd.read_csv(
            "data/cleaned_dataset.csv"
        )

        features = [
            "Type",
            "Air temperature [K]",
            "Process temperature [K]",
            "Rotational speed [rpm]",
            "Torque [Nm]",
            "Tool wear [min]"
        ]

        # ==========================================
        # PREDICTIONS
        # ==========================================

        predictions = model.predict(
            df[features]
        )

        df["Prediction"] = predictions


        # ==========================================
        # MACHINE TYPE ANALYSIS
        # ==========================================

        failure_by_type = (
            df.groupby("Type")["Prediction"]
            .sum()
            .astype(int)
            .to_dict()
        )

        machines_by_type = (
            df["Type"]
            .value_counts()
            .astype(int)
            .to_dict()
        )


        # ==========================================
        # PARAMETER ANALYSIS
        # ==========================================

        parameters = [

            "Air temperature [K]",

            "Process temperature [K]",

            "Rotational speed [rpm]",

            "Torque [Nm]",

            "Tool wear [min]"

        ]

        parameter_analysis = {}


        for parameter in parameters:

            safe_average = df[
                df["Prediction"] == 0
            ][parameter].mean()

            failure_average = df[
                df["Prediction"] == 1
            ][parameter].mean()

            parameter_analysis[parameter] = {

                "safe_average":
                    round(
                        float(safe_average),
                        2
                    ),

                "failure_average":
                    round(
                        float(failure_average),
                        2
                    )

            }


        # ==========================================
        # FEATURE IMPORTANCE
        # ==========================================

        rf_model = model.named_steps["model"]

        importances = (
            rf_model.feature_importances_
        )

        feature_names = (
            model
            .named_steps["preprocessor"]
            .get_feature_names_out()
        )


        feature_importance = []


        for feature, importance in zip(
            feature_names,
            importances
        ):

            clean_name = (
                feature
                .replace(
                    "remainder__",
                    ""
                )
                .replace(
                    "categorical__Type_",
                    "Type "
                )
            )

            feature_importance.append({

                "feature":
                    clean_name,

                "importance":
                    round(
                        float(importance),
                        4
                    )

            })


        # Sort highest first

        feature_importance.sort(
            key=lambda x: x["importance"],
            reverse=True
        )


        print(
            "Feature importance:",
            feature_importance
        )


        # ==========================================
        # RESPONSE
        # ==========================================

        return jsonify({

            "failure_by_type":
                failure_by_type,

            "machines_by_type":
                machines_by_type,

            "parameter_analysis":
                parameter_analysis,

            "feature_importance":
                feature_importance

        })


    except Exception as e:

        print(
            "ANALYTICS ERROR:",
            str(e)
        )

        return jsonify({

            "error": str(e)

        }), 500
    # ==========================================
# SINGLE MACHINE PREDICTION
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        # Required fields
        required_fields = [
            "Type",
            "Air temperature [K]",
            "Process temperature [K]",
            "Rotational speed [rpm]",
            "Torque [Nm]",
            "Tool wear [min]"
        ]

        # Check missing fields
        for field in required_fields:

            if field not in data:

                return jsonify({
                    "error": f"Missing field: {field}"
                }), 400


        # Create dataframe
        input_data = pd.DataFrame([{

            "Type": data["Type"],

            "Air temperature [K]":
                float(data["Air temperature [K]"]),

            "Process temperature [K]":
                float(data["Process temperature [K]"]),

            "Rotational speed [rpm]":
                float(data["Rotational speed [rpm]"]),

            "Torque [Nm]":
                float(data["Torque [Nm]"]),

            "Tool wear [min]":
                float(data["Tool wear [min]"])

        }])


        # Prediction
        prediction = model.predict(
            input_data
        )[0]


        # Probability
        probability = model.predict_proba(
            input_data
        )[0][1]


        # Risk
        if prediction == 1:

            risk = "High Risk"

        else:

            risk = "Low Risk"


        return jsonify({

            "prediction":
                int(prediction),

            "risk":
                risk,

            "failure_probability":
                round(
                    float(probability) * 100,
                    2
                )

        })


    except Exception as e:

        print(
            "PREDICTION ERROR:",
            str(e)
        )

        return jsonify({

            "error": str(e)

        }), 500


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
    debug=True,
    port=5001
)