"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import safeFetch from "@/utils/safeFetch";

interface ContainerType {
  _id: string;
  name: string;
  description: string;
  dimensions: {
    insideLength: number;
    insideWidth: number;
    insideHeight: number;
    doorWidth: number;
    doorHeight: number;
    cbmCapacity: number;
  };
  tareWeight: number;
  maxCargoWeight: number;
  status: string;
}

const STANDARD_CONTAINERS: Omit<ContainerType, "_id" | "status">[] = [
  {
    name: "20' Standard",
    description: "20ft Standard Shipping Container",
    dimensions: {
      insideLength: 5.898,
      insideWidth: 2.352,
      insideHeight: 2.393,
      doorWidth: 2.34,
      doorHeight: 2.28,
      cbmCapacity: 33,
    },
    tareWeight: 2230,
    maxCargoWeight: 28230,
  },
  {
    name: "40' Standard",
    description: "40ft Standard Shipping Container",
    dimensions: {
      insideLength: 12.032,
      insideWidth: 2.35,
      insideHeight: 2.382,
      doorWidth: 2.34,
      doorHeight: 2.292,
      cbmCapacity: 67,
    },
    tareWeight: 3520,
    maxCargoWeight: 26960,
  },
  {
    name: "40' High-Cube",
    description: "40ft High Cube Shipping Container",
    dimensions: {
      insideLength: 12.024,
      insideWidth: 2.352,
      insideHeight: 2.698,
      doorWidth: 2.34,
      doorHeight: 2.597,
      cbmCapacity: 76,
    },
    tareWeight: 4020,
    maxCargoWeight: 26460,
  },
  {
    name: "20' Flatrack",
    description: "20ft Flatrack Container",
    dimensions: {
      insideLength: 5.813,
      insideWidth: 2.228,
      insideHeight: 1.961,
      doorWidth: 0,
      doorHeight: 0,
      cbmCapacity: 27,
    },
    tareWeight: 2200,
    maxCargoWeight: 30480,
  },
  {
    name: "40' Flatrack",
    description: "40ft Flatrack Container",
    dimensions: {
      insideLength: 11.832,
      insideWidth: 2.345,
      insideHeight: 2.184,
      doorWidth: 0,
      doorHeight: 0,
      cbmCapacity: 60,
    },
    tareWeight: 4300,
    maxCargoWeight: 40800,
  },
  {
    name: "20' Open Top",
    description: "20ft Open Top Container",
    dimensions: {
      insideLength: 5.894,
      insideWidth: 2.34,
      insideHeight: 2.315,
      doorWidth: 2.341,
      doorHeight: 2.274,
      cbmCapacity: 32,
    },
    tareWeight: 2200,
    maxCargoWeight: 28280,
  },
  {
    name: "40' Open Top",
    description: "40ft Open Top Container",
    dimensions: {
      insideLength: 12.029,
      insideWidth: 2.342,
      insideHeight: 2.326,
      doorWidth: 2.341,
      doorHeight: 2.274,
      cbmCapacity: 68,
    },
    tareWeight: 4010,
    maxCargoWeight: 26070,
  },
  {
    name: "20' Refrigerated",
    description: "20ft Reefer Container",
    dimensions: {
      insideLength: 5.439,
      insideWidth: 2.294,
      insideHeight: 2.014,
      doorWidth: 2.296,
      doorHeight: 2.27,
      cbmCapacity: 25,
    },
    tareWeight: 3010,
    maxCargoWeight: 21450,
  },
  {
    name: "40' Refrigerated",
    description: "40ft Reefer Container",
    dimensions: {
      insideLength: 11.84,
      insideWidth: 2.296,
      insideHeight: 2.12,
      doorWidth: 2.286,
      doorHeight: 2.195,
      cbmCapacity: 60,
    },
    tareWeight: 4100,
    maxCargoWeight: 26630,
  },
  {
    name: "20' Tank",
    description: "20ft Tank Container",
    dimensions: {
      insideLength: 6.058,
      insideWidth: 2.438,
      insideHeight: 2.41,
      doorWidth: 0,
      doorHeight: 0,
      cbmCapacity: 35,
    },
    tareWeight: 3860,
    maxCargoWeight: 26220,
  },
];

export default function AdminContainersPage() {
  const [containers, setContainers] = useState<ContainerType[]>([]);
  const [newContainer, setNewContainer] = useState<
    Omit<ContainerType, "_id" | "status">
  >({
    name: "",
    description: "",
    dimensions: {
      insideLength: 0,
      insideWidth: 0,
      insideHeight: 0,
      doorWidth: 0,
      doorHeight: 0,
      cbmCapacity: 0,
    },
    tareWeight: 0,
    maxCargoWeight: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const fetchContainers = async () => {
    const query = filter === "all" ? "?showAll=true" : "";
    const data = await safeFetch(
      `http://localhost:8000/api/containers${query}`
    );
    if (!data) return;

    const all = data.types || [];
    const filtered =
      filter === "active"
        ? all.filter((c: ContainerType) => c.status === "active")
        : filter === "inactive"
        ? all.filter((c: ContainerType) => c.status === "inactive")
        : all;

    setContainers(filtered);
  };

  useEffect(() => {
    fetchContainers();
  }, [filter]);

  useEffect(() => {
    if (!isCustom && newContainer.name) {
      const match = STANDARD_CONTAINERS.find(
        (c) => c.name === newContainer.name
      );
      if (match) setNewContainer(match);
    }
  }, [newContainer.name, isCustom]);

  const handleCreate = async () => {
    const { name, description, dimensions, tareWeight, maxCargoWeight } =
      newContainer;

    if (
      !name ||
      !description ||
      !tareWeight ||
      !maxCargoWeight ||
      Object.values(dimensions).some((v) => !v && v !== 0)
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const data = await safeFetch("http://localhost:8000/api/containers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newContainer),
    });

    if (data?.container) {
      toast.success("Container created");
      setShowForm(false);
      setNewContainer({
        name: "",
        description: "",
        dimensions: {
          insideLength: 0,
          insideWidth: 0,
          insideHeight: 0,
          doorWidth: 0,
          doorHeight: 0,
          cbmCapacity: 0,
        },
        tareWeight: 0,
        maxCargoWeight: 0,
      });
      fetchContainers();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this container?")) return;

    const res = await safeFetch(`http://localhost:8000/api/containers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res) {
      toast.success("Container deleted");
      fetchContainers();
    }
  };

  const toggleStatus = async (id: string, status: string) => {
    const res = await safeFetch(`http://localhost:8000/api/containers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    if (res) {
      toast.success("Status updated");
      fetchContainers();
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6 space-y-10 mt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-[#ffcc00]">
            Container Management
          </h1>
          <div className="flex gap-4 items-center">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="p-2 bg-[#1b1b1b] border border-gray-700 text-white rounded-md"
            >
              <option value="all">Show All</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <button
              className="bg-[#902f3c] hover:bg-[#7e2632] text-white px-4 py-2 rounded-lg"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ Create Container"}
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-[#111] p-6 rounded-xl border border-gray-700 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="customToggle"
                checked={isCustom}
                onChange={(e) => setIsCustom(e.target.checked)}
              />
              <label
                htmlFor="customToggle"
                className="text-sm font-medium text-white"
              >
                Enter Custom Container
              </label>
            </div>

            {!isCustom && (
              <select
                className="p-3 w-full rounded-md bg-[#1b1b1b] text-white border border-gray-700"
                value={newContainer.name}
                onChange={(e) =>
                  setNewContainer((prev) => ({ ...prev, name: e.target.value }))
                }
              >
                <option value="">Select Standard Container</option>
                {STANDARD_CONTAINERS.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              placeholder="Custom Container Name"
              value={newContainer.name}
              onChange={(e) =>
                setNewContainer((prev) => ({ ...prev, name: e.target.value }))
              }
              className="p-3 rounded-md w-full bg-[#1b1b1b] text-white border border-gray-700"
            />

            <input
              type="text"
              placeholder="Container Description"
              value={newContainer.description}
              onChange={(e) =>
                setNewContainer({
                  ...newContainer,
                  description: e.target.value,
                })
              }
              className="p-3 rounded-md w-full bg-[#1b1b1b] text-white border border-gray-700"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "insideLength", label: "Inside Length (m)" },
                { key: "insideWidth", label: "Inside Width (m)" },
                { key: "insideHeight", label: "Inside Height (m)" },
                { key: "doorWidth", label: "Door Width (m)" },
                { key: "doorHeight", label: "Door Height (m)" },
                { key: "cbmCapacity", label: "CBM Capacity" },
              ].map(({ key, label }) => (
                <input
                  key={key}
                  type="number"
                  step="any"
                  placeholder={label}
                  value={
                    newContainer.dimensions[
                      key as keyof typeof newContainer.dimensions
                    ] || ""
                  }
                  onChange={(e) =>
                    setNewContainer((prev) => ({
                      ...prev,
                      dimensions: {
                        ...prev.dimensions,
                        [key]: parseFloat(e.target.value),
                      },
                    }))
                  }
                  className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
                />
              ))}

              <input
                type="number"
                step="any"
                placeholder="Tare Weight (kg)"
                value={newContainer.tareWeight || ""}
                onChange={(e) =>
                  setNewContainer((prev) => ({
                    ...prev,
                    tareWeight: parseFloat(e.target.value),
                  }))
                }
                className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
              />
              <input
                type="number"
                step="any"
                placeholder="Max Cargo Weight (kg)"
                value={newContainer.maxCargoWeight || ""}
                onChange={(e) =>
                  setNewContainer((prev) => ({
                    ...prev,
                    maxCargoWeight: parseFloat(e.target.value),
                  }))
                }
                className="p-3 rounded-md bg-[#1b1b1b] text-white border border-gray-700"
              />
            </div>

            <button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg w-full sm:w-auto"
            >
              Submit
            </button>
          </div>
        )}

        {/* Container Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {containers.map((container) => (
            <div
              key={container._id}
              className="bg-[#1b1b1b] p-5 rounded-xl border border-gray-700 text-white space-y-2"
            >
              <h2 className="text-xl font-bold">{container.name}</h2>
              <p className="text-sm text-gray-400">{container.description}</p>
              <p className="text-xs text-gray-500">
                CBM: {container.dimensions?.cbmCapacity}
              </p>
              <p className="text-xs text-gray-500">
                Max Load: {container.maxCargoWeight} kg
              </p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() =>
                    toggleStatus(
                      container._id,
                      container.status === "active" ? "inactive" : "active"
                    )
                  }
                  className={`text-xs px-3 py-1 rounded-full ${
                    container.status === "active"
                      ? "bg-green-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {container.status}
                </button>
                <button
                  onClick={() => handleDelete(container._id)}
                  className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1 rounded-full"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
