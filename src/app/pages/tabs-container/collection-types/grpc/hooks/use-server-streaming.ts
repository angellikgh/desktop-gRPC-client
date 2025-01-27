import { GrpcMethodType } from '../../../../../../core/protobuf/interfaces';
import { notification } from '../../../../../components';
import {
  GrpcProtocol,
  GrpcStreamMessageType,
  GrpcTab,
  useCollectionsStore,
  useTabsStore,
  useTlsPresetsStore,
} from '../../../../../storage';
import { getOptions, getTlsOptions, parseMetadata, parseRequest } from './prepare-request';

export function useServerStreaming() {
  const collections = useCollectionsStore((store) => store.collections);
  const { addGrpcStreamMessage } = useTabsStore((store) => store);
  const tlsPresets = useTlsPresetsStore((store) => store.presets);

  async function invoke(
    tab: GrpcTab<GrpcMethodType.SERVER_STREAMING>,
    onEnd: () => void
  ): Promise<string | undefined> {
    try {
      const tls = getTlsOptions(tlsPresets, tab.data.tlsId);
      const [grpcOptions, requestOptions] = getOptions(collections, tab, tls);
      const request = parseRequest(tab);
      const metadata = parseMetadata(tab);

      addGrpcStreamMessage(
        tab.id,
        {
          type: GrpcStreamMessageType.STARTED,
          value: tab.data.requestTabs.request.value,
        },
        true
      );

      const client =
        tab.data.protocol === GrpcProtocol.GRPC ? window.clients.grpc : window.clients.grpcWeb;

      const id = await client.serverStreaming.invoke(
        grpcOptions,
        requestOptions,
        request,
        metadata,
        (data) => {
          addGrpcStreamMessage(tab.id, {
            type: GrpcStreamMessageType.SERVER_MESSAGE,
            value: JSON.stringify(data, null, 2),
          });
        },
        (error) => {
          addGrpcStreamMessage(tab.id, {
            type: GrpcStreamMessageType.ERROR,
            value: error.message,
          });

          onEnd();
        },
        () => {
          addGrpcStreamMessage(tab.id, {
            type: GrpcStreamMessageType.SERVER_STREAMING_ENDED,
          });

          onEnd();
        }
      );

      return id;
    } catch (error: any) {
      notification(
        { title: 'Invoke request error', description: error.message },
        { type: 'error' }
      );
    }

    return undefined;
  }

  async function cancel(
    tab: GrpcTab<GrpcMethodType.SERVER_STREAMING>,
    callId: string
  ): Promise<void> {
    addGrpcStreamMessage(tab.id, {
      type: GrpcStreamMessageType.CANCELED,
    });

    const client =
      tab.data.protocol === GrpcProtocol.GRPC ? window.clients.grpc : window.clients.grpcWeb;

    await client.serverStreaming.cancel(callId);
  }

  return { invoke, cancel };
}
