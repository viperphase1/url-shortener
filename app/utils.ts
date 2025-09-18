export async function hashString(inputString: string) {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(inputString); // Encode the string to a Uint8Array

    // Use SHA-256 for a 256-bit (64-character hex) fixed-length hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the ArrayBuffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hexHash;
}

// asynchronous version of string replace so we can look for hashes in the db in parallel
export async function replaceAsync(str: string, regex: RegExp, asyncFn: Function) {
    const promises: any = [];
    str.replace(regex, (match, ...args) => {
        promises.push(asyncFn(match, ...args));
        return match; // placeholder
    });

    const data = await Promise.all(promises);
    let i = 0;

    return str.replace(regex, () => data[i++]);
}

export function getHost(req: any) {
    const host = req.headers.host; // e.g., "example.com"

    // Determine protocol (Vercel sets 'x-forwarded-proto')
    const protocol = req.headers["x-forwarded-proto"] || "http";

    const fullHost = `${protocol}://${host}`;
    return fullHost;
}
