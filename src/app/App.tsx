import { NextUIProvider } from '@nextui-org/react';
import React from 'react';
import { useEffectOnce } from 'react-use';

import { Main } from './pages';
import { ThemeType, useCollectionsStore, useSettingsStore } from './storage';
import { DarkTheme, globalStyles, LightTheme } from './themes';

function App(): JSX.Element {
  const theme = useSettingsStore((store) => store.type) === ThemeType.Dark ? DarkTheme : LightTheme;
  const { collections, updateCollection } = useCollectionsStore((store) => store);

  globalStyles();

  useEffectOnce(() => {
    collections.forEach((collection) => {
      updateCollection(collection.id, collection);
    });
  });

  return (
    <NextUIProvider theme={theme}>
      <Main />
    </NextUIProvider>
  );
}

export default App;
