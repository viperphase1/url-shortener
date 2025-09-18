import { getCollection } from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import {ObjectId} from "bson";

export async function GET(req: NextRequest) {
    let res: NextResponse, client: any, db: any, collection: any;

    async function onComplete() {
        if (client) {
            await client.close();
        }
    }

    try {
        // Extract the id from the URL path
        const url = new URL(req.url);
        const id = url.pathname.slice(1);

        if (!id) {
            return new NextResponse("Id missing", { status: 400 });
        }

        [client, db, collection] = await getCollection("db1", "urls");

        const record = await collection.findOne({ _id: new ObjectId(id) });
        if (record?.url) {
            // Redirect to the original URL
            res = NextResponse.redirect(record.url);
        }
        else {
            res = new NextResponse("URL not found", { status: 404 });
        }
    } catch (err: any) {
        res = new NextResponse("Server error: " + err.message, { status: 500 });
    }

    await onComplete();

    return res;
}
