import { faFloppyDisk, faGlobe, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Container, Input, Spacer, Switch, SwitchEvent, Tooltip } from '@nextui-org/react';
import React, { PropsWithChildren } from 'react';
import { MultiValue, SingleValue } from 'react-select';

import { GrpcTlsType } from '../../../../../../core/clients/grpc/interfaces';
import { GrpcMethodType } from '../../../../../../core/protobuf/interfaces';
import { ColoredSelect } from '../../../../../components';
import {
  Environment,
  GrpcProtocol,
  GrpcTab,
  useEnvironmentsStore,
  useTabsStore,
  useTlsPresetsStore,
} from '../../../../../storage';
import { CreateEnvironmentModal } from '../environments';
import { TlsSettingsModal } from '../tls';

export interface SendHeaderProps<T extends GrpcMethodType> {
  tab: GrpcTab<T>;
}

export const SendHeader: React.FC<PropsWithChildren<SendHeaderProps<GrpcMethodType>>> = ({
  tab,
  children,
}) => {
  const { updateGrpcTabData, updateGrpcTabsEnvironment } = useTabsStore((store) => store);
  const { removeEnvironment, environments } = useEnvironmentsStore((store) => store);
  const tlsPresets = useTlsPresetsStore((store) => store.presets);

  const selectedEnvironment =
    environments.find((item) => item.id === tab.data.environmentId) || null;

  const selectedTlsPreset = tlsPresets.find((item) => item.id === tab.data.tlsId);

  const [createEnvironmentModalVisible, setCreateEnvironmentModalVisible] = React.useState(false);
  const [tlsSettingsModalVisible, setTlsSettingsModalVisible] = React.useState(false);

  const handleEnvironmentChange = (value: MultiValue<Environment> | SingleValue<Environment>) => {
    const environment = value as Environment;

    updateGrpcTabData(tab.id, {
      environmentId: environment?.id,
      url: environment?.url,
    });
  };

  const handleGrpcProtocolChange = (event: SwitchEvent) => {
    updateGrpcTabData(tab.id, {
      protocol: event.target.checked ? GrpcProtocol.GRPC_WEB : GrpcProtocol.GRPC,
    });
  };

  const handleRemoveEnvironment = (environment: Environment) => {
    removeEnvironment(environment.id);
    updateGrpcTabsEnvironment(environment.id, undefined);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateGrpcTabData(tab.id, {
      environmentId: undefined,
      url: e.target.value,
    });
  };

  const handleCreateEnvironmentModalSubmit = (environment: Environment) => {
    handleEnvironmentChange(environment);
    setCreateEnvironmentModalVisible(false);
  };

  const handleCreateEnvironmentModalVisible = () => {
    setCreateEnvironmentModalVisible(true);
  };

  const handleCreateEnvironmentModalClose = () => {
    setCreateEnvironmentModalVisible(false);
  };

  const handleTlsSettingsModalSubmit = (id: string) => {
    updateGrpcTabData(tab.id, {
      tlsId: id,
    });
  };

  const handleTlsSettingsModalVisible = () => {
    setTlsSettingsModalVisible(true);
  };

  const handleTlsSettingsModalClose = () => {
    setTlsSettingsModalVisible(false);
  };

  return (
    <>
      <Container
        gap={0.5}
        fluid
        css={{
          display: 'flex',
          flexWrap: 'nowrap',
          height: 30,
        }}
      >
        <ColoredSelect
          aria-label="tab-environment-select"
          bordered
          borderWeight="light"
          size="sm"
          placeholder="Environment"
          options={environments}
          css={{ flex: 2 }}
          value={selectedEnvironment}
          onChange={handleEnvironmentChange}
          onRemove={handleRemoveEnvironment}
        />
        <Spacer x={0.2} />
        <Input
          aria-label="tab-url-input"
          size="sm"
          bordered
          borderWeight="light"
          animated={false}
          clearable
          placeholder="0.0.0.0:3000"
          css={{ flex: 6, '& input': { paddingLeft: 0, marginLeft: '5px !important' } }}
          value={tab.data.url || ''}
          onChange={handleUrlChange}
          contentLeftStyling={false}
          contentLeft={
            selectedTlsPreset && selectedTlsPreset.tls.type !== GrpcTlsType.INSECURE ? (
              <Tooltip content="Connection is secure" placement="bottom" enterDelay={500}>
                <Button
                  size="sm"
                  light
                  animated={false}
                  css={{
                    background: 'transparent',
                    padding: 0,
                    margin: 0,
                    minWidth: 30,
                    color: '$success',
                    '&:hover': {
                      color: '$successBorder',
                    },
                  }}
                  icon={<FontAwesomeIcon icon={faLock} />}
                  onClick={handleTlsSettingsModalVisible}
                />
              </Tooltip>
            ) : (
              <Tooltip content="Connection is not secure" placement="bottom" enterDelay={500}>
                <Button
                  size="sm"
                  light
                  animated={false}
                  css={{
                    background: 'transparent',
                    padding: 0,
                    margin: 0,
                    minWidth: 30,
                    color: '$accents6',
                    '&:hover': {
                      color: '$accents5',
                    },
                  }}
                  icon={<FontAwesomeIcon icon={faUnlock} />}
                  onClick={handleTlsSettingsModalVisible}
                />
              </Tooltip>
            )
          }
          contentRight={
            <Button
              auto
              light
              icon={<FontAwesomeIcon icon={faFloppyDisk} />}
              css={{
                background: 'transparent',
                padding: 0,
                margin: 0,
                minWidth: 10,
                color: '$accents6',
                '&:hover': {
                  color: '$accents5',
                },
              }}
              onClick={handleCreateEnvironmentModalVisible}
            />
          }
        />
        <Spacer x={0.5} />
        <Tooltip
          content={tab.data.protocol === GrpcProtocol.GRPC_WEB ? 'Using gRPC-Web' : 'Using gRPC'}
          placement="left"
          enterDelay={500}
          css={{ width: 'max-content' }}
        >
          <Switch
            size="md"
            bordered
            disabled={
              tab.info.methodType !== GrpcMethodType.UNARY &&
              tab.info.methodType !== GrpcMethodType.SERVER_STREAMING
            }
            icon={<FontAwesomeIcon icon={faGlobe} />}
            checked={tab.data.protocol === GrpcProtocol.GRPC_WEB}
            onChange={handleGrpcProtocolChange}
          />
        </Tooltip>
        {children}
      </Container>
      <CreateEnvironmentModal
        closeButton
        blur
        open={createEnvironmentModalVisible}
        defaultValues={{
          url: tab.data.url || '',
        }}
        onCreate={handleCreateEnvironmentModalSubmit}
        onClose={handleCreateEnvironmentModalClose}
      />
      <TlsSettingsModal
        fullScreen
        closeButton
        blur
        defaultValues={selectedTlsPreset}
        open={tlsSettingsModalVisible}
        onApply={handleTlsSettingsModalSubmit}
        onClose={handleTlsSettingsModalClose}
      />
    </>
  );
};
