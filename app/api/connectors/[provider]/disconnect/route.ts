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

export async function POST(
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

    const disconnected = await connectorService.disconnectConnector(userId, connectorType);

    return NextResponse.json({
      success: true,
      data: {
        disconnected,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
