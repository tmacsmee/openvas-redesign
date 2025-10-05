"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { AlertTriangle, CheckCircle2, Clock, Plus, Shield } from "lucide-react";
import Link from "next/link";

export function DashboardOverview() {
  const { scans } = useStore();

  const totalScans = scans.length;
  const activeScans = scans.filter((s) => s.status === "Running").length;
  const completedScans = scans.filter((s) => s.status === "Completed").length;

  // Calculate total vulnerabilities by severity
  let totalHigh = 0;
  let totalMedium = 0;
  let totalLow = 0;
  let totalLog = 0;
  let totalCritical = 0;

  scans.forEach((scan) => {
    scan.reports.forEach((report) => {
      totalCritical += report.severityCounts.critical;
      totalHigh += report.severityCounts.high;
      totalMedium += report.severityCounts.medium;
      totalLow += report.severityCounts.low;
      totalLog += report.severityCounts.log;
    });
  });

  // Get recent scans
  const recentScans = [...scans]
    .sort((a, b) => {
      const dateA = a.lastRun ? new Date(a.lastRun).getTime() : 0;
      const dateB = b.lastRun ? new Date(b.lastRun).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Overview of your vulnerability scans and security status
          </p>
        </div>
        <Link href="/scans/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            New Scan
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Scans
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScans}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedScans} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Severity
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalHigh + totalCritical}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Vulnerabilities found
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Scans
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeScans}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Issues
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCritical + totalHigh + totalMedium + totalLow}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all scans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vulnerabilities by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            {totalCritical + totalHigh + totalMedium + totalLow + totalLog ===
            0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No vulnerabilities detected yet
              </p>
            ) : (
              <div className="space-y-4">
                {totalCritical > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500" />
                      <span className="text-sm">Critical</span>
                    </div>
                    <span className="text-sm font-medium">{totalCritical}</span>
                  </div>
                )}
                {totalHigh > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-sm">High</span>
                    </div>
                    <span className="text-sm font-medium">{totalHigh}</span>
                  </div>
                )}
                {totalMedium > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500" />
                      <span className="text-sm">Medium</span>
                    </div>
                    <span className="text-sm font-medium">{totalMedium}</span>
                  </div>
                )}
                {totalLow > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <span className="text-sm">Low</span>
                    </div>
                    <span className="text-sm font-medium">{totalLow}</span>
                  </div>
                )}
                {totalLog > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-300" />
                      <span className="text-sm">Log</span>
                    </div>
                    <span className="text-sm font-medium">{totalLog}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Scan Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentScans.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent scans
              </p>
            ) : (
              <div className="space-y-4">
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{scan.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {scan.targets.length > 1
                          ? `${scan.targets.length} hosts`
                          : scan.targets[0]}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        scan.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : scan.status === "Running"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {scan.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
