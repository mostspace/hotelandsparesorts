import { NextResponse } from 'next/server'




export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const partnerID = searchParams.get("partnerID");

  console.log("PARTNER ID", partnerID);

  const response = await fetch(
    "https://api.worldota.net/api/b2b/v3/hotel/order/document/voucher/download/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Basic ' + btoa(`${process.env.NEXT_RATEHAWK_KEY_ID_PREMIUM}:${process.env.NEXT_RATEHAWK_API_KEY_PREMIUM}`)
      },
      body: JSON.stringify({
        partner_order_id: partnerID,
        language: "en",
      }),
    }
  );

  console.log("RESPONSE", response.status);

  if (!response.ok) {
    console.log("ISSUE");
    const text = await response.text();
    return NextResponse.json(
      { error: "Failed to fetch PDF", details: text },
      { status: response.status }
    );
  }

  // Convert to ArrayBuffer for PDF
  const buffer = await response.arrayBuffer();
  console.log("NO ISSUE, sending PDF…");

  // Return it as a PDF response
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="voucher-${partnerID}.pdf"`,
    },
  });
}