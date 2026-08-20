import { NextResponse } from 'next/server';
import { runPhase0VerificationSuite } from '@/tests/phase0.test';

export async function GET() {
  try {
    const results = await runPhase0VerificationSuite();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: results.length,
        passed: results.filter((r) => r.passed).length,
        failed: results.filter((r) => !r.passed).length,
      },
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Test suite execution error',
      },
      { status: 500 }
    );
  }
}
