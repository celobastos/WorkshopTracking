import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../Services/api";

const WorkshopDetails = () => {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);

  useEffect(() => {
    api.get(`/workshops/${id}`)
      .then((res) => setWorkshop(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!workshop) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl">{workshop.nome}</h1>
      <p>{workshop.descricao}</p>
      <h2 className="mt-4 text-xl">Collaborators</h2>
      <ul className="bg-gray-100 p-4 rounded shadow">
        {workshop.collaborators.map((c) => (
          <li key={c.id}>{c.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default WorkshopDetails;
