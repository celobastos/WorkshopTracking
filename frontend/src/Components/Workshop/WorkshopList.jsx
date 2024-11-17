import React, { useEffect, useState } from "react";
import api from "../../Services/api";

const WorkshopsList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [newWorkshop, setNewWorkshop] = useState({ nome: "", dataRealizacao: "", descricao: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch all workshops
  useEffect(() => {
    api
      .get("/workshops")
      .then((response) => setWorkshops(response.data))
      .catch((error) => console.error("Error fetching workshops:", error));
  }, []);

  // Add new workshop
  const handleAddWorkshop = (e) => {
    e.preventDefault();
    api
      .post("/workshops", newWorkshop)
      .then((response) => {
        setWorkshops([...workshops, response.data]); // Add new workshop to the list
        setNewWorkshop({ nome: "", dataRealizacao: "", descricao: "" }); // Reset form
        setShowAddForm(false); // Close form
      })
      .catch((error) => console.error("Error adding workshop:", error));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Workshops</h1>
      <ul className="divide-y divide-gray-200">
        {workshops.map((workshop) => (
          <li key={workshop.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold text-gray-900">{workshop.nome}</p>
                <p className="mt-1 text-xs text-gray-500">Realização: {workshop.dataRealizacao}</p>
                <p className="mt-1 text-xs text-gray-500">{workshop.descricao}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowAddForm(true)}
      >
        Add Workshop
      </button>

      {/* Add Workshop Form */}
      {showAddForm && (
        <div className="mt-4 border p-4 rounded bg-gray-100">
          <h2 className="text-lg font-semibold">Add New Workshop</h2>
          <form onSubmit={handleAddWorkshop} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newWorkshop.nome}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, nome: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Realization</label>
              <input
                type="date"
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

export default WorkshopsList;
