import { Client } from "@notionhq/client";
import { CreatePageResponse } from "@notionhq/client/build/src/api-endpoints";
import { config } from "dotenv";

config();

export interface INotionDatabaseRow {
  name: string;
  category: "credit-card";
  type: "inter-credit-card" | "nubank-credit-card";
  expiration: string; 
  createdAt: string; 
  owner: "gabriel" | "work";
  value: number;
  status: "pending" | "paid";
};

export default class NotionService {
  private readonly notion: Client;

  constructor() {
    const auth = process.env.NOTION_API_KEY;
    
    if (!auth) throw new Error("Notion API key not found.");

    console.log("Notion API key: " + auth);

    const notion = new Client({ auth });

    this.notion = notion;
  }

  async addRowToDatabase(database_id: string, properties: INotionDatabaseRow): Promise<CreatePageResponse>  {
    return await this.notion.pages.create({
      parent: { database_id },
      properties: {
        "name": { 
          type: "title", 
          title: [{ text: { content: properties.name } }] 
        },
        "category": {
          type: "multi_select",
          multi_select: [{ name: properties.category }]
        },
        "expiration": {
          type: "date",
          date: {
            start: properties.expiration,
            time_zone: "America/Sao_Paulo",
          },
        },
        "created_at": {
          type: "date",
          date: {
            start: properties.createdAt,
            time_zone: "America/Sao_Paulo",
          },
        },
        "owner": {
          type: "select", 
          select: { name: properties.owner }
        },
        "status": {
          type: "status",
          status: { name: properties.status }
        },
        "type": {
          type: "select",
          select: { name: properties.type }
        },
        "value": {
          type: "number",
          number: properties.value
        },
      },
    });
  }
}

