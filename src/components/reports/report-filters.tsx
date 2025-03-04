"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

type Filters = {
  department: string
  period: string
}

export function ReportFilters({
  filters,
  setFilters,
}: {
  filters: Filters
  setFilters: (filters: Filters) => void
}) {
  const handleDepartmentChange = (value: string) => {
    setFilters({ ...filters, department: value })
  }

  const handlePeriodChange = (value: string) => {
    setFilters({ ...filters, period: value })
  }

  const handleReset = () => {
    setFilters({ department: "all", period: "q1-2025" })
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="grid gap-2 md:w-1/3">
            <Label htmlFor="department">Department</Label>
            <Select value={filters.department} onValueChange={handleDepartmentChange}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 md:w-1/3">
            <Label htmlFor="period">Time Period</Label>
            <Select value={filters.period} onValueChange={handlePeriodChange}>
              <SelectTrigger id="period">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q1-2025">Q1 2025</SelectItem>
                <SelectItem value="q2-2025">Q2 2025</SelectItem>
                <SelectItem value="q3-2025">Q3 2025</SelectItem>
                <SelectItem value="q4-2025">Q4 2025</SelectItem>
                <SelectItem value="annual-2025">Annual 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={handleReset} className="md:ml-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

