import { Button, Loading, Spacer } from '@nextui-org/react';
import React from 'react';

import { GrpcMethodType } from '../../../../../../core/protobuf/interfaces';
import { useUnaryCall } from '../hooks';
import { SendHeader, SendHeaderProps } from './send-header.basic';

export const UnaryCallSendHeader: React.FC<SendHeaderProps<GrpcMethodType.UNARY>> = ({ tab }) => {
  const { invoke } = useUnaryCall();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleInvokeButtonClick = async () => {
    setIsLoading(true);

    await invoke(tab);

    setIsLoading(false);
  };

  return (
    <SendHeader tab={tab}>
      <Spacer x={0.5} />
      <Button
        size="sm"
        bordered
        borderWeight="light"
        color="gradient"
        disabled={isLoading}
        css={{ minWidth: 60 }}
        onClick={handleInvokeButtonClick}
      >
        {isLoading ? <Loading type="gradient" color="currentColor" size="xs" /> : 'Invoke'}
      </Button>
    </SendHeader>
  );
};
