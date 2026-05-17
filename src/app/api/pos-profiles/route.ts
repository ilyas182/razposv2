import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userEmail } = await req.json();

    // Use private server-side environment variables!
    // Make sure to add these to your .env / Vercel settings
    // We use FRAPPE_API_URL here because server-side fetch requires an absolute URL (https://...)
    const FRAPPE_URL = process.env.FRAPPE_API_URL;
    const API_KEY = process.env.ADMIN_API_KEY; 
    const API_SECRET = process.env.ADMIN_API_SECRET;

    if (!API_KEY || !API_SECRET) {
      return NextResponse.json({ error: "Server API keys not configured" }, { status: 500 });
    }

    // Fetch securely on behalf of the user using Admin privileges
    const response = await fetch(`${FRAPPE_URL}/api/method/frappe.client.get_list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `token ${API_KEY}:${API_SECRET}`,
      },
      body: JSON.stringify({
        doctype: "POS Profile",
        fields: ["name", "company", "warehouse"],
        filters: [["POS Profile User", "user", "=", userEmail]],
      }),
    });

    const data = await response.json();
    console.log(data)
    if (!response.ok) {
      throw new Error(data.exc_type || "Failed to fetch profiles from ERPNext");
    }

    return NextResponse.json({ message: data.message || [] });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
