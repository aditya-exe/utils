import React, { createContext, useRef, useContext, useCallback, useSyncExternalStore } from "react";

export default function createFastContext<Store>(initialState: Store) {
  function useStoreData(): {
    get: () => Store;
    set: (value: Partial<Store>) => void;
    subscribe: (callback: () => void) => () => void;
  } {
    const store = useRef(initialState);

    const subscribers = useRef(new Set<() => void>());

    const get = useCallback(() => {
      return store.current;
    }, []);

    const set = useCallback((value: Partial<Store>) => {
      store.current = { ...store.current, ...value };
      subscribers.current.forEach((callback) => {
        return callback();
      });
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return { get, set, subscribe };
  }

  type UseStoreDataType = ReturnType<typeof useStoreData>;

  const StoreContext = createContext<UseStoreDataType | null>(null);

  const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    )
  }

  function useStore<SelectorOutput>(selector: (store: Store) => SelectorOutput): [SelectorOutput, (valie: Partial<Store>) => void] {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error("Store not found");
    }

    const state = useSyncExternalStore(store.subscribe, () => selector(store.get()));

    return [state, store.set];
  }

  return {
    Provider,
    useStore,
  };
}