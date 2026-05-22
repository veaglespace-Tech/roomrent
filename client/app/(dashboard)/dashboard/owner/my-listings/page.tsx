"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteProperty, getOwnerProperties } from "@/services/property-service";
import { Property } from "@/types";

export default function MyListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  const loadListings = () => getOwnerProperties().then(setProperties).catch(() => setProperties([]));

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <div className="panel overflow-x-auto p-8">
      <h1 className="text-3xl font-bold">My Listings</h1>
      <div className="mt-6">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td>{property.title}</td>
                <td>{property.location}</td>
                <td>₹{property.price}</td>
                <td className="space-x-2">
                  <Link className="btn btn-sm rounded-full" href={`/dashboard/owner/edit-property/${property.id}`}>Edit</Link>
                  <button
                    className="btn btn-sm btn-outline rounded-full"
                    onClick={async () => {
                      await deleteProperty(property.id);
                      loadListings();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

