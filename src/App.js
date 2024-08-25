import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

const options = [
  { label: "Alphabets", value: "alphabets" },
  { label: "Numbers", value: "numbers" },
  { label: "Highest Lowercase Alphabet", value: "highestLowercase" },
];

function App() {
  const [inputValue, setInputValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const handleSubmit = async () => {
    setError("");
    setResponse(null);

    try {
      const jsonData = JSON.parse(inputValue);
      const apiUrl = "http://localhost:5000/your-api-endpoint";
      const result = await axios.post(apiUrl, jsonData);
      const data = result.data;

      const filteredData = filterResponseData(
        data,
        selectedOptions.map((option) => option.value)
      );
      setResponse(filteredData);
    } catch (err) {
      if (err.response) {
        setError("Server error: " + err.response.data.message);
      } else if (err.request) {
        setError("Network error. Please try again.");
      } else {
        setError("Invalid JSON input");
      }
    }
  };

  const filterResponseData = (data, filters) => {
    let result = data;

    if (filters.includes("alphabets")) {
      result = result.filter((item) => /^[a-zA-Z]+$/.test(item));
    }
    if (filters.includes("numbers")) {
      result = result.filter((item) => /^\d+$/.test(item));
    }
    if (filters.includes("highestLowercase")) {
      const lowestLowercase = result.filter((item) => /^[a-z]$/.test(item));
      if (lowestLowercase.length > 0) {
        result = [lowestLowercase.sort().reverse()[0]];
      } else {
        result = [];
      }
    }

    return result;
  };

  return (
    <div className="App">
      {/* <h1>21BCE9320</h1> */}
      <input
        id="jsonInput"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="API Input"
      />
      <button onClick={handleSubmit}>Submit</button>
      <div className="Select-container">
        <Select
          isMulti
          options={options}
          onChange={handleSelectChange}
          placeholder="Multi filters"
          getOptionLabel={(option) => option.label}
        />
      </div>
      {error && <div className="error">{error}</div>}
      {response && (
        <div>
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
