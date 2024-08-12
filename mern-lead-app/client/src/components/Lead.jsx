import React, { useState, useEffect } from "react";
import axios from "axios";
// import './Login.css';
import './Lead.css';

const Lead = () => {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [leadData, setLeadData] = useState({
    name: "",
    number: "",
    email: "",
    product: "",
  });
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [editingLeadData, setEditingLeadData] = useState({});

  useEffect(() => {
    fetchLeads();
  }, []);
  axios.defaults.withCredentials = true;

  const fetchLeads = async () => {
    try {
      const res = await axios.get("https://lead-app-b71y.vercel.app/leads");
      setLeads(res.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleSearch = async () => {
    if (search.trim() === "") {
      fetchLeads();
    } else {
      try {
        const res = await axios.get(`https://lead-app-b71y.vercel.app/leads?search=${search}`);
        setLeads(res.data);
      } catch (error) {
        console.error('Error searching leads:', error);
      }
    }
  };

  const handleSort = async (sortField) => {
    setSort(sortField);
    try {
      const res = await axios.get(`https://lead-app-b71y.vercel.app/leads?sort=${sortField}`);
      setLeads(res.data);
    } catch (error) {
      console.error('Error sorting leads:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeadData({
      ...leadData,
      [name]: value,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingLeadData({
      ...editingLeadData,
      [name]: value,
    });
  };

  const handleCreateLead = async () => {
    try {
      await axios.post("https://lead-app-b71y.vercel.app/leads", leadData);
      fetchLeads();
      setLeadData({ name: "", number: "", email: "", product: "" });
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const handleEditLead = (lead) => {
    setEditingLeadId(lead._id);
    setEditingLeadData(lead);
  };

  const handleUpdateLead = async (id) => {
    try {
      await axios.put(`https://lead-app-b71y.vercel.app/leads/${id}`, editingLeadData);
      setEditingLeadId(null);
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingLeadId(null);
    setEditingLeadData({});
  };

  const handleDeleteLead = async (id) => {
    try {
      await axios.delete(`https://lead-app-b71y.vercel.app/leads/${id}`);
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  return (
    <div>
      <div className="lead-container">
          <h2>Leads</h2>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={handleSearch}  // Fetch leads when the input loses focus
            
          />
          <button className="btn" onClick={handleSearch}>Search</button>
        <select onChange={(e) => handleSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="number">Number</option>
          <option value="email">Email</option>
          <option value="product">Product</option>
        </select>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateLead();
        }}
      >
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={leadData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          placeholder="Number"
          name="number"
          value={leadData.number}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={leadData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          placeholder="Product"
          name="product"
          value={leadData.product}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="btn">Add Lead</button>
      </form>
      <table className="table-container">
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Email</th>
            <th>Product</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              {editingLeadId === lead._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={editingLeadData.name || ''}
                      onChange={handleEditInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="number"
                      value={editingLeadData.number || ''}
                      onChange={handleEditInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={editingLeadData.email || ''}
                      onChange={handleEditInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="product"
                      value={editingLeadData.product || ''}
                      onChange={handleEditInputChange}
                    />
                  </td>
                  <td>
                    <button className="btn" onClick={() => handleUpdateLead(lead._id)}>
                      Save
                    </button>
                    <button className="btn" onClick={handleCancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{lead.name}</td>
                  <td>{lead.number}</td>
                  <td>{lead.email}</td>
                  <td>{lead.product}</td>
                  <td>
                    <button className="btn" onClick={() => handleEditLead(lead)}>Edit</button>
                    <button className="btn" onClick={() => handleDeleteLead(lead._id)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Lead;
