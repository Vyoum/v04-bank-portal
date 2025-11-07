import { TrendingUp, Send, Plus, Eye } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const spendingData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 2000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
]

const categoryData = [
  { name: "Shopping", value: 35, color: "#4B9FED" },
  { name: "Food", value: 25, color: "#2D9368" },
  { name: "Transport", value: 20, color: "#F4A460" },
  { name: "Other", value: 20, color: "#8B7BA8" },
]

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <p className="text-sm opacity-90 mb-2">Total Balance</p>
          <h3 className="text-3xl font-bold mb-4">$24,586.50</h3>
          <div className="flex items-center justify-between">
            <span className="text-xs opacity-75">**** **** **** 2891</span>
            <TrendingUp className="w-4 h-4" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
          <p className="text-sm opacity-90 mb-2">Monthly Income</p>
          <h3 className="text-3xl font-bold mb-4">$8,500.00</h3>
          <div className="text-xs opacity-75">+12% from last month</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground">
          <p className="text-sm opacity-90 mb-2">Monthly Spending</p>
          <h3 className="text-3xl font-bold mb-4">$3,240.82</h3>
          <div className="text-xs opacity-75">-8% from last month</div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Spending by Category */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-foreground">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {[
              { name: "Netflix", amount: "-$12.99", time: "Today" },
              { name: "Salary Deposit", amount: "+$3,500.00", time: "Yesterday" },
              { name: "Coffee Shop", amount: "-$5.40", time: "2 days ago" },
            ].map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{tx.name}</p>
                  <p className="text-xs text-muted-foreground">{tx.time}</p>
                </div>
                <p className={`font-semibold ${tx.amount.startsWith("+") ? "text-accent" : "text-foreground"}`}>
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-start gap-2">
              <Send className="w-4 h-4" />
              Send Money
            </Button>
            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 justify-start gap-2">
              <Plus className="w-4 h-4" />
              Add Card
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Eye className="w-4 h-4" />
              View Reports
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
