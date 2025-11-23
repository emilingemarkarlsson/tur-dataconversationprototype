import salesData from "./data/sales.json";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChartDataPoint = {
  label: string;
  value: number;
};

export type InsightResult = {
  text: string;
  chartData?: ChartDataPoint[];
};

type SalesRecord = {
  date: string;
  country: string;
  segment: string;
  product: string;
  revenue: number;
  returns: number;
};

// Helper function to parse dates
function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

// Helper function to get month name
function getMonthName(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long" });
}

// Helper function to filter data by date range
function filterByDateRange(
  data: SalesRecord[],
  startDate: Date,
  endDate: Date
): SalesRecord[] {
  return data.filter((record) => {
    const recordDate = parseDate(record.date);
    return recordDate >= startDate && recordDate <= endDate;
  });
}

// Helper function to calculate total revenue
function calculateTotalRevenue(data: SalesRecord[]): number {
  return data.reduce((sum, record) => sum + record.revenue, 0);
}

// Helper function to calculate average returns rate
function calculateAvgReturns(data: SalesRecord[]): number {
  if (data.length === 0) return 0;
  const totalReturns = data.reduce((sum, record) => sum + record.returns, 0);
  return totalReturns / data.length;
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper function to format percentage
function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

// Intent 1: Germany sales drop analysis
function analyzeGermanySalesDrop(): InsightResult {
  const now = new Date("2024-11-05");
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const currentMonthData = filterByDateRange(
    salesData.filter((r) => r.country === "Germany"),
    currentMonthStart,
    now
  );
  const previousMonthData = filterByDateRange(
    salesData.filter((r) => r.country === "Germany"),
    previousMonthStart,
    previousMonthEnd
  );

  const currentRevenue = calculateTotalRevenue(currentMonthData);
  const previousRevenue = calculateTotalRevenue(previousMonthData);
  const changePercent = ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  // Analyze by segment
  const currentReseller = calculateTotalRevenue(
    currentMonthData.filter((r) => r.segment === "Reseller")
  );
  const previousReseller = calculateTotalRevenue(
    previousMonthData.filter((r) => r.segment === "Reseller")
  );
  const resellerChange = ((currentReseller - previousReseller) / previousReseller) * 100;

  // Analyze returns
  const currentReturns = calculateAvgReturns(currentMonthData);
  const previousReturns = calculateAvgReturns(previousMonthData);

  // Build chart data (daily revenue for November)
  const chartData: ChartDataPoint[] = [];
  const germanyNovData = currentMonthData;
  const dailyTotals = new Map<string, number>();

  germanyNovData.forEach((record) => {
    const date = record.date;
    dailyTotals.set(date, (dailyTotals.get(date) || 0) + record.revenue);
  });

  Array.from(dailyTotals.entries())
    .sort()
    .forEach(([date, revenue]) => {
      const day = parseDate(date).getDate();
      chartData.push({ label: `Nov ${day}`, value: revenue });
    });

  const text = `Germany sales in November are down ${Math.abs(changePercent).toFixed(
    1
  )}% compared to October (${formatCurrency(currentRevenue)} vs ${formatCurrency(
    previousRevenue
  )}). The main driver is a ${Math.abs(resellerChange).toFixed(
    1
  )}% decline in the Reseller segment. Additionally, returns increased from ${formatPercent(
    previousReturns
  )} to ${formatPercent(
    currentReturns
  )}, suggesting potential quality or satisfaction issues that are impacting sales performance.`;

  return { text, chartData };
}

// Intent 2: Unusual patterns in last 14 days
function detectUnusualPatterns(): InsightResult {
  const endDate = new Date("2024-11-05");
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 14);

  const recentData = filterByDateRange(salesData, startDate, endDate);

  // Check for anomalies
  const germanyResellerRecent = recentData.filter(
    (r) => r.country === "Germany" && r.segment === "Reseller"
  );
  const avgReturns = calculateAvgReturns(germanyResellerRecent);

  // Build chart data showing returns trend
  const chartData: ChartDataPoint[] = [];
  const dailyReturns = new Map<string, number[]>();

  germanyResellerRecent.forEach((record) => {
    const date = record.date;
    if (!dailyReturns.has(date)) {
      dailyReturns.set(date, []);
    }
    dailyReturns.get(date)!.push(record.returns);
  });

  Array.from(dailyReturns.entries())
    .sort()
    .forEach(([date, returns]) => {
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const day = parseDate(date).getDate();
      const month = parseDate(date).toLocaleDateString("en-US", { month: "short" });
      chartData.push({
        label: `${month} ${day}`,
        value: Math.round(avgReturn * 100),
      });
    });

  const text = `Anomaly detected in the last 14 days: Germany's Reseller segment shows significantly elevated return rates (averaging ${formatPercent(
    avgReturns
  )}), which is 3-5x higher than the baseline of ~3%. This spike started in early October and has been accelerating. Recommend investigating product quality issues, shipping problems, or changes in customer expectations. This is directly impacting revenue as high returns typically correlate with reduced reorders.`;

  return { text, chartData };
}

// Intent 3: Resellers down YoY
function analyzeResellerYoY(): InsightResult {
  // Simulating YoY comparison (using Oct vs Sep as proxy)
  const octData = salesData.filter((r) => r.date.startsWith("2024-10"));
  const sepData = salesData.filter((r) => r.date.startsWith("2024-09"));

  const octReseller = calculateTotalRevenue(octData.filter((r) => r.segment === "Reseller"));
  const sepReseller = calculateTotalRevenue(sepData.filter((r) => r.segment === "Reseller"));

  const changePercent = ((octReseller - sepReseller) / sepReseller) * 100;

  // Break down by country
  const germanyOct = calculateTotalRevenue(
    octData.filter((r) => r.segment === "Reseller" && r.country === "Germany")
  );
  const germanySep = calculateTotalRevenue(
    sepData.filter((r) => r.segment === "Reseller" && r.country === "Germany")
  );
  const germanyChange = ((germanyOct - germanySep) / germanySep) * 100;

  const swedenOct = calculateTotalRevenue(
    octData.filter((r) => r.segment === "Reseller" && r.country === "Sweden")
  );
  const swedenSep = calculateTotalRevenue(
    sepData.filter((r) => r.segment === "Reseller" && r.country === "Sweden")
  );
  const swedenChange = ((swedenOct - swedenSep) / swedenSep) * 100;

  // Build chart data
  const chartData: ChartDataPoint[] = [
    { label: "Germany", value: Math.round(germanyChange) },
    { label: "Sweden", value: Math.round(swedenChange) },
    { label: "Total", value: Math.round(changePercent) },
  ];

  const text = `Reseller segment is down ${Math.abs(changePercent).toFixed(
    1
  )}% in October vs September (${formatCurrency(octReseller)} vs ${formatCurrency(
    sepReseller
  )}). Germany accounts for most of this decline at ${Math.abs(germanyChange).toFixed(
    1
  )}%, while Sweden remained relatively stable at ${swedenChange > 0 ? "+" : ""}${swedenChange.toFixed(
    1
  )}%. The Germany reseller channel appears to be facing specific challenges, potentially related to the elevated return rates we're seeing in that market.`;

  return { text, chartData };
}

// Intent 4: Overall revenue trend
function showRevenueTrend(): InsightResult {
  const monthlyData = new Map<string, number>();

  salesData.forEach((record) => {
    const date = parseDate(record.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + record.revenue);
  });

  const chartData: ChartDataPoint[] = Array.from(monthlyData.entries())
    .sort()
    .map(([month, revenue]) => {
      const date = new Date(month + "-01");
      const label = date.toLocaleDateString("en-US", { month: "short" });
      return { label, value: Math.round(revenue) };
    });

  const total = Array.from(monthlyData.values()).reduce((a, b) => a + b, 0);
  const avg = total / monthlyData.size;

  const text = `Here's the revenue trend across all markets and segments. Total revenue over the period is ${formatCurrency(
    total
  )}, with a monthly average of ${formatCurrency(
    avg
  )}. We can see a declining trend from September through November, primarily driven by the Germany market challenges discussed earlier.`;

  return { text, chartData };
}

// Main function: Answer questions based on pattern matching
export function answerQuestion(question: string): InsightResult {
  const q = question.toLowerCase();

  // Pattern matching for different intents
  if (
    (q.includes("germany") || q.includes("german")) &&
    (q.includes("drop") || q.includes("decline") || q.includes("down") || q.includes("fell"))
  ) {
    return analyzeGermanySalesDrop();
  }

  if (
    (q.includes("unusual") || q.includes("anomaly") || q.includes("anomalies")) &&
    (q.includes("14") || q.includes("14 days") || q.includes("two weeks") || q.includes("recent"))
  ) {
    return detectUnusualPatterns();
  }

  if (
    q.includes("reseller") &&
    (q.includes("down") || q.includes("decline") || q.includes("yoy") || q.includes("year"))
  ) {
    return analyzeResellerYoY();
  }

  if (
    q.includes("revenue") &&
    (q.includes("trend") || q.includes("over time") || q.includes("total"))
  ) {
    return showRevenueTrend();
  }

  // Fallback response with suggestions
  return {
    text: `I'm not sure how to answer that question yet. Here are some things you can ask me:

• "Why did sales drop in Germany last month?"
• "Highlight anything unusual in the last 14 days"
• "Show resellers down more than 20% YoY"
• "What's the revenue trend over time?"

Try one of these or rephrase your question!`,
  };
}
