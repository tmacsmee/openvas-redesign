"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStore } from "@/lib/store"
import { format } from "date-fns"
import { ArrowUpDown, Download, Eye, Search } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const SEVERITY_COLORS = {
  Critical: "#9333ea",
  High: "#dc2626",
  Medium: "#ea580c",
  Low: "#ca8a04",
  Log: "#6b7280",
}

export function ReportsView() {
  const { scans } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<"date" | "name" | "severity">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const allReports = useMemo(() => {
    return scans.flatMap((scan) =>
      scan.reports.map((report) => ({
        ...report,
        scanName: scan.name,
        scanId: scan.id,
      })),
    )
  }, [scans])

  const filteredReports = useMemo(() => {
    const filtered = allReports.filter(
      (report) =>
        report.scanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.taskName.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    filtered.sort((a, b) => {
      let comparison = 0

      if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortField === "name") {
        comparison = a.scanName.localeCompare(b.scanName)
      } else if (sortField === "severity") {
        const getSeverityScore = (counts: any) =>
          counts.critical * 4 + counts.high * 3 + counts.medium * 2 + counts.low * 1
        comparison = getSeverityScore(a.severityCounts) - getSeverityScore(b.severityCounts)
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }, [allReports, searchQuery, sortField, sortDirection])

  const chartData = useMemo(() => {
    const totalCounts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      log: 0,
    }

    allReports.forEach((report) => {
      totalCounts.critical += report.severityCounts.critical
      totalCounts.high += report.severityCounts.high
      totalCounts.medium += report.severityCounts.medium
      totalCounts.low += report.severityCounts.low
      totalCounts.log += report.severityCounts.log
    })

    const severityPieData = [
      { name: "Critical", value: totalCounts.critical, fill: SEVERITY_COLORS.Critical },
      { name: "High", value: totalCounts.high, fill: SEVERITY_COLORS.High },
      { name: "Medium", value: totalCounts.medium, fill: SEVERITY_COLORS.Medium },
      { name: "Low", value: totalCounts.low, fill: SEVERITY_COLORS.Low },
      { name: "Log", value: totalCounts.log, fill: SEVERITY_COLORS.Log },
    ].filter((item) => item.value > 0)

    const timeSeriesData = allReports
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((report) => ({
        date: format(new Date(report.date), "MMM dd"),
        high: report.severityCounts.high,
        critical: report.severityCounts.critical,
      }))

    const cvssDistribution = Array.from({ length: 11 }, (_, i) => ({
      score: i === 0 ? "0" : i.toString(),
      count: 0,
    }))

    allReports.forEach((report) => {
      report.vulnerabilities.forEach((vuln) => {
        const score = Math.floor(vuln.cvss)
        if (score >= 0 && score <= 10) {
          cvssDistribution[score].count++
        }
      })
    })

    return { severityPieData, timeSeriesData, cvssDistribution }
  }, [allReports])

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const totalReports = allReports.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground mt-1">View and analyze scan results</p>
        </div>
      </div>

      {totalReports > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Reports by Severity Class (Total: {totalReports})</CardTitle>
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
              <CardTitle className="text-sm font-medium">Reports with High Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="critical" stroke="#9333ea" name="Critical" />
                  <Line type="monotone" dataKey="high" stroke="#dc2626" name="High" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Reports by CVSS (Total: {totalReports})</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData.cvssDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="score" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Reports ({filteredReports.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter reports..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {allReports.length === 0
                  ? "No reports yet. Run a scan to generate reports."
                  : "No reports match your filter."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => toggleSort("date")} className="h-8 px-2">
                      Date
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => toggleSort("name")} className="h-8 px-2">
                      Task
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => toggleSort("severity")} className="h-8 px-2">
                      Severity
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="text-sm">
                      <div>{format(new Date(report.date), "EEE, MMM dd, yyyy")}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(report.date), "HH:mm:ss 'UTC'")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "100%" }} />
                      </div>
                      <span className="text-xs text-muted-foreground">100%</span>
                    </TableCell>
                    <TableCell className="font-medium">{report.scanName}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        {report.severityCounts.critical > 0 && (
                          <span className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                            {report.severityCounts.critical}
                          </span>
                        )}
                        {report.severityCounts.high > 0 && (
                          <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            {report.severityCounts.high}
                          </span>
                        )}
                        {report.severityCounts.medium > 0 && (
                          <span className="inline-flex items-center rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                            {report.severityCounts.medium}
                          </span>
                        )}
                        {report.severityCounts.low > 0 && (
                          <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                            {report.severityCounts.low}
                          </span>
                        )}
                        {report.severityCounts.log > 0 && (
                          <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                            {report.severityCounts.log}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/reports/${report.scanId}`}>
                          <Button variant="ghost" size="icon" title="View Report">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" title="Download Report">
                          <Download className="h-4 w-4" />
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
  )
}
