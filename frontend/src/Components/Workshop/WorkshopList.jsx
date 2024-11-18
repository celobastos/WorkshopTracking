import React, { useEffect, useState } from "react";
import api from "../../Services/api";
import { AiOutlineClose, AiOutlineEye, AiOutlineUserAdd } from "react-icons/ai";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const WorkshopsList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [newWorkshop, setNewWorkshop] = useState({ nome: "", dataRealizacao: "", descricao: "" });
  const [notification, setNotification] = useState("");
  const [atasDetails, setAtasDetails] = useState(null);
  const [showAtasDetails, setShowAtasDetails] = useState(false);
  const [totalColaboradores, setTotalColaboradores] = useState(0);
  const [collaborators, setCollaborators] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);

   useEffect(() => {
    api
      .get("/colaboradores")
      .then((res) => {
        const collaboratorsData = res.data?.$values || [];
        setTotalColaboradores(collaboratorsData.length);
        setCollaborators(collaboratorsData);
      })
      .catch((err) => console.error("Error fetching collaborators:", err));
  }, []);



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

  const fetchAtasByWorkshopId = (workshopId) => {
    api
      .get(`/atas/by-workshop/${workshopId}`)
      .then((response) => {
        setAtasDetails(response.data);
        setShowAtasDetails(true);
      })
      .catch((error) => console.error("Error fetching Atas details:", error));
  };
  const handleAssignCollaborators = (workshop) => {
    setSelectedWorkshop(workshop);
    setSelectedCollaborators([]);
    setShowAssignModal(true);
  };

  const handleSaveAssignments = () => {
    const payload = {
      workshopId: selectedWorkshop.id,
      colaboradorIds: selectedCollaborators,
    };

    api
      .post("/atas", payload)
      .then(() => {
        setNotification("Colaboradores atribuídos com sucesso!");
        setTimeout(() => setNotification(""), 3000);
        setShowAssignModal(false);
      })
      .catch((error) => console.error("Error assigning collaborators:", error));
  };

  const toggleCollaborator = (collaboratorId) => {
    if (selectedCollaborators.includes(collaboratorId)) {
      setSelectedCollaborators(selectedCollaborators.filter((id) => id !== collaboratorId));
    } else {
      setSelectedCollaborators([...selectedCollaborators, collaboratorId]);
    }
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
            <div className="flex items-center space-x-4">
              <button
                className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchAtasByWorkshopId(workshop.id); 
                }}
              >
                <AiOutlineEye size={20} />
                Detalhes
              </button>
              <button
                className="text-green-500 hover:text-green-700 flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAssignCollaborators(workshop);
                }}
              >
                <AiOutlineUserAdd size={20} />
                Atribuir Colaboradores
              </button>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteWorkshop(workshop.id);
                }}
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
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
            onSubmit={handleAddWorkshop}
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

      {showAtasDetails && atasDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-3/5 p-6 max-h-[80vh] overflow-y-auto relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAtasDetails(false)}
            >
              <AiOutlineClose size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Detalhes do Workshop</h2>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">Participação dos Colaboradores</h3>
              <div className="h-[300px]">
                <Bar
                  data={{
                    labels: atasDetails.$values.map((ata) => `Ata ${ata.id}`),
                    datasets: [
                      {
                        label: "Colaboradores Presentes",
                        data: atasDetails.$values.map((ata) => ata.colaboradores?.$values.length || 0),
                        backgroundColor: "rgba(54, 162, 235, 0.6)"
                      },
                      {
                        label: "Colaboradores Ausentes",
                        data: atasDetails.$values.map(
                          (ata) =>
                            totalColaboradores - (ata.colaboradores?.$values.length || 0)
                        ),
                        backgroundColor: "rgba(255, 99, 132, 0.6)"
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top"
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700">Distribuição Geral de Atas</h3>
              <div className="h-[300px]">
                <Pie
                  data={{
                    labels: atasDetails.$values.map((ata) => `Ata ${ata.id}`),
                    datasets: [
                      {
                        data: atasDetails.$values.map(
                          (ata) => ata.colaboradores?.$values.length || 0
                        ),
                        backgroundColor: atasDetails.$values.map(
                          (_, index) =>
                            `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${
                              (index * 150) % 255
                            }, 0.6)`
                        )
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top"
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700">Lista de Atas</h3>
              <ul className="mt-4 divide-y divide-gray-200">
                {atasDetails.$values.map((ata) => (
                  <li key={ata.id} className="py-2">
                    <p className="text-sm text-gray-900">
                      Ata: {ata.id} - Data de Registro: {new Date(ata.dataRegistro).toLocaleDateString()}
                    </p>
                    <ul className="ml-4 mt-2">
                      {ata.colaboradores?.$values.map((colaborador) => (
                        <li key={colaborador.id} className="text-sm text-gray-700">
                          - {colaborador.nome || "Nome não informado"}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && selectedWorkshop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-3/5 p-6 max-h-[80vh] overflow-y-auto relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAssignModal(false)}
            >
              <AiOutlineClose size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Atribuir Colaboradores</h2>
            <p className="text-sm text-gray-600 mt-4">
              Workshop: <span className="font-medium">{selectedWorkshop.nome}</span>
            </p>

            {collaborators.length === 0 ? (
              <p className="text-sm text-gray-500 mt-6">Nenhum colaborador encontrado.</p>
            ) : (
              <ul className="mt-6 space-y-2">
                {collaborators.map((collaborator) => (
                  <li key={collaborator.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCollaborators.includes(collaborator.id)}
                      onChange={() => toggleCollaborator(collaborator.id)}
                    />
                    <span className="text-sm text-gray-800">{collaborator.nome}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex items-center justify-end gap-4">
              <button
                className="text-sm font-semibold text-gray-700"
                onClick={() => setShowAssignModal(false)}
              >
                Cancelar
              </button>
              <button
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
                onClick={handleSaveAssignments}
                disabled={selectedCollaborators.length === 0}
              >
                Salvar
              </button>
            </div>
          </div>
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
