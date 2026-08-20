import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/firebase-admin';
import { ConnectorService, GoogleDriveConnector } from '@/services/connectors/connector.service';
import { handleApiError } from '@/lib/errors';

const connectorService = new ConnectorService();

export async function GET(req: NextRequest) {
  try {
    const decodedToken = await requireAuthenticatedUser(req);
    const userId = decodedToken.uid;

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || undefined;
    const pageToken = searchParams.get('pageToken') || undefined;
    const pageSizeParam = searchParams.get('pageSize');
    const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 30;

    const drive = connectorService.getConnector('GOOGLE_DRIVE') as GoogleDriveConnector;
    const result = await drive.listFiles(userId, {
      q,
      pageSize,
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
