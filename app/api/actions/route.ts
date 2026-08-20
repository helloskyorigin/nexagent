import { NextRequest, NextResponse } from 'next/server';
import { ActionEngine } from '@/services/actions/action.engine';
import { ConnectorService } from '@/services/connectors/connector.service';
import { handleApiError } from '@/lib/errors';

const actionEngine = new ActionEngine();
const connectorService = new ConnectorService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user_demo_phase0';
    const actionType = body.actionType || 'MOCK_SEND_SUMMARY';
    const targetConnector = body.targetConnector || 'GMAIL';

    const action = await actionEngine.prepareAction(
      userId,
      actionType,
      targetConnector,
      body.payload || { recipient: 'team@nexorbit.ai' }
    );

    await connectorService.connectConnector(userId, targetConnector, {
      accountEmail: `${userId}@test.com`,
    });

    const verifyResult = await actionEngine.verifyAction(userId, action.id);

    const approval = await actionEngine.requestApproval(
      userId,
      action.id,
      `Approve action: ${actionType} on ${targetConnector}`
    );

    approval.status = 'APPROVED';

    const executed = await actionEngine.executeAction(userId, action.id, approval.id);

    const resultVerify = await actionEngine.verifyResult(userId, action.id);

    const completed = await actionEngine.completeAction(userId, action.id);

    return NextResponse.json({
      success: true,
      lifecycleSummary: {
        stage1_prepare: action,
        stage2_verify: verifyResult,
        stage3_approval: approval,
        stage4_executed: executed,
        stage5_resultVerification: resultVerify,
        stage6_completed: completed,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
