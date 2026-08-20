import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/firebase-admin';
import { ConnectorService, GmailConnector } from '@/services/connectors/connector.service';
import { handleApiError } from '@/lib/errors';

const connectorService = new ConnectorService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const { messageId } = await params;
    const decodedToken = await requireAuthenticatedUser(req);
    const userId = decodedToken.uid;

    if (!messageId) {
      return NextResponse.json({ success: false, error: 'Message ID is required' }, { status: 400 });
    }

    const gmail = connectorService.getConnector('GMAIL') as GmailConnector;
    const message = await gmail.getMessage(userId, messageId);

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
