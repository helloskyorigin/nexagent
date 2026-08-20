import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/firebase-admin';
import { ConnectorService, GmailConnector } from '@/services/connectors/connector.service';
import { handleApiError } from '@/lib/errors';

const connectorService = new ConnectorService();

export async function GET(req: NextRequest) {
  try {
    const decodedToken = await requireAuthenticatedUser(req);
    const userId = decodedToken.uid;

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || undefined;
    const label = searchParams.get('label') || undefined;
    const pageToken = searchParams.get('pageToken') || undefined;
    const maxResultsParam = searchParams.get('maxResults');
    const maxResults = maxResultsParam ? parseInt(maxResultsParam, 10) : 15;

    const labelIds = label && label !== 'ALL' ? [label] : undefined;

    const gmail = connectorService.getConnector('GMAIL') as GmailConnector;
    const result = await gmail.listMessages(userId, {
      q,
      labelIds,
      maxResults,
      pageToken,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
