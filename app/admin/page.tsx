import { db } from "@/utils/db/db";
import { usersTable } from "@/utils/db/schema";
import { count } from "drizzle-orm";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [userCountRow] = await db
    .select({ count: count() })
    .from(usersTable);
  const userCount = Number(userCountRow?.count ?? 0);

  const recentUsers = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      plan: usersTable.plan,
      role: usersTable.role,
    })
    .from(usersTable)
    .orderBy(usersTable.email)
    .limit(10);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Total users
          </p>
          <p className="mt-2 text-3xl font-black">{userCount}</p>
          <Link
            href="/admin/users"
            className="mt-2 inline-block text-sm font-semibold text-black underline hover:no-underline"
          >
            View all →
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b border-black px-6 py-4">
          <h2 className="font-bold uppercase tracking-wide">Recent users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Plan</th>
                <th className="px-6 py-3 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No users yet.
                  </td>
                </tr>
              ) : (
                recentUsers.map((u) => (
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
