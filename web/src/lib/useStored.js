"use client";

import { useMemo, useSyncExternalStore } from "react";

function subscribe(key) {
  return (callback) => {
    const onStorage = (e) => {
      if (e.key === key || e.key === null) callback();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("dopamina-local", callback);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("dopamina-local", callback);
    };
  };
}

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setStoredJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("dopamina-local"));
  } catch {
    // storage indisponível (modo privado) — pedido segue só em memória
  }
}

export function useStoredJson(key) {
  const raw = useSyncExternalStore(subscribe(key), () => read(key), () => null);
  return useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [raw]);
}
