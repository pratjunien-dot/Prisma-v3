import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET() {
  try {
    const feed = await parser.parseURL('https://news.google.com/rss?hl=fr&gl=FR&ceid=FR:fr');
    const items = feed.items.slice(0, 15).map(item => ({
      title: item.title,
      link: item.link,
      date: item.pubDate,
      source: item.source
    }));
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching RSS:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
