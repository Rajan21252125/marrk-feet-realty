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
        Object.keys(obj).forEach((key) => {
            if (key.startsWith('$')) {
                delete (obj as any)[key];
            } else {
                (obj as any)[key] = sanitize((obj as any)[key]);
            }
        });
    }
    return obj;
}
