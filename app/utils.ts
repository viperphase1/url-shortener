// asynchronous version of string replace so we can look for records in the db in parallel
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
