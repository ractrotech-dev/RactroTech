import { db } from "@/utils/db/db";
import { projectEnquiriesTable, projectsTable, clientsTable } from "@/utils/db/schema";
import { sql } from "drizzle-orm";
import { BarChart3, TrendingUp, Users, DollarSign, Target, MousePointer2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import MiniStat from "@/components/admin/MiniStat";
import DashboardCharts from "../DashboardCharts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics | Admin | RactroTech", description: "Business intelligence" };

export default async function AdminAnalyticsPage() {
  // Real data fetching for analytics
  const inquiryStats = await db
    .select({
      status: projectEnquiriesTable.status,
      count: sql<number>`count(*)::int`,
    })
    .from(projectEnquiriesTable)
    .groupBy(projectEnquiriesTable.status);

  const projectStats = await db
    .select({
      status: projectsTable.status,
      count: sql<number>`count(*)::int`,
    })
    .from(projectsTable)
    .groupBy(projectsTable.status);

  const totalRevenueRows = await db
    .select({ total: sql<number>`sum(budget)::int` })
    .from(projectsTable);
  const totalRevenue = totalRevenueRows[0]?.total || 0;

  const clientCountRows = await db.select({ count: sql<number>`count(*)::int` }).from(clientsTable);
  const clientCount = clientCountRows[0]?.count || 0;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Business Insights" 
        subtitle="Performance metrics and growth analytics" 
        backHref="/admin" 
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat icon={<DollarSign size={16} />} value={`$${totalRevenue.toLocaleString()}`} label="Pipeline Value" color="bg-yellow-400" />
        <MiniStat icon={<Target size={16} />} value={clientCount} label="Active Clients" color="bg-blue-400" />
        <MiniStat icon={<TrendingUp size={16} />} value="24%" label="Conversion Rate" color="bg-emerald-400" />
        <MiniStat icon={<MousePointer2 size={16} />} value="1.2k" label="Site Visits" color="bg-purple-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="mb-6 text-xs font-black tracking-[0.2em]">Inquiry Distribution</h3>
          <div className="space-y-4">
            {inquiryStats.map(stat => (
              <div key={stat.status}>
                <div className="mb-1.5 flex justify-between text-[10px] font-black tracking-wider">
                  <span>{stat.status}</span>
                  <span>{stat.count}</span>
                </div>
                <div className="h-4 border-2 border-black bg-gray-50 p-0.5">
                  <div 
                    className="h-full bg-blue-400 border-r-2 border-black" 
                    style={{ width: `${(stat.count / Math.max(...inquiryStats.map(s => s.count)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="mb-6 text-xs font-black tracking-[0.2em]">Project Status Overview</h3>
          <div className="space-y-4">
             {projectStats.map(stat => (
              <div key={stat.status}>
                <div className="mb-1.5 flex justify-between text-[10px] font-black tracking-wider">
                  <span>{stat.status}</span>
                  <span>{stat.count}</span>
                </div>
                <div className="h-4 border-2 border-black bg-gray-50 p-0.5">
                  <div 
                    className="h-full bg-yellow-400 border-r-2 border-black" 
                    style={{ width: `${(stat.count / Math.max(...projectStats.map(s => s.count)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="mb-6 text-xs font-black tracking-[0.2em]">Growth Trends</h3>
        <DashboardCharts />
      </div>
    </div>
  );
}
