"use client";

import { useEffect, useState } from "react";
import { getAdminUsers } from "@/services/user-service";
import { UserProfile } from "@/types";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    getAdminUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  return (
    <div className="panel overflow-x-auto p-8">
      <h1 className="text-3xl font-bold">Manage Users</h1>
      <table className="table mt-6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

