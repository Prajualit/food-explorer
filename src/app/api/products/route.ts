import { NextResponse } from "next/server";

const BASE_URL = "https://world.openfoodfacts.org";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("page_size") || "24";

  try {
    // Use a broader search parameter to get general products
    // Adding search_simple=1 with action=process to get general product listing
    const url = `${BASE_URL}/cgi/search.pl?search_simple=1&action=process&page=${page}&page_size=${pageSize}&json=true`;
    
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
    
    // Check if response is HTML (rate limiting or server error)
    if (text.trim().startsWith('<!') || text.trim().startsWith('<html')) {
      console.error("OpenFoodFacts API returned HTML instead of JSON - likely rate limited or server error");
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
    console.error("Error fetching products from OpenFoodFacts:", error);
    
    return NextResponse.json(
      { 
        products: [],
        count: 0,
        page: parseInt(page),
        page_count: 0,
        page_size: parseInt(pageSize),
        skip: 0
      },
      { status: 200 } // Return 200 with empty data so UI doesn't show error
    );
  }
}
