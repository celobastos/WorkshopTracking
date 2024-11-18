import React, { useEffect, useState } from "react";
import api from "../../Services/api";
import { AiOutlineClose } from "react-icons/ai";

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
        const workshopsData = response.data?.$values || [];
        setWorkshops(workshopsData);
      })
      .catch((error) => console.error("Error fetching workshops:", error));
  }, []);


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
              className="text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation(); 
                handleDeleteWorkshop(workshop.id);
              }}
            >
             <AiOutlineClose size={24} />
            </button>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowAddForm(true)}
      >
        Adicione um Workshop
      </button>
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleAddWorkshop} // Connect the function to the form
            className="bg-white rounded-lg shadow-lg w-2/5 p-6 relative space-y-8"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddForm(false)}
            >
              <AiOutlineClose size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Adicionar Novo Workshop</h2>
            <p className="mt-1 text-sm text-gray-600">
              Insira os detalhes do novo workshop.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-900">Nome</label>
                <div className="mt-2">
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm"
                    value={newWorkshop.nome}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, nome: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-900">Data</label>
                <div className="mt-2">
                  <input
                    type="date"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm"
                    value={newWorkshop.dataRealizacao}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, dataRealizacao: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-900">Descrição</label>
                <div className="mt-2">
                  <textarea
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm"
                    value={newWorkshop.descricao}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, descricao: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-sm font-semibold text-gray-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-400 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                Adicionar
              </button>
            </div>
          </form>
        </div>
      )}



      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowDetails(false);
            }}
            className="bg-white rounded-lg shadow-lg w-2/5 p-6 relative space-y-8"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowDetails(false)}
            >
              <AiOutlineClose size={24} />
            </button>
            {selectedWorkshop && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Editar Workshop</h2>
                <p className="mt-1 text-sm text-gray-600">Atualize os detalhes do workshop.</p>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-900">Nome</label>
                    <div className="mt-2">
                      <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm"
                        value={selectedWorkshop.nome}
                        onChange={(e) => handleUpdateWorkshop("nome", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-900">Data</label>
                    <div className="mt-2">
                      <input
                        type="date"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm"
                        value={selectedWorkshop.dataRealizacao}
                        onChange={(e) =>
                          handleUpdateWorkshop("dataRealizacao", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-900">Descrição</label>
                    <div className="mt-2">
                      <textarea
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm"
                        value={selectedWorkshop.descricao}
                        onChange={(e) => handleUpdateWorkshop("descricao", e.target.value)}
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
                onClick={() => {
                  api
                    .put(`/workshops/${selectedWorkshop.id}`, selectedWorkshop)
                    .then(() => {
                      setNotification("Workshop atualizado com sucesso.");
                      setTimeout(() => setNotification(""), 3000);
                      setShowDetails(false);
                    })
                    .catch((error) => console.error("Erro ao atualizar workshop:", error));
                }}
                className="rounded-md bg-blue-400 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
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

export default WorkshopsList;
