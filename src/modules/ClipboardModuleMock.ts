// Mock TurboModule for testing
export default {
  setString: async (text: string): Promise<void> => {
    console.log('Mock clipboard set:', text);
  },
  getString: async (): Promise<string> => {
    return 'Mock clipboard content';
  },
};
