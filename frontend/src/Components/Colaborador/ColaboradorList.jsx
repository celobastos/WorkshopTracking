import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
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
        setTimeout(() => setNotification(""), 3000);
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
      <h1 className="text-2xl font-semibold mb-4">Colaboradores</h1>
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
                className="text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCollaborator(collaborator.id);
                }}
              >
                <AiOutlineClose size={24} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Nenhum colaborador encontrado.</p>
      )}
      <button
        className="mt-4 bg-blue-400 text-white px-4 py-2 rounded"
        onClick={() => setShowAddForm(true)}
      >
        Adicione um Colaborador
      </button>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-2/5 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddForm(false)}
            >
              <AiOutlineClose size={24} />
            </button>
            <h2 className="text-lg font-semibold">Adicione um novo Colaborador</h2>
            <form onSubmit={handleAddCollaborator} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm"
                  value={newCollaborator.nome}
                  onChange={(e) => setNewCollaborator({ nome: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="text-sm font-semibold text-gray-900"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="rounded-md bg-blue-400 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form className="bg-white rounded-lg shadow-lg w-2/5 p-6 relative space-y-8">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowDetails(false)}
            >
              <AiOutlineClose size={24} />
            </button>
            {selectedCollaborator && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Edite o Colaborador</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Atualize os dados do colaborador.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                      Nome
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        type="text"
                        value={selectedCollaborator.nome}
                        onChange={(e) => handleUpdateCollaborator("nome", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="text-sm font-semibold text-gray-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-400 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}



      {notification && (
         <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow">
          {notification}
        </div>
      )}
    </div>
  );
};

export default CollaboratorList;
