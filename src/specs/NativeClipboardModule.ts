import { NativeModules } from 'react-native';

interface ClipboardModuleType {
  setString(text: string): Promise<void>;
  getString(): Promise<string>;
}

export default NativeModules.ClipboardModule as ClipboardModuleType;
