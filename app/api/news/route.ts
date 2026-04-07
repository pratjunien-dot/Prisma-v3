import { NextResponse } from "next/server";
import Parser from "rss-parser";

export const revalidate = 300; // 5 minutes cache

const parser = new Parser();

export async function GET() {
  try {
    const feed = await parser.parseURL("https://news.google.com/rss?hl=fr&gl=FR&ceid=FR:fr");
    
    const items = feed.items.slice(0, 6).map((item) => ({
      title: item.title,
      source: item.source,
      link: item.link,
      date: item.pubDate,
      snippet: item.contentSnippet,
    }));

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
