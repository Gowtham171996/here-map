// src/__mocks__/here-sdk.ts

global.H = {
  service: {
    Platform: class {
      createDefaultLayers = () => ({
        vector: {
          normal: {
            map: {},
          },
        },
      });
    },
  },
  Map: class {
    constructor(_: any, __: any, ___: any) {
      return {
        addObject: jest.fn(),
        dispose: jest.fn(), // ✅ Add this line
      };
    }
  },
  map: {
    Marker: class {
      constructor(_: any) {}
    },
    MapEvents: class {},
  },
  mapevents: {
    Behavior: class {
      constructor(_: any) {}
    },
    MapEvents: class {
      constructor(_: any) {}
    },
  },
  ui: {
    UI: {
      createDefault: jest.fn(),
    },
  },
} as any;