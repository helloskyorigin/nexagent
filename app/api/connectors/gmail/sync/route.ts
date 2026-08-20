import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/firebase-admin';
import { ConnectorService, GmailConnector } from '@/services/connectors/connector.service';
import { handleApiError } from '@/lib/errors';

const connectorService = new ConnectorService();

export async function POST(req: NextRequest) {
  try {
    const decodedToken = await requireAuthenticatedUser(req);
    const userId = decodedToken.uid;

    const gmail = connectorService.getConnector('GMAIL') as GmailConnector;
    const health = await gmail.healthCheck(userId);
    const status = await gmail.getStatus(userId);

    return NextResponse.json({
      success: true,
      data: {
        health,
        status,
        syncedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
