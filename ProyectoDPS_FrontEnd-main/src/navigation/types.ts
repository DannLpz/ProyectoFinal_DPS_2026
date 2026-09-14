export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Catalog: undefined;
  ForYou: undefined;
  AR: { preselectedItemId?: string } | undefined;   
};