import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sklearn.model_selection import train_test_split

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report

# Load spaCy's English model
nlp = spacy.load("en_core_web_sm")

# Load data from CSV file
df = pd.read_csv("messages.csv")

# Sentiment Analyzer for detecting the sentiment of a message
analyzer = SentimentIntensityAnalyzer()

def get_sentiment_score(message):
    sentiment = analyzer.polarity_scores(message)
    return sentiment['compound']

# Preprocess message (Tokenization, Lemmatization)
def preprocess_message(message):
    doc = nlp(message.lower())
    tokens = [token.lemma_ for token in doc if token.is_alpha and not token.is_stop]
    return " ".join(tokens)

# Preprocess messages and add sentiment scores
df['processed_message'] = df['message'].apply(preprocess_message)
df['sentiment_score'] = df['message'].apply(get_sentiment_score)

# Vectorize the messages using TF-IDF
tfidf = TfidfVectorizer(max_features=100)
X_tfidf = tfidf.fit_transform(df['processed_message']).toarray()

# Combine TF-IDF features and sentiment score into a single feature matrix
X = pd.concat([pd.DataFrame(X_tfidf), df[['sentiment_score']].reset_index(drop=True)], axis=1)

# Convert all column names to strings to avoid mixed type errors
X.columns = X.columns.astype(str)

# Define the target variable
y = df['importance'].map({"Low": 0, "Moderate": 1, "High": 2})  # Convert to numerical labels

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a classifier (Random Forest in this case)
classifier = RandomForestClassifier(n_estimators=100, random_state=42)
classifier.fit(X_train, y_train)

# Function to predict the importance of new messages
def predict_importance(message):
    processed_message = preprocess_message(message)
    sentiment_score = get_sentiment_score(message)
    
    # Vectorize the new message using the fitted TF-IDF vectorizer
    X_new_tfidf = tfidf.transform([processed_message]).toarray()
    
    # Combine the TF-IDF vector and sentiment score
    X_new = pd.concat([pd.DataFrame(X_new_tfidf), pd.DataFrame([sentiment_score], columns=['sentiment_score'])], axis=1)
    
    # Convert all column names to strings to avoid mixed type errors
    X_new.columns = X_new.columns.astype(str)

    # Predict the importance level
    importance_level = classifier.predict(X_new)
    importance_mapping = {0: "Low", 1: "Moderate", 2: "High"}
    
    evaluate_model()

    return importance_mapping[importance_level[0]]




def evaluate_model():
    # Make predictions on the test set
    y_pred = classifier.predict(X_test)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)

    # Calculate precision, recall, and F1-score for each class
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')

    # Generate confusion matrix
    conf_matrix = confusion_matrix(y_test, y_pred)

    # Generate classification report
    class_report = classification_report(y_test, y_pred, target_names=["Low", "Moderate", "High"])

    # Print results
    print(f"Accuracy: {accuracy:.2f}")
    print(f"Precision: {precision:.2f}")
    print(f"Recall: {recall:.2f}")
    print(f"F1 Score: {f1:.2f}")
    print("Confusion Matrix:")
    print(conf_matrix)
    print("Classification Report:")
    print(class_report)