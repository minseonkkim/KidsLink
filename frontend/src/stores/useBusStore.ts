import create from 'zustand';

interface Child {
  childName: string;
  parentTel: string;
  status: string;
  checked: boolean;
}

interface BusStop {
  busId: number;
  busStopId: number;
  busStopName: string;
  children: Child[];
}

interface BusStore {
  busStops: BusStop[];
  setBusStops: (stops: BusStop[]) => void;
  toggleChildChecked: (busStopId: number, childName: string) => void;
}

export const useBusStore = create<BusStore>((set, get) => ({
  busStops: [],
  setBusStops: (stops) => {
    const currentStops = get().busStops;
    const newStops = stops.map((newStop) => {
      const currentStop = currentStops.find((stop) => stop.busStopId === newStop.busStopId);
      if (currentStop) {
        const newChildren = newStop.children.map((newChild) => {
          const currentChild = currentStop.children.find((child) => child.childName === newChild.childName);
          return currentChild ? { ...newChild, checked: currentChild.checked } : newChild;
        });
        return { ...newStop, children: newChildren };
      }
      return newStop;
    });
    set({ busStops: newStops });
  },
  toggleChildChecked: (busStopId, childName) =>
    set((state) => ({
      busStops: state.busStops.map((stop) =>
        stop.busStopId === busStopId
          ? {
              ...stop,
              children: stop.children.map((child) =>
                child.childName === childName
                  ? { ...child, checked: !child.checked }
                  : child
              ),
            }
          : stop
      ),
    })),
}));
