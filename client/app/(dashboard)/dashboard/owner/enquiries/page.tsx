"use client";

import { useEffect, useState } from "react";
import { getOwnerEnquiries } from "@/services/user-service";
import { Enquiry } from "@/types";

export default function OwnerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    getOwnerEnquiries().then(setEnquiries).catch(() => setEnquiries([]));
  }, []);

  return (
    <div className="panel overflow-x-auto p-8">
      <h1 className="text-3xl font-bold">Owner Enquiries</h1>
      <div className="mt-6">
        <table className="table">
          <thead>
            <tr>
              <th>Property</th>
              <th>User</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id}>
                <td>{enquiry.propertyTitle}</td>
                <td>{enquiry.userName} ({enquiry.userEmail})</td>
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

