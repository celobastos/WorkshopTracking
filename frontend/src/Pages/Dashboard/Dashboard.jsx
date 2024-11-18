import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pie, Line } from "react-chartjs-2";
import api from "../../Services/api";

const Dashboard = () => {
  const [workshops, setWorkshops] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [atas, setAtas] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);

  useEffect(() => {
    api
      .get("/workshops")
      .then((response) => {
        const workshopsData = response.data?.$values || [];
        setWorkshops(workshopsData);
      })
      .catch((error) => console.error("Error fetching workshops:", error));

    api
      .get("/colaboradores")
      .then((response) => {
        const collaboratorsData = response.data?.$values || [];
        setCollaborators(collaboratorsData);
      })
      .catch((error) => console.error("Error fetching collaborators:", error));

    api
      .get("/atas")
      .then((response) => {
        const atasData = response.data?.$values || [];
        setAtas(atasData);

        const workshopsParticipation = {};
        const participationOverTime = {};

        atasData.forEach((ata) => {
          const workshopId = ata.workshopId;
          const ataDate = new Date(ata.dataRegistro).toLocaleDateString();

          workshopsParticipation[workshopId] =
            (workshopsParticipation[workshopId] || 0) + ata.colaboradores?.$values.length;

          participationOverTime[ataDate] =
            (participationOverTime[ataDate] || 0) + ata.colaboradores?.$values.length;
        });

        const pieData = {
          labels: Object.keys(workshopsParticipation).map((id) => {
            const workshop = workshops.find((w) => w.id === parseInt(id, 10));
            return workshop ? workshop.nome : `Workshop ${id}`;
          }),
          datasets: [
            {
              data: Object.values(workshopsParticipation),
              backgroundColor: Object.keys(workshopsParticipation).map(
                (_, index) =>
                  `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.6)`
              ),
            },
          ],
        };
        setPieChartData(pieData);

        const lineData = {
          labels: Object.keys(participationOverTime).sort((a, b) => new Date(a) - new Date(b)),
          datasets: [
            {
              label: "Participação dos Colaboradores",
              data: Object.values(participationOverTime),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.3)",
              fill: true,
              tension: 0.4,
            },
          ],
        };
        setLineChartData(lineData);
      })
      .catch((error) => console.error("Error fetching atas:", error));
  }, );

  const renderWorkshopList = (items) => {
    if (!Array.isArray(items)) {
      return <p className="text-center text-gray-500">Nenhum workshop encontrado.</p>;
    }

    return (
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold text-gray-900">{item.nome}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Realização: {new Date(item.dataRealizacao).toLocaleDateString()}
                </p>
                <p className="mt-1 text-xs text-gray-500">{item.descricao}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderCollaboratorList = (items) => {
    if (!Array.isArray(items)) {
      return <p className="text-center text-gray-500">Nenhum colaborador encontrado.</p>;
    }

    return (
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold text-gray-900">
                  {item.nome || "Colaborador sem nome"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Atas: {item.atas?.$values.length || 0}
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
      description: "Lista de Workshops recentes.",
      content: renderWorkshopList(workshops),
      linkText: "Lista de workshops recentes",
      linkTo: "/workshops",
      style: "lg:row-span-2 lg:col-start-1",
    },
    {
      title: "Performance",
      description: "Visualizações relacionadas à performance.",
      content: pieChartData && (
        <div className="h-[300px]">
          <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      ),
      style: "lg:col-start-2 lg:row-start-1",
    },
    {
      title: "Segurança",
      description: "Visualizações relacionadas à segurança.",
      content: lineChartData && (
        <div className="h-[300px]">
          <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      ),
      style: "lg:col-start-2 lg:row-start-2",
    },
    {
      title: "Colaboradores",
      description: "Lista de colaboradores recentes.",
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
