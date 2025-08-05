import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer
} from "recharts";

// Main App component
const App = () => {
  // State to hold the time series data for the chart
  const [data, setData] = useState([]);
  // State to hold the change point model summary
  const [summary, setSummary] = useState(null);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // State to handle any errors during data fetching
  const [error, setError] = useState(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Define an async function to handle data fetching
    const fetchData = async () => {
      try {
        // Fetch both time series and summary data concurrently using Promise.all
        const [timeseriesRes, summaryRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/log-returns"),
          axios.get("http://127.0.0.1:5000/api/change-point-summary"),
        ]);
        
        // Update the state with the fetched data
        setData(timeseriesRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        // Log and set an error if fetching fails
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please ensure the server is running and the endpoints are correct.");
      } finally {
        // Set loading to false once the operation is complete
        setLoading(false);
      }
    };
    
    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Helper function to get the change point date string from the summary
  const getChangePointDate = () => {
    if (summary && summary.tau && data.length > 0) {
      // Use the mean of tau, which is a better representation of the change point
      // Round the mean to get a valid integer index
      const changePointIndex = Math.round(summary.tau.mean);
      
      // Check if the index is within the bounds of the data array
      if (changePointIndex >= 0 && changePointIndex < data.length) {
        // Access the date from the data array using the rounded index
        return data[changePointIndex]?.Date;
      }
    }
    return null;
  };
  
  const changePointDate = getChangePointDate();

  // Conditional rendering for loading, error, and no data states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-medium text-gray-700">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-xl font-medium">
        {error}
      </div>
    );
  }
  
  if (!data.length) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-xl font-medium">
        No data available to display.
      </div>
    );
  }

  // The main component render with the chart and summary table
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-inter antialiased">
      <script src="https://cdn.tailwindcss.com"></script>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Brent Oil Price Change Point Dashboard</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Change Point Visualization</h2>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Date" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="LogReturn" stroke="#6366f1" dot={false} strokeWidth={2} name="Log Return" />
              <Line type="monotone" dataKey="Estimated_mu" stroke="#10b981" dot={false} strokeWidth={2} name="Estimated Mean" />
              {changePointDate && (
                <ReferenceLine
                  x={changePointDate}
                  label={{ value: "Change Point", position: "insideTopRight", fill: "red", fontSize: 14 }}
                  stroke="red"
                  strokeDasharray="5 5"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {summary && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Model Summary</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Std</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HDI (2.5%)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HDI (97.5%)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">R-hat</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(summary).map(([param, value]) => (
                  <tr key={param} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{param}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value?.mean?.toFixed(4) || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value?.std?.toFixed(4) || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value?.hdi?.[0]?.toFixed(4) || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value?.hdi?.[1]?.toFixed(4) || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value?.r_hat?.toFixed(4) || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;