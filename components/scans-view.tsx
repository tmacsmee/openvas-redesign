"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { format, isAfter, subDays } from "date-fns";
import {
  ArrowUpDown,
  FileText,
  Filter,
  Loader2,
  Play,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SEVERITY_COLORS = {
  Critical: "#9333ea",
  High: "#dc2626",
  Medium: "#ea580c",
  Low: "#ca8a04",
  Log: "#6b7280",
};

const STATUS_COLORS = {
  Completed: "#10b981",
  Running: "#3b82f6",
  Failed: "#dc2626",
  New: "#8b5cf6",
  Stopped: "#6b7280",
};

export function ScansView() {
  const { scans, deleteScan, startScan } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<
    "name" | "status" | "severity" | "vulnerabilities" | "lastRun"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [lastRunFilter, setLastRunFilter] = useState<string>("all");
  const [vulnerabilityFilter, setVulnerabilityFilter] = useState<string>("all");

  const filteredScans = useMemo(() => {
    let filtered = scans.filter(
      (scan) =>
        scan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scan.targets.some((target) =>
          target.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    if (lastRunFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((scan) => {
        if (!scan.lastRun) return lastRunFilter === "never";
        const lastRunDate = new Date(scan.lastRun);

        switch (lastRunFilter) {
          case "today":
            return isAfter(lastRunDate, subDays(now, 1));
          case "week":
            return isAfter(lastRunDate, subDays(now, 7));
          case "month":
            return isAfter(lastRunDate, subDays(now, 30));
          case "never":
            return false;
          default:
            return true;
        }
      });
    }

    if (vulnerabilityFilter !== "all") {
      filtered = filtered.filter((scan) => {
        if (scan.reports.length === 0) return vulnerabilityFilter === "none";

        const latestReport = scan.reports[scan.reports.length - 1];
        const { critical, high, medium, low } = latestReport.severityCounts;

        switch (vulnerabilityFilter) {
          case "critical":
            return critical > 0;
          case "high":
            return high > 0;
          case "medium":
            return medium > 0;
          case "low":
            return low > 0;
          case "none":
            return critical === 0 && high === 0 && medium === 0 && low === 0;
          default:
            return true;
        }
      });
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "status") {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === "severity") {
        const getSeverityScore = (scan: typeof a) => {
          if (scan.reports.length === 0) return 0;
          const latest = scan.reports[scan.reports.length - 1];
          return (
            latest.severityCounts.critical * 4 +
            latest.severityCounts.high * 3 +
            latest.severityCounts.medium * 2 +
            latest.severityCounts.low * 1
          );
        };
        comparison = getSeverityScore(a) - getSeverityScore(b);
      } else if (sortField === "vulnerabilities") {
        const getVulnCount = (scan: typeof a) => {
          if (scan.reports.length === 0) return 0;
          return scan.reports[scan.reports.length - 1].vulnerabilities.length;
        };
        comparison = getVulnCount(a) - getVulnCount(b);
      } else if (sortField === "lastRun") {
        const aTime = a.lastRun ? new Date(a.lastRun).getTime() : 0;
        const bTime = b.lastRun ? new Date(b.lastRun).getTime() : 0;
        comparison = aTime - bTime;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    scans,
    searchQuery,
    sortField,
    sortDirection,
    lastRunFilter,
    vulnerabilityFilter,
  ]);

  const chartData = useMemo(() => {
    const statusCounts = {
      New: 0,
      Running: 0,
      Completed: 0,
      Stopped: 0,
      Failed: 0,
    };

    const severityCounts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      log: 0,
    };

    scans.forEach((scan) => {
      statusCounts[scan.status]++;

      if (scan.reports.length > 0) {
        const latest = scan.reports[scan.reports.length - 1];
        severityCounts.critical += latest.severityCounts.critical;
        severityCounts.high += latest.severityCounts.high;
        severityCounts.medium += latest.severityCounts.medium;
        severityCounts.low += latest.severityCounts.low;
        severityCounts.log += latest.severityCounts.log;
      }
    });

    const statusPieData = Object.entries(statusCounts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
        fill: STATUS_COLORS[name as keyof typeof STATUS_COLORS],
      }));

    const severityPieData = [
      {
        name: "Critical",
        value: severityCounts.critical,
        fill: SEVERITY_COLORS.Critical,
      },
      { name: "High", value: severityCounts.high, fill: SEVERITY_COLORS.High },
      {
        name: "Medium",
        value: severityCounts.medium,
        fill: SEVERITY_COLORS.Medium,
      },
      { name: "Low", value: severityCounts.low, fill: SEVERITY_COLORS.Low },
      { name: "Log", value: severityCounts.log, fill: SEVERITY_COLORS.Log },
    ].filter((item) => item.value > 0);

    const hostData = scans
      .filter((scan) => scan.reports.length > 0)
      .map((scan) => {
        const latest = scan.reports[scan.reports.length - 1];
        return {
          name: scan.name.substring(0, 15),
          high: latest.severityCounts.high,
          critical: latest.severityCounts.critical,
        };
      })
      .slice(0, 5);

    return { statusPieData, severityPieData, hostData };
  }, [scans]);

  const getSeverityBadge = (scan: any) => {
    if (scan.reports.length === 0) return null;

    const latestReport = scan.reports[scan.reports.length - 1];
    const { critical, high, medium } = latestReport.severityCounts;

    let severity = "low";
    let label = "Low";

    if (critical > 0) {
      severity = "critical";
      label = "Critical";
    } else if (high > 0) {
      severity = "high";
      label = "High";
    } else if (medium > 0) {
      severity = "medium";
      label = "Medium";
    }

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          severity === "critical"
            ? "bg-purple-100 text-purple-800"
            : severity === "high"
            ? "bg-red-100 text-red-800"
            : severity === "medium"
            ? "bg-orange-100 text-orange-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {label}
      </span>
    );
  };

  const getVulnerabilityCount = (scan: any) => {
    if (scan.reports.length === 0) return 0;
    const latestReport = scan.reports[scan.reports.length - 1];
    return latestReport.vulnerabilities.length;
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const activeFiltersCount = [
    lastRunFilter !== "all",
    vulnerabilityFilter !== "all",
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scans</h2>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your vulnerability scans
          </p>
        </div>
        <Link href="/scans/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            New Scan
          </Button>
        </Link>
      </div>

      {scans.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Tasks by Severity Class (Total: {scans.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chartData.severityPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.severityPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Tasks with most High Results per Host
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData.hostData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="critical" fill="#9333ea" name="Critical" />
                  <Bar dataKey="high" fill="#dc2626" name="High" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Tasks by Status (Total: {scans.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chartData.statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>All Scans ({filteredScans.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 bg-transparent"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="ml-1 rounded-full bg-emerald-600 text-white px-1.5 py-0.5 text-xs">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Last Run</Label>
                      <Select
                        value={lastRunFilter}
                        onValueChange={setLastRunFilter}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="today">Last 24 hours</SelectItem>
                          <SelectItem value="week">Last 7 days</SelectItem>
                          <SelectItem value="month">Last 30 days</SelectItem>
                          <SelectItem value="never">Never run</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Vulnerabilities</Label>
                      <Select
                        value={vulnerabilityFilter}
                        onValueChange={setVulnerabilityFilter}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="critical">Has Critical</SelectItem>
                          <SelectItem value="high">Has High</SelectItem>
                          <SelectItem value="medium">Has Medium</SelectItem>
                          <SelectItem value="low">Has Low</SelectItem>
                          <SelectItem value="none">
                            No Vulnerabilities
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => {
                          setLastRunFilter("all");
                          setVulnerabilityFilter("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter scans..."
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredScans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {scans.length === 0
                  ? "No scans yet. Create your first scan to get started."
                  : "No scans match your filter."}
              </p>
              {scans.length === 0 && (
                <Link href="/scans/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4" />
                    Create Scan
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort("name")}
                      className="h-8 px-2"
                    >
                      Name
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort("status")}
                      className="h-8 px-2"
                    >
                      Status
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort("severity")}
                      className="h-8 px-2"
                    >
                      Severity
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort("vulnerabilities")}
                      className="h-8 px-2"
                    >
                      Vulnerabilities
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort("lastRun")}
                      className="h-8 px-2"
                    >
                      Last Run
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-medium">{scan.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {scan.targets.length > 1
                        ? `${scan.targets.length} hosts`
                        : scan.targets[0]}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          scan.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : scan.status === "Running"
                            ? "bg-blue-100 text-blue-800"
                            : scan.status === "Failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {scan.status === "Running" && (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        )}
                        {scan.status}
                      </span>
                    </TableCell>
                    <TableCell>{getSeverityBadge(scan)}</TableCell>
                    <TableCell>{getVulnerabilityCount(scan)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {scan.lastRun
                        ? format(new Date(scan.lastRun), "MMM d, yyyy HH:mm")
                        : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {scan.reports.length > 0 && (
                          <Link href={`/reports/${scan.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View Report"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Start Scan"
                          onClick={() => startScan(scan.id)}
                          disabled={scan.status === "Running"}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete Scan"
                          onClick={() => deleteScan(scan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
