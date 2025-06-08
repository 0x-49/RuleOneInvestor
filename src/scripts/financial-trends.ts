// src/scripts/financial-trends.ts
import type { FinancialMetrics as FinancialMetricsType, StockWithMetrics } from '../shared/schema';

// Define MetricType based on its usage in FinancialTrends.astro frontmatter
type MetricType = 'revenue' | 'netIncome' | 'eps' | 'equity' | 'freeCashFlow' | 'operatingCashFlow' | 'dividends' | 'bookValue';

// DOM element to read data from
const container = document.getElementById('financial-trends-container');

if (container) {
    const rawStockDataAttr = container.dataset.stockData;
    const serverMetricConfigsAttr = container.dataset.metricConfigs;
    const serverInitialMetricAttr = container.dataset.initialMetric;

    if (typeof rawStockDataAttr !== 'string' || typeof serverMetricConfigsAttr !== 'string' || typeof serverInitialMetricAttr !== 'string') {
        console.error('FinancialTrends: Missing data attributes for script initialization.');
    } else {
        // Ensure FrappeCharts is loaded
        if (typeof (window as any).FrappeCharts === 'undefined') {
            console.error('FinancialTrends: FrappeCharts library not loaded.');
        } else {
            const FrappeCharts = (window as any).FrappeCharts;
            let chart: any = null; // To hold the chart instance

            const stockData: StockWithMetrics | null = JSON.parse(rawStockDataAttr);
            const metricConfigs: Record<MetricType, { label: string; color: string }> = JSON.parse(serverMetricConfigsAttr);
            let selectedMetricKey: MetricType = JSON.parse(serverInitialMetricAttr) as MetricType;

            const selectedMetricLabelEl = document.getElementById('selected-metric-label') as HTMLElement | null;
            const statCagrEl = document.getElementById('stat-cagr') as HTMLElement | null;
            const statConsistencyEl = document.getElementById('stat-consistency') as HTMLElement | null;
            const statLatestEl = document.getElementById('stat-latest') as HTMLElement | null;
            const dropdownMenuItems = document.querySelectorAll<HTMLElement>('#financial-metric-selector [data-metric-key]');
            const dropdownMenu = document.getElementById('financial-metric-selector') as HTMLElement | null; // Root of dropdown
            const dropdownTrigger = document.getElementById('selected-metric-trigger') as HTMLElement | null;
            const chartPlaceholder = document.getElementById('chart-placeholder') as HTMLElement | null;

            if (!selectedMetricLabelEl || !statCagrEl || !statConsistencyEl || !statLatestEl || dropdownMenuItems.length === 0 || !dropdownMenu || !dropdownTrigger || !chartPlaceholder) {
                console.error("FinancialTrends: One or more essential DOM elements are missing. Script will not run.");
            } else {
                const formatFinancialValueClient = (value: number | undefined | null): string => {
                    if (value === undefined || value === null) return "N/A";
                    if (value === 0) return "$0";
                    const absValue = Math.abs(value);
                    if (absValue >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
                    if (absValue >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
                    if (absValue >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
                    if (absValue >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
                    return `$${value.toFixed(0)}`;
                };

                const calculateConsistencyClient = (values: (number | undefined | null)[]): number => {
                    const validValues = values.filter((v): v is number => typeof v === 'number' && v > 0);
                    if (validValues.length < 2) return 0;
                    let increases = 0;
                    for (let i = 1; i < validValues.length; i++) {
                        if (validValues[i] > validValues[i - 1]) {
                            increases++;
                        }
                    }
                    return (increases / (validValues.length - 1)) * 100;
                };

                const getMetricDataClient = (metricKey: MetricType, yearlyMetrics: FinancialMetricsType[] | undefined): { year: string | undefined; value: number | undefined }[] => {
                    if (!yearlyMetrics) return [];
                    return yearlyMetrics.map(m => ({ year: m.year, value: m[metricKey as keyof FinancialMetricsType] as number | undefined }));
                };
                
                function updateStatistics(metricKeyToUpdate: MetricType) {
                    if (!stockData || !stockData.metrics || stockData.metrics.length === 0) {
                        if(selectedMetricLabelEl) selectedMetricLabelEl.textContent = metricConfigs[metricKeyToUpdate].label;
                        if(statCagrEl) statCagrEl.textContent = 'N/A';
                        if(statConsistencyEl) statConsistencyEl.textContent = 'N/A';
                        if(statLatestEl) statLatestEl.textContent = 'N/A';
                        if(chartPlaceholder) chartPlaceholder.innerHTML = 'Chart Visualization (No data available)';
                        chart = null; // Clear chart instance
                        return;
                    }

                    const sortedMetrics = [...stockData.metrics].sort((a, b) => {
                        const yearA = a.year ? parseInt(a.year) : 0;
                        const yearB = b.year ? parseInt(b.year) : 0;
                        return yearA - yearB;
                    });
                    const chartData = getMetricDataClient(metricKeyToUpdate, sortedMetrics);
                    const values = chartData.map(d => d.value).filter((v): v is number => typeof v === 'number' && v > 0);
                    
                    const cagr = values.length > 1 
                      ? (Math.pow(values[values.length - 1] / values[0], 1 / (values.length - 1)) - 1) * 100
                      : 0;
                    const consistency = calculateConsistencyClient(values);
                    const latest = values[values.length - 1] ?? 0;

                    if(selectedMetricLabelEl) selectedMetricLabelEl.textContent = metricConfigs[metricKeyToUpdate].label;
                    if(statCagrEl) statCagrEl.textContent = `${cagr.toFixed(1)}%`;
                    if(statConsistencyEl) statConsistencyEl.textContent = `${consistency.toFixed(0)}%`;
                    if(statLatestEl) statLatestEl.textContent = formatFinancialValueClient(latest);

                    if (!chartPlaceholder) return;

                    const frappeChartData = {
                      labels: chartData.map(d => d.year?.toString() || ''),
                      datasets: [ { name: metricConfigs[metricKeyToUpdate].label, values: chartData.map(d => d.value || 0), chartType: 'line' } ],
                    };
                    const title = `${metricConfigs[metricKeyToUpdate].label} Trend`;

                    chartPlaceholder.innerHTML = ''; // Clear previous content (text or old chart)
                    if (chartData.length > 0 && chartData.some(d => d.value !== undefined && d.value !== null)) {
                        chart = new FrappeCharts.Chart(chartPlaceholder, {
                          title: title, data: frappeChartData, type: 'line', height: 320,
                          colors: [metricConfigs[metricKeyToUpdate].color || '#7c3aed'],
                          axisOptions: { xIsSeries: true, xAxisMode: 'tick', yAxisMode: 'span' },
                          lineOptions: { regionFill: 1, hideDots: 0, heatline: 0, spline: 1 },
                          tooltipOptions: { formatTooltipX: (d: any) => d, formatTooltipY: (d: any) => formatFinancialValueClient(d) }
                        });
                    } else {
                        chartPlaceholder.innerHTML = 'Chart Visualization (Not enough data for this metric)';
                        chart = null; // Clear chart instance
                    }
                }

                updateStatistics(selectedMetricKey);

                dropdownMenuItems.forEach(item => {
                    item.addEventListener('click', () => {
                        const newMetricKey = item.getAttribute('data-metric-key') as MetricType | null;
                        if (newMetricKey && newMetricKey !== selectedMetricKey) {
                            selectedMetricKey = newMetricKey;
                            updateStatistics(selectedMetricKey);
                        }
                        if (dropdownMenu && dropdownTrigger) {
                            const content = dropdownMenu.querySelector<HTMLElement>('[role="menu"]');
                            if (content) content.classList.add('hidden');
                            dropdownTrigger.setAttribute('aria-expanded', 'false');
                        }
                    });
                });

                if (dropdownTrigger && dropdownMenu) {
                    const content = dropdownMenu.querySelector<HTMLElement>('[role="menu"]');
                    if (content) {
                        dropdownTrigger.addEventListener('click', (event) => {
                            event.stopPropagation();
                            const isExpanded = dropdownTrigger.getAttribute('aria-expanded') === 'true';
                            content.classList.toggle('hidden', isExpanded);
                            dropdownTrigger.setAttribute('aria-expanded', String(!isExpanded));
                        });
                        document.addEventListener('click', (event) => {
                            if (dropdownMenu && !dropdownMenu.contains(event.target as Node)) {
                                content.classList.add('hidden');
                                dropdownTrigger.setAttribute('aria-expanded', 'false');
                            }
                        });
                    }
                }
            }
        }
    }
} else {
    console.error('FinancialTrends: Container element #financial-trends-container not found. Script will not run.');
}
