import { useState } from "react";
import axios from "axios";
import "../styles/CropRecommendation.css";

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    Nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: ""
  });

  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Allow empty input
    if (value === "") {
      setFormData({ ...formData, [name]: value });
      return;
    }

    // Prevent non-numeric input
    if (!/^\d*\.?\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSuggestions(null);

    try {
      // Convert input values to numbers before sending to API
      const formattedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])
      );

      const response = await fetch("http://127.0.0.1:5000/predict-crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setResult(data.predicted_crop);
      setConfidence(data.confidence_score);

      // Fetch AI-generated tips
      const tips = await fetchCropTips(data.predicted_crop);
      setSuggestions(tips);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult("Error predicting crop. Please try again.");
      setConfidence(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Crop Tips from AI Assistant
  const fetchCropTips = async (crop) => {
    if (!crop) return;

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCmBNgShM-gZROTu6qURC0cmD0ZD0hg9Zk",
        {
          contents: [
            {
              parts: [
                {
                  text: `You are an AI assistant specialized in agriculture. 
                  Provide 5 practical farming tips for growing "${crop}".`
                }
              ]
            }
          ]
        }
      );

      const aiResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate tips for this crop.";

      return aiResponse.split("\n");
    } catch (error) {
      console.error("Error fetching crop tips:", error);
      return ["Error retrieving suggestions. Please try again later."];
    }
  };

  return (
    <div className="crop-rec-wrapper">
      <div className="crop-recom-container">
        <h2>Crop Recommendation System</h2>
        <form onSubmit={handleSubmit} className="crop-form">
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          ))}

          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict Crop"}
          </button>
        </form>

        {/* Display Result & AI-generated Tips */}
        {result && (
          <div className="result-container">
            <h3>Recommended Crop: {result}</h3>
            {confidence !== null && <p>Confidence Score: {confidence}%</p>}
            {suggestions ? (
              <ul className="suggestions-list">
                {suggestions.map((tip, index) => (
                  <p key={index}>{tip}</p>
                ))}
              </ul>
            ) : (
              <p>Loading suggestions...</p>
            )}
          </div>
        )}
      </div>
    </div>

  );
};

export default CropRecommendation;
