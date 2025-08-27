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
    const data = await getStoredAnalytics();
    return {
      totalUsers: data.length,
      calculatorUsage: {} as Record<string, number>,
      recentActivity: data.slice(-10).reverse(),
      topCalculators: [] as { name: string; count: number }[]
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