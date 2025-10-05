"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewScanForm() {
  const router = useRouter();
  const { addScan, startScan } = useStore();

  const [scanType, setScanType] = useState("localhost");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [hosts, setHosts] = useState("");
  const [excludeHosts, setExcludeHosts] = useState("");
  const [portList, setPortList] = useState("all");
  const [scanConfig, setScanConfig] = useState("full");
  const [scanner, setScanner] = useState("default");
  const [aliveTest, setAliveTest] = useState("default");
  const [schedule, setSchedule] = useState("once");
  const [addToAssets, setAddToAssets] = useState(true);
  const [applyOverrides, setApplyOverrides] = useState(true);
  const [minQoD, setMinQoD] = useState("70");
  const [maxNVTsPerHost, setMaxNVTsPerHost] = useState("4");
  const [maxConcurrentHosts, setMaxConcurrentHosts] = useState("20");
  const [autoDeleteReports, setAutoDeleteReports] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targets: string[] = [];
    if (scanType === "localhost") {
      targets = ["127.0.0.1"];
    } else if (scanType === "multiple") {
      targets = hosts
        .split(/[\n,]/)
        .map((h) => h.trim())
        .filter(Boolean);
    } else if (scanType === "network") {
      targets = [hosts];
    }

    const excludeList = excludeHosts
      .split(/[\n,]/)
      .map((h) => h.trim())
      .filter(Boolean);

    const scanId = addScan({
      name: name || "Unnamed Scan",
      comment,
      targets,
      excludeHosts: excludeList,
      portList,
      scanConfig,
      scanner,
      status: "New",
      schedule,
      addToAssets,
      applyOverrides,
      minQoD: Number.parseInt(minQoD),
      maxNVTsPerHost: Number.parseInt(maxNVTsPerHost),
      maxConcurrentHosts: Number.parseInt(maxConcurrentHosts),
      aliveTest,
    });

    // Start the scan immediately
    startScan(scanId);

    router.push("/scans");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/scans">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Scan</h2>
          <p className="text-muted-foreground mt-1">
            Configure and launch a vulnerability scan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide a name and description for your scan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Scan Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Localhost Full Scan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Optional description of this scan"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Scan Type */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Type</CardTitle>
            <CardDescription>Choose what you want to scan</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={scanType} onValueChange={setScanType}>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="localhost" id="localhost" />
                <Label htmlFor="localhost" className="flex-1 cursor-pointer">
                  <div className="font-medium">Localhost</div>
                  <div className="text-sm text-muted-foreground">
                    Scan the local machine (127.0.0.1)
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple" className="flex-1 cursor-pointer">
                  <div className="font-medium">Multiple Hosts</div>
                  <div className="text-sm text-muted-foreground">
                    Scan specific IP addresses or hostnames
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="network" id="network" />
                <Label htmlFor="network" className="flex-1 cursor-pointer">
                  <div className="font-medium">Network Range</div>
                  <div className="text-sm text-muted-foreground">
                    Scan an entire network (CIDR notation)
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Target Configuration</CardTitle>
            <CardDescription>Specify the targets to scan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanType === "localhost" && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Target: 127.0.0.1</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The scan will target your local machine
                </p>
              </div>
            )}
            {scanType === "multiple" && (
              <div className="space-y-2">
                <Label htmlFor="hosts">Host Addresses *</Label>
                <Textarea
                  id="hosts"
                  placeholder="Enter IP addresses or hostnames (one per line or comma-separated)&#10;Example:&#10;192.168.1.100&#10;192.168.1.101&#10;127.0.0.1"
                  rows={5}
                  value={hosts}
                  onChange={(e) => setHosts(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter multiple hosts separated by commas or new lines
                </p>
              </div>
            )}
            {scanType === "network" && (
              <div className="space-y-2">
                <Label htmlFor="network">Network Range *</Label>
                <Input
                  id="network"
                  placeholder="e.g., 192.168.1.0/24"
                  value={hosts}
                  onChange={(e) => setHosts(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Use CIDR notation to specify the network range
                </p>
              </div>
            )}

            {scanType !== "localhost" && (
              <div className="space-y-2">
                <Label htmlFor="exclude">Exclude Hosts</Label>
                <Textarea
                  id="exclude"
                  placeholder="Enter hosts to exclude (one per line or comma-separated)"
                  rows={3}
                  value={excludeHosts}
                  onChange={(e) => setExcludeHosts(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="alive">Alive Test</Label>
              <Select value={aliveTest} onValueChange={setAliveTest}>
                <SelectTrigger id="alive">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Scan Config Default</SelectItem>
                  <SelectItem value="icmp">ICMP Ping</SelectItem>
                  <SelectItem value="tcp">TCP-ACK Service Ping</SelectItem>
                  <SelectItem value="arp">ARP Ping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scan Configuration</CardTitle>
            <CardDescription>
              Configure scan parameters and performance settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="scanner">Scanner</Label>
                  <Select value={scanner} onValueChange={setScanner}>
                    <SelectTrigger id="scanner">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">OpenVAS Default</SelectItem>
                      <SelectItem value="fast">Fast Scanner</SelectItem>
                      <SelectItem value="deep">Deep Scanner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="config">Scan Config</Label>
                  <Select value={scanConfig} onValueChange={setScanConfig}>
                    <SelectTrigger id="config">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full and Fast</SelectItem>
                      <SelectItem value="deep">Full and Deep</SelectItem>
                      <SelectItem value="ultimate">
                        Full and Very Deep
                      </SelectItem>
                      <SelectItem value="discovery">Discovery</SelectItem>
                      <SelectItem value="system">System Discovery</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Full and Fast is recommended for discovering the most
                    vulnerabilities
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ports">Port List</Label>
                  <Select value={portList} onValueChange={setPortList}>
                    <SelectTrigger id="ports">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All IANA assigned TCP</SelectItem>
                      <SelectItem value="common">Common Ports</SelectItem>
                      <SelectItem value="all-tcp-udp">
                        All TCP and UDP
                      </SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="maxnvts">
                    Maximum concurrently executed NVTs per host
                  </Label>
                  <Input
                    id="maxnvts"
                    type="number"
                    min="1"
                    max="20"
                    value={maxNVTsPerHost}
                    onChange={(e) => setMaxNVTsPerHost(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Higher values increase scan speed but use more resources
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxhosts">
                    Maximum concurrently scanned hosts
                  </Label>
                  <Input
                    id="maxhosts"
                    type="number"
                    min="1"
                    max="50"
                    value={maxConcurrentHosts}
                    onChange={(e) => setMaxConcurrentHosts(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of hosts to scan simultaneously
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Select value={schedule} onValueChange={setSchedule}>
                    <SelectTrigger id="schedule">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="assets"
                    checked={addToAssets}
                    onCheckedChange={(checked) =>
                      setAddToAssets(checked as boolean)
                    }
                  />
                  <Label htmlFor="assets" className="cursor-pointer">
                    Add results to Assets
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="overrides"
                    checked={applyOverrides}
                    onCheckedChange={(checked) =>
                      setApplyOverrides(checked as boolean)
                    }
                  />
                  <Label htmlFor="overrides" className="cursor-pointer">
                    Apply Overrides
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minqod">Min QoD (Quality of Detection)</Label>
                  <Input
                    id="minqod"
                    type="number"
                    min="0"
                    max="100"
                    value={minQoD}
                    onChange={(e) => setMinQoD(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum quality threshold (0-100)
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autodelete"
                    checked={autoDeleteReports}
                    onCheckedChange={(checked) =>
                      setAutoDeleteReports(checked as boolean)
                    }
                  />
                  <Label htmlFor="autodelete" className="cursor-pointer">
                    Auto delete old reports
                  </Label>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/scans">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
            <Play className="h-4 w-4 mr-2" />
            Create and Start Scan
          </Button>
        </div>
      </form>
    </div>
  );
}
