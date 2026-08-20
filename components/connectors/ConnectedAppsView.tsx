'use client';

import React from 'react';
import { PluginsPage } from '../plugins/PluginsPage';

export interface ConnectedAppsViewProps {
  onNavigate?: (pageId: string) => void;
  initialSelectedConnectorId?: string | null;
}

export const ConnectedAppsView: React.FC<ConnectedAppsViewProps> = () => {
  return <PluginsPage />;
};
