interface EmailData {
  name: string;
  email: string;
  calculatorType: string;
  results: any;
  timestamp: string;
}

interface AnalyticsData {
  calculatorType: string;
  userInfo: {
    name: string;
    email: string;
  };
  results: any;
  timestamp: string;
  sessionId: string;
}

// Generate a simple session ID for tracking
const generateSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Store user analytics for advisor tracking
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

// Store analytics data locally (in a real app, this would go to a backend)
const storeAnalytics = async (data: AnalyticsData): Promise<void> => {
  try {
    const existingData = await getStoredAnalytics();
    const newData = [...existingData, data];
    
    // Keep only last 1000 entries to prevent storage bloat
    const limitedData = newData.slice(-1000);
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('calculator_analytics', JSON.stringify(limitedData));
    }
  } catch (error) {
    console.error('Failed to store analytics:', error);
  }
};

// Get stored analytics data
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

// Generate PDF content as HTML for download
export const generatePDFContent = (data: EmailData): string => {
  const { name, calculatorType, results, timestamp } = data;
  
  // Ensure results is an object and not null/undefined
  const safeResults = results && typeof results === 'object' ? results : {};
  
  // Format currency values
  const formatValue = (key: string, value: any): string => {
    if (typeof value === 'number') {
      // Check if it's likely a currency value
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
      // Check if it's a percentage
      if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('percent')) {
        return `${value}%`;
      }
      return value.toLocaleString();
    }
    return String(value || 'N/A');
  };
  
  // Format key names
  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/\b\w/g, l => l.toUpperCase());
  };
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${calculatorType || 'Calculator'} Results - ${name}</title>
      <style>
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
        
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 40px; 
          color: #04233a; 
          line-height: 1.6;
          background: #fff;
        }
        
        .header { 
          text-align: center; 
          margin-bottom: 40px; 
          border-bottom: 3px solid #04233a;
          padding-bottom: 20px;
        }
        
        .logo { 
          font-size: 28px; 
          font-weight: bold; 
          color: #04233a; 
          margin-bottom: 10px;
        }
        
        .title { 
          font-size: 24px; 
          font-weight: bold; 
          margin: 15px 0; 
          color: #04233a;
        }
        
        .subtitle { 
          color: #666; 
          margin-bottom: 20px; 
          font-size: 16px;
        }
        
        .section { 
          margin: 30px 0; 
          padding: 25px; 
          border: 2px solid #e6f2ff; 
          border-radius: 12px; 
          background: #fafbfc;
        }
        
        .section h3 { 
          color: #04233a; 
          margin-top: 0; 
          font-size: 20px;
          border-bottom: 1px solid #04233a;
          padding-bottom: 10px;
        }
        
        .result-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 20px;
        }
        
        .result-item { 
          padding: 15px; 
          background: #fff; 
          border-radius: 8px; 
          border-left: 4px solid #04233a;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .result-label { 
          font-weight: 600; 
          color: #04233a; 
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .result-value { 
          font-size: 18px; 
          color: #333; 
          font-weight: bold;
        }
        
        .disclaimer { 
          margin-top: 40px; 
          padding: 25px; 
          background: #fff3cd; 
          border-radius: 12px; 
          font-size: 14px; 
          border-left: 4px solid #ffc107;
        }
        
        .disclaimer strong {
          color: #856404;
        }
        
        .footer { 
          margin-top: 40px; 
          text-align: center; 
          color: #666; 
          font-size: 14px; 
          border-top: 2px solid #04233a;
          padding-top: 20px;
        }
        
        .footer p {
          margin: 5px 0;
        }
        
        .print-button {
          background: #04233a;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          margin: 20px 0;
        }
        
        .print-button:hover {
          background: #032a47;
        }
        
        @media (max-width: 768px) {
          .result-grid {
            grid-template-columns: 1fr;
          }
          body {
            margin: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print">
        <button class="print-button" onclick="window.print()">🖨️ Print or Save as PDF</button>
      </div>
      
      <div class="header">
        <div class="logo">McLaughlin Financial Group</div>
        <div class="title">${calculatorType || 'Calculator'} Results</div>
        <div class="subtitle">Prepared for ${name} on ${new Date(timestamp).toLocaleDateString('en-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</div>
      </div>
      
      <div class="section">
        <h3>📊 Your Calculation Results</h3>
        <div class="result-grid">
          ${Object.entries(safeResults).map(([key, value]) => `
            <div class="result-item">
              <div class="result-label">${formatKey(key)}</div>
              <div class="result-value">${formatValue(key, value)}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ Important Disclaimer:</strong> These calculations are for illustrative purposes only and should not be considered as financial advice. The results are based on the information you provided and certain assumptions about future performance, which may not be accurate. Actual results may vary significantly. Please consult with a qualified financial advisor before making any financial decisions.
      </div>
      
      <div class="footer">
        <p><strong>McLaughlin Financial Group</strong></p>
        <p>📍 1 Elora Street North, Unit 1, Harriston, Ontario</p>
        <p>📞 Phone: 519-510-0411 | ✉️ Email: info@mclaughlinfinancial.ca</p>
        <p>🕒 Generated on ${new Date(timestamp).toLocaleString('en-CA')}</p>
      </div>
      
      <script>
        // Auto-focus for better printing experience
        window.onload = function() {
          console.log('PDF content loaded successfully');
        };
      </script>
    </body>
    </html>
  `;
};

// Utility function to safely show alerts
const showAlert = (title: string, message: string, buttons?: any[]) => {
  try {
    // Try to use React Native Alert if available
    if (typeof require !== 'undefined') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Alert: RNAlert } = require('react-native');
        if (RNAlert && RNAlert.alert) {
          RNAlert.alert(title, message, buttons || [{ text: 'OK' }]);
          return;
        }
      } catch {
        // React Native not available, continue to web fallback
      }
    }
    
    // Web fallback
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(`${title}\n\n${message}`);
    } else {
      console.log(`Alert: ${title} - ${message}`);
    }
  } catch (error) {
    console.warn('Failed to show alert:', error);
    console.log(`Alert: ${title} - ${message}`);
  }
};

// Generate and download PDF with enhanced error handling
export const downloadPDF = async (data: EmailData): Promise<void> => {
  try {
    console.log('Starting PDF generation for:', data.calculatorType);
    
    // Always store analytics first
    await storeUserAnalytics(data);
    
    const pdfContent = generatePDFContent(data);
    
    // Check if we're on web by checking for window object
    const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';
    
    if (isWeb) {
      // Enhanced web implementation
      try {
        // Comprehensive environment checks
        if (typeof window === 'undefined') {
          throw new Error('Window object not available');
        }
        
        if (typeof document === 'undefined') {
          throw new Error('Document object not available');
        }
        
        if (typeof Blob === 'undefined') {
          throw new Error('Blob constructor not available');
        }
        
        // Create blob with proper MIME type
        const blob = new Blob([pdfContent], { 
          type: 'text/html;charset=utf-8' 
        });
        
        // Enhanced URL creation with fallbacks
        let downloadUrl: string;
        
        if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
          downloadUrl = URL.createObjectURL(blob);
        } else if (typeof webkitURL !== 'undefined' && typeof webkitURL.createObjectURL === 'function') {
          downloadUrl = webkitURL.createObjectURL(blob);
        } else {
          throw new Error('URL.createObjectURL not supported');
        }
        
        // Create safe filename
        const safeCalculatorType = data.calculatorType.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
        const safeName = data.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${safeCalculatorType}_Results_${safeName}_${timestamp}.html`;
        
        // Create and trigger download with enhanced error handling
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.style.display = 'none';
        link.style.position = 'absolute';
        link.style.left = '-9999px';
        
        // Add to DOM, click, and clean up
        document.body.appendChild(link);
        
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          try {
            link.click();
            
            // Clean up after successful download
            setTimeout(() => {
              try {
                document.body.removeChild(link);
                if (typeof URL !== 'undefined' && URL.revokeObjectURL) {
                  URL.revokeObjectURL(downloadUrl);
                } else if (typeof webkitURL !== 'undefined' && webkitURL.revokeObjectURL) {
                  webkitURL.revokeObjectURL(downloadUrl);
                }
              } catch (cleanupError) {
                console.warn('Cleanup error (non-critical):', cleanupError);
              }
            }, 1000);
            
            console.log('PDF downloaded successfully on web');
            
            // Show success message
            showAlert(
              '✅ Success!',
              `Your ${data.calculatorType} results have been downloaded successfully. You can open the HTML file in any browser and print or save as PDF.`
            );
            
          } catch (clickError) {
            console.error('Click error:', clickError);
            throw clickError;
          }
        }, 100);
        
      } catch (webError) {
        console.error('Web PDF download failed:', webError);
        
        // Enhanced fallback: open in new window for printing
        try {
          if (typeof window !== 'undefined' && window.open) {
            const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
            if (newWindow) {
              newWindow.document.write(pdfContent);
              newWindow.document.close();
              
              // Enhanced print functionality
              newWindow.onload = () => {
                setTimeout(() => {
                  try {
                    newWindow.focus();
                    newWindow.print();
                  } catch (printError) {
                    console.warn('Print error (non-critical):', printError);
                  }
                }, 1000);
              };
              
              showAlert(
                '📄 Results Opened',
                'Your results have been opened in a new window. Use your browser\'s print function (Ctrl+P or Cmd+P) to save as PDF.'
              );
            } else {
              throw new Error('Failed to open new window (popup blocked?)');
            }
          } else {
            throw new Error('Window.open not available');
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          
          // Final fallback: copy to clipboard or show content
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(pdfContent);
              showAlert(
                '📋 Content Copied',
                'Unable to download PDF, but your results have been copied to clipboard. You can paste them into a text editor and save as HTML.'
              );
            } else {
              throw new Error('Clipboard not available');
            }
          } catch (clipboardError) {
            console.error('Clipboard fallback failed:', clipboardError);
            
            showAlert(
              '⚠️ Download Failed',
              'Unable to download PDF due to browser limitations. Your results have been saved to analytics. Please try using a different browser or contact support.'
            );
          }
        }
      }
    } else {
      // Enhanced mobile implementation
      try {
        showAlert(
          '💾 Results Saved',
          'Your calculator results have been saved and tracked successfully. For a PDF copy, please use the web version of this app or visit our website on a computer.',
          [
            { text: 'OK' },
            { 
              text: 'Open Web Version', 
              onPress: () => {
                // Could open web version if available
                console.log('User requested web version');
              }
            }
          ]
        );
        
        console.log('Mobile PDF generation completed (analytics stored)');
      } catch (mobileError) {
        console.error('Mobile PDF generation failed:', mobileError);
        
        showAlert(
          '❌ Error',
          'Failed to save results. Please check your connection and try again.',
          [{ text: 'Retry', onPress: () => downloadPDF(data) }, { text: 'Cancel' }]
        );
      }
    }
  } catch (error) {
    console.error('Critical PDF generation error:', error);
    
    // Enhanced error recovery
    try {
      await storeUserAnalytics(data);
      
      showAlert(
        '⚠️ Partial Success',
        'Your results have been saved for tracking, but PDF generation encountered an issue. Please try again or contact support if the problem persists.',
        [
          { text: 'Retry', onPress: () => downloadPDF(data) },
          { text: 'OK' }
        ]
      );
    } catch (analyticsError) {
      console.error('Critical analytics storage error:', analyticsError);
      
      showAlert(
        '❌ System Error',
        'Failed to save results and generate PDF. Please check your connection and try again. If the problem persists, please contact support.',
        [
          { text: 'Retry', onPress: () => downloadPDF(data) },
          { text: 'Cancel' }
        ]
      );
    }
  }
};

// Get analytics summary for advisor dashboard
export const getAnalyticsSummary = async () => {
  try {
    const data = await getStoredAnalytics();
    
    const summary = {
      totalUsers: data.length,
      calculatorUsage: {} as Record<string, number>,
      recentActivity: data.slice(-10).reverse(),
      topCalculators: [] as { name: string; count: number }[]
    };
    
    // Count calculator usage
    data.forEach(entry => {
      summary.calculatorUsage[entry.calculatorType] = (summary.calculatorUsage[entry.calculatorType] || 0) + 1;
    });
    
    // Get top calculators
    summary.topCalculators = Object.entries(summary.calculatorUsage)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return summary;
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

export type { EmailData, AnalyticsData };