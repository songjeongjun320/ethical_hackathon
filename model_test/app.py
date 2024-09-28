import streamlit as st
from transformers import pipeline

st.title("Sentiment Analysis Application")
st.write("Loading the model, please wait...")

@st.cache_resource
def load_model():
    return pipeline('sentiment-analysis', model='finiteautomata/bertweet-base-sentiment-analysis')

try:
    model = load_model()
    st.write("Model loaded successfully!")

    # Using text_area for multi-line user input, without default value
    user_input = st.text_area('Enter the text to analyze:', height=100)

    if user_input:
        st.write("Analyzing...")
        result = model(user_input)
        st.write("Analysis result:", result)
        
        # Interpreting labels
        label_map = {"POS": "Positive", "NEG": "Negative", "NEU": "Neutral"}
        st.write(f"Sentiment: {label_map[result[0]['label']]}")
        st.write(f"Confidence: {result[0]['score']:.2f}")

except Exception as e:
    st.error(f"Error loading the model: {str(e)}")

st.write("Application ready for analysis")