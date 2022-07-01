import { faSquarePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Container, Input, Spacer, styled, Table, Text } from '@nextui-org/react';
import { nanoid } from 'nanoid';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FileInput } from '../../../components';
import { Collection, CollectionType } from '../../../storage';

export interface CollectionFormProps {
  id?: string;

  onSubmit: (payload: Collection<CollectionType>) => void;
}

const PathComponeent = styled(Text, {
  overflowX: 'auto',
  overflowY: 'hidden',
  flex: 1,
});

type IncludeDirectoriesContainerProps = {
  value?: string[];

  onChange: (value: string[]) => void;
};

const IncludeDirectoriesContainer = React.forwardRef<
  HTMLDivElement,
  IncludeDirectoriesContainerProps
>(({ onChange, value = [] }, ref) => {
  const [directories, setDirectories] = React.useState<string[]>(value);

  const handleAddPathButtonClick = async () => {
    const paths = await window.electron.selectDirectoryDialog.open();
    const newDirectories = [...directories, ...paths];

    setDirectories(newDirectories);
    onChange(newDirectories);
  };

  const handleDeletePathButtonClick = (path: string) => () => {
    const newDirectories = directories.filter((item) => item !== path);

    setDirectories(newDirectories);
    onChange(newDirectories);
  };

  return (
    <div ref={ref}>
      <div style={{ display: 'flex' }}>
        <Text weight="normal" size={14} css={{ userSelect: 'none', paddingLeft: 4 }}>
          Include directories
        </Text>
        <Spacer />
        <Button
          auto
          bordered
          borderWeight="light"
          size="xs"
          color="success"
          icon={<FontAwesomeIcon icon={faSquarePlus} />}
          onClick={handleAddPathButtonClick}
        >
          Add path
        </Button>
      </div>
      <Spacer y={0.3} />
      <Table bordered borderWeight="light" fixed selectionMode="single" color="primary">
        <Table.Header>
          <Table.Column>Path</Table.Column>
        </Table.Header>
        <Table.Body>
          {directories.map((directory) => (
            <Table.Row key={nanoid()}>
              <Table.Cell css={{ display: 'flex', alignItems: 'center' }}>
                <PathComponeent small>{directory}</PathComponeent>
                <Spacer y={0} />
                <Button
                  size="xs"
                  bordered
                  borderWeight="light"
                  color="error"
                  icon={<FontAwesomeIcon icon={faTrash} />}
                  css={{ marginLeft: 'auto', minWidth: 10 }}
                  onClick={handleDeletePathButtonClick(directory)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
});

export const CollectionForm: React.FC<CollectionFormProps> = ({ onSubmit = () => {}, id }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Collection<CollectionType>>();

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)}>
      <Container gap={0} css={{ display: 'flex', flexDirection: 'column' }}>
        <Input
          autoFocus
          bordered
          borderWeight="light"
          size="sm"
          animated={false}
          label="Name"
          clearable
          color={errors.name ? 'error' : 'default'}
          {...register('name', { required: true })}
        />
        <Spacer />
        <FileInput
          bordered
          borderWeight="light"
          buttonColor="gradient"
          size="sm"
          animated={false}
          label="Protobuf path"
          accept=".proto"
          readOnly
          color={errors.options?.path ? 'error' : 'default'}
          {...register('options.path', { required: true })}
        />
        {/* <Controller
          name="options.path"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <FileInput
              bordered
              borderWeight="light"
              buttonColor="gradient"
              size="sm"
              animated={false}
              label="Protobuf path"
              accept=".proto"
              readOnly
              color={errors.options?.path ? 'error' : 'default'}
              {...field}
            />
          )}
        /> */}
        <Spacer />
        <Controller
          name="options.includeDirs"
          control={control}
          render={({ field }) => <IncludeDirectoriesContainer {...field} />}
        />
      </Container>
    </form>
  );
};
