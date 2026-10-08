from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(X, y, random_state=0)
clf = RandomForestClassifier(random_state=0).fit(Xtr, ytr)
print("accuracy:", round(clf.score(Xte, yte), 3))
