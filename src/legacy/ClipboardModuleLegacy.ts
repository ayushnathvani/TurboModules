import { NativeModules } from 'react-native';

const { ClipboardModuleLegacy } = NativeModules;

export default {
  setString: (text: string): Promise<void> => {
    return ClipboardModuleLegacy.setString(text);
  },
  getString: (): Promise<string> => {
    return ClipboardModuleLegacy.getString();
  },
};
