import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Services/api";

const Dashboard = () => {
  const [workshops, setWorkshops] = useState([]);
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    api
      .get("/workshops")
      .then((response) => setWorkshops(response.data))
      .catch((error) => console.error("Error fetching workshops:", error));

    api
      .get("/colaboradores")
      .then((response) => {
        console.log("Collaborators Data:", response.data);
        setCollaborators(response.data);
      })
      .catch((error) => console.error("Error fetching collaborators:", error));
  }, []);

  const renderWorkshopList = (items) => (
    <ul className="divide-y divide-gray-100">
      {items.map((item, index) => (
        <li key={index} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold text-gray-900">{item.name}</p>
              <p className="mt-1 text-xs text-gray-500">
                Realização: {item.realizacao}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  const renderCollaboratorList = (items) => {
    if (!items.length) {
      return <p className="text-center text-gray-500">Nenhum colaborador encontrado.</p>;
    }

    return (
      <ul className="divide-y divide-gray-100">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold text-gray-900">
                  {item.nome || "Colaborador sem nome"}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const features = [
    {
      title: "Workshops",
      description: "Todos os workshops disponíveis.",
      content: renderWorkshopList(workshops),
      linkText: "Veja toda a lista de workshops",
      linkTo: "/workshops",
      style: "lg:row-span-2 lg:col-start-1",
    },
    {
      title: "Performance",
      description: "Visualizações relacionadas à performance.",
      content: null,
      style: "lg:col-start-2 lg:row-start-1",
    },
    {
      title: "Segurança",
      description: "Visualizações relacionadas à segurança.",
      content: null,
      style: "lg:col-start-2 lg:row-start-2",
    },
    {
      title: "Colaboradores",
      description: "A lista de todos os colaboradores.",
      content: renderCollaboratorList(collaborators),
      linkText: "Veja toda a lista de colaboradores",
      linkTo: "/collaborators",
      style: "lg:row-span-2 lg:col-start-3",
    },
  ];

  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
          Gerencie seus Colaboradores e Workshops
        </p>
        <div className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-3 lg:grid-rows-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative ${feature.style} flex flex-col`}
              style={{ minHeight: "20rem" }}
            >
              <div className="absolute inset-px rounded-lg bg-white"></div>
              <div className="relative flex flex-col flex-grow overflow-hidden rounded-lg p-6">
                <div className="mb-4">
                  <p className="text-lg font-medium tracking-tight text-gray-950">
                    {feature.title}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
                <div className="flex-grow overflow-y-auto">{feature.content}</div>
                {feature.linkText && (
                  <div className="mt-4">
                    <Link
                      to={feature.linkTo}
                      className="text-indigo-600 hover:underline text-sm absolute bottom-4"
                    >
                      {feature.linkText}
                    </Link>
                  </div>
                )}
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
