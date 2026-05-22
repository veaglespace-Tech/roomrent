"use client";

import { useEffect, useState } from "react";
import { getMyEnquiries } from "@/services/user-service";
import { Enquiry } from "@/types";

export default function MyEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    getMyEnquiries().then(setEnquiries).catch(() => setEnquiries([]));
  }, []);

  return (
    <div className="panel overflow-x-auto p-8">
      <h1 className="text-3xl font-bold">My Enquiries</h1>
      <div className="mt-6">
        <table className="table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id}>
                <td>{enquiry.propertyTitle}</td>
                <td>{enquiry.message}</td>
                <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

