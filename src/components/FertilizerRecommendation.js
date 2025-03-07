import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/FertilizerRecommendation.css'
export default function FertilizerRecommendation() {
  const [soilTypes, setSoilTypes] = useState([
    "Sandy", "Loamy", "Black", "Red", "Clayey"
  ]);
  const [cropTypes, setCropTypes] = useState([
    "Maize", "Sugarcane", "Cotton", "Tobacco", "Paddy", "Barley", "Wheat", "Millets",
    "Oil seeds", "Pulses", "Ground Nuts"
  ]);
  const [formData, setFormData] = useState({
    Temparature: "",
    Humidity: "",
    Moisture: "",
    "Soil Type": "",
    "Crop Type": "",
    Nitrogen: "",
    Potassium: "",
    Phosphorous: "",
  });
  const [fertilizer, setFertilizer] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict-fertilizer", formData);
      setFertilizer(response.data.fertilizer);
    } catch (error) {
      console.error("Error fetching prediction", error);
    }
  };

  return (
    <div className="container">
      <h2>Fertilizer Recommendation</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="Temparature" placeholder="Temperature" onChange={handleChange} required />
        <input type="number" name="Humidity" placeholder="Humidity" onChange={handleChange} required />
        <input type="number" name="Moisture" placeholder="Moisture" onChange={handleChange} required />
        
        <select name="Soil Type" onChange={handleChange} required>
          <option value="">Select Soil Type</option>
          {soilTypes.map((soil) => <option key={soil} value={soil}>{soil}</option>)}
        </select>
        
        <select name="Crop Type" onChange={handleChange} required>
          <option value="">Select Crop Type</option>
          {cropTypes.map((crop) => <option key={crop} value={crop}>{crop}</option>)}
        </select>
        
        <input type="number" name="Nitrogen" placeholder="Nitrogen" onChange={handleChange} required />
        <input type="number" name="Potassium" placeholder="Potassium" onChange={handleChange} required />
        <input type="number" name="Phosphorous" placeholder="Phosphorous" onChange={handleChange} required />
        
        <button type="submit">Predict Fertilizer</button>
      </form>
      
      {fertilizer && <h3>Recommended Fertilizer: {fertilizer}</h3>}
    </div>
  );
}