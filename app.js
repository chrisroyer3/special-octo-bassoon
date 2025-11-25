// Chart Genie Prototype - JavaScript

// Global state
let currentChart = null;
let currentChartInstance = null;
let chatHistory = [];
let articleAnalysis = null;

// Mock Sportradar data
const MOCK_PLAYER_DATA = {
    'Patrick Mahomes': {
        week10: {
            passing_yards: 372,
            touchdowns: 3,
            interceptions: 1,
            completions: 26,
            attempts: 38,
            completion_pct: 68.4,
            passer_rating: 104.2,
            longest_pass: 48
        },
        season_avg: {
            passing_yards: 284,
            touchdowns: 2.1,
            interceptions: 0.8,
            completion_pct: 66.2,
            passer_rating: 98.7
        },
        last5games: [
            { week: 6, passing_yards: 262, touchdowns: 2, interceptions: 1 },
            { week: 7, passing_yards: 291, touchdowns: 3, interceptions: 0 },
            { week: 8, passing_yards: 225, touchdowns: 1, interceptions: 2 },
            { week: 9, passing_yards: 318, touchdowns: 2, interceptions: 1 },
            { week: 10, passing_yards: 372, touchdowns: 3, interceptions: 1 }
        ]
    },
    'Tua Tagovailoa': {
        week10: {
            passing_yards: 285,
            touchdowns: 2,
            interceptions: 1,
            completions: 23,
            attempts: 35,
            completion_pct: 65.7,
            passer_rating: 89.3
        }
    },
    'Travis Kelce': {
        week10: {
            receptions: 8,
            targets: 11,
            receiving_yards: 95,
            touchdowns: 2,
            yards_per_catch: 11.9
        }
    }
};

// Chart configurations for suggestions
const CHART_SUGGESTIONS = [
    {
        id: 1,
        title: 'Patrick Mahomes Passing Stats - Week 10 vs. Dolphins',
        type: 'bar',
        rationale: 'Highlights the 3 TD performance you mentioned in paragraph 1',
        metrics: ['passing_yards', 'touchdowns', 'interceptions'],
        player: 'Patrick Mahomes',
        timeframe: 'week10'
    },
    {
        id: 2,
        title: 'Mahomes vs. Tagovailoa Head-to-Head Comparison',
        type: 'grouped-bar',
        rationale: 'Both QBs mentioned - shows the performance contrast',
        metrics: ['passing_yards', 'touchdowns', 'passer_rating'],
        players: ['Patrick Mahomes', 'Tua Tagovailoa'],
        timeframe: 'week10'
    },
    {
        id: 3,
        title: 'Mahomes Performance Trend - Last 5 Games',
        type: 'line',
        rationale: 'Shows Week 10 as peak performance in recent stretch',
        metrics: ['passing_yards', 'touchdowns'],
        player: 'Patrick Mahomes',
        timeframe: 'last5games'
    }
];

// Analyze article and show suggestions
async function analyzeArticle() {
    // Hide initial state
    document.getElementById('initialState').classList.add('hidden');

    // Show loading state
    document.getElementById('suggestionsView').classList.remove('active');
    document.getElementById('refinementView').classList.remove('active');
    document.getElementById('loadingState').classList.add('active');

    // Simulate AI analysis (2 second delay)
    await sleep(2000);

    // Mock analysis results
    articleAnalysis = {
        players: ['Patrick Mahomes', 'Tua Tagovailoa', 'Travis Kelce'],
        teams: ['Kansas City Chiefs', 'Miami Dolphins'],
        stats: ['passing yards', 'touchdowns', 'completion percentage'],
        topics: ['QB performance', 'red zone efficiency', 'MVP case']
    };

    // Generate suggestion cards
    generateSuggestionCards();

    // Show suggestions
    document.getElementById('loadingState').classList.remove('active');
    document.getElementById('suggestionsView').classList.add('active');
}

// Generate suggestion cards
function generateSuggestionCards() {
    const container = document.getElementById('suggestionCards');
    container.innerHTML = '';

    CHART_SUGGESTIONS.forEach(suggestion => {
        const card = document.createElement('div');
        card.className = 'suggestion-card';

        const chartTypeLabel = {
            'bar': 'Bar chart',
            'grouped-bar': 'Grouped bar chart',
            'line': 'Line chart',
            'radar': 'Radar chart'
        }[suggestion.type];

        // Generate data preview showing metric categories only
        const dataPreview = suggestion.metrics.map(metric =>
            formatMetricName(metric)
        ).join(', ');

        card.innerHTML = `
            <div class="suggestion-title">${suggestion.title}</div>
            <div class="suggestion-type">${chartTypeLabel}</div>
            <div class="suggestion-rationale">${dataPreview}</div>
            <div class="suggestion-actions">
                <button class="btn btn-primary btn-small" onclick="generateChartDirectly(${suggestion.id})">
                    Generate
                </button>
                <button class="btn btn-secondary btn-small" onclick="customizeChart(${suggestion.id})">
                    Edit Prompt
                </button>
                <button class="btn btn-secondary btn-small" onclick="generateChartInNewBlockFromSuggestion(${suggestion.id})">
                    Generate in New Block
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Refresh suggestions (simulate getting different suggestions)
async function refreshSuggestions() {
    document.getElementById('suggestionsView').classList.remove('active');
    document.getElementById('loadingState').classList.add('active');

    await sleep(1500);

    // In a real implementation, this would call AI again with a "diversity" parameter
    // For now, just regenerate the same suggestions
    generateSuggestionCards();

    document.getElementById('loadingState').classList.remove('active');
    document.getElementById('suggestionsView').classList.add('active');
}

// Generate chart directly without customization
async function generateChartDirectly(suggestionId) {
    const suggestion = CHART_SUGGESTIONS.find(s => s.id === suggestionId);

    // Set current chart configuration
    currentChart = {
        ...suggestion,
        config: {
            title: suggestion.title,
            type: suggestion.type,
            metrics: [...suggestion.metrics],
            player: suggestion.player,
            players: suggestion.players,
            timeframe: suggestion.timeframe,
            colors: 'default'
        }
    };

    // Reset chat history
    chatHistory = [];
    const chatMessagesEl = document.getElementById('chatMessages');
    chatMessagesEl.innerHTML = '';
    chatMessagesEl.classList.remove('active');

    // Hide suggestions, show refinement
    document.getElementById('suggestionsView').classList.remove('active');
    document.getElementById('refinementView').classList.add('active');

    // Hide config, show chart preview
    document.getElementById('chartConfigContainer').style.display = 'none';
    document.getElementById('chartPreviewContainer').style.display = 'block';
    document.getElementById('chatContainer').style.display = 'block';

    // Show loading state briefly
    document.getElementById('generateChartBtn').style.display = 'none';
    const insertBtn = document.getElementById('insertChartBtn');
    insertBtn.textContent = 'Generating...';
    insertBtn.style.display = 'inline-block';
    insertBtn.disabled = true;

    // Simulate API call delay (1 second)
    await sleep(1000);

    // Render the chart
    renderChart();

    // Update button state
    insertBtn.textContent = 'Insert';
    insertBtn.disabled = false;

    // Hide "Generate in New Block" button after direct generation
    document.getElementById('generateNewBlockBtn').style.display = 'none';
}

// Customize chart (open refinement view)
function customizeChart(suggestionId) {
    const suggestion = CHART_SUGGESTIONS.find(s => s.id === suggestionId);

    // Set current chart configuration
    currentChart = {
        ...suggestion,
        config: {
            title: suggestion.title,
            type: suggestion.type,
            metrics: [...suggestion.metrics],
            player: suggestion.player,
            players: suggestion.players,
            timeframe: suggestion.timeframe,
            colors: 'default'
        }
    };

    // Reset chat history
    chatHistory = [];
    const chatMessagesEl = document.getElementById('chatMessages');
    chatMessagesEl.innerHTML = '';
    chatMessagesEl.classList.remove('active');

    // Hide suggestions, show refinement
    document.getElementById('suggestionsView').classList.remove('active');
    document.getElementById('refinementView').classList.add('active');

    // Update configuration display
    updateConfigDisplay();

    // Reset button states and views
    document.getElementById('generateChartBtn').style.display = 'inline-block';
    document.getElementById('insertChartBtn').style.display = 'none';
    document.getElementById('generateNewBlockBtn').style.display = 'inline-block';
    document.getElementById('chartConfigContainer').style.display = 'block';
    document.getElementById('chartPreviewContainer').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'none';
}

// Update configuration display
function updateConfigDisplay() {
    const config = currentChart.config;

    // Build timeframe text
    const timeframeNames = {
        'week10': 'Week 10, 2025',
        'last5games': 'Last 5 Games',
        'season_avg': 'Season Average'
    };
    let timeframeText = timeframeNames[config.timeframe] || config.timeframe;
    if (config.comparison === 'season_avg') {
        timeframeText += ' vs Season Average';
    }

    // Get chart type name
    const chartTypeNames = {
        'bar': 'bar chart',
        'grouped-bar': 'grouped bar chart',
        'line': 'line chart',
        'radar': 'radar chart'
    };
    const chartTypeName = chartTypeNames[config.type] || config.type;

    // Build detailed API prompt
    let apiPrompt = `Create a professional sports data visualization ${chartTypeName} titled "${config.title}". `;

    // Add player/comparison details
    if (config.players) {
        apiPrompt += `Compare the performance of ${config.players.join(' and ')} `;
    } else {
        apiPrompt += `Visualize ${config.player}'s performance `;
    }

    // Add timeframe context
    apiPrompt += `for ${timeframeText}. `;

    // Add metrics with detail
    const metricsText = config.metrics.map(m => formatMetricName(m).toLowerCase()).join(', ');
    apiPrompt += `Display the following statistics: ${metricsText}. `;

    // Add styling details
    if (config.colors === 'chiefs') {
        apiPrompt += `Style the chart using Kansas City Chiefs team colors (red #E31837 and gold #FFB81C). `;
    } else {
        apiPrompt += `Use a clean, professional color scheme with high contrast for readability. `;
    }

    // Add chart-specific instructions
    if (config.type === 'line') {
        apiPrompt += `Show trend lines with data points clearly marked. Include grid lines for easy value reading. `;
    } else if (config.type === 'grouped-bar') {
        apiPrompt += `Display bars side-by-side for direct comparison. Include a legend identifying each player. `;
    } else if (config.type === 'radar') {
        apiPrompt += `Display metrics on multiple axes with filled area for visual impact. `;
    } else {
        apiPrompt += `Ensure bars are clearly labeled with values displayed. `;
    }

    // Add formatting requirements
    apiPrompt += `Format with clear axis labels, a descriptive title, and ensure all text is legible. Make it suitable for embedding in a sports article.`;

    // Only show the API prompt that will be sent to OpenAI
    document.getElementById('promptTextarea').value = apiPrompt;
}

// Toggle edit mode
function toggleEditMode() {
    const textarea = document.getElementById('promptTextarea');
    const editBtn = document.getElementById('editPromptBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const saveBtn = document.getElementById('saveEditBtn');
    const generateBtn = document.getElementById('generateChartBtn');
    const generateNewBlockBtn = document.getElementById('generateNewBlockBtn');

    if (textarea.readOnly) {
        // Enable editing
        textarea.readOnly = false;
        textarea.classList.add('editing');
        editBtn.style.display = 'none';
        cancelBtn.style.display = 'inline-block';
        saveBtn.style.display = 'inline-block';
        generateBtn.style.display = 'none';
        // Keep Generate in New Block visible but disabled during editing
        generateNewBlockBtn.style.display = 'inline-block';
        generateNewBlockBtn.disabled = true;

        // Store original value for cancel
        textarea.dataset.original = textarea.value;
    } else {
        // Disable editing (save mode)
        textarea.readOnly = true;
        textarea.classList.remove('editing');
        editBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'none';
        saveBtn.style.display = 'none';
        generateBtn.style.display = 'inline-block';
        generateNewBlockBtn.style.display = 'inline-block';
        generateNewBlockBtn.disabled = false;
    }
}

// Cancel edit
function cancelEdit() {
    const textarea = document.getElementById('promptTextarea');
    const editBtn = document.getElementById('editPromptBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const saveBtn = document.getElementById('saveEditBtn');
    const generateBtn = document.getElementById('generateChartBtn');
    const generateNewBlockBtn = document.getElementById('generateNewBlockBtn');

    // Restore original value
    textarea.value = textarea.dataset.original;

    // Exit edit mode
    textarea.readOnly = true;
    textarea.classList.remove('editing');
    editBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'none';
    saveBtn.style.display = 'none';
    generateBtn.style.display = 'inline-block';
    generateNewBlockBtn.disabled = false;
}

// Save edit
function saveEdit() {
    const textarea = document.getElementById('promptTextarea');
    const editBtn = document.getElementById('editPromptBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const saveBtn = document.getElementById('saveEditBtn');
    const generateBtn = document.getElementById('generateChartBtn');
    const generateNewBlockBtn = document.getElementById('generateNewBlockBtn');

    // In a real implementation, you might parse the edited text back into config
    // For now, just accept the changes and exit edit mode

    // Exit edit mode
    textarea.readOnly = true;
    textarea.classList.remove('editing');
    editBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'none';
    saveBtn.style.display = 'none';
    generateBtn.style.display = 'inline-block';
    generateNewBlockBtn.disabled = false;

    addChatMessage('assistant', '✓ Configuration updated. Ready to generate chart with your custom prompt.');
}

// Generate chart (make API call)
async function generateChart() {
    const btn = document.getElementById('generateChartBtn');
    const originalText = btn.textContent;

    // Show loading state
    btn.textContent = 'Generating...';
    btn.disabled = true;

    // Simulate API call delay (2 seconds)
    await sleep(2000);

    // Hide config, show chart preview and chat
    document.getElementById('chartConfigContainer').style.display = 'none';
    document.getElementById('chartPreviewContainer').style.display = 'block';
    document.getElementById('chatContainer').style.display = 'block';

    // Render the chart
    renderChart();

    // Update buttons - hide Generate and Generate in New Block, show only Insert
    btn.style.display = 'none';
    document.getElementById('insertChartBtn').style.display = 'inline-block';
    document.getElementById('generateNewBlockBtn').style.display = 'none';
    btn.textContent = originalText;
    btn.disabled = false;
}

// Render chart based on current configuration
function renderChart() {
    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');

    // Update title
    document.getElementById('chartTitle').textContent = currentChart.config.title;

    // Destroy existing chart
    if (currentChartInstance) {
        currentChartInstance.destroy();
    }

    // Prepare data based on chart type
    let chartConfig;

    if (currentChart.config.type === 'bar') {
        chartConfig = prepareBarChart();
    } else if (currentChart.config.type === 'grouped-bar') {
        chartConfig = prepareGroupedBarChart();
    } else if (currentChart.config.type === 'line') {
        chartConfig = prepareLineChart();
    } else if (currentChart.config.type === 'radar') {
        chartConfig = prepareRadarChart();
    }

    // Create new chart
    currentChartInstance = new Chart(ctx, chartConfig);
}

// Prepare bar chart data
function prepareBarChart() {
    const player = currentChart.config.player;
    const timeframe = currentChart.config.timeframe;
    const metrics = currentChart.config.metrics;

    const data = MOCK_PLAYER_DATA[player][timeframe];

    const labels = metrics.map(m => formatMetricName(m));
    const values = metrics.map(m => data[m]);

    // Check if we're comparing to season average
    const hasComparison = currentChart.config.comparison === 'season_avg';

    if (hasComparison) {
        const avgData = MOCK_PLAYER_DATA[player].season_avg;
        const avgValues = metrics.map(m => avgData[m] || 0);

        return {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Week 10',
                        data: values,
                        backgroundColor: getChartColors().primary,
                        borderWidth: 0
                    },
                    {
                        label: 'Season Average',
                        data: avgValues,
                        backgroundColor: getChartColors().secondary,
                        borderWidth: 0
                    }
                ]
            },
            options: getChartOptions()
        };
    } else {
        return {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: player,
                    data: values,
                    backgroundColor: getChartColors().primary,
                    borderWidth: 0
                }]
            },
            options: getChartOptions()
        };
    }
}

// Prepare grouped bar chart (multi-player comparison)
function prepareGroupedBarChart() {
    const players = currentChart.config.players;
    const timeframe = currentChart.config.timeframe;
    const metrics = currentChart.config.metrics;

    const labels = metrics.map(m => formatMetricName(m));

    const datasets = players.map((player, index) => {
        const data = MOCK_PLAYER_DATA[player][timeframe];
        const values = metrics.map(m => data[m]);

        const colors = index === 0 ? getChartColors().primary : getChartColors().secondary;

        return {
            label: player.split(' ')[1], // Use last name only
            data: values,
            backgroundColor: colors,
            borderWidth: 0
        };
    });

    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: getChartOptions()
    };
}

// Prepare line chart (trend over time)
function prepareLineChart() {
    const player = currentChart.config.player;
    const metrics = currentChart.config.metrics;

    const gameData = MOCK_PLAYER_DATA[player].last5games;
    const labels = gameData.map(g => `Week ${g.week}`);

    const datasets = metrics.map((metric, index) => {
        const values = gameData.map(g => g[metric]);
        const colors = index === 0 ? getChartColors().primary : getChartColors().accent;

        return {
            label: formatMetricName(metric),
            data: values,
            borderColor: colors,
            backgroundColor: colors + '40', // Add transparency
            tension: 0.3,
            fill: false
        };
    });

    return {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            ...getChartOptions(),
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
}

// Prepare radar chart (multi-dimensional performance)
function prepareRadarChart() {
    const player = currentChart.config.player;
    const timeframe = currentChart.config.timeframe;
    const metrics = currentChart.config.metrics;

    const data = MOCK_PLAYER_DATA[player][timeframe];
    const labels = metrics.map(m => formatMetricName(m));
    const values = metrics.map(m => normalizeMetricValue(m, data[m]));

    return {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: player,
                data: values,
                borderColor: getChartColors().primary,
                backgroundColor: getChartColors().primary + '40',
                borderWidth: 2
            }]
        },
        options: {
            ...getChartOptions(),
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    };
}

// Get chart colors based on configuration
function getChartColors() {
    if (currentChart.config.colors === 'chiefs') {
        return {
            primary: '#E31837', // Chiefs red
            secondary: '#FFB81C', // Chiefs gold
            accent: '#E31837'
        };
    } else {
        return {
            primary: '#2563eb', // Blue
            secondary: '#9ca3af', // Gray
            accent: '#10b981' // Green
        };
    }
}

// Get default chart options
function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    };
}

// Format metric name for display
function formatMetricName(metric) {
    const names = {
        'passing_yards': 'Passing Yards',
        'touchdowns': 'Touchdowns',
        'interceptions': 'Interceptions',
        'completion_pct': 'Completion %',
        'passer_rating': 'Passer Rating',
        'completions': 'Completions',
        'attempts': 'Attempts',
        'longest_pass': 'Longest Pass',
        'receptions': 'Receptions',
        'targets': 'Targets',
        'receiving_yards': 'Receiving Yards'
    };
    return names[metric] || metric;
}

// Normalize metric value for radar chart (0-100 scale)
function normalizeMetricValue(metric, value) {
    const scales = {
        'passing_yards': 400,
        'touchdowns': 5,
        'interceptions': 3,
        'completion_pct': 100,
        'passer_rating': 140
    };

    const maxValue = scales[metric] || 100;
    return Math.min((value / maxValue) * 100, 100);
}

// Handle chat message
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to chat
    addChatMessage('user', message);

    // Clear input
    input.value = '';

    // Process the command
    processCommand(message);
}

// Quick chat (from suggestion pills)
function quickChat(message) {
    document.getElementById('chatInput').value = message;
    sendChatMessage();
}

// Handle Enter key in chat input
function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Add message to chat history
function addChatMessage(role, message) {
    const chatMessages = document.getElementById('chatMessages');

    // Show chat messages area when first message is added
    if (!chatMessages.classList.contains('active')) {
        chatMessages.classList.add('active');
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process conversational command
async function processCommand(command) {
    const lowerCommand = command.toLowerCase();

    // Show thinking message
    addChatMessage('assistant', '...');
    await sleep(800);

    // Remove thinking message
    const messages = document.getElementById('chatMessages').querySelectorAll('.chat-message');
    messages[messages.length - 1].remove();

    // Add metric
    if (lowerCommand.includes('add completion') || lowerCommand.includes('add comp')) {
        handleAddMetric('completion_pct', 'completion percentage (68.4%)');
    }
    else if (lowerCommand.includes('add passer rating') || lowerCommand.includes('add rating')) {
        handleAddMetric('passer_rating', 'passer rating (104.2)');
    }
    else if (lowerCommand.includes('add completions')) {
        handleAddMetric('completions', 'completions (26)');
    }
    else if (lowerCommand.includes('add attempts')) {
        handleAddMetric('attempts', 'attempts (38)');
    }

    // Compare to season average
    else if (lowerCommand.includes('compare') && lowerCommand.includes('season')) {
        handleCompareToAverage();
    }

    // Change chart type
    else if (lowerCommand.includes('line chart')) {
        handleChangeChartType('line');
    }
    else if (lowerCommand.includes('bar chart')) {
        handleChangeChartType('bar');
    }
    else if (lowerCommand.includes('radar chart')) {
        handleChangeChartType('radar');
    }

    // Change colors
    else if (lowerCommand.includes('chiefs color')) {
        handleChangeColors('chiefs');
    }
    else if (lowerCommand.includes('default color') || lowerCommand.includes('blue')) {
        handleChangeColors('default');
    }

    // Remove metric
    else if (lowerCommand.includes('remove interceptions') || lowerCommand.includes('remove ints')) {
        handleRemoveMetric('interceptions');
    }

    // Unknown command
    else {
        addChatMessage('assistant', `I'm not sure how to interpret "${command}". Try commands like "add completion percentage", "compare to season average", or "change to a line chart".`);
    }
}

// Handle adding a metric
function handleAddMetric(metric, displayName) {
    if (currentChart.config.metrics.includes(metric)) {
        addChatMessage('assistant', `${displayName} is already in the configuration.`);
        return;
    }

    currentChart.config.metrics.push(metric);
    addChatMessage('assistant', `✓ Added ${displayName}. Regenerating chart...`);

    // Check if chart is getting crowded
    if (currentChart.config.metrics.length >= 5 && currentChart.config.type !== 'radar') {
        setTimeout(() => {
            addChatMessage('assistant', `⚠️ FYI: With ${currentChart.config.metrics.length} metrics, this chart might be crowded. Would you like me to switch to a radar chart?`);
        }, 1000);
    }

    // Regenerate the chart with new configuration
    renderChart();
}

// Handle removing a metric
function handleRemoveMetric(metric) {
    const index = currentChart.config.metrics.indexOf(metric);

    if (index === -1) {
        addChatMessage('assistant', `${formatMetricName(metric)} is not in the configuration.`);
        return;
    }

    currentChart.config.metrics.splice(index, 1);
    addChatMessage('assistant', `✓ Removed ${formatMetricName(metric)}. Regenerating chart...`);

    // Regenerate the chart with new configuration
    renderChart();
}

// Handle compare to season average
function handleCompareToAverage() {
    if (currentChart.config.comparison === 'season_avg') {
        addChatMessage('assistant', "You're already comparing to season average.");
        return;
    }

    currentChart.config.comparison = 'season_avg';
    currentChart.config.title = currentChart.config.title.replace('Week 10', 'Week 10 vs Season Avg');

    addChatMessage('assistant', "✓ Added season average comparison. Regenerating chart...");

    // Regenerate the chart with new configuration
    renderChart();
}

// Handle chart type change
function handleChangeChartType(newType) {
    if (currentChart.config.type === newType) {
        addChatMessage('assistant', `This is already configured as a ${newType} chart.`);
        return;
    }

    const oldType = currentChart.config.type;
    currentChart.config.type = newType;

    let message = `✓ Changed from ${oldType} chart to ${newType} chart.`;

    // Special handling for line charts (need temporal data)
    if (newType === 'line' && currentChart.config.timeframe !== 'last5games') {
        currentChart.config.timeframe = 'last5games';
        currentChart.config.title = `${currentChart.config.player} Performance Trend - Last 5 Games`;
        message += ' Since line charts show trends, I\'ve switched to displaying the last 5 games.';
    }

    message += ' Regenerating chart...';
    addChatMessage('assistant', message);

    // Regenerate the chart with new configuration
    renderChart();
}

// Handle color change
function handleChangeColors(colorScheme) {
    currentChart.config.colors = colorScheme;

    if (colorScheme === 'chiefs') {
        addChatMessage('assistant', '✓ Applied Chiefs team colors (red and gold). Regenerating chart...');
    } else {
        addChatMessage('assistant', '✓ Applied default color scheme (blue). Regenerating chart...');
    }

    // Regenerate the chart with new configuration
    renderChart();
}

// Back to suggestions
function backToSuggestions() {
    document.getElementById('refinementView').classList.remove('active');
    document.getElementById('suggestionsView').classList.add('active');

    // Hide chat container and new block button
    document.getElementById('chatContainer').style.display = 'none';
    document.getElementById('generateNewBlockBtn').style.display = 'none';

    // Destroy chart
    if (currentChartInstance) {
        currentChartInstance.destroy();
        currentChartInstance = null;
    }
}

// Insert final chart
function insertChart() {
    alert('✓ Chart inserted successfully!\n\nIn a real WordPress implementation, this would:\n\n1. Save the chart configuration to the Gutenberg block\n2. Embed the chart in the article\n3. Allow re-editing by clicking the chart\n\nChart config saved:\n' + JSON.stringify(currentChart.config, null, 2));

    backToSuggestions();
}

// Insert chart from a generated block
function insertGeneratedChart(blockId, config) {
    alert('✓ Chart inserted successfully!\n\nIn a real WordPress implementation, this would:\n\n1. Save the chart configuration to the Gutenberg block\n2. Lock the chart as final\n3. Allow re-editing by clicking the chart\n\nChart config saved:\n' + JSON.stringify(config, null, 2));

    // In a real implementation, this would finalize the block
    console.log('Chart from block', blockId, 'has been inserted');
}

// Generate chart in new block from a suggestion card
async function generateChartInNewBlockFromSuggestion(suggestionId) {
    const suggestion = CHART_SUGGESTIONS.find(s => s.id === suggestionId);

    // Create chart configuration from suggestion
    const chartConfig = {
        title: suggestion.title,
        type: suggestion.type,
        metrics: [...suggestion.metrics],
        player: suggestion.player,
        players: suggestion.players,
        timeframe: suggestion.timeframe,
        colors: 'default'
    };

    // Generate the new block with this configuration
    await createNewChartBlock(chartConfig);

    // Show brief success message
    console.log('Chart generated in new block:', chartConfig.title);
}

// Generate chart in a new block below the current one (from refinement view)
async function generateChartInNewBlock() {
    // Save current chart configuration
    const savedConfig = JSON.parse(JSON.stringify(currentChart.config));

    // Generate the new block with current configuration
    await createNewChartBlock(savedConfig);

    // Show success message in current block
    addChatMessage('assistant', '✓ Chart generated in new block below! You can continue refining this chart or go back to create more.');
}

// Helper function to create a new chart block
async function createNewChartBlock(chartConfig) {
    // Find the current Chart Genie block
    const currentBlock = document.getElementById('chartGenieBlock');

    // Create a new Chart Genie block
    const newBlockWrapper = document.createElement('div');
    newBlockWrapper.className = 'block';

    const newBlock = document.createElement('div');
    newBlock.className = 'chart-genie-block is-selected';
    const uniqueId = Date.now();
    newBlock.id = 'chartGenieBlock_' + uniqueId;

    // Create the content for the new block with chart already displayed
    newBlock.innerHTML = `
        <div class="block-icon-header">
            <div class="block-icon">📊</div>
            <div class="block-title">Sports Data Visualizer</div>
        </div>

        <div class="chart-preview-container" style="display: block;">
            <div class="chart-title">${chartConfig.title}</div>
            <canvas id="chartCanvas_${uniqueId}" style="max-height: 300px;"></canvas>
            <div class="chart-generated-notice">
                ✓ Chart generated successfully
            </div>
        </div>

        <div class="chat-container" style="display: block; margin-top: 20px;">
            <div class="chat-header">
                💬 Refine Your Chart
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input-area">
                <div class="chat-input-row">
                    <input
                        type="text"
                        class="chat-input"
                        placeholder="e.g., 'Change the colors to Chiefs red and gold'"
                        disabled
                    >
                    <button class="btn btn-primary" disabled>
                        Send
                    </button>
                </div>
                <div class="chat-suggestions">
                    <div class="chat-suggestions-label">Chart is locked in this prototype - refinement available in main block</div>
                </div>
            </div>
        </div>

        <div class="action-row" style="margin-top: 20px;">
            <button class="btn btn-primary" onclick="insertGeneratedChart('${uniqueId}', ${JSON.stringify(chartConfig).replace(/"/g, '&quot;')})">
                Insert Chart
            </button>
        </div>
    `;

    newBlockWrapper.appendChild(newBlock);

    // Insert the new block after the current block's parent
    const currentBlockWrapper = currentBlock.closest('.block');
    currentBlockWrapper.parentNode.insertBefore(newBlockWrapper, currentBlockWrapper.nextSibling);

    // Scroll to the new block
    newBlockWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Render chart in the new block
    const newCanvas = newBlock.querySelector('canvas');
    const newCtx = newCanvas.getContext('2d');

    // Recreate the chart with the provided configuration
    const tempCurrentChart = currentChart;
    currentChart = { config: chartConfig };

    let chartDataConfig;
    if (chartConfig.type === 'bar') {
        chartDataConfig = prepareBarChart();
    } else if (chartConfig.type === 'grouped-bar') {
        chartDataConfig = prepareGroupedBarChart();
    } else if (chartConfig.type === 'line') {
        chartDataConfig = prepareLineChart();
    } else if (chartConfig.type === 'radar') {
        chartDataConfig = prepareRadarChart();
    }

    new Chart(newCtx, chartDataConfig);

    // Restore current chart
    currentChart = tempCurrentChart;
}

// Utility: sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    console.log('Sports Data Visualizer Prototype loaded');
    console.log('Click "Suggest Charts" to begin');
});
