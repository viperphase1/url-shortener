import {replaceAsync} from "@/app/utils";
import {getCollection} from "@/app/db";
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { html } = body;

    // match urls, skip @import css rules since ")" is a reserved character and @import works without quotes
    // there may be other cases we need to avoid
    const regex = /(?<!@import\s+url\(|url\()\bhttps?:\/\/[^\s"'<>]+/gi;

    let client: any, db: any, collection: any;

    async function onComplete() {
        if (client) {
            await client.close();
        }
    }

    const urlObj = new URL(request.url);

    let res = html;

    try {
        // asynchronous regex replace, maps urls to mongo object ids
        // was hoping mongo had auto incrementing ids, given more time I would set up a postgres db in the cloud to use instead
        res = await replaceAsync(html, regex, async (url: string) => {
            // only ask for a db connection if the html contains a url longer than 12 (ObjectId length) + domain length characters
            if (url.length <= 12 + urlObj.pathname.length) return url;

            if (!client) {
                [client, db, collection] = await getCollection('db1', 'urls');
            }

            // create or read entry in the db for this url, will use id in shortened url
            const hit = await collection.findOne({ url: url });
            let id;
            if (hit) {
                id = hit._id;
            } else {
                const newRecord = await collection.insertOne({url: url});
                id = newRecord.insertedId;
            }

            // {domain}/{id} will map to redirect function at app/api/[id]/route.ts (see next.config.json)
            urlObj.pathname = `/${id}`;
            return urlObj.toString();
        });
        res = new NextResponse(res);
    } catch(err: any) {
        res = new NextResponse("Server error: " + err.message, { status: 500 });
    }

    await onComplete();

    return res;
}
