import { CSS, Grid } from '@nextui-org/react';
import React from 'react';

import { ExplorerHeader } from './explorer-header';

const ExplorerGridStyles: CSS = {
  display: 'flex',
  flexDirection: 'column',

  minWidth: 250,
  maxWidth: 250,
  background: '$background',
  borderRight: 'solid $border 1px',
};

export interface ExplorerProps {
  children: React.ReactNode;
  header: React.ReactNode;
  sideBar: React.ReactNode;
}

export const Explorer: React.FC<ExplorerProps> = ({ children, header, sideBar }) => (
  <Grid.Container wrap="nowrap" css={{ height: '100%' }}>
    <Grid css={ExplorerGridStyles}>
      <ExplorerHeader>{header}</ExplorerHeader>
      {sideBar}
    </Grid>
    <Grid css={{ display: 'flex', flexWrap: 'nowrap', flex: 1, overflow: 'hidden' }}>
      {children}
    </Grid>
  </Grid.Container>
);
