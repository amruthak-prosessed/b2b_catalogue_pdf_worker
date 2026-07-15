export function generateHeader(catalog: any) {

  const company = catalog.companies;

  const logoUrl =
`${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${company.logo_url}`;

  const bannerUrl =
`${process.env.SUPABASE_URL}/storage/v1/object/public/assets/${company.id}/assets/banner/banner.png`;

  const productCount = catalog.catalog_products.length;

  const categoryCount = new Set(
    catalog.catalog_products.map(
      (item: any) => item.products.category
    )
  ).size;

  return `

<div class="header">

<div class="banner">

<img
class="bannerImage"
src="${bannerUrl}"
/>

</div>

<div class="headerContent">

<div class="leftSection">

<img
class="companyLogo"
src="${logoUrl}"
/>

<div>

<div class="companyName">

${company.name}

</div>

<div class="catalogLabel">

CATALOGUE

</div>

<div class="catalogName">

${catalog.name}

</div>

</div>

</div>

<div class="rightSection">

<div class="editionCard">

<div class="editionMonth">

${new Date().toLocaleString(
"default",
{ month:"short" }
)}

${new Date().getFullYear()}

</div>

<div class="editionText">

EDITION

</div>

</div>

<div class="statCard">

<div class="statNumber">

${productCount}

</div>

<div class="statText">

PRODUCTS

</div>

</div>

<div class="statCard">

<div class="statNumber">

${categoryCount}

</div>

<div class="statText">

CATEGORIES

</div>

</div>

</div>

</div>

<div class="greenDivider"></div>

`;

}