# OpenVAS Redesign

A modern, intuitive redesign of the OpenVAS vulnerability scanner interface, focused on improving usability for novice users while maintaining professional functionality.

## System Requirements

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher
- **Browser**: Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **RAM**: 2GB minimum (4GB recommended)
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

## Installation

### 1. Clone or Download the Repository

```bash
git clone <REPOSITORY_URL>
cd openvas-redesign
```

Or download and extract the ZIP file to your desired location.

### 2. Install Dependencies

```bash
npm install
```

All required libraries are included in `package.json`. No additional downloads or IDEs are needed.

### 3. Build the Project

```bash
npm run build
```

### 4. Start the Application

```bash
npm run start
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

**Login**: Enter any username and password (e.g., `admin` / `admin`)

## General Functionality

This application implements the complete OpenVAS vulnerability scanning workflow, whilst exhibiting our redesign for better HCI and usability considerations (with only mock/placeholder functionality):

### T1: Login to OpenVAS
- Navigate to `http://localhost:3000`
- Enter any credentials and click "Sign in"

### T2: Scan Localhost for Maximum Vulnerabilities
1. Click **Scans** → **New Scan**
2. Enter Name: "Localhost Scan", Hosts: "127.0.0.1"
3. Click **Save**
4. Click **Scans** → **New Scans**
5. Enter Name: "Localhost Vulnerability Scan", select your target, choose "Full and fast" scan config
6. Click **Save**, then click the play button (▶) to start
7. Wait for scan completion (progress bar shows status)

### T3: Scan Two Hosts Including Localhost
1. Create a new target with Hosts: "127.0.0.1, 192.168.1.100"
2. Create and run a task with this target

### T4: Scan the Whole Network
1. Create a new target with Hosts: "192.168.1.0/24" (CIDR notation)
2. Create and run a scan with this target

### T5: Evaluate Results and Form Prioritized Remediation Plan
1. Click **Results** → select a completed scan
2. Review vulnerabilities by severity (Critical/High/Medium/Low)
3. Click individual vulnerabilities to see CVSS scores, affected hosts, and descriptions
4. Click **Vulnerabilities** for a consolidated view across all scans
5. Use filters to focus on Critical and High severity issues

### T6: Determine Necessary Remediation Actions
1. Click **Remediation** in the sidebar
2. Review "Unassigned Vulnerabilities"
3. For each critical vulnerability, click **Create Task**
4. Set priority, assign to team member, set due date, add remediation notes
5. Track progress in the "Remediation Tasks" table
6. Update status as work progresses (Pending → In Progress → Completed)

----

This redesign addresses usability issues identified in the original OpenVAS. 

### Usability Improvements

| Issue in Original OpenVAS | Solution in Redesign |
|---------------------------|----------------------|
| **Lack of information about default settings** | Quick Start Guide on dashboard explains default configurations; tooltips provide context for all settings |
| **Hidden lower severity levels by default** | All severity levels visible by default; clear filter controls with explanations |
| **No explanation of CVSS scores or impacts** | Tooltips explain CVSS scoring; vulnerability details include plain-language impact descriptions |
| **Users unaware of outdated NVT databases** | Dashboard shows last update time; tooltips explain NVT (Network Vulnerability Tests) |
| **No guidance on credentialed vs non-credentialed scans** | Tooltips explain the difference; form labels clarify when credentials are needed |
| **Critical errors not communicated** | Clear error messages and status indicators throughout workflow |
| **False negative scenarios not explained** | Tooltips and result pages explain scan limitations and potential false negatives |
| **Confusing IP address syntax** | Input fields include placeholder examples (e.g., "192.168.1.1, 192.168.1.10-20, 10.0.0.0/24") |
| **Unintuitive task order** | Streamlined workflow: Targets → Tasks → Results → Remediation with guided navigation |
| **Small, hard-to-find UI elements** | Larger buttons, clear icons, generous spacing, modern card-based layouts |
| **Unexplained technical jargon** | 20+ contextual tooltips explaining terms like QoD, NVT, CVSS, CVE, Port Lists, Alive Tests |

### Design Improvements

- **Modern Dark Theme**: Professional aesthetic reduces eye strain
- **Card-Based Layouts**: Information grouped in clear, scannable sections
- **Color-Coded Severity**: Consistent color scheme (Red=Critical, Orange=High, Yellow=Medium, Blue=Low)
- **Responsive Design**: Works on various screen sizes
- **Consolidated Views**: Single vulnerability database across all scans

### Functional Scope

**Important**: This is a UI/UX prototype for user studies, not a functional vulnerability scanner.

| Feature | Original OpenVAS | This Redesign |
|---------|------------------|---------------|
| Network Scanning | Real vulnerability detection | Simulated (mock data) |
| Scan Duration | Minutes to hours | 3-5 seconds (simulated) |
| Authentication | Real user management | Demo mode (any credentials work) |
| Database | PostgreSQL with CVE data | In-memory state management |
| Results | Actual network vulnerabilities | Generated demonstration data |

**What's Preserved**: Core workflow, OpenVAS terminology, severity classifications, CVSS scoring, scan configuration options, and credential management concepts.

**Use Case**: This implementation is designed for usability testing and user studies to evaluate interface improvements. It should not be used for actual security assessments.

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
PORT=3001 npm run start
```

### Dependencies Won't Install
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
Ensure you're using Node.js 18 or higher:
```bash
node --version
```

### Page Won't Load
1. Check that the server is running
2. Access `http://localhost:3000` (not https)
3. Clear browser cache
4. Check browser console (F12) for errors

All dependencies are automatically installed via `npm install`.

---

**Version**: 1.0.0  
**Purpose**: User study prototype for evaluating OpenVAS interface improvements
