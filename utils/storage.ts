/**
 * Lưu trữ dữ liệu vào localStorage
 */
export function setStorage(key: string, value: any): void {
  if (typeof window === "undefined") return;

  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

/**
 * Lấy dữ liệu từ localStorage
 */
export function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
}

/**
 * Xóa dữ liệu khỏi localStorage
 */
export function removeStorage(key: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

/**
 * Xóa toàn bộ localStorage
 */
export function clearStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

/**
 * Kiểm tra xem localStorage có khả dụng không
 */
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
