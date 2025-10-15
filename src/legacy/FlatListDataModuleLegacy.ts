/**
 * Legacy Implementation - Pure JavaScript Data Generation
 * NO NATIVE CODE - generates data entirely in JavaScript
 */

export default {
  generateData: (count: number): Promise<any[]> => {
    return new Promise(resolve => {
      // Generate data in JavaScript (no native call)
      const data = [];
      const timestamp = Date.now();

      for (let i = 0; i < count; i++) {
        data.push({
          id: `item_${i}`,
          title: `Item ${i}`,
          description: `This is the description for item number ${i}`,
          value: Math.floor(Math.random() * 1000),
          timestamp: timestamp,
        });
      }

      resolve(data);
    });
  },
};
