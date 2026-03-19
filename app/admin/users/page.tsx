import { db } from "@/utils/db/db";
import { usersTable } from "@/utils/db/schema";
import Link from "next/link";

export const metadata = {
  title: "Users | Admin | RactroTech",
  description: "Manage users",
};

export default async function AdminUsersPage() {
  const users = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      plan: usersTable.plan,
      role: usersTable.role,
    })
    .from(usersTable)
    .orderBy(usersTable.email);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link
          href="/admin"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="rounded-lg border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black bg-gray-50">
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Plan</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">ID</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users yet.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100">
                    <td className="px-6 py-3 font-medium">{u.email}</td>
                    <td className="px-6 py-3">{u.name}</td>
                    <td className="px-6 py-3">
                      <span className="rounded border border-black bg-yellow-400 px-2 py-0.5 text-xs font-bold uppercase">
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${
                          u.role === "admin"
                            ? "border border-black bg-black text-white"
                            : "border border-gray-300 bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="max-w-[200px] truncate px-6 py-3 font-mono text-xs text-gray-500">
                      {u.id}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
