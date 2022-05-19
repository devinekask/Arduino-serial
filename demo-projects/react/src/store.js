import create from 'zustand'
import { SerialBinary } from '../../../lib'



const serial = new SerialBinary();


const useStore = create((set, get) => ({
  count: 0,
  connected: false,
  increaseCount: () => {
    set(state => ({ count: state.count + 1 }))
    serial.write(new Uint8Array([get().count]));
  },
  resetCount: () => set({ count: 0 }),
  connect: async () => {
    await serial.connect();
    set({ connected: true });
  },
  disconnect: async () => {
    await serial.disconnect();
    set({ connected: false });
  }
}))


const handleMessage = (message) => {
  console.log(message)
  if (message[0] === 255) {
    useStore.getState().increaseCount();
  }
}

serial.onMessage(handleMessage);

export default useStore
