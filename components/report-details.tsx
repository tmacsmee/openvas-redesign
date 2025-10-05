"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, Search, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"

const vulnerabilities = [
  {
    id: 1,
    name: "SSL/TLS: Deprecated TLSv1.0 and TLSv1.1 Protocol Detection",
    severity: "high",
    cvss: 7.5,
    host: "127.0.0.1",
    port: "443/tcp",
    solution: "Disable TLSv1.0 and TLSv1.1 protocols",
  },
  {
    id: 2,
    name: "Apache HTTP Server Multiple Vulnerabilities",
    severity: "high",
    cvss: 7.2,
    host: "127.0.0.1",
    port: "80/tcp",
    solution: "Update Apache to the latest version",
  },
  {
    id: 3,
    name: "OpenSSH Weak Encryption Algorithms Supported",
    severity: "medium",
    cvss: 5.3,
    host: "127.0.0.1",
    port: "22/tcp",
    solution: "Configure SSH to use only strong encryption algorithms",
  },
  {
    id: 4,
    name: "MySQL Unencrypted Connection",
    severity: "medium",
    cvss: 4.8,
    host: "127.0.0.1",
    port: "3306/tcp",
    solution: "Enable SSL/TLS for MySQL connections",
  },
  {
    id: 5,
    name: "HTTP Security Headers Missing",
    severity: "low",
    cvss: 3.1,
    host: "127.0.0.1",
    port: "80/tcp",
    solution: "Add security headers like X-Frame-Options, CSP, etc.",
  },
]

export function ReportDetails() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/reports">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">Localhost Full Scan</h2>
          <p className="text-muted-foreground mt-1">Completed on Fri, Jan 04, 2025 14:30 UTC</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Vulnerabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">224</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-900">High Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">23</div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-900">Medium Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">45</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-900">Low Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">67</div>
          </CardContent>
        </Card>
      </div>

      {/* Remediation Priority */}
      <Card className="border-emerald-200">
        <CardHeader className="bg-emerald-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-emerald-700 mt-0.5" />
            <div>
              <CardTitle className="text-emerald-900">Prioritized Remediation Plan</CardTitle>
              <p className="text-sm text-emerald-700 mt-1">
                Address these vulnerabilities in order of priority based on severity and exploitability
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-bold text-sm">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900">Critical: Update SSL/TLS Configuration</h4>
                <p className="text-sm text-red-700 mt-1">
                  Disable deprecated TLSv1.0 and TLSv1.1 protocols immediately. These are vulnerable to known attacks.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    High - CVSS 7.5
                  </span>
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Port 443/tcp
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-bold text-sm">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900">Critical: Update Apache HTTP Server</h4>
                <p className="text-sm text-red-700 mt-1">
                  Multiple vulnerabilities detected. Update to the latest stable version to patch known security issues.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    High - CVSS 7.2
                  </span>
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Port 80/tcp
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border border-orange-200 rounded-lg bg-orange-50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white font-bold text-sm">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900">Important: Strengthen SSH Configuration</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Configure SSH to use only strong encryption algorithms. Disable weak ciphers and key exchange methods.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                    Medium - CVSS 5.3
                  </span>
                  <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                    Port 22/tcp
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border border-orange-200 rounded-lg bg-orange-50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white font-bold text-sm">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900">Important: Enable MySQL Encryption</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Enable SSL/TLS for MySQL connections to protect data in transit. Configure require_secure_transport.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                    Medium - CVSS 4.8
                  </span>
                  <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                    Port 3306/tcp
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-600 text-white font-bold text-sm">
                5
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900">Recommended: Add HTTP Security Headers</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Implement security headers like X-Frame-Options, Content-Security-Policy, and X-Content-Type-Options.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Low - CVSS 3.1
                  </span>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Port 80/tcp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vulnerabilities Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Vulnerabilities</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search vulnerabilities..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vulnerability</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>CVSS</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Port</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vulnerabilities.map((vuln) => (
                <TableRow key={vuln.id}>
                  <TableCell className="font-medium max-w-md">{vuln.name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        vuln.severity === "high"
                          ? "bg-red-100 text-red-800"
                          : vuln.severity === "medium"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {vuln.severity.charAt(0).toUpperCase() + vuln.severity.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono">{vuln.cvss}</TableCell>
                  <TableCell className="text-muted-foreground font-mono">{vuln.host}</TableCell>
                  <TableCell className="text-muted-foreground font-mono">{vuln.port}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
