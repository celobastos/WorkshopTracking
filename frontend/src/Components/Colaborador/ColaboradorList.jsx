import React, { useEffect, useState } from "react";
import api from "../../Services/api";

const CollaboratorList = () => {
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    api.get("/colaboradores")
      .then((res) => setCollaborators(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Collaborators</h1>
      <ul className="bg-gray-100 p-4 rounded shadow">
        {collaborators.map((c) => (
          <li key={c.id} className="mb-2">
            {c.nome}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollaboratorList;
