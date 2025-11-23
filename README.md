# Conversational Analytics Demo

A self-contained conversational analytics demo that showcases the future of data exploration through natural language. This project demonstrates how users can ask questions in plain English and receive intelligent insights with visualizations — all running entirely in the browser.

## 🛠️ Tech Stack

<div align="center">

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="50" height="50" alt="React" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="50" height="50" alt="TypeScript" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="50" height="50" alt="Vite" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="50" height="50" alt="Tailwind CSS" />

</div>

## 🌟 Features

- **Natural Language Queries**: Ask questions in plain English about your sales data
- **Rule-Based Intelligence**: Smart pattern matching engine that detects intents and provides contextual insights
- **Interactive Visualizations**: Automatic chart generation using Recharts for trend analysis
- **100% Frontend**: No backend required — all data processing happens in the browser
- **Modern UI**: Built with React, Tailwind CSS, and shadcn/ui components
- **Dark Theme**: Sleek, professional interface optimized for readability

## 🚀 Live Demo

Visit the live demo: [https://yourusername.github.io/conversational-analytics-demo/](https://yourusername.github.io/conversational-analytics-demo/)

## 📋 Example Questions

Try asking:

- "Why did sales drop in Germany last month?"
- "Highlight anything unusual in the last 14 days"
- "Show resellers down more than 20% YoY"
- "What's the revenue trend over time?"

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Project Structure

```
conversational-analytics-demo/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components (Button, Card, Input)
│   │   ├── Chat.tsx     # Chat message display component
│   │   └── ChartPanel.tsx  # Chart visualization component
│   ├── data/
│   │   └── sales.json   # Sample sales dataset
│   ├── lib/
│   │   └── utils.ts     # Utility functions (cn helper)
│   ├── App.tsx          # Main application component
│   ├── engine.ts        # Conversational engine with rule-based logic
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/conversational-analytics-demo.git
cd conversational-analytics-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔧 Development

### Running Locally

```bash
npm run dev
```

This starts the Vite development server with hot module replacement.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

## 🚢 Deploying to GitHub Pages

### Option 1: Using GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

2. Enable GitHub Pages:
   - Go to your repository Settings → Pages
   - Set Source to "GitHub Actions"

3. Push to main branch:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

The site will automatically deploy to `https://yourusername.github.io/conversational-analytics-demo/`

### Option 2: Manual Deployment

```bash
# Build the project
npm run build

# Deploy to gh-pages branch using gh-pages package
npm install -g gh-pages
gh-pages -d dist
```

Then enable GitHub Pages in repository settings (Source: gh-pages branch).

## 🧠 How It Works

### The Conversational Engine

The core logic is in `src/engine.ts`, which:

1. **Pattern Matching**: Uses regex and keyword detection to identify user intent
2. **Data Filtering**: Applies date ranges, segments, and country filters to the dataset
3. **Aggregation**: Calculates totals, averages, and comparisons
4. **Natural Language Generation**: Creates human-readable explanations
5. **Chart Data**: Formats data for visualization

Example intent detection:
```typescript
if (q.includes("germany") && q.includes("drop")) {
  return analyzeGermanySalesDrop();
}
```

### The Data Model

Sample data in `src/data/sales.json`:
```json
{
  "date": "2024-11-01",
  "country": "Germany",
  "segment": "Reseller",
  "product": "Robotic mower",
  "revenue": 25000,
  "returns": 0.15
}
```

### Extending the Engine

To add new intents:

1. Add pattern matching in `answerQuestion()`
2. Create a new analysis function (e.g., `analyzeNewIntent()`)
3. Filter and aggregate the data
4. Return `InsightResult` with text and optional chartData

## 🎨 Customization

### Changing the Theme

Edit `src/index.css` to modify the color scheme:
```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Change primary color */
  --background: 0 0% 100%;        /* Change background */
}
```

### Adding New Data

Replace `src/data/sales.json` with your own dataset. Keep the same structure or update the TypeScript types in `engine.ts`.

### Styling Components

All components use Tailwind CSS classes. Modify the `className` props to change styling.

## 📝 License

MIT License - feel free to use this project for learning or as a starting point for your own analytics tools.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Inspiration

This project is inspired by the blog post *"Beyond dashboards: why the future of analytics is conversational"* which explores how conversational interfaces can make data more accessible and actionable.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful React components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Recharts](https://recharts.org/) for simple charting
- [Vite](https://vitejs.dev/) for blazing fast development

## 🤖 Integrera med AI Agents

### Alternativ 1: n8n Integration

[n8n](https://n8n.io/) är en workflow automation-plattform som kan kopplas till olika LLM-tjänster.

#### Steg för att integrera:

1. **Sätt upp n8n**
   ```bash
   npx n8n
   ```

2. **Skapa ett workflow med följande noder:**
   - **Webhook Trigger**: Ta emot frågor från frontend
   - **HTTP Request**: Hämta data från din databackend
   - **LLM Node**: Välj mellan:
     - OpenAI (GPT-4, GPT-3.5)
     - Anthropic Claude
     - Groq (ultra-snabb inferens med Llama, Mixtral)
     - Azure OpenAI
     - Google PaLM
   - **Code Node**: Formatera svar och skapa chartData
   - **Respond to Webhook**: Returnera strukturerat svar

3. **Konfigurera LLM-node för Groq (rekommenderat för låg latens)**
   ```javascript
   // I n8n Code node
   const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       model: 'llama-3.1-70b-versatile', // eller mixtral-8x7b-32768
       messages: [
         {
           role: 'system',
           content: 'Du är en dataanalytiker som svarar på frågor om försäljningsdata...'
         },
         {
           role: 'user',
           content: userQuery
         }
       ],
       temperature: 0.7
     })
   });
   ```

4. **Anpassa frontend för att anropa n8n webhook**
   ```typescript
   // I engine.ts
   async function askAgent(query: string): Promise<InsightResult> {
     const response = await fetch('https://your-n8n-instance.com/webhook/analytics', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ 
         query, 
         data: salesData // Skicka kontext om behövs
       })
     });
     return await response.json();
   }
   ```

### Alternativ 2: LangChain + LangGraph (LangSmith)

[LangChain](https://build.langchain.com/) erbjuder en kraftfull plattform för att bygga LLM-agenter med observability.

#### Sätt upp LangChain Agent:

1. **Installera dependencies**
   ```bash
   npm install langchain @langchain/openai @langchain/anthropic @langchain/groq
   ```

2. **Skapa en agent med verktyg**
   ```typescript
   import { ChatGroq } from "@langchain/groq";
   import { DynamicStructuredTool } from "langchain/tools";
   import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
   
   // Definiera verktyg för dataanalys
   const analyzeSalesTool = new DynamicStructuredTool({
     name: "analyze_sales_data",
     description: "Analyserar försäljningsdata baserat på filter och returnerar insights",
     schema: z.object({
       country: z.string().optional(),
       segment: z.string().optional(),
       dateRange: z.string().optional(),
     }),
     func: async ({ country, segment, dateRange }) => {
       // Din befintliga engine-logik här
       const result = await analyzeData(country, segment, dateRange);
       return JSON.stringify(result);
     },
   });
   
   // Skapa agent med Groq (snabbast)
   const llm = new ChatGroq({
     apiKey: process.env.GROQ_API_KEY,
     model: "llama-3.1-70b-versatile",
     temperature: 0.7,
   });
   
   const agent = await createOpenAIFunctionsAgent({
     llm,
     tools: [analyzeSalesTool],
     prompt: systemPrompt,
   });
   
   const agentExecutor = new AgentExecutor({
     agent,
     tools: [analyzeSalesTool],
   });
   
   // Använd agenten
   const response = await agentExecutor.invoke({
     input: "Varför sjönk försäljningen i Tyskland?"
   });
   ```

3. **Integrera med LangSmith för monitoring**
   ```bash
   export LANGCHAIN_TRACING_V2=true
   export LANGCHAIN_API_KEY=your_langsmith_key
   export LANGCHAIN_PROJECT=conversational-analytics
   ```

4. **Bygg agent med LangGraph för mer kontroll**
   ```typescript
   import { StateGraph } from "@langchain/langgraph";
   
   // Definiera agent state
   interface AgentState {
     query: string;
     data: any[];
     insights: string;
     chartData?: any;
   }
   
   // Skapa graph med noder
   const graph = new StateGraph<AgentState>({
     channels: {
       query: null,
       data: null,
       insights: null,
       chartData: null,
     }
   })
     .addNode("fetch_data", fetchDataNode)
     .addNode("analyze", analyzeNode)
     .addNode("generate_chart", chartNode)
     .addEdge("fetch_data", "analyze")
     .addEdge("analyze", "generate_chart");
   
   const app = graph.compile();
   ```

### Rekommenderade LLM-modeller via Groq

[Groq](https://groq.com/) erbjuder extremt snabb inferens (perfekt för konversations-UI):

- **Llama 3.1 70B**: Bäst balans mellan prestanda och hastighet
- **Llama 3.1 8B**: Snabbast, bra för enklare queries
- **Mixtral 8x7B**: Utmärkt för reasoning och komplexa analyser
- **Gemma 2 9B**: Google-modell, bra för kodgenerering

#### Groq API Exempel:
```typescript
const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function queryGroq(question: string, context: string) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Du är en expert på dataanalys. Analysera försäljningsdata och ge konkreta insights.
                    
                    Tillgänglig data: ${context}
                    
                    Svara alltid med:
                    1. En tydlig förklaring
                    2. Relevanta siffror
                    3. JSON för chart om relevant: { type: "line|bar", data: [...] }`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });
  
  return await response.json();
}
```

### Jämförelse av ansatser

| Metod | Fördelar | Nackdelar | Bäst för |
|-------|----------|-----------|----------|
| **n8n** | Visuell workflow, många integrationer, self-hosted | Kräver separat server | Snabb prototyping, no-code teams |
| **LangChain** | Kraftfull, mycket kontroll, bra verktygsekosystem | Mer kod, steeper learning curve | Produktionssystem, komplexa agents |
| **Groq API direkt** | Extremt snabb latens, enkel integration | Färre features än full agent framework | Real-time conversational UI |

---

Built with ❤️ using React, TypeScript, and modern web technologies.
