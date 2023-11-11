import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useLocalStorage } from "../src/hooks/use-local-storage";

const mocks = vi.hoisted(() => {
	return {
		getItem: vi.fn(),
		setItem: vi.fn(),
	};
});

describe("useLocalStorage", () => {
	afterEach(cleanup);
	it("sets the initial value", () => {
		const { result } = renderHook(() =>
			useLocalStorage("test", "initial", false),
		);
		expect(result.current[0]).toBe("initial");
	});

	it("loads from local storage on mount", () => {
		localStorage.setItem("test", "stored value");
		const { result } = renderHook(() =>
			useLocalStorage("test", "initial", false),
		);
		expect(result.current[0]).toBe("stored value");
	});

	it("does not load from local storage on mount when disableStorage is set", () => {
		localStorage.setItem("test", "stored value");
		const { result } = renderHook(() =>
			useLocalStorage("test", "initial", true),
		);
		expect(result.current[0]).toBe("initial");
	});
});
