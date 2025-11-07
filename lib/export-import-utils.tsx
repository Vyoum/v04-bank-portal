export interface ExportOptions {
  format: "csv" | "json" | "ofx"
  includeCards: boolean
  includeAccounts: boolean
  includeTransactions: boolean
  dateRange?: {
    startDate: string
    endDate: string
  }
}

export function exportTransactionsAsCSV(transactions: any[], filename?: string) {
  const headers = ["ID", "Date", "Description", "Category", "Amount", "Type", "Status", "Tags"]

  const rows = transactions.map((tx) => [
    tx.id,
    tx.date,
    tx.name,
    tx.category,
    tx.amount,
    tx.type,
    tx.status,
    tx.customTags?.join("; ") || "",
  ])

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  downloadFile(csv, filename || `transactions-${new Date().toISOString().split("T")[0]}.csv`)
}

export function exportTransactionsAsJSON(transactions: any[], filename?: string) {
  const json = JSON.stringify(transactions, null, 2)
  downloadFile(json, filename || `transactions-${new Date().toISOString().split("T")[0]}.json`, "application/json")
}

export function exportTransactionsAsOFX(transactions: any[], accountNumber?: string) {
  // Simplified OFX format
  let ofx = `OFXHEADER:100
OFXVERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILESPEC:OK
NEWFILESPEC:OK
<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<DTSERVER>${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}
<LANGUAGE>ENG
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<STMTRS>
<CURDEF>USD
<BANKTRANLIST>
`

  transactions.forEach((tx) => {
    ofx += `<STMTTRN>
<TRNTYPE>${tx.type === "credit" ? "CREDIT" : "DEBIT"}
<DTPOSTED>${tx.date.replace(/-/g, "")}
<TRNAMT>${tx.type === "credit" ? tx.amount : -tx.amount}
<FITID>${tx.id}
<NAME>${tx.name.substring(0, 32)}
<MEMO>${tx.category}
</STMTTRN>
`
  })

  ofx += `</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`

  downloadFile(ofx, `transactions-${new Date().toISOString().split("T")[0]}.ofx`, "application/x-ofx")
}

export function importTransactionsFromCSV(csvContent: string) {
  const lines = csvContent.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.replace(/"/g, ""))

  const transactions = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.replace(/"/g, ""))
    return {
      id: values[0],
      date: values[1],
      name: values[2],
      category: values[3],
      amount: Number.parseFloat(values[4]),
      type: values[5] as "debit" | "credit",
      status: values[6] as "completed" | "pending",
      customTags: values[7] ? values[7].split("; ") : [],
    }
  })

  return transactions
}

function downloadFile(content: string, filename: string, mimeType = "text/csv") {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
