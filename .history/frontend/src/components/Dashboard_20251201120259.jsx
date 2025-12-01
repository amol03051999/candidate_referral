import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../api";

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/candidates`);
      setCandidates(res.data);
    } catch (error) {
      console.error("Error fetching candidates", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(`${API_BASE}/candidates/${id}/status`, {
        status,
      });
      setCandidates(candidates.map((c) => (c._id === id ? res.data : c)));
    } catch (error) {
      alert("Error updating status");
      console.error(error);
    }
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Reviewed: "bg-blue-100 text-blue-800",
    Hired: "bg-green-100 text-green-800",
  };

  if (loading)
    return <div className="text-center py-12">Loading candidates...</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="flex gap-4 mb-6">
        <h2 className="text-2xl font-semibold flex-1">Referred Candidates</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by job title or status..."
          className="flex-1 p-3 border rounded-lg"
        />
      </div>

      <div className="grid gap-4">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate._id}
            className="border rounded-lg p-6 hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                {candidate.name}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[candidate.status]
                }`}
              >
                {candidate.status}
              </span>
            </div>
            <p className="text-gray-600 mb-1">
              <strong>Job:</strong> {candidate.jobTitle}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Email:</strong> {candidate.email}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Phone:</strong> {candidate.phone}
            </p>
            {candidate.resumeUrl && (
              <a
                href={`${API_BASE.replace("/api", "")}${candidate.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View Resume
              </a>
            )}
            <div className="flex gap-2 mt-4">
              <select
                onChange={(e) => updateStatus(candidate._id, e.target.value)}
                defaultValue={candidate.status}
                className="border px-3 py-1 rounded text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Hired">Hired</option>
              </select>
              <button
                onClick={() => {
                  if (window.confirm("Delete candidate?")) {
                    // TODO: call DELETE API here
                  }
                }}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete Amol Shinde, [01-12-2025 11:38]
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredCandidates.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          {search ? "No matching candidates" : "No candidates yet"}
        </p>
      )}
    </div>
  );
};

export default Dashboard;
