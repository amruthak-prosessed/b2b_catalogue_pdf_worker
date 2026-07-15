export function generateCategories(catalog: any) {

  const categories = [
    ...new Set(
      catalog.catalog_products.map(
        (item: any) => item.products.category
      )
    )
  ];

  return `

<div class="categorySection">

<div class="categoryTitle">

MAIN CATEGORIES

</div>

<div class="categorySubtitle">

Choose a category to jump to. Use section headers like the printed catalogue.

</div>

<div class="categoryGrid">

${categories.map(category => `

<div class="categoryChip">

${category}

</div>

`).join("")}

</div>

</div>

`;

}