"use client";

import { useEffect, useState } from "react";
import { getAdminProperties } from "@/services/property-service";
import { Property } from "@/types";

export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    getAdminProperties().then(setProperties).catch(() => setProperties([]));
  }, []);

  return (
    <div className="panel overflow-x-auto p-8">
      <h1 className="text-3xl font-bold">Manage Properties</h1>
      <table className="table mt-6">
        <thead>
          <tr>
            <th>Title</th>
            <th>Owner</th>
            <th>Location</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{property.title}</td>
              <td>{property.owner.name}</td>
              <td>{property.location}</td>
              <td>₹{property.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
