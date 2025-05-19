import { NextResponse } from "next/server"

// This would normally use an actual SERP API like Google Custom Search, Bing API, or a specialized fashion API
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const style = searchParams.get("style") || "casual"
    const location = searchParams.get("location") || "nearby"
    const priceRange = searchParams.get("priceRange") || "all"
    const gender = searchParams.get("gender") || "all"
    const size = searchParams.get("size") || "all"
    const color = searchParams.get("color") || "all"
    const brand = searchParams.get("brand") || "all"
    const sustainable = searchParams.get("sustainable") === "true"
    const localBusiness = searchParams.get("localBusiness") === "true"

    console.log("Searching for clothes with params:", {
      style,
      location,
      priceRange,
      gender,
      size,
      color,
      brand,
      sustainable,
      localBusiness,
    })

    // In a real implementation, we would call an external API here
    // For now, we'll generate mock results based on the search parameters
    const results = generateFashionResults(
      style,
      location,
      priceRange,
      gender,
      size,
      color,
      brand,
      sustainable,
      localBusiness,
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Fashion search error:", error)
    return NextResponse.json({ error: "Failed to search for fashion items" }, { status: 500 })
  }
}

// Helper function to generate mock fashion search results
function generateFashionResults(
  style: string,
  location: string,
  priceRange: string,
  gender: string,
  size: string,
  color: string,
  brand: string,
  sustainable: boolean,
  localBusiness: boolean,
) {
  // Define store types based on preferences
  const storeTypes = []
  if (localBusiness) {
    storeTypes.push("Local Boutique", "Small Business")
  } else {
    storeTypes.push("Department Store", "Mall", "Retail Chain")
  }

  if (sustainable) {
    storeTypes.push("Eco-Friendly Store", "Sustainable Fashion")
  }

  // Define price ranges
  let priceMultiplier = 1
  let pricePrefix = "$"
  if (priceRange === "budget") {
    priceMultiplier = 0.5
    pricePrefix = "$"
  } else if (priceRange === "mid-range") {
    priceMultiplier = 1
    pricePrefix = "$$"
  } else if (priceRange === "luxury") {
    priceMultiplier = 3
    pricePrefix = "$$$"
  }

  // Define clothing items based on style
  const clothingItems = getClothingItemsByStyle(style, gender)

  // Generate random number of results (10-20)
  const numResults = Math.floor(Math.random() * 10) + 10
  const results = []

  for (let i = 0; i < numResults; i++) {
    const item = clothingItems[Math.floor(Math.random() * clothingItems.length)]
    const storeType = storeTypes[Math.floor(Math.random() * storeTypes.length)]
    const distance = (Math.random() * 5).toFixed(1)
    const basePrice = item.basePrice * priceMultiplier

    // Apply color filter if specified
    const itemColor =
      color !== "all" ? color : item.availableColors[Math.floor(Math.random() * item.availableColors.length)]

    // Apply size filter if specified
    const itemSize = size !== "all" ? size : ["XS", "S", "M", "L", "XL"][Math.floor(Math.random() * 5)]

    // Apply brand filter or generate random brand
    const itemBrand = brand !== "all" ? brand : getRandomBrand(style, priceRange)

    // Generate store name
    const storeName = generateStoreName(storeType, itemBrand)

    results.push({
      id: i + 1,
      name: `${itemColor} ${item.name}`,
      description: item.description,
      price: Number.parseFloat((basePrice + Math.random() * 10).toFixed(2)),
      priceRange: pricePrefix,
      color: itemColor,
      size: itemSize,
      brand: itemBrand,
      store: storeName,
      storeType: storeType,
      distance: `${distance} miles`,
      location: location,
      imageUrl: `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(`${itemColor} ${item.name}`)}`,
      sustainable: sustainable && Math.random() > 0.5,
      localBusiness: (localBusiness && storeType.includes("Local")) || storeType.includes("Small"),
      rating: (3 + Math.random() * 2).toFixed(1),
      reviews: Math.floor(Math.random() * 100) + 5,
      inStock: Math.random() > 0.2,
    })
  }

  return results
}

function getClothingItemsByStyle(style: string, gender: string) {
  const styles: Record<string, any[]> = {
    casual: [
      {
        name: "T-Shirt",
        description: "Comfortable cotton t-shirt",
        basePrice: 25,
        availableColors: ["White", "Black", "Gray", "Blue", "Red"],
      },
      { name: "Jeans", description: "Classic denim jeans", basePrice: 50, availableColors: ["Blue", "Black", "Gray"] },
      {
        name: "Hoodie",
        description: "Cozy pullover hoodie",
        basePrice: 45,
        availableColors: ["Gray", "Black", "Navy", "Green"],
      },
      {
        name: "Sneakers",
        description: "Everyday comfortable sneakers",
        basePrice: 70,
        availableColors: ["White", "Black", "Gray", "Blue"],
      },
    ],
    formal: [
      {
        name: "Dress Shirt",
        description: "Crisp button-up shirt",
        basePrice: 60,
        availableColors: ["White", "Blue", "Pink", "Black"],
      },
      {
        name: "Slacks",
        description: "Tailored dress pants",
        basePrice: 80,
        availableColors: ["Black", "Navy", "Gray", "Khaki"],
      },
      {
        name: "Blazer",
        description: "Sophisticated blazer",
        basePrice: 120,
        availableColors: ["Black", "Navy", "Gray"],
      },
      {
        name: "Dress Shoes",
        description: "Polished leather shoes",
        basePrice: 100,
        availableColors: ["Black", "Brown"],
      },
    ],
    athletic: [
      {
        name: "Performance Tee",
        description: "Moisture-wicking athletic shirt",
        basePrice: 35,
        availableColors: ["Black", "Gray", "Blue", "Red"],
      },
      {
        name: "Running Shorts",
        description: "Lightweight running shorts",
        basePrice: 40,
        availableColors: ["Black", "Gray", "Blue"],
      },
      {
        name: "Leggings",
        description: "Stretchy athletic leggings",
        basePrice: 55,
        availableColors: ["Black", "Gray", "Blue", "Purple"],
      },
      {
        name: "Training Shoes",
        description: "Supportive athletic shoes",
        basePrice: 90,
        availableColors: ["Black", "White", "Gray", "Blue"],
      },
    ],
    vintage: [
      {
        name: "Retro Tee",
        description: "Vintage-inspired t-shirt",
        basePrice: 30,
        availableColors: ["Faded Black", "Washed Blue", "Vintage Red"],
      },
      {
        name: "High-Waisted Jeans",
        description: "Classic high-waisted jeans",
        basePrice: 65,
        availableColors: ["Washed Blue", "Faded Black"],
      },
      {
        name: "Denim Jacket",
        description: "Classic denim jacket",
        basePrice: 75,
        availableColors: ["Washed Blue", "Faded Black"],
      },
      {
        name: "Vintage Dress",
        description: "Retro-inspired dress",
        basePrice: 70,
        availableColors: ["Floral", "Polka Dot", "Solid"],
      },
    ],
    streetwear: [
      {
        name: "Graphic Tee",
        description: "Bold graphic t-shirt",
        basePrice: 35,
        availableColors: ["Black", "White", "Red"],
      },
      {
        name: "Cargo Pants",
        description: "Utility cargo pants",
        basePrice: 70,
        availableColors: ["Black", "Olive", "Khaki"],
      },
      {
        name: "Bomber Jacket",
        description: "Stylish bomber jacket",
        basePrice: 90,
        availableColors: ["Black", "Olive", "Navy"],
      },
      {
        name: "High-Top Sneakers",
        description: "Statement high-top sneakers",
        basePrice: 85,
        availableColors: ["Black", "White", "Red"],
      },
    ],
    bohemian: [
      {
        name: "Flowy Blouse",
        description: "Loose-fitting bohemian blouse",
        basePrice: 45,
        availableColors: ["White", "Cream", "Floral"],
      },
      {
        name: "Maxi Skirt",
        description: "Long flowing maxi skirt",
        basePrice: 60,
        availableColors: ["Floral", "Paisley", "Solid"],
      },
      {
        name: "Embroidered Dress",
        description: "Detailed embroidered dress",
        basePrice: 75,
        availableColors: ["White", "Blue", "Red"],
      },
      {
        name: "Fringe Bag",
        description: "Boho-inspired fringe bag",
        basePrice: 50,
        availableColors: ["Brown", "Black", "Tan"],
      },
    ],
    minimalist: [
      {
        name: "Basic Tee",
        description: "Simple, high-quality t-shirt",
        basePrice: 40,
        availableColors: ["White", "Black", "Gray", "Navy"],
      },
      {
        name: "Slim Pants",
        description: "Clean-cut slim pants",
        basePrice: 70,
        availableColors: ["Black", "Navy", "Gray"],
      },
      {
        name: "Simple Sweater",
        description: "Understated quality sweater",
        basePrice: 65,
        availableColors: ["Gray", "Black", "Cream"],
      },
      {
        name: "Leather Loafers",
        description: "Timeless leather loafers",
        basePrice: 110,
        availableColors: ["Black", "Brown"],
      },
    ],
  }

  // Default to casual if style not found
  return styles[style.toLowerCase()] || styles.casual
}

function getRandomBrand(style: string, priceRange: string) {
  const brands: Record<string, string[]> = {
    casual: {
      budget: ["H&M", "Old Navy", "Gap", "Uniqlo"],
      "mid-range": ["American Eagle", "Levi's", "Madewell", "J.Crew"],
      luxury: ["Ralph Lauren", "Tommy Hilfiger", "Lacoste"],
    },
    formal: {
      budget: ["H&M", "Zara", "Uniqlo"],
      "mid-range": ["Banana Republic", "J.Crew", "Brooks Brothers"],
      luxury: ["Hugo Boss", "Armani", "Burberry"],
    },
    athletic: {
      budget: ["Old Navy Active", "Target All in Motion", "Amazon Essentials"],
      "mid-range": ["Nike", "Adidas", "Under Armour", "Puma"],
      luxury: ["Lululemon", "Athleta", "Alo Yoga"],
    },
    vintage: {
      budget: ["Thrift Store Find", "Vintage Market", "Second Hand"],
      "mid-range": ["Urban Outfitters", "Reformation", "Anthropologie"],
      luxury: ["Gucci Vintage", "Versace Archive", "YSL Vintage"],
    },
    streetwear: {
      budget: ["H&M Divided", "Forever 21", "ASOS"],
      "mid-range": ["Stussy", "Carhartt", "The Hundreds", "Obey"],
      luxury: ["Supreme", "Off-White", "Bape", "Palace"],
    },
    bohemian: {
      budget: ["Forever 21", "Target", "Old Navy"],
      "mid-range": ["Free People", "Anthropologie", "Urban Outfitters"],
      luxury: ["Zimmermann", "Ulla Johnson", "Johanna Ortiz"],
    },
    minimalist: {
      budget: ["Uniqlo", "Everlane", "COS"],
      "mid-range": ["Madewell", "& Other Stories", "Arket"],
      luxury: ["Jil Sander", "The Row", "Toteme"],
    },
  }

  // Default to casual if style not found
  const styleOptions = brands[style.toLowerCase()] || brands.casual
  const priceOptions = styleOptions[priceRange] || styleOptions["mid-range"]

  return priceOptions[Math.floor(Math.random() * priceOptions.length)]
}

function generateStoreName(storeType: string, brand: string) {
  if (storeType === "Department Store") {
    return ["Nordstrom", "Macy's", "Bloomingdale's", "Saks Fifth Avenue"][Math.floor(Math.random() * 4)]
  } else if (storeType === "Mall") {
    return ["Westfield Mall", "Fashion Valley", "The Galleria", "Plaza Center"][Math.floor(Math.random() * 4)]
  } else if (storeType === "Retail Chain") {
    return brand
  } else if (storeType === "Local Boutique") {
    const prefixes = ["Urban", "City", "Metro", "Downtown", "Uptown", "Village"]
    const suffixes = ["Threads", "Styles", "Fashion", "Closet", "Wardrobe", "Boutique"]
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`
  } else if (storeType === "Small Business") {
    const names = ["The Style Studio", "Fashion Forward", "Trendy & Co.", "Chic Boutique", "Modern Threads"]
    return names[Math.floor(Math.random() * names.length)]
  } else if (storeType === "Eco-Friendly Store") {
    const names = ["Green Threads", "Eco Chic", "Sustainable Style", "Earth Friendly Fashion", "Conscious Closet"]
    return names[Math.floor(Math.random() * names.length)]
  } else if (storeType === "Sustainable Fashion") {
    const names = ["Reformation", "Everlane", "Patagonia", "Eileen Fisher", "Stella McCartney"]
    return names[Math.floor(Math.random() * names.length)]
  }

  return brand
}
