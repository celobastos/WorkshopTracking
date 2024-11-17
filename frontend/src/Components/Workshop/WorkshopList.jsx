import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Services/api";

const WorkshopList = () => {
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    api.get("/workshops")
      .then((res) => setWorkshops(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Workshops</h1>
      <ul className="bg-gray-100 p-4 rounded shadow">
        {workshops.map((w) => (
          <li key={w.id}>
            <Link to={`/workshops/${w.id}`} className="text-blue-500">
              {w.nome}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkshopList;
