'use client';

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import safeFetch from "@/utils/safeFetch";

interface ContainerDimensions {
  insideLength: number;
  insideWidth: number;
  insideHeight: number;
  doorWidth: number;
  doorHeight: number;
  cbmCapacity: number;
}

interface ContainerType {
  _id: string;
  name: string;
  description: string;
  dimensions: ContainerDimensions;
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
  const [newContainer, setNewContainer] = useState<Omit<ContainerType, "_id" | "status">>({
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

  // Only throttle for fetching containers (prevents spamming on filter change)
  const fetchContainers = useCallback(async () => {
    const query = filter === "all" ? "?showAll=true" : "";
    const data = await safeFetch<{ types: ContainerType[] }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/containers${query}`,

    );

    if (!data) return;

    const all: ContainerType[] = data.types || [];
    const filtered: ContainerType[] =
      filter === "active"
        ? all.filter((c) => c.status === "active")
        : filter === "inactive"
        ? all.filter((c) => c.status === "inactive")
        : all;

    setContainers(filtered);
  }, [filter]);

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  useEffect(() => {
    if (!isCustom && newContainer.name) {
      const match = STANDARD_CONTAINERS.find((c) => c.name === newContainer.name);
      if (match) setNewContainer(match);
    }
  }, [newContainer.name, isCustom]);

  // Debounce create (prevents double submit)
  const handleCreate = async () => {
    const { name, description, dimensions, tareWeight, maxCargoWeight } = newContainer;

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

    const data = await safeFetch<{ container: ContainerType }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/containers`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newContainer),
      },
      { debounce: true }
    );

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

  // Throttle delete (prevents rapid delete clicks)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this container?")) return;

    const res = await safeFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/containers/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
      { throttle: true }
    );

    if (res) {
      toast.success("Container deleted");
      fetchContainers();
    }
  };

  // Throttle status toggle (prevents rapid toggling)
  const toggleStatus = async (id: string, status: string) => {
    const res = await safeFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/containers/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      },
      { throttle: true }
    );

    if (res) {
      toast.success("Status updated");
      fetchContainers();
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6 space-y-10 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-[#ffcc00]">Container Management</h1>
          <div className="flex gap-4 items-center">
            <select
              value={filter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilter(e.target.value as "all" | "active" | "inactive")
              }
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

        {showForm && (
          <div className="bg-[#111] p-6 rounded-xl border border-gray-700 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="customToggle"
                checked={isCustom}
                onChange={() => {
                  setIsCustom((prev) => !prev);
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
                }}
                className="cursor-pointer"
              />
              <label htmlFor="customToggle" className="cursor-pointer select-none">
                Create Custom Container
              </label>
            </div>

            {!isCustom ? (
              <select
                className="w-full bg-[#222] rounded-md p-2"
                value={newContainer.name}
                onChange={(e) =>
                  setNewContainer((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              >
                <option value="">-- Select Standard Container --</option>
                {STANDARD_CONTAINERS.map((cont) => (
                  <option key={cont.name} value={cont.name}>
                    {cont.name}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-2 rounded-md bg-[#222] text-white"
                  value={newContainer.name}
                  onChange={(e) =>
                    setNewContainer((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <textarea
                  placeholder="Description"
                  className="w-full p-2 rounded-md bg-[#222] text-white"
                  rows={2}
                  value={newContainer.description}
                  onChange={(e) =>
                    setNewContainer((prev) => ({ ...prev, description: e.target.value }))
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Inside Length (m)"
                    className="p-2 rounded-md bg-[#222] text-white"
                    value={newContainer.dimensions.insideLength}
                    onChange={(e) =>
                      setNewContainer((prev) => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions,
                          insideLength: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Inside Width (m)"
                    className="p-2 rounded-md bg-[#222] text-white"
                    value={newContainer.dimensions.insideWidth}
                    onChange={(e) =>
                      setNewContainer((prev) => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions,
                          insideWidth: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Inside Height (m)"
                    className="p-2 rounded-md bg-[#222] text-white"
                    value={newContainer.dimensions.insideHeight}
                    onChange={(e) =>
                      setNewContainer((prev) => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions,
                          insideHeight: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Door Width (m)"
                    className="p-2 rounded-md bg-[#222] text-white"
                    value={newContainer.dimensions.doorWidth}
                    onChange={(e) =>
                      setNewContainer((prev) => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions,
                          doorWidth: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Door Height (m)"
                    className="p-2 rounded-md bg-[#222] text-white"
                    value={newContainer.dimensions.doorHeight}
                    onChange={(e) =>
                      setNewContainer((prev) => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions,
                          doorHeight: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                  <input
                    type="number"
                    step="0.001"
                    placeholder="CBM Capacity"
                    className="p-2 rounded-md bg-[#222] text-white"
                    value={newContainer.dimensions.cbmCapacity}
                    onChange={(e) =>
                      setNewContainer((prev) => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions,
                          cbmCapacity: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>

                <input
                  type="number"
                  step="1"
                  placeholder="Tare Weight (kg)"
                  className="w-full p-2 rounded-md bg-[#222] text-white"
                  value={newContainer.tareWeight}
                  onChange={(e) =>
                    setNewContainer((prev) => ({
                      ...prev,
                      tareWeight: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <input
                  type="number"
                  step="1"
                  placeholder="Max Cargo Weight (kg)"
                  className="w-full p-2 rounded-md bg-[#222] text-white"
                  value={newContainer.maxCargoWeight}
                  onChange={(e) =>
                    setNewContainer((prev) => ({
                      ...prev,
                      maxCargoWeight: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </>
            )}

            <button
              className="bg-[#b92935] hover:bg-[#a1242f] text-white px-4 py-2 rounded-md"
              onClick={handleCreate}
            >
              Create Container
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {containers.map((container) => (
            <div
              key={container._id}
              className="bg-[#111] p-5 rounded-xl border border-gray-700 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-[#ffcc00]">{container.name}</h2>
                <p className="text-gray-300 my-2">{container.description}</p>

                <ul className="text-gray-400 text-sm space-y-1">
                  <li>
                    Dimensions (L×W×H):{" "}
                    {`${container.dimensions.insideLength}m × ${container.dimensions.insideWidth}m × ${container.dimensions.insideHeight}m`}
                  </li>
                  <li>
                    Door (W×H):{" "}
                    {container.dimensions.doorWidth && container.dimensions.doorHeight
                      ? `${container.dimensions.doorWidth}m × ${container.dimensions.doorHeight}m`
                      : "N/A"}
                  </li>
                  <li>CBM Capacity: {container.dimensions.cbmCapacity} m³</li>
                  <li>Tare Weight: {container.tareWeight} kg</li>
                  <li>Max Cargo Weight: {container.maxCargoWeight} kg</li>
                  <li>Status: {container.status}</li>
                </ul>
              </div>

              <div className="flex justify-between mt-4 gap-2">
                <button
                  onClick={() =>
                    toggleStatus(
                      container._id,
                      container.status === "active" ? "inactive" : "active"
                    )
                  }
                  className={`px-3 py-1 rounded-md text-white ${
                    container.status === "active" ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {container.status === "active" ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => handleDelete(container._id)}
                  className="px-3 py-1 rounded-md bg-[#b92935] hover:bg-[#8e2127] text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {containers.length === 0 && (
            <p className="text-gray-400 col-span-full text-center mt-10">
              No containers found.
            </p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}