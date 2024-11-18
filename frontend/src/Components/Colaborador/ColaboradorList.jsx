import React, { useEffect, useState } from "react";
import api from "../../Services/api";

const CollaboratorList = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState({ nome: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    api
      .get("/colaboradores")
      .then((res) => {
        const collaboratorsData = res.data?.$values || []; // Safely extract $values
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
        setCollaborators([...collaborators, addedCollaborator]); // Add new collaborator to the list
        setNewCollaborator({ nome: "" }); // Reset form
        setShowAddForm(false); // Close form
      })
      .catch((error) => console.error("Error adding collaborator:", error));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Collaborators</h1>
      {collaborators.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {collaborators.map((collaborator) => (
            <li key={collaborator.id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold text-gray-900">
                    {collaborator.nome || "Colaborador sem nome"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Atas: {collaborator.atas?.$values.length || 0}
                  </p>
                </div>
              </div>
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

      {showAddForm && (
        <div className="mt-4 border p-4 rounded bg-gray-100">
          <h2 className="text-lg font-semibold">Add New Collaborator</h2>
          <form onSubmit={handleAddCollaborator} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CollaboratorList;
