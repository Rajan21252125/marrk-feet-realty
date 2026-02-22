/**
 * Deeply sanitizes an object to prevent NoSQL injection by removing any keys
 * that start with $ (MongoDB operators).
 */
export function sanitize<T>(obj: T): T {
    if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = sanitize(obj[i]);
        }
    } else if (obj !== null && typeof obj === 'object') {
        const objectWithKeys = obj as unknown as Record<string, unknown>;
        Object.keys(objectWithKeys).forEach((key) => {
            if (key.startsWith('$')) {
                delete objectWithKeys[key];
            } else {
                objectWithKeys[key] = sanitize(objectWithKeys[key]);
            }
        });
    }
    return obj;
}
