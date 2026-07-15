export function generateProductCard(
  product: any,
  settings: any
) {

  const image =
    product.products.product_images?.[0];

  const imageUrl = image
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/product-images/${image.storage_url}`
    : "";

  return `

<div class="productCard">

<div class="imageContainer">

${
imageUrl
? `
<img
src="${imageUrl}"
class="productImage"
/>
`
: ""
}

${
settings.showStock
? `
<div class="stockBadge">

${
product.products.in_stock
? "In Stock"
: "Out of Stock"
}

</div>
`
: ""
}

</div>

<div class="productName">

${product.products.name}

</div>

${
settings.showSku
? `
<div class="productSku">

SKU : ${product.products.sku}

</div>
`
: ""
}

${
settings.showLogo
? `
<div class="productBrand">

${product.products.brand}

</div>
`
: ""
}

${
settings.showPrice
? `
<div class="productPrice">

₹${product.products.price}

</div>
`
: ""
}

${
settings.showQuantity
? `
<div class="productUnit">

${product.products.unit}

</div>
`
: ""
}

</div>

`;

}