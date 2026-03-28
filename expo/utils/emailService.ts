export interface EmailData {
  name: string;
  email: string;
  calculatorType: string;
  results: any;
  timestamp: string;
}

export interface AnalyticsData {
  calculatorType: string;
  userInfo: {
    name: string;
    email: string;
  };
  results: any;
  timestamp: string;
  sessionId: string;
}

const generateSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const storeAnalytics = async (data: AnalyticsData): Promise<void> => {
  try {
    const existingData = await getStoredAnalytics();
    const newData = [...existingData, data];
    const limitedData = newData.slice(-1000);
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('calculator_analytics', JSON.stringify(limitedData));
    }
    
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('Server analytics track failed, using client-only storage');
    }
  } catch (error) {
    console.error('Failed to store analytics:', error);
  }
};

export const storeUserAnalytics = async (data: EmailData): Promise<void> => {
  try {
    const sessionId = generateSessionId();
    const analyticsData: AnalyticsData = {
      calculatorType: data.calculatorType,
      userInfo: {
        name: data.name,
        email: data.email
      },
      results: data.results || {},
      timestamp: data.timestamp,
      sessionId
    };

    await storeAnalytics(analyticsData);
    console.log('User analytics stored:', {
      name: data.name,
      email: data.email,
      calculatorType: data.calculatorType,
      sessionId
    });

    try {
      const pageSource = typeof window !== 'undefined' && window.location ? window.location.pathname : 'app';
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: undefined,
          interest: data.calculatorType,
          notes: 'Auto-logged from calculator submission',
          pageSource,
          honeypot: ''
        })
      });
      if (!res.ok) {
        console.warn('Advisor contact forwarding failed with status:', res.status);
      } else {
        console.log('Advisor contact forwarding succeeded');
      }
    } catch (err) {
      console.warn('Advisor contact forwarding error:', err);
    }
  } catch (error) {
    console.error('Failed to store user analytics:', error);
    throw error;
  }
};

export const getStoredAnalytics = async (): Promise<AnalyticsData[]> => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('calculator_analytics');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return [];
  }
};

export const generatePDFContent = (data: EmailData): string => {
  const { name, calculatorType, results, timestamp } = data;
  const safeResults = results && typeof results === 'object' ? results : {};
  
  const formatValue = (key: string, value: any): string => {
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('amount') || 
          key.toLowerCase().includes('cost') || 
          key.toLowerCase().includes('payment') || 
          key.toLowerCase().includes('savings') || 
          key.toLowerCase().includes('value') ||
          key.toLowerCase().includes('income') ||
          key.toLowerCase().includes('room') ||
          key.toLowerCase().includes('contribution')) {
        return new Intl.NumberFormat('en-CA', {
          style: 'currency',
          currency: 'CAD'
        }).format(value);
      }
      if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('percent')) {
        return `${value}%`;
      }
      return value.toLocaleString();
    }
    return String(value || 'N/A');
  };
  
  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/\b\w/g, l => l.toUpperCase());
  };
  
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${calculatorType} Results</title></head><body><h1>${calculatorType} Results for ${name}</h1><div>${Object.entries(safeResults).map(([key, value]) => `<p><strong>${formatKey(key)}:</strong> ${formatValue(key, value)}</p>`).join('')}</div><p>Generated on ${new Date(timestamp).toLocaleString()}</p></body></html>`;
};

const showNotification = (title: string, message: string) => {
  try {
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(`${title}\n\n${message}`);
    } else {
      console.log(`${title}: ${message}`);
    }
  } catch (error) {
    console.log(`${title}: ${message}`);
  }
};

export const downloadPDF = async (data: EmailData): Promise<void> => {
  try {
    await storeUserAnalytics(data);
    const pdfContent = generatePDFContent(data);
    
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        const blob = new Blob([pdfContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.calculatorType}_Results.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('Success', 'Results downloaded successfully');
      } catch (error) {
        console.error('Download failed:', error);
        showNotification('Info', 'Results saved to analytics');
      }
    } else {
      showNotification('Info', 'Results saved successfully');
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    showNotification('Error', 'Failed to save results');
  }
};

export const getAnalyticsSummary = async () => {
  try {
    const clientData = await getStoredAnalytics();
    let serverData: AnalyticsData[] = [];
    try {
      const res = await fetch('/api/analytics/list');
      if (res.ok) {
        const json = await res.json();
        serverData = (json?.data as AnalyticsData[]) || [];
      }
    } catch (e) {
      console.warn('Server analytics fetch failed, using client-only data');
    }

    const combined = [...serverData, ...clientData];

    const calculatorUsage = combined.reduce<Record<string, number>>((acc, cur) => {
      acc[cur.calculatorType] = (acc[cur.calculatorType] || 0) + 1;
      return acc;
    }, {});

    const topCalculators = Object.entries(calculatorUsage)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentActivity = combined.slice(-50).reverse();

    return {
      totalUsers: combined.length,
      calculatorUsage,
      recentActivity,
      topCalculators,
    };
  } catch (error) {
    console.error('Failed to get analytics summary:', error);
    return {
      totalUsers: 0,
      calculatorUsage: {},
      recentActivity: [],
      topCalculators: []
    };
  }
};