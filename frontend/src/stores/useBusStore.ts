import { create } from "zustand";
import { ChildInfo } from "../types/info";

interface Child {
  child: ChildInfo;
  parentTel: string;
  status: string;
  checked?: boolean;
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
  toggleChildChecked: (busStopId: number, childId: number) => void;
  setAllChecked: (checked: boolean) => void; // Add this line
}

export const useBusStore = create<BusStore>((set) => ({
  busStops: [],
  setBusStops: (stops) =>
    set({
      busStops: stops.map((stop) => ({
        ...stop,
        children: stop.children
          ? stop.children.map((child) => ({
              ...child,
              checked: child.checked !== undefined ? child.checked : false,
            }))
          : [],
      })),
    }),
  toggleChildChecked: (busStopId, childId) =>
    set((state) => ({
      busStops: state.busStops.map((stop) =>
        stop.busStopId === busStopId
          ? {
              ...stop,
              children: stop.children.map((child) =>
                child.child.childId === childId
                  ? { ...child, checked: !child.checked }
                  : child
              ),
            }
          : stop
      ),
    })),
  setAllChecked: (checked) =>
    set((state) => ({
      busStops: state.busStops.map((stop) => ({
        ...stop,
        children: stop.children.map((child) => ({ ...child, checked })),
      })),
    })),
}));
