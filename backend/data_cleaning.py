import pandas as pd

# Load dataset
df = pd.read_csv("data/dataset.csv")

print("Original dataset shape:")
print(df.shape)

print("\nOriginal columns:")
print(df.columns.tolist())


# --------------------------------
# 1. Remove unnecessary columns
# --------------------------------

df = df.drop(columns=["UDI", "Product ID"])


# --------------------------------
# 2. Check missing values
# --------------------------------

print("\nMissing values:")
print(df.isnull().sum())


# --------------------------------
# 3. Check duplicate rows
# --------------------------------

print("\nDuplicate rows:")
print(df.duplicated().sum())


# --------------------------------
# 4. Check machine failure count
# --------------------------------

print("\nMachine failure count:")
print(df["Machine failure"].value_counts())


# --------------------------------
# 5. Display cleaned dataset
# --------------------------------

print("\nCleaned dataset:")
print(df.head())

print("\nCleaned dataset shape:")
print(df.shape)


# --------------------------------
# 6. Save cleaned dataset
# --------------------------------

df.to_csv("data/cleaned_dataset.csv", index=False)

print("\nCleaned dataset saved successfully!")