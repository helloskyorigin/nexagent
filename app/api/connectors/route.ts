import { NextRequest, NextResponse } from 'next/server';
import { ConnectorService } from '@/services/connectors/connector.service';
import { handleApiError } from '@/lib/errors';
import { SupportedConnectorType } from '@/config';
import { requireAuthenticatedUser } from '@/lib/firebase-admin';

const connectorService = new ConnectorService();

export async function GET(req: NextRequest) {
  try {
    const decodedToken = await requireAuthenticatedUser(req);
    const userId = decodedToken.uid;

    const statuses = await connectorService.getStatuses(userId);

    return NextResponse.json({
      success: true,
      data: {
        userId,
        statuses,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const decodedToken = await requireAuthenticatedUser(req);
    const userId = decodedToken.uid;

    const body = await req.json();
    const connectorType = body.connectorType as SupportedConnectorType;
    const action = body.action || 'CONNECT';

    if (action === 'CONNECT') {
      const connector = await connectorService.connectConnector(userId, connectorType, {
        accountEmail: body.accountEmail || `demo@${connectorType.toLowerCase()}.com`,
        scopes: body.scopes || ['read', 'write'],
      });
      return NextResponse.json({ success: true, data: connector });
    }

    if (action === 'DISCONNECT') {
      const disconnected = await connectorService.disconnectConnector(userId, connectorType);
      return NextResponse.json({ success: true, data: { disconnected } });
    }

    if (action === 'SYNC') {
      const syncResult = await connectorService.syncConnector(userId, connectorType);
      return NextResponse.json({ success: true, data: syncResult });
    }

    return NextResponse.json({ success: false, message: 'Invalid connector action' }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
