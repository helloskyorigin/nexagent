import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/firebase-admin';
import { ConnectorService, GmailConnector } from '@/services/connectors/connector.service';
import { handleApiError } from '@/lib/errors';

const connectorService = new ConnectorService();

export async function GET(req: NextRequest) {
  try {
    const decodedToken = await requireAuthenticatedUser(req);
    const userId = decodedToken.uid;

    const gmail = connectorService.getConnector('GMAIL') as GmailConnector;
    const profile = await gmail.getProfile(userId);

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
