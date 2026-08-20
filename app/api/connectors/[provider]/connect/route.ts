import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/firebase-admin';
import { ConnectorService } from '@/services/connectors/connector.service';
import { handleApiError } from '@/lib/errors';
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
  try {
    const { provider } = await params;
    const decodedToken = await requireAuthenticatedUser(req);
    const userId = decodedToken.uid;

    const connectorType = getConnectorType(provider);
    if (!connectorType) {
      return NextResponse.json({ success: false, error: 'Unknown provider' }, { status: 400 });
    }

    const appUrl = process.env.APP_URL || new URL(req.url).origin;
    const redirectUri = `${appUrl.replace(/\/$/, '')}/api/connectors/${provider}/callback`;

    const connector = connectorService.getConnector(connectorType);
    const authUrl = connector.getOAuthUrl(userId, redirectUri);

    return NextResponse.json({
      success: true,
      url: authUrl,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
