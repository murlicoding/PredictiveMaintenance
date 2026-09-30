import pandas as pd
import plotly.express as px

# Load cleaned dataset
df = pd.read_csv("data/cleaned_dataset.csv")

print("Dataset loaded successfully!")

# -----------------------------------
# 1. Basic information
# -----------------------------------

print("\nDataset Shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())


# -----------------------------------
# 2. Machine failure distribution
# -----------------------------------

failure_count = df["Machine failure"].value_counts()

print("\nMachine Failure Distribution:")
print(failure_count)


# -----------------------------------
# 3. Failure by machine Type
# -----------------------------------

failure_by_type = pd.crosstab(
    df["Type"],
    df["Machine failure"]
)

print("\nFailure by Machine Type:")
print(failure_by_type)


# -----------------------------------
# 4. Average values
# -----------------------------------

print("\nAverage Machine Parameters:")

print(
    df[
        [
            "Air temperature [K]",
            "Process temperature [K]",
            "Rotational speed [rpm]",
            "Torque [Nm]",
            "Tool wear [min]"
        ]
    ].mean()
)


# -----------------------------------
# 5. Failed vs non-failed averages
# -----------------------------------

print("\nAverage parameters by machine failure:")

print(
    df.groupby("Machine failure")[
        [
            "Air temperature [K]",
            "Process temperature [K]",
            "Rotational speed [rpm]",
            "Torque [Nm]",
            "Tool wear [min]"
        ]
    ].mean()
)


# -----------------------------------
# 6. Failure count chart
# -----------------------------------

fig1 = px.bar(
    failure_count,
    x=failure_count.index,
    y=failure_count.values,
    labels={
        "x": "Machine Failure",
        "y": "Number of Machines"
    },
    title="Machine Failure Distribution"
)

fig1.show()


# -----------------------------------
# 7. Failure by Type chart
# -----------------------------------

fig2 = px.bar(
    failure_by_type,
    barmode="group",
    title="Machine Failure by Machine Type",
    labels={
        "value": "Number of Machines",
        "Type": "Machine Type"
    }
)

fig2.show()


# -----------------------------------
# 8. Torque vs Machine Failure
# -----------------------------------

fig3 = px.box(
    df,
    x="Machine failure",
    y="Torque [Nm]",
    title="Torque vs Machine Failure"
)

fig3.show()


# -----------------------------------
# 9. Tool Wear vs Machine Failure
# -----------------------------------

fig4 = px.box(
    df,
    x="Machine failure",
    y="Tool wear [min]",
    title="Tool Wear vs Machine Failure"
)

fig4.show()


# -----------------------------------
# 10. Temperature relationship
# -----------------------------------

fig5 = px.scatter(
    df,
    x="Air temperature [K]",
    y="Process temperature [K]",
    color="Machine failure",
    title="Air Temperature vs Process Temperature"
)

fig5.show()