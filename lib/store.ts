import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ScanStatus = "New" | "Running" | "Stopped" | "Completed" | "Failed"
export type SeverityLevel = "Critical" | "High" | "Medium" | "Low" | "Log"

export interface Vulnerability {
  id: string
  name: string
  severity: SeverityLevel
  cvss: number
  host: string
  port: string
  description: string
  solution: string
  references: string[]
}

export interface ScanReport {
  id: string
  taskId: string
  taskName: string
  date: Date
  status: "Completed" | "Failed"
  vulnerabilities: Vulnerability[]
  severityCounts: {
    critical: number
    high: number
    medium: number
    low: number
    log: number
  }
}

export interface Scan {
  id: string
  name: string
  comment: string
  targets: string[]
  excludeHosts: string[]
  portList: string
  scanConfig: string
  scanner: string
  status: ScanStatus
  createdAt: Date
  lastRun?: Date
  reports: ScanReport[]
  schedule: string
  addToAssets: boolean
  applyOverrides: boolean
  minQoD: number
  maxNVTsPerHost: number
  maxConcurrentHosts: number
  aliveTest: string
}

interface StoreState {
  scans: Scan[]
  addScan: (scan: Omit<Scan, "id" | "createdAt" | "reports">) => string
  updateScanStatus: (id: string, status: ScanStatus) => void
  addReport: (scanId: string, report: Omit<ScanReport, "id">) => void
  deleteScan: (id: string) => void
  startScan: (id: string) => void
}

const generateMockVulnerabilities = (targetCount: number): Vulnerability[] => {
  const vulnerabilityTemplates = [
    {
      name: "OpenSSL Heartbleed Vulnerability",
      severity: "Critical" as SeverityLevel,
      cvss: 9.8,
      port: "443/tcp",
      description:
        "The Heartbleed Bug is a serious vulnerability in the popular OpenSSL cryptographic software library. This weakness allows stealing the information protected, under normal conditions, by the SSL/TLS encryption.",
      solution: "Update OpenSSL to version 1.0.1g or later. Regenerate all SSL certificates and private keys.",
    },
    {
      name: "Apache HTTP Server Multiple Vulnerabilities",
      severity: "High" as SeverityLevel,
      cvss: 7.5,
      port: "80/tcp",
      description:
        "Multiple vulnerabilities have been discovered in Apache HTTP Server that could allow remote attackers to cause denial of service or potentially execute arbitrary code.",
      solution: "Upgrade Apache HTTP Server to the latest stable version. Review and update server configuration.",
    },
    {
      name: "Weak SSH Encryption Algorithms",
      severity: "Medium" as SeverityLevel,
      cvss: 5.3,
      port: "22/tcp",
      description:
        "The SSH server is configured to support weak encryption algorithms that are vulnerable to cryptographic attacks.",
      solution: "Disable weak ciphers in SSH configuration. Use only strong encryption algorithms like AES-256.",
    },
    {
      name: "TLS/SSL Deprecated Protocol",
      severity: "Medium" as SeverityLevel,
      cvss: 4.8,
      port: "443/tcp",
      description:
        "The server supports deprecated SSL/TLS protocols (SSLv2, SSLv3, TLS 1.0) that have known security vulnerabilities.",
      solution: "Disable SSLv2, SSLv3, and TLS 1.0. Enable only TLS 1.2 and TLS 1.3.",
    },
    {
      name: "HTTP TRACE Method Enabled",
      severity: "Low" as SeverityLevel,
      cvss: 2.6,
      port: "80/tcp",
      description:
        "The HTTP TRACE method is enabled on the web server, which could be exploited for cross-site tracing attacks.",
      solution: "Disable the HTTP TRACE method in the web server configuration.",
    },
    {
      name: "TCP Timestamps Enabled",
      severity: "Log" as SeverityLevel,
      cvss: 0.0,
      port: "general/tcp",
      description: "TCP timestamps are enabled, which may allow remote attackers to estimate the system uptime.",
      solution: "This is informational. Consider disabling TCP timestamps if not required.",
    },
    {
      name: "OS Identification",
      severity: "Log" as SeverityLevel,
      cvss: 0.0,
      port: "general/tcp",
      description:
        "The operating system of the remote host has been identified through various fingerprinting techniques.",
      solution: "This is informational. No action required.",
    },
    {
      name: "Outdated PHP Version",
      severity: "High" as SeverityLevel,
      cvss: 8.1,
      port: "80/tcp",
      description: "The PHP version running on the server is outdated and contains known security vulnerabilities.",
      solution: "Update PHP to the latest stable version. Review and update all PHP applications.",
    },
    {
      name: "MySQL Default Credentials",
      severity: "Critical" as SeverityLevel,
      cvss: 9.1,
      port: "3306/tcp",
      description: "The MySQL database server is using default or weak credentials that can be easily guessed.",
      solution: "Change all default passwords immediately. Implement strong password policies.",
    },
    {
      name: "Directory Listing Enabled",
      severity: "Low" as SeverityLevel,
      cvss: 3.1,
      port: "80/tcp",
      description: "Directory listing is enabled on the web server, exposing the directory structure and files.",
      solution: "Disable directory listing in the web server configuration.",
    },
    {
      name: "SQL Injection Vulnerability",
      severity: "Critical" as SeverityLevel,
      cvss: 9.3,
      port: "80/tcp",
      description:
        "The web application is vulnerable to SQL injection attacks that could allow unauthorized database access.",
      solution: "Use parameterized queries and prepared statements. Implement input validation and sanitization.",
    },
    {
      name: "Cross-Site Scripting (XSS)",
      severity: "High" as SeverityLevel,
      cvss: 7.2,
      port: "443/tcp",
      description:
        "The application is vulnerable to cross-site scripting attacks that could allow execution of malicious scripts.",
      solution: "Implement proper output encoding and Content Security Policy headers.",
    },
    {
      name: "Unpatched Windows SMB Vulnerability",
      severity: "Critical" as SeverityLevel,
      cvss: 9.8,
      port: "445/tcp",
      description: "The Windows SMB service contains critical vulnerabilities that could allow remote code execution.",
      solution: "Apply the latest Windows security updates immediately. Consider disabling SMBv1.",
    },
    {
      name: "Weak Password Policy",
      severity: "Medium" as SeverityLevel,
      cvss: 5.5,
      port: "general/tcp",
      description: "The system has a weak password policy that allows easily guessable passwords.",
      solution: "Implement strong password requirements including length, complexity, and expiration.",
    },
    {
      name: "Missing Security Headers",
      severity: "Low" as SeverityLevel,
      cvss: 3.7,
      port: "443/tcp",
      description:
        "The web server is missing important security headers like X-Frame-Options and X-Content-Type-Options.",
      solution: "Configure security headers in the web server or application configuration.",
    },
  ]

  const vulnerabilities: Vulnerability[] = []
  const vulnCount = Math.floor(Math.random() * 20) + 15 // 15-35 vulnerabilities

  for (let i = 0; i < vulnCount; i++) {
    const template = vulnerabilityTemplates[Math.floor(Math.random() * vulnerabilityTemplates.length)]
    const hostIndex = Math.floor(Math.random() * targetCount) + 1

    vulnerabilities.push({
      id: `vuln-${Date.now()}-${i}`,
      name: template.name,
      severity: template.severity,
      cvss: template.cvss + (Math.random() * 0.5 - 0.25), // Add slight variation to CVSS
      host: `192.168.1.${hostIndex}`,
      port: template.port,
      description: template.description,
      solution: template.solution,
      references: [
        `CVE-2023-${Math.floor(Math.random() * 90000) + 10000}`,
        `https://nvd.nist.gov/vuln/detail/CVE-2023-${Math.floor(Math.random() * 90000) + 10000}`,
      ],
    })
  }

  return vulnerabilities
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      scans: [],

      addScan: (scan) => {
        const id = `scan-${Date.now()}`
        const newScan: Scan = {
          ...scan,
          id,
          createdAt: new Date(),
          reports: [],
        }
        set((state) => ({ scans: [...state.scans, newScan] }))
        return id
      },

      updateScanStatus: (id, status) => {
        set((state) => ({
          scans: state.scans.map((scan) => (scan.id === id ? { ...scan, status, lastRun: new Date() } : scan)),
        }))
      },

      addReport: (scanId, report) => {
        const reportId = `report-${Date.now()}`
        const fullReport: ScanReport = { ...report, id: reportId }

        set((state) => ({
          scans: state.scans.map((scan) =>
            scan.id === scanId ? { ...scan, reports: [...scan.reports, fullReport] } : scan,
          ),
        }))
      },

      deleteScan: (id) => {
        set((state) => ({
          scans: state.scans.filter((scan) => scan.id !== id),
        }))
      },

      startScan: (id) => {
        const scan = get().scans.find((s) => s.id === id)
        if (!scan) return

        // Set to running
        get().updateScanStatus(id, "Running")

        // Simulate 15-second scan
        setTimeout(() => {
          const vulnerabilities = generateMockVulnerabilities(scan.targets.length)

          const severityCounts = {
            critical: vulnerabilities.filter((v) => v.severity === "Critical").length,
            high: vulnerabilities.filter((v) => v.severity === "High").length,
            medium: vulnerabilities.filter((v) => v.severity === "Medium").length,
            low: vulnerabilities.filter((v) => v.severity === "Low").length,
            log: vulnerabilities.filter((v) => v.severity === "Log").length,
          }

          get().addReport(id, {
            taskId: id,
            taskName: scan.name,
            date: new Date(),
            status: "Completed",
            vulnerabilities,
            severityCounts,
          })

          get().updateScanStatus(id, "Completed")
        }, 15000) // 15 seconds
      },
    }),
    {
      name: "openvas-storage",
    },
  ),
)
