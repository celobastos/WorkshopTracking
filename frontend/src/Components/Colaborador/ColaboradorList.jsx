import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai"; // Import close icon
import api from "../../Services/api";

const CollaboratorList = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState({ nome: "" });
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    api
      .get("/colaboradores")
      .then((res) => {
        const collaboratorsData = res.data?.$values || [];
        setCollaborators(collaboratorsData);
      })
      .catch((err) => console.error("Error fetching collaborators:", err));
  }, []);

  const handleAddCollaborator = (e) => {
    e.preventDefault();
    api
      .post("/colaboradores", newCollaborator)
      .then((response) => {
        const addedCollaborator = response.data;
        setCollaborators([...collaborators, addedCollaborator]);
        setNewCollaborator({ nome: "" });
        setShowAddForm(false);
      })
      .catch((error) => console.error("Error adding collaborator:", error));
  };

  const handleDeleteCollaborator = (id) => {
    api
      .delete(`/colaboradores/${id}`)
      .then(() => {
        setCollaborators(collaborators.filter((c) => c.id !== id));
        setNotification("Collaborator deleted successfully");
        setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
      })
      .catch((error) => console.error("Error deleting collaborator:", error));
  };

  const handleUpdateCollaborator = (key, value) => {
    const updatedCollaborator = { ...selectedCollaborator, [key]: value };
    setSelectedCollaborator(updatedCollaborator);

    api
      .put(`/colaboradores/${selectedCollaborator.id}`, updatedCollaborator)
      .catch((error) => console.error("Error updating collaborator:", error));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Collaborators</h1>
      {collaborators.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {collaborators.map((collaborator) => (
            <li
              key={collaborator.id}
              className="flex justify-between gap-x-6 py-5 cursor-pointer"
              onClick={() => {
                setSelectedCollaborator(collaborator);
                setShowDetails(true);
              }}
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {collaborator.nome || "Colaborador sem nome"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Atas: {collaborator.atas?.$values.length || 0}
                </p>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click from opening details
                  handleDeleteCollaborator(collaborator.id);
                }}
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Nenhum colaborador encontrado.</p>
      )}
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowAddForm(true)}
      >
        Add Collaborator
      </button>

      {/* Add Collaborator Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-1/2 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddForm(false)}
            >
              <AiOutlineClose size={24} />
            </button>
            <h2 className="text-lg font-semibold">Add New Collaborator</h2>
            <form onSubmit={handleAddCollaborator} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full rounded border-gray-300"
                  value={newCollaborator.nome}
                  onChange={(e) => setNewCollaborator({ nome: e.target.value })}
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
          </div>
        </div>
      )}

      {/* Collaborator Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-1/2 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowDetails(false)}
            >
              <AiOutlineClose size={24} />
            </button>
            {selectedCollaborator && (
              <div>
                <h2 className="text-lg font-semibold">Edit Collaborator</h2>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="w-full rounded border-gray-300"
                      value={selectedCollaborator.nome}
                      onChange={(e) => handleUpdateCollaborator("nome", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
         <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow">
          {notification}
        </div>
      )}
    </div>
  );
};

export default CollaboratorList;
