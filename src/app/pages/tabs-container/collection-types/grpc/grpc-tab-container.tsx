import { Container, Spacer } from '@nextui-org/react';
import React from 'react';

import { GrpcMethodType } from '../../../../../core/protobuf/interfaces';
import { ResizablePanel } from '../../../../components';
import { CollectionType, Tab } from '../../../../storage';
import { Request } from './request';
import { StreamResponse, UnaryResponse } from './response';
import { StreamSendHeader, UnarySendHeader } from './send-header';

export interface GrpcTabContainerProps {
  tab: Tab<CollectionType.GRPC>;
}

export const GrpcTabContainer: React.FC<GrpcTabContainerProps> = ({ tab }) => {
  let content = (
    <>
      <Spacer />
      <UnarySendHeader tab={tab} />
      <Spacer />
      <ResizablePanel firstNode={<Request tab={tab} />} secondNode={<UnaryResponse tab={tab} />} />
    </>
  );

  if (tab.info.methodType === GrpcMethodType.SERVER_STREAMING) {
    content = (
      <>
        <Spacer />
        <StreamSendHeader tab={tab} />
        <Spacer />
        <ResizablePanel
          firstNode={<Request tab={tab} />}
          secondNode={<StreamResponse tab={tab} />}
        />
      </>
    );
  }

  return (
    <Container
      gap={0}
      fluid
      display="flex"
      css={{ flex: 1, flexDirection: 'column', flexWrap: 'nowrap' }}
    >
      {content}
    </Container>
  );
};
