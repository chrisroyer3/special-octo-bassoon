# Chart Genie Prototype

An interactive prototype demonstrating the core functionality of Chart Genie - an AI-powered sports data visualization tool for content editors.

## What This Prototype Demonstrates

### ✅ Core Features Implemented

1. **AI Content Analysis**
   - Analyzes article title and body content
   - Extracts players, teams, and stats mentioned
   - Simulates AI processing with realistic delay

2. **Smart Chart Suggestions**
   - Generates 3 relevant chart suggestions based on article content
   - Shows chart type, rationale, and preview information
   - Allows one-click insertion or customization

3. **Refresh Suggestions**
   - "Get different suggestions" button to explore alternatives
   - Simulates re-analysis of content

4. **Conversational Chart Refinement**
   - Natural language chat interface for editing charts
   - Live chart preview that updates in real-time
   - Quick suggestion pills for common commands

5. **Live Chart Rendering**
   - Real-time chart updates using Chart.js
   - Multiple chart types: bar, grouped bar, line, radar
   - Responsive and interactive visualizations

6. **Supported Commands**
   - "Add completion percentage" - Adds new metric to chart
   - "Add passer rating" - Adds passer rating metric
   - "Compare to his season average" - Adds season avg comparison
   - "Change to a line chart" - Converts chart type
   - "Change to a radar chart" - Converts to radar chart
   - "Make it Chiefs colors" - Applies team colors (red/gold)
   - "Remove interceptions" - Removes metric from chart

## How to Use the Prototype

### Step 1: Open the Prototype

1. Navigate to the prototype folder
2. Open `index.html` in a web browser (Chrome, Firefox, Safari, or Edge)
3. No build process or server required - it's a standalone HTML file

### Step 2: Analyze Article Content

1. Review the pre-filled article about Patrick Mahomes (or edit it)
2. Click **"Analyze & Suggest Charts"**
3. Wait 2 seconds for AI analysis simulation

### Step 3: Review Suggestions

Three chart suggestions will appear:

- **Suggestion 1**: Mahomes Week 10 passing stats (bar chart)
- **Suggestion 2**: Mahomes vs Tagovailoa comparison (grouped bar)
- **Suggestion 3**: Mahomes performance trend over 5 games (line chart)

Each suggestion shows:
- Chart title and type
- Rationale explaining why it's relevant
- "Insert Chart" (direct insertion) or "Customize First" buttons

### Step 4: Customize a Chart

1. Click **"Customize First"** on any suggestion
2. See live chart preview at top
3. Use the chat interface to refine:

**Try these commands:**
```
Add completion percentage
Compare to his season average
Change to a radar chart
Make it Chiefs colors
Remove interceptions
```

4. Watch the chart update in real-time after each command

### Step 5: Insert Chart

1. When satisfied with the chart, click **"Insert This Chart"**
2. Prototype will show what configuration would be saved
3. In real implementation, this would create a WordPress Gutenberg block

## Technical Architecture

### Frontend
- **HTML/CSS/JavaScript** - Standalone web app (no build tools)
- **Chart.js** - Chart rendering library (via CDN)
- **Responsive design** - Works on desktop and tablet

### Data Layer
- **Mock Sportradar data** - Pre-loaded player stats (Mahomes, Tagovailoa, Kelce)
- **Simulated AI analysis** - Uses setTimeout to simulate API calls
- **No external API calls** - All data is self-contained

### State Management
- Global JavaScript objects track current chart configuration
- Chat history persists during refinement session
- Chart.js instance managed for updates/redraws

## Mock Data Included

### Players
- **Patrick Mahomes**: Week 10 stats, season averages, last 5 games trend
- **Tua Tagovailoa**: Week 10 stats
- **Travis Kelce**: Week 10 receiving stats

### Metrics Available
- Passing yards, touchdowns, interceptions
- Completion percentage, passer rating
- Completions, attempts, longest pass
- Receptions, targets, receiving yards (for Kelce)

## What's NOT Included (MVP Scope)

This prototype focuses on core UX validation and does NOT include:

- ❌ Real AI/LLM integration (OpenAI, Claude API)
- ❌ Real Sportradar API integration
- ❌ WordPress/Gutenberg block integration
- ❌ Server-side API endpoints
- ❌ Authentication/security
- ❌ Database storage
- ❌ Advanced error handling
- ❌ Undo/version history
- ❌ Template library
- ❌ Auto-update functionality
- ❌ Embed code generation
- ❌ Chart download (PNG/SVG export)

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## File Structure

```
Chart Genie Prototype/
├── index.html          # Main HTML file with UI
├── app.js              # JavaScript logic and data
└── README.md           # This file
```

## Next Steps for Production

To move from prototype to production:

1. **Backend API Development**
   - WordPress REST API endpoints
   - OpenAI/Claude API integration for content analysis
   - Sportradar API integration with caching

2. **Gutenberg Block Development**
   - Convert prototype to WordPress block using @wordpress/blocks
   - Implement block save/edit components
   - Add block attributes and serialization

3. **Enhanced AI**
   - Fine-tune prompts for better chart suggestions
   - Improve natural language command parsing
   - Add contextual awareness and smart defaults

4. **Production Features**
   - Error handling and rate limiting
   - Undo/redo functionality
   - Template library
   - Chart export (PNG, SVG, embed codes)
   - Auto-update when Sportradar data changes

5. **Testing & QA**
   - Unit tests for chart logic
   - Integration tests for WordPress
   - Editor user testing
   - Performance optimization

## Feedback & Iteration

To test the prototype with editors:

1. **Observation**: Watch editors use the prototype without guidance
2. **Key questions**:
   - Are the 3 suggestions relevant and useful?
   - Is the conversational editing intuitive?
   - What commands do they try that don't work?
   - How long does it take to create a chart vs. manual process?
3. **Metrics to track**:
   - Time from "Analyze" click to "Insert Chart" (target: <3 min)
   - Number of refinement commands used (target: 2-3 avg)
   - Success rate of commands (target: >80%)

## Questions or Issues?

This is a functional prototype for demonstration and user testing purposes. It showcases the core Chart Genie workflow and validates the UX approach before building the full production system.

---

**Built:** November 2025
**Version:** 1.0 (Prototype)
**Purpose:** UX Validation & Stakeholder Demo
