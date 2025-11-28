import { Plus, Trash2, Lock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BankCard {
  id: string
  name: string
  type: "credit" | "debit"
  lastDigits: string
  expiry: string
  status: "active" | "inactive"
  balance?: number
}

const cards: BankCard[] = [
  {
    id: "1",
    name: "Primary Card",
    type: "debit",
    lastDigits: "2891",
    expiry: "12/25",
    status: "active",
    balance: 24586.5,
  },
  { id: "2", name: "Credit Card", type: "credit", lastDigits: "5042", expiry: "08/26", status: "active" },
  { id: "3", name: "Backup Card", type: "debit", lastDigits: "3156", expiry: "03/24", status: "inactive" },
]

export default function Cards() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">My Cards</h2>
          <p className="text-muted-foreground">Manage your debit and credit cards</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="w-4 h-4" />
          Add Card
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`relative h-48 rounded-xl p-6 text-white overflow-hidden transition-transform hover:scale-105 ${
              card.status === "active"
                ? "bg-gradient-to-br from-primary to-primary/80"
                : "bg-gradient-to-br from-muted to-muted/80"
            }`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs opacity-75">Card Name</p>
                  <p className="text-lg font-semibold">{card.name}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    card.status === "active" ? "bg-white/20" : "bg-white/30"
                  }`}
                >
                  {card.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              <div>
                <p className="text-sm opacity-75 mb-2">Card Number</p>
                <p className="text-xl tracking-wider font-mono">•••• •••• •••• {card.lastDigits}</p>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs opacity-75">Expires</p>
                  <p className="text-sm font-semibold">{card.expiry}</p>
                </div>
                <div className="text-xs font-semibold">{card.type.toUpperCase()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Card Settings</h3>
        <div className="space-y-3">
          {cards
            .filter((c) => c.status === "active")
            .map((card) => (
              <div key={card.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{card.name}</p>
                    <p className="text-xs text-muted-foreground">•••• {card.lastDigits}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
}
