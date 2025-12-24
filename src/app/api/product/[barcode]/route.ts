import { NextResponse } from "next/server";

const BASE_URL = "https://world.openfoodfacts.org";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;

  try {
    const url = `${BASE_URL}/api/v0/product/${barcode}.json`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FoodExplorer/1.0',
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      console.error(`OpenFoodFacts API returned status ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    if (text.trim().startsWith('<!') || text.trim().startsWith('<html')) {
      console.error("OpenFoodFacts API returned HTML instead of JSON");
      throw new Error("API rate limit or server error");
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse API response as JSON");
      throw new Error("Invalid JSON response");
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching product by barcode:", error);
    return NextResponse.json(
      { 
        status: 0,
        code: barcode,
        status_verbose: "product not found or API unavailable",
        product: null
      },
      { status: 200 }
    );
  }
}
