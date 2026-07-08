import { useState, useCallback, useRef } from "react";

export function useUndoRedo<T>(initialPresent: T) {
  const [present, setPresent] = useState<T>(initialPresent);
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);

  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;

    const previous = pastRef.current[pastRef.current.length - 1];
    pastRef.current = pastRef.current.slice(0, pastRef.current.length - 1);

    futureRef.current = [present, ...futureRef.current];
    setPresent(previous);
  }, [present]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;

    const next = futureRef.current[0];
    futureRef.current = futureRef.current.slice(1);

    pastRef.current = [...pastRef.current, present];
    setPresent(next);
  }, [present]);

  const update = useCallback((newPresentOrFunc: T | ((prev: T) => T), skipHistory: boolean = false) => {
    setPresent((prev) => {
      const newPresent = typeof newPresentOrFunc === "function"
        ? (newPresentOrFunc as any)(prev)
        : newPresentOrFunc;

      if (skipHistory) {
        return newPresent;
      }

      // Deep compare check or simple reference check to prevent pushing duplicate history states
      if (JSON.stringify(newPresent) === JSON.stringify(prev)) {
        return prev;
      }

      // Limit history stack size to 50 entries
      const newPast = [...pastRef.current, prev];
      if (newPast.length > 50) {
        newPast.shift();
      }

      pastRef.current = newPast;
      futureRef.current = [];
      return newPresent;
    });
  }, []);

  const reset = useCallback((newPresent: T) => {
    setPresent(newPresent);
    pastRef.current = [];
    futureRef.current = [];
  }, []);

  return {
    state: present,
    setState: update,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
}
