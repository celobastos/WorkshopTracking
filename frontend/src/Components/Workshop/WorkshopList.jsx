import React, { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import api from "../../Services/api";

const WorkshopsList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [newWorkshop, setNewWorkshop] = useState({ nome: "", dataRealizacao: "", descricao: "" });
  const [notification, setNotification] = useState("");

  // Fetch workshops
  useEffect(() => {
    api
      .get("/workshops")
      .then((response) => {
        const workshopsData = response.data?.$values || []; // Extract $values or fallback to empty array
        setWorkshops(workshopsData);
      })
      .catch((error) => console.error("Error fetching workshops:", error));
  }, []);

  // Add workshop
  const handleAddWorkshop = (e) => {
    e.preventDefault();
    api
      .post("/workshops", newWorkshop)
      .then((response) => {
        const addedWorkshop = response.data;
        setWorkshops([...workshops, addedWorkshop]);
        setNewWorkshop({ nome: "", dataRealizacao: "", descricao: "" });
        setShowAddForm(false);
      })
      .catch((error) => console.error("Error adding workshop:", error));
  };

  // Delete workshop
  const handleDeleteWorkshop = (id) => {
    api
      .delete(`/workshops/${id}`)
      .then(() => {
        setWorkshops(workshops.filter((workshop) => workshop.id !== id));
        setNotification("Workshop deleted successfully.");
        setTimeout(() => setNotification(""), 3000);
      })
      .catch((error) => console.error("Error deleting workshop:", error));
  };

  // Update workshop
  const handleUpdateWorkshop = (key, value) => {
    const updatedWorkshop = { ...selectedWorkshop, [key]: value };
    setSelectedWorkshop(updatedWorkshop);

    api
      .put(`/workshops/${selectedWorkshop.id}`, updatedWorkshop)
      .catch((error) => console.error("Error updating workshop:", error));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Workshops</h1>
      <ul className="divide-y divide-gray-200">
        {workshops.map((workshop) => (
          <li
            key={workshop.id}
            className="flex justify-between gap-x-6 py-5 cursor-pointer"
            onClick={() => {
              setSelectedWorkshop(workshop);
              setShowDetails(true);
            }}
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{workshop.nome}</p>
              <p className="mt-1 text-xs text-gray-500">
                Realização: {new Date(workshop.dataRealizacao).toLocaleDateString()}
              </p>
              <p className="mt-1 text-xs text-gray-500">{workshop.descricao}</p>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation(); // Prevent click from opening details
                handleDeleteWorkshop(workshop.id);
              }}
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowAddForm(true)}
      >
        Add Workshop
      </button>

      {/* Add Workshop Modal */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
        <h2 className="text-lg font-semibold">Add New Workshop</h2>
        <form onSubmit={handleAddWorkshop} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full rounded border-gray-300"
              value={newWorkshop.nome}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, nome: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="w-full rounded border-gray-300"
              value={newWorkshop.dataRealizacao}
              onChange={(e) =>
                setNewWorkshop({ ...newWorkshop, dataRealizacao: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full rounded border-gray-300"
              value={newWorkshop.descricao}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, descricao: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>
        </form>
      </Modal>

      {/* Workshop Details Modal */}
      <Modal isOpen={showDetails} onClose={() => setShowDetails(false)}>
        {selectedWorkshop && (
          <div>
            <h2 className="text-lg font-semibold">Edit Workshop</h2>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full rounded border-gray-300"
                  value={selectedWorkshop.nome}
                  onChange={(e) => handleUpdateWorkshop("nome", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  className="w-full rounded border-gray-300"
                  value={selectedWorkshop.dataRealizacao}
                  onChange={(e) =>
                    handleUpdateWorkshop("dataRealizacao", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="w-full rounded border-gray-300"
                  value={selectedWorkshop.descricao}
                  onChange={(e) => handleUpdateWorkshop("descricao", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
      {notification && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow">
          {notification}
        </div>
      )}
    </div>

  );
};

export default WorkshopsList;
