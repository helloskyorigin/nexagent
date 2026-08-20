import { NextRequest, NextResponse } from 'next/server';
import { ConnectorService } from '@/services/connectors/connector.service';
import { SupportedConnectorType } from '@/config';

const connectorService = new ConnectorService();

function getConnectorType(provider: string): SupportedConnectorType | null {
  const map: Record<string, SupportedConnectorType> = {
    gmail: 'GMAIL',
    calendar: 'GOOGLE_CALENDAR',
    drive: 'GOOGLE_DRIVE',
    notion: 'NOTION',
    github: 'GITHUB',
  };
  return map[provider.toLowerCase()] || null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error') || searchParams.get('error_description');
  const state = searchParams.get('state') || '';

  // Return a beautiful popup response template
  const respondWithHtml = (status: 'SUCCESS' | 'ERROR', detailMessage: string) => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Callback</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #f8fafc;
              color: #0f172a;
            }
            .card {
              background: white;
              padding: 2.5rem;
              border-radius: 1rem;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
              text-align: center;
              max-width: 400px;
              width: 90%;
            }
            .success-icon { color: #22c55e; font-size: 3rem; margin-bottom: 1rem; }
            .error-icon { color: #ef4444; font-size: 3rem; margin-bottom: 1rem; }
            h1 { font-size: 1.5rem; margin: 0 0 0.5rem 0; font-weight: 700; }
            p { color: #64748b; font-size: 0.875rem; margin: 0 0 1.5rem 0; line-height: 1.5; }
            .btn {
              background-color: #0f172a;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              font-weight: 600;
              cursor: pointer;
              font-size: 0.875rem;
              transition: opacity 0.2s;
            }
            .btn:hover { opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="card">
            ${status === 'SUCCESS' 
              ? `<div class="success-icon">✓</div>
                 <h1>Connection Successful</h1>
                 <p>Your ${provider.toUpperCase()} account has been successfully connected to Nexorbit.</p>`
              : `<div class="error-icon">✕</div>
                 <h1>Connection Failed</h1>
                 <p>${detailMessage}</p>`
            }
            <button class="btn" onclick="window.close()">Close Window</button>
          </div>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({
                  type: 'OAUTH_AUTH_CALLBACK',
                  status: '${status}',
                  provider: '${provider}',
                  error: ${status === 'ERROR' ? JSON.stringify(detailMessage) : 'null'}
                }, '*');
                setTimeout(() => {
                  window.close();
                }, 1000);
              }
            } catch (e) {
              console.error('Failed to notify opener window:', e);
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  };

  if (error) {
    return respondWithHtml('ERROR', `Access denied: ${error}`);
  }

  if (!code) {
    return respondWithHtml('ERROR', 'No authorization code was provided.');
  }

  const [userId] = state.split(':');
  if (!userId) {
    return respondWithHtml('ERROR', 'Invalid state parameter.');
  }

  const connectorType = getConnectorType(provider);
  if (!connectorType) {
    return respondWithHtml('ERROR', 'Unknown provider type.');
  }

  try {
    const appUrl = process.env.APP_URL || new URL(req.url).origin;
    const redirectUri = `${appUrl.replace(/\/$/, '')}/api/connectors/${provider}/callback`;

    await connectorService.connectConnector(userId, connectorType, {
      code,
      redirectUri,
    });

    return respondWithHtml('SUCCESS', '');
  } catch (err: any) {
    console.error('Callback OAuth exchange error:', err);
    return respondWithHtml('ERROR', err.message || 'An error occurred during token exchange.');
  }
}
